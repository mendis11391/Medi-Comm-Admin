import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orders } from "../../../shared/data/order";
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orders_url = `http://localhost:3000/orders`;

  constructor(private http: HttpClient) { 
    
  }

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.orders_url}`)
  }

  // updateOrderStatus(id: string, data): Observable<any>{
  //     const url = `${this.orders_url}/${id}`;
  //     return this.http.put(url, data);
  //   }
  // }
}
