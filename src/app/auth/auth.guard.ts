import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, getFirestore } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  // const firestore = inject(AngularFirestore);
  const firestore=getFirestore();
  // const auth = inject(Auth);
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    router.navigate(['/login']);
    return false;
  }

  const userEmail = user.email;

  // try {
  //   const userDoc = firestore.collection('users', (ref) => ref.where('email', '==', userEmail)).valueChanges();

  //   const userData = await firstValueFrom(userDoc);
  //   if (userData.length === 0) {
  //     router.navigate(['/login']);
  //     return false;
  //   }

  //   return true;
  // } catch (error) {
  //   console.error("Error checking user authentication:", error);
  //   router.navigate(['/login']);
  //   return false;
  // }
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking user authentication:", error);
    router.navigate(['/login']);
    return false;
  }
};

