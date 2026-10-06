import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, switchMap, catchError, of, map, mergeMap, toArray, from } from 'rxjs';

import { UserService } from './service/user.service';
import { PostService } from './service/post.service';
import { CommentService } from './service/comment.service';
import { User } from './model/user.model';
import { Post } from './model/post.model';

import { UserComponent } from './components/user/user.component';
import { PostComponent } from './components/post/post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, UserComponent, PostComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private userService = inject(UserService);
  private postService = inject(PostService);
  private commentService = inject(CommentService);

  userForm = new FormGroup({
    username: new FormControl('')
  });

  user: User | null = null;
  posts: Post[] = [];
  notFound = false;

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      // 1. Buscar usuario por username
      switchMap((username) => {
        this.user = null;
        this.posts = [];
        this.notFound = false;

        if (!username) return of(null);

        return this.userService.searchUser(username).pipe(
          catchError((err) => {
            console.error('Error al buscar usuario:', err);
            return of(null);
          })
        );
      }),

      // 2. Si el usuario existe, se asigna y se piden sus posts
      switchMap((userResponse) => {
        if (!userResponse || !userResponse.users || userResponse.users.length === 0) {
          if (userResponse) this.notFound = true;
          return of(null);
        }

        this.user = userResponse.users[0];
        return this.postService.getPostsByUser(this.user.id).pipe(
          catchError((err) => {
            console.error('Error al obtener posts:', err);
            return of(null);
          })
        );
      }),

      // 3. Traer los comentarios de cada post sin hacer `.subscribe()` anidados
      switchMap((postsResponse) => {
        if (!postsResponse || !postsResponse.posts || postsResponse.posts.length === 0) {
          return of([]);
        }

        // Convertimos el arreglo de posts en emisiones individuales con `from`
        return from(postsResponse.posts).pipe(
          mergeMap((post) =>
            this.commentService.getCommentsByPost(post.id).pipe(
              map((commentResponse) => ({
                ...post,
                comments: commentResponse.comments
              })),
              catchError(() => of({ ...post, comments: [] }))
            )
          ),
          toArray() // Reagrupa todos los posts procesados en un solo arreglo
        );
      })
    ).subscribe((posts) => {
      // Único subscribe donde recibimos la información completa
      if (posts) {
        this.posts = posts;
      }
    });
  }

  onSubmit() {
    const username = this.userForm.value.username;
    if (username) {
      this.searchSubject.next(username);
    }
  }
}