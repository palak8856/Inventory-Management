import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;

  constructor(private router: Router, private http:HttpClient, private firestore:AngularFirestore, private auth: AngularFireAuth,) {
    const user = localStorage.getItem('user');
  try {
    this.user = user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    this.user = null;
  }
  }


  async isAdmin(firestore: AngularFirestore): Promise<boolean> {
    const storedUser = this.user;
  
    if (!storedUser?.email) {
      console.error("User email is missing or undefined in localStorage.");
      return false;
    }
  
    try {
      const userQuerySnapshot = await firestore
        .collection('users')
        .ref.where('email', '==', storedUser.email) 
        .get();
  
      if (userQuerySnapshot.empty) {
        console.error("No matching user found in Firestore.");
        return false;
      }
  
      console.log("Email verified successfully:", storedUser.email);
      return true; 
    } catch (error) {
      console.error("Error verifying email in Firestore:", error);
      return false;
    }
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
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      console.warn('User data is undefined or null');
    }
  }
}
