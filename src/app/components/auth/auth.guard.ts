import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router,Route, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, CanLoad } from "@angular/router";

import { Observable } from 'rxjs';
import { Role } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  //   // if( this._authService.authenticatedCheck()) {
  //   //   return true;
  //   // } else {
  //   //   this._router.navigate(['/auth/login']);
  //   //   return false;
  //   // }
  //   return new Promise<boolean>((resolve, reject) => {

  //     if (!this._authService.authenticatedCheck()) {
  //         resolve(false);
  //         return;
  //     }

  //     let role = localStorage.getItem('role');
  //     let userRole = role && role.length > 0 ? role[0].toUpperCase() : '';
  //     let roles = route && route.data["roles"] && route.data["roles"].length > 0 ? route.data["roles"].map(xx => xx.toUpperCase()) : null;

  //     if (roles == null || roles.indexOf(userRole) != -1){
  //       resolve(true);
  //     } else {
  //         resolve(false);
  //         this._router.navigate(['login']);
  //     }
  //   });
  // }

  // canActivate(): boolean{
  //   if( this._authService.authenticatedCheck()) {
  //     return true;
  //   } else {
  //     this._router.navigate(['/auth/login']);
  //     return false;
  //   }
    
  // }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.authenticatedCheck()) {
        this.router.navigate(['login']);
        return false;
    }

    const roles = route.data.roles as Role[];
    // if (roles && !roles.some(r => this.authService.hasRole(r))) {
    //     this.router.navigate(['error', 'not-found']);
    //     return false;
    // }

    return true;
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.authenticatedCheck()) {
          return false;
      }

      const roles = route.data && route.data.roles as Role[];
      if (roles && !roles.some(r => this.authService.hasRole(r))) {
          return false;
      }

      return true;
  }

}
