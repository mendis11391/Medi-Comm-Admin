import { Injectable } from '@angular/core';
import { ConstantsURL } from '../../../constants/constant-urls';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  b_url = `http://localhost:3000/`;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
   }

  loginCheck(formdata) {
    return this.http.post(ConstantsURL.LOGIN, formdata);
  }

  authenticatedCheck() {
    return !!localStorage.getItem('token');
  }

  public getUserDetails(token): Observable<User> {
    return this.http.post<User>(`${this.b_url}admindetails`,{token:token});
  }

  public getAdminDetails() {
    let token= localStorage.getItem('token');
    return this.http.post(`${this.b_url}admindetails`,{token:token});
  }

  public getUserDetailsById(id): Observable<User> {
    return this.http.get<User>(`${this.b_url}admin/${id}`);
  }

  public productAdd(){
    let product= localStorage.getItem('product_add');;
    if(product=='1'){
      return true;
    }else{
      return false;
    }
  }

  public productView(){
    let product= localStorage.getItem('product_view');;
    if(product=='1'){
      return true;
    }else{
      return false;
    }
  }

  public deposit(){
    let product= localStorage.getItem('deposits');;
    if(product=='1'){
      return true;
    }else{
      return false;
    }
  }

  public order(){
    let product= localStorage.getItem('orders');;
    if(product=='1'){
      return true;
    }else{
      return false;
    }
  }
}
