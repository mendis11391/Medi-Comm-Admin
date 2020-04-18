import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category } from '../../../shared/tables/product';
import { ConstantsURL } from '../../../../constants/constant-urls';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  b_url = `http://localhost:3000/products`;
  c_url = `http://localhost:3000/category`;
  cty_url = `http://localhost:3000/cities`;

  // public compareProducts : BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;

  // Observable Product Array
  private products() {
     return this.http.get(this.b_url);
  }

  // Get Products
  public getProducts(){
    return this.products();
  }

  // Get Products By Id
  public getProduct(id: string) {
    return this.http.get(`${this.b_url}/${id}`);
  }

  updateProduct(id: string, data): Observable<any> {
    const url = `${this.b_url}/${id}`;
    return this.http.put(url, data);
  }

  deleteProduct(id: string): Observable<{}> {
    const url = `${this.b_url}/${id}`;
    return this.http.delete(url);
  }

  getCategories() {
    return this.http.get(this.c_url);
  }

  updateCategory(id: string) {
    const url = `${this.c_url}/${id}`;
    return this.http.put(url, id);
  }

  addCategory(categoryName) {
    return this.http.post(this.c_url, {cat_name: categoryName});
  }

  deleteCategory(id) {
    const url = `${this.c_url}/${id}`;
    return this.http.delete(url);
  }

  getAllCities() {
    return this.http.get(this.cty_url);
  }

}
