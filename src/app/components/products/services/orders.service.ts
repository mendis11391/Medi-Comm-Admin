import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orders,OrderItems, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  b_url = `${environment.apiUrl}/`;
  orders_url = `${environment.apiUrl}/orders`;
  assets_url = `${environment.apiUrl}/assets`;
  customer_url = `${environment.apiUrl}/users`;

  tillDate:Date;
  
  constructor(private http: HttpClient) { 
    
  }

  getAllassets(): Observable<Assets[]> {
    return this.http.get<Assets[]>(`${this.assets_url}`)
  }

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.orders_url}`)
  }

  getAllOrdersByCustomerId(id): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.orders_url}/${id}`)
  }

  public getCustomerRequests(id): Observable<Orders[]>{
    return this.http.get<Orders[]>(`${this.orders_url}/customerRequests/${id}`)
  }

  public updateCustomersDetails(id, val){
    return this.http.put(`${this.customer_url}/updateUserDetail/${id}`, val)
  }

  public updateCustomerAddressFeild(id, val){
    return this.http.put(`${this.customer_url}/updateUserAddressFeild/${id}`, val)
  }

  getRenewalsByCustomerId(id){
    return this.http.get<Customers[]>(`${this.orders_url}/renewals/${id}`)
  }

  public getUserDetailsByUid(id) {
    return this.http.get(`${this.customer_url}/getUserAddressInfo/${id}`);
  }

  public updateNewRenewProducts(formval) {
    return this.http.post(`${this.b_url}payments/updateNewRenewOrder`, formval);
  }

  public newRenewProducts(formval) {
    return this.http.post(`${this.b_url}payments/newRenew`, formval);
  }

  public postRenewtransaction(formval) {
    return this.http.post(`${this.b_url}payments/postManualRenewalOrderTransaction`, formval);
  }

  getAllCustomers(): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${this.customer_url}`)
  }

  getAllCustomersKYC(){
    return this.http.get(`${this.customer_url}/getAllKYC/kycList`)
  }

  getAllCustomersByid(id): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${this.customer_url}/getCustomerById/${id}`)
  }

  getKYCMainTableByid(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycMainTable/${id}`)
  }

  getKYCIndividualByid(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycIndividualDetails/${id}`)
  }

  updateKYCMainTableByid(id, val) {
    return this.http.put(`${this.customer_url}/getAllKYC/updateStatus/${id}`, val);
  }

  getKYCImage(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycImage/${id}`)
  }

  getAllAddressByCustomersByid(id): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${this.customer_url}/getUserAddressInfo/${id}`)
  }

  

  getAllOrderItems(): Observable<OrderItems[]> {
    return this.http.get<OrderItems[]>(`${this.orders_url}/getAllOrderItems`)
  }

  // updateOrderStatus(id: string, data): Observable<any>{
  //     const url = `${this.orders_url}/${id}`;
  //     return this.http.put(url, data);
  //   }
  // }
}
