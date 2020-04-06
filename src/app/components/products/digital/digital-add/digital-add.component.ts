import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder } from  '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
const URL = 'http://localhost:3000/products/upload/';

@Component({
  selector: 'app-digital-add',
  templateUrl: './digital-add.component.html',
  styleUrls: ['./digital-add.component.scss']
})
export class DigitalAddComponent implements OnInit {

  addProduct: FormGroup;
  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private category:ProductService,
    private brand: BrandService) {
      this.productFields();
    }


  fileData=[];
  imagePath;
  categories;
  brands;

  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void { }

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

  onImageChange(evt){
    if(evt.target.files.length>0) {
      this.fileData = evt.target.files;
    }
  }

  appendTenure() {
    return `3:${this.addProduct.value.tenure.threeMonths}[--split--]6:${this.addProduct.value.tenure.sixMonths}[--split--]9:${this.addProduct.value.tenure.nineMonths}[--split--]12:${this.addProduct.value.tenure.twelveMonths}[--split--]18:${this.addProduct.value.tenure.eighteenMonths}[--split--]24:${this.addProduct.value.tenure.twentyFourMonths}`;
  }

  addProducts() {
    const tenureData = this.appendTenure();
    const formData = new FormData();
    for (let img of this.fileData) {
      formData.append('product_image', img);
    }
    formData.append('name', this.addProduct.value.title);
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
    formData.append('category', this.addProduct.value.category);

    this.addProduct.value.product_image = this.fileData;

    this.http.post('http://localhost:3000/products/', formData).subscribe((res) => {
      console.log(res);
    });
  }

  imageChange(evt) {
    console.log(evt);
    // this.images_name
  }

  upload() {
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#product_image');
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
        let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('product_image', inputEl.files.item(0));
            //call the angular http method
            this.http.post(URL, formData).pipe(map((res:Response) => res.json())).subscribe(
                //map the success function and alert the response
                 (success) => {
                         alert('success');
                },
                (error) => alert(error))
          }
  }

}
