import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliverydateService {
  cty_url = `http://localhost:3000/cities`;

  constructor(private http: HttpClient) { }

  public getAllCities() {
    return this.http.get(`${this.cty_url}`);
  }

  updateDeliveryDate(data) {
    const url = `${this.cty_url}`;
    return this.http.put(url, data);
  }
}
