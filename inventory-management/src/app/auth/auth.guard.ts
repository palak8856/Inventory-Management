import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  const role = authService.getRole();
  if (role) {
    const requiredRole = route.data['role'];
    if (!requiredRole || role === requiredRole) {
      return true;
    }
  }

  router.navigate(['login'], { replaceUrl: true });
  return false;
};
