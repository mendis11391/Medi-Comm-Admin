import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brandUrl = `${environment.apiUrl}/brand`;

  constructor(private http: HttpClient) { }

  getAllBrands() {
    return this.http.get(this.brandUrl);
  }

}
