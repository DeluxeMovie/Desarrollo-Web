import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsResponse } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private ROOT_URL = 'https://dummyjson.com';
  private http = inject(HttpClient);

  getPostsByUser(userId: number): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${this.ROOT_URL}/posts/user/${userId}`);
  }
}