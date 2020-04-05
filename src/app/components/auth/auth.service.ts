import { Injectable } from '@angular/core';
import { ConstantsURL } from '../../../constants/constant-urls';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginCheck(formdata) {
    return this.http.post(ConstantsURL.LOGIN, formdata);
  }

  authenticatedCheck() {
    return !!localStorage.getItem('token');
  }
}
