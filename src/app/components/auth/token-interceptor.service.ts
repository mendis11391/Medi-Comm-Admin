import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : 'null';
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(tokenizedReq);
  }
}