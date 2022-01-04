import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category } from '../../../shared/tables/product';
import { ConstantsURL } from '../../../../constants/constant-urls';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

export interface specValues {
  spec_id?: number,
  spec_value?: string,
  status?: boolean
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  b_url = `http://localhost:3000/products`;
  c_url = `http://localhost:3000/category`;
  cty_url = `http://localhost:3000/cities`;
  pay_url = `http://localhost:3000/payments`

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

  public getAllProducts(){
    return this.http.get(`${this.b_url}/getAllProducts`);
  }

  public getAllProductsByCityId(id){
    return this.http.get(`${this.b_url}/productsByCity/${id}`);
  }

  // Get Products By Id
  public getProduct(id: string) {
    return this.http.get(`${this.b_url}/adminProdById/${id}`);
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
    return this.http.get(this.c_url+'/getMainCategory');
  }

  getAllCategories(){
    return this.http.get(this.c_url);
  }

  getAllCategorySpecs(){
    return this.http.get(this.c_url+'/getCategorySpecs');
  }

  getAllSpecs() {
    return this.http.get(this.c_url+'/getAllSpecs');
  }

  getAllScrollers() {
    return this.http.get(this.c_url+'/getAllScrollersNames');
  }

  getAllProductSpecs() {
    return this.http.get(this.b_url+'/specs');
  }

  getAllSpecsByProductId(id) {
    return this.http.get(this.b_url+'/specs/'+id);
  }

  getAllHighlights() {
    return this.http.get(this.b_url+'/getAllHighlights');
  }

  getAllAccs() {
    return this.http.get(this.c_url+'/getAllAccs');
  }

  getAllAccsByProductId(id) {
    return this.http.get(this.b_url+'/accessories/'+id);
  }

  getAllHighlightsByProductId(id) {
    return this.http.get(this.b_url+'/getHighlights/'+id);
  }

  getCityTimelineByProductId(id) {
    return this.http.get(this.b_url+'/getCityTimelineProduct/'+id);
  }

  getAllTenures() {
    return this.http.get(this.b_url+'/getAllTenures');
  }

  postTenureDiscounts(tenureDiscounts) {
    return this.http.post(this.b_url+'/postTenureDiscounts',  tenureDiscounts);
  }

  postCategorySpecs(catSpecs) {
    return this.http.post(this.c_url+'/postCategorySpecs',  catSpecs);
  }

  getTenureByPriority() {
    return this.http.get(this.b_url+'/tenures');
  }

  getTenureByPriorityId(id) {
    return this.http.get(this.b_url+'/tenures/'+id);
  }

  deleteTenureDiscountsById(id) {
    const url = `${this.b_url}/deleteTenureDiscount/${id}`;
    return this.http.delete(url);
  }

  deleteCategorySpecsById(id) {
    const url = `${this.c_url}/deleteCategorySpecs/${id}`;
    return this.http.delete(url);
  }

  getAllPricingSchemes() {
    return this.http.get(this.c_url+'/getAllPricingSchemes');
  }

  getAllSpecValues(){
    return this.http.get(this.b_url+'/getAllSpecValues');
  }

  getAllScrollerValues(){
    return this.http.get(this.b_url+'/getAllScrollerValues');
  }

  getSpecsByCatId(id) {
    return this.http.get(this.c_url+'/getSpecsByCatId/'+id);
  }

  getSpecValueByID(id){
    return this.http.get(this.b_url+'/getSpecsValuesById/'+id);
  }

  updateCategory(id: string) {
    const url = `${this.c_url}/${id}`;
    return this.http.put(url, id);
  }

  addCategory(categoryName) {
    return this.http.post(this.c_url,  categoryName);
  }

  deleteCategory(id) {
    const url = `${this.c_url}/${id}`;
    return this.http.delete(url);
  }

  getSpecs() {
    return this.http.get(this.c_url+'/getAllSpecs');
  }

  getAllCities() {
    return this.http.get(this.cty_url);
  }

  addReplacement(val){
    return this.http.post(`${this.pay_url}/replacement`, val)
  }

}
