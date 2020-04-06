import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder } from  '@angular/forms';
import { ProductService } from '../../services/product.service';
import { fileURLToPath } from 'url';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from '../../services/brand.service';
const URL = 'http://localhost:3000/products/upload/';

@Component({
  selector: 'app-digital-edit',
  templateUrl: './digital-edit.component.html'
})
export class DigitalEditComponent implements OnInit {

  addProduct: FormGroup;
  id:string = '';
  prodId: string;
  categories;
  brands;

  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private productsService: ProductService,
    private brand: BrandService,
    private category: ProductService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  fileData=[];
  imagePath;

  productFields(){
    this.addProduct = this.formBuilder.group({
      title: [''],
      description: [''],
      price:[''],
      product_image:[''],
      status: ['0'],
      brand:[''],
      ram:[''],
      processor:[''],
      screen_size:[''],
      disk_type:['0'],
      disk_size:[''],
      specifications:[''],
      tenureFinal: [''],
      tenure: this.formBuilder.group({
        threeMonths: [0],
        sixMonths: [0],
        nineMonths: [0],
        twelveMonths: [0],
        eighteenMonths: [0],
        twentyFourMonths: [0]
      }),
      category:['']
    });
  }

  ngOnInit() {
    this.prodId = this.route.snapshot.params['id'];
    this.getProducts(this.route.snapshot.params['id']);
    this.productFields();

    this.getAllCategories();
    this.getAllBrands();
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getAllBrands() {
    this.brand.getAllBrands().subscribe((res) => {
      this.brands = res;
    });
  }

  getProducts(id) {
    this.productsService.getProduct(id).subscribe((res: any) => {
      let data = res[0];
      this.id = data.prod_id;
      this.addProduct.patchValue({
        title: data.prod_name,
        description: data.prod_description,
        price: data.prod_price,
        status: data.prod_status,
        brand: data.brand_name,
        ram: data.prod_ram,
        processor: data.prod_processor,
        screen_size: data.prod_screensize,
        disk_type: data.prod_disktype,
        disk_size: data.prod_disksize,
        specifications:data.prod_specification,
        tenure: {
          threeMonths: data.prod_tenure[0][1],
          sixMonths:  data.prod_tenure[1][1],
          nineMonths:  data.prod_tenure[2][1],
          twelveMonths:  data.prod_tenure[3][1],
          eighteenMonths:  data.prod_tenure[4][1],
          twentyFourMonths:  data.prod_tenure[5][1]
        }
      });

      if(this.addProduct.value.disk_type === '0') {
        let a: HTMLElement = document.querySelector('#edo-ani1');
        a.click();
      } else {
        let a: HTMLElement = document.querySelector('#edo-ani');
        a.click();
      }

      if(this.addProduct.value.status === '0') {
        let a: HTMLElement = document.querySelector('#edo-ani4');
        a.click();
      } else {
        let a: HTMLElement = document.querySelector('#edo-ani3');
        a.click();
      }
    });
  }


  appendTenure() {
    return `3:${this.addProduct.value.tenure.threeMonths}[--split--]6:${this.addProduct.value.tenure.sixMonths}[--split--]9:${this.addProduct.value.tenure.nineMonths}[--split--]12:${this.addProduct.value.tenure.twelveMonths}[--split--]18:${this.addProduct.value.tenure.eighteenMonths}[--split--]24:${this.addProduct.value.tenure.twentyFourMonths}`;
  }

  updateProducts() {  
    const tenureData = this.appendTenure();
    this.addProduct.patchValue({
      tenureFinal: tenureData
    });
    const formData = new FormData();
    // for (let img of this.fileData) {
    //   formData.append('product_image', img);
    // }
    formData.append('title', this.addProduct.value.title);
    formData.append('description', this.addProduct.value.description);
    formData.append('price', this.addProduct.value.price);
    formData.append('status', this.addProduct.value.status);
    formData.append('brand', this.addProduct.value.brand);
    formData.append('ram', this.addProduct.value.ram);
    formData.append('processor', this.addProduct.value.processor);
    formData.append('screen_size', this.addProduct.value.screen_size);
    formData.append('disk_type', this.addProduct.value.disk_type);
    formData.append('disk_size', this.addProduct.value.disk_size);
    formData.append('specifications', this.addProduct.value.specifications);
    formData.append('tenure', tenureData);


    this.http.put(`http://localhost:3000/products/${this.prodId}`, this.addProduct.value).subscribe((res) => {
      console.log(res);
    });
  }



}
