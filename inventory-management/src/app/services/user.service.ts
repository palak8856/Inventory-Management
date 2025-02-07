import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;

  constructor(private router: Router, private http:HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 
    return user?.role === 'admin'; 
  }

  logout() {
    localStorage.removeItem('user'); 
    this.router.navigate(['login']); 
  }
  
  isLoggedIn():boolean{
    return !!localStorage.getItem('user');
  }

  getRole(): string | null {
    return this.user?.role || null;
  }

  login(email:string, password:string){
    return this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBM2LY-jwFtiXAtZlLEt0RLaIWWuaZngIM",{
      email:email,
      password:password,
      returnSecureToken:true
    })
  }

  register(email:string, password:string){
    return this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBM2LY-jwFtiXAtZlLEt0RLaIWWuaZngIM",{
      email:email,
      password:password,
      returnSecureToken:true
    })
  }

  saveUserToLocalStorage(): void {
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
