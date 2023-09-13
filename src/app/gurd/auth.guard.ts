import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable , of} from 'rxjs';
import { AuthService } from '../service/auth.service';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isActivate = false

  constructor(public router: Router, private authService:AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // const token = sessionStorage.getItem('token'); 
      // if (token) {
      //   return true;
      // } else {
      //   this.router.navigate(['/auth/login']);
      //   return false;
      // }

      return this.authService.getProtectedData().pipe(
        map(response => {
          // API call was successful
          return true;
        }),
        catchError(error => {
          // API call failed or token not found
          this.router.navigate(['/auth/login']);
          return of(false);
        })
      );
  }
}
