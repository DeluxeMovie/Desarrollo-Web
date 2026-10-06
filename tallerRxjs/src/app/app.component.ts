import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, switchMap, catchError, of } from 'rxjs';

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
      switchMap((username) => {
        // Limpiamos los datos anteriores al buscar de nuevo
        this.user = null;
        this.posts = [];
        this.notFound = false;

        if (!username) return of(null);

        return this.userService.searchUser(username).pipe(
          catchError((err) => {
            console.error('Error al buscar usuario', err);
            return of(null);
          })
        );
      })
    ).subscribe((response) => {
      if (response && response.users && response.users.length > 0) {
        this.user = response.users[0];
        this.loadPosts(this.user.id);
      } else if (response) {
        this.notFound = true;
      }
    });
  }

  onSubmit() {
    const username = this.userForm.value.username;
    if (username) {
      this.searchSubject.next(username);
    }
  }

  private loadPosts(userId: number) {
    this.postService.getPostsByUser(userId).subscribe({
      next: (response) => {
        this.posts = response.posts;
        for (let post of this.posts) {
          this.commentService.getCommentsByPost(post.id).subscribe({
            next: (response) => {
              post.comments = response.comments;
            }
          });
        }
      }
    });
  }
}