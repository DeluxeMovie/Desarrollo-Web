import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersResponse } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private ROOT_URL = 'https://dummyjson.com';
  private http = inject(HttpClient);

  searchUser(username: string): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.ROOT_URL}/users/filter?key=username&value=${username}`);
  }
}