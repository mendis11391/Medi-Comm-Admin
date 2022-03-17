import { Injectable } from '@angular/core';
import { ConstantsURL } from '../../../constants/constant-urls';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { User, Role, UserData } from './user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  b_url = `${environment.apiUrl}/`;
  private currentUserSubject: BehaviorSubject<UserData>;
  public currentUser: Observable<UserData>;
  private user: User;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserData>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
   }

  loginCheck(formdata) {
    return this.http.post(`${this.b_url}login`, formdata);
  }

  authenticatedCheck() {
    return !!localStorage.getItem('token');
  }

  //auth codes
  hasRole(role: Role) {
    return this.authenticatedCheck() && this.user.role === role;
  }

  login(role: Role) {
    this.user = { role: role };
  }
  //auth codes

  public getUserDetails(token): Observable<UserData> {
    return this.http.post<UserData>(`${this.b_url}admindetails`,{token:token});
  }

  public getAdminDetails() {
    let token= localStorage.getItem('token');
    return this.http.post(`${this.b_url}admindetails`,{token:token});
  }

  public getUserDetailsById(id): Observable<UserData> {
    return this.http.get<UserData>(`${this.b_url}admin/${id}`);
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
