import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brandUrl = `http://localhost:3000/brand`;

  constructor(private http: HttpClient) { }

  getAllBrands() {
    return this.http.get(this.brandUrl);
  }

}
