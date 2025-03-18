import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { LoginRequest, User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  register(user: User) {
    return this.http.post(`${this.apiUrl}/user/register`, user);
  }

  login(user: LoginRequest) {
    return this.http.post(`${this.apiUrl}/user/login`, user);
  }
}
