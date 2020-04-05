import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsURL } from '../../../../constants/constant-urls';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get(ConstantsURL.GET_PRODUCTS);
  }

  getIndividualProductDetail(id) {
    return this.http.get(`${ConstantsURL.GET_PRODUCT_BY_ID}${id}`);
  }

  
}
