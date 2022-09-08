import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : 'null';
    if (token) {
      token = token.split(' ')[0];
    }
    const timeRef = new Date();
    const year = timeRef.getFullYear();
    const month = timeRef.getMonth();
    const curdate = timeRef.getDate();
    const curhours = timeRef.getHours();
    const curmin = timeRef.getMinutes();
    const cursec = timeRef.getSeconds();
    const curmilsec = timeRef.getMilliseconds();

    const finalCurTime = `${year},${month},${curdate},${curhours},${curmin},${cursec},${curmilsec}`;

    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token} ${finalCurTime}`
      }
    })
    return next.handle(tokenizedReq);
  }
}