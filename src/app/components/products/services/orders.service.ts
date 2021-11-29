import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orders,OrderItems, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orders_url = `http://localhost:3000/orders`;
  assets_url = `http://localhost:3000/assets`;
  customer_url = `http://localhost:3000/users`;

  constructor(private http: HttpClient) { 
    
  }

  getAllassets(): Observable<Assets[]> {
    return this.http.get<Assets[]>(`${this.assets_url}`)
  }

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.orders_url}`)
  }

  getAllCustomers(): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${this.customer_url}`)
  }
  getAllCustomersByid(id): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${this.customer_url}/getCustomerById/${id}`)
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
