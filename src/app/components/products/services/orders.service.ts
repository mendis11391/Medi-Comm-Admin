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
  mail_url = `${environment.apiUrl}/forgotpassword`;
  admin_url = `${environment.apiUrl}/admin`;

  tillDate:Date;
  
  constructor(private http: HttpClient) { 
    
  }

  public getorders(id): Observable<Orders[]>{
    return this.http.get<Orders[]>(`${this.orders_url}/${id}`)
  }

  getAllassets(): Observable<Assets[]> {
    return this.http.get<Assets[]>(`${this.assets_url}`)
  }

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.orders_url}`)
  }

  getAllNewOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.admin_url}/newOrders`)
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

  getKycBycustomerId(id){
    return this.http.get(`${this.customer_url}/getAllKYC/getKycBycustomerId/${id}`);
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
    return this.http.put(`${this.customer_url}/getAllKYC/updateKYCMaintablefield/${id}`, val);
  }

  updateKYCMainTableExpiryDateByid(id, val) {
    return this.http.put(`${this.customer_url}/getAllKYC/updateKYCMaintableexpiryDatefield/${id}`, val);
  }

  getKYCImage(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycImage/${id}`)
  }

  public getKycByCustomerId(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycBycustomerId/${id}`);
  }

  public getEmailTemplatesByid(id) {
    return this.http.get(`${this.mail_url}/getEmailTemplates/${id}`);
  }

  public kycNotifyMail(formval) {
    return this.http.post(`${this.mail_url}/eKYCMail`, formval);
  }

  public kycSubmit(formval) {
    return this.http.post(`${this.customer_url}/kycSubmit`, formval);
  }

  public kycDetailsSubmit(formval) {
    return this.http.post(`${this.customer_url}/kycDetailsSubmit`, formval);
  }

  public kycCompanyDetailsSubmit(formval) {
    return this.http.post(`${this.customer_url}/kycCompanyDetailsSubmit`, formval);
  }

  public updateKYCDetailsTab(id,data){
    const url = `${this.customer_url}/getAllKYC/updatekycDetailsTab/${id}`;
    return this.http.put(url, data);
  }

  public updateKYCIdProofTab(id,data){
    const url = `${this.customer_url}/getAllKYC/updatekycIdProofTab/${id}`;
    return this.http.put(url, data);
  }

  public updateKYCAddressProofTab(id,data){
    const url = `${this.customer_url}/getAllKYC/updatekycAddressProofTab/${id}`;
    return this.http.put(url, data);
  }

  public updateKYCReferencesTab(id,data){
    const url = `${this.customer_url}/getAllKYC/updatekycReferencesTab/${id}`;
    return this.http.put(url, data);
  }

  public getKYCMainDetailsById(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycMainTable/${id}`);
  }

  public getKYCIndividualDetailsById(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycIndividualDetails/${id}`);
  }

  public getKYCImagesById(id) {
    return this.http.get(`${this.customer_url}/getAllKYC/kycImage/${id}`);
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
