import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}

  canActivate(): Observable<boolean>{
    return this.auth.authState.pipe(
      switchMap(user => {
        if (!user || !user.email) {
          console.log("User doesnt exist");
          this.router.navigate(['/login']);
          return of(false);
        }
        return this.checkUserInFirestore(user.email);
      })
    );
  }
  
   checkUserInFirestore(email: string): Observable<boolean> {
    return new Observable(observer => {
      this.firestore.collection('users', ref => ref.where('email', '==', email))
        .get()
        .subscribe(snapshot => {
          if (!snapshot.empty) {
            observer.next(true);
          } else {
            this.router.navigate(['/login']);
            console.log("User not found");
            observer.next(false);
          }
          observer.complete();
        }, error => {
          console.log(error);
          this.router.navigate(['/login']);
          observer.next(false);
        });
    });
  }
}
