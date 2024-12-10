import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserResponse } from '../models/user.interface';
import {LoginResponse} from '../models/login.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000';
  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers(){
    return this.httpClient.get<User[]>(this.API_URL+'/usuarios')
  }

  getUser(id: number){
    return this.httpClient.get<UserResponse>(this.API_URL+'/usuarios/'+id)
  }
  
  login(username:string,password:string){
    const body = { username, password };
    return this.httpClient.post<LoginResponse>(this.API_URL+'/login',body)
  }

  addUser(user: User): Observable<any>{
    return this.httpClient.post(this.API_URL+'/usuarios/', user);
  }

  updateUser(user: User): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/usuarios`, user);
  }
  
  

}
