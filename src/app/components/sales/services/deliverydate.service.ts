import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliverydateService {
  cty_url = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) { }

  public getAllCities() {
    return this.http.get(`${this.cty_url}`);
  }

  updateDeliveryDate(data) {
    const url = `${this.cty_url}`;
    return this.http.put(url, data);
  }

  updateTaxes(data) {
    const url = `${this.cty_url}/taxes`;
    return this.http.put(url, data);
  }

  updatePadding(data, id) {
    const url = `${this.cty_url}/padding/${id}`;
    return this.http.put(url, data);
  }
}
