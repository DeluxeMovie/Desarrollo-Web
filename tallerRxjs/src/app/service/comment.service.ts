import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsResponse } from '../model/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private ROOT_URL = 'https://dummyjson.com';
  private http = inject(HttpClient);

  getCommentsByPost(postId: number): Observable<CommentsResponse> {
    return this.http.get<CommentsResponse>(`${this.ROOT_URL}/comments/post/${postId}`);
  }
}