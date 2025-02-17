import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AuthGuard} from "../auth/auth.guard";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;

  constructor(private router: Router, private http:HttpClient, private firestore:AngularFirestore, private auth: AngularFireAuth, private authGuard: AuthGuard) {
    const user = localStorage.getItem('user');
  try {
    this.user = user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    this.user = null;
  }
  }

  async isAdmin(firestore: AngularFirestore): Promise<boolean> {
    // const storedUser = this.user;
    const storedUser = JSON.parse(localStorage.getItem('user')!);
  
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
  
      const userDoc:any = userQuerySnapshot.docs[0].data(); // Get user document data
      console.log(userQuerySnapshot.docs[0].data());
      if (userDoc.role === 'admin') {
        console.log("Admin verified:", storedUser.email);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error verifying admin role", error);
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

  // login(email:string, password:string){
  //   return this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBM2LY-jwFtiXAtZlLEt0RLaIWWuaZngIM",{
  //     email:email,
  //     password:password,
  //     returnSecureToken:true
  //   })
  // }
  login(email: string, password: string): Promise<boolean|undefined> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        if (userCredential.user) {
          return this.authGuard.checkUserInFirestore(userCredential.user.email!).toPromise();
        }
        return false;
      })
      .catch(error => {
        console.error("Login error:", error);
        return false;
      });
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
