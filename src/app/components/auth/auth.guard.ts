import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  

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

  canActivate(): boolean{
    if( this._authService.authenticatedCheck()) {
      return true;
    } else {
      this._router.navigate(['/auth/login']);
      return false;
    }
    
  }

    



}
