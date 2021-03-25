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
  prodImgs;

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
  defaultBrand;

  productFields(){
    this.addProduct = this.formBuilder.group({
      title: [''],
      description: [''],
      qty:[''],
      price:[''],
      deliveryDate:[''],
      product_image:[''],
      status: ['0'],
      brand:[''],
      ram:[''],
      processor:[''],
      screen_size:[''],
      weight:[''],
      usb:[''],
      hdmi:[''],
      clockSpeed:[''],
      battery:[''],
      touchScreen:['0'],
      connectivity:[''],
      webcam:['0'],
      disk_type:['0'],
      disk_size:[''],
      specifications:[''],
      tenureFinal: [''],
      tenure: this.formBuilder.group({
        oneMonth: [0],
        threeMonths: [0],
        sixMonths: [0],
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

  onImageChange(evt){
    if(evt.target.files.length>0) {
      this.fileData = evt.target.files;
    }
  }

  getAllBrands() {
    this.brand.getAllBrands().subscribe((res) => {
      this.brands = res;
    });
  }

  getProducts(id) {
    this.productsService.getProduct(id).subscribe((res: any) => {
      let data = res;
      this.id = data.prod_id;
      let specs= JSON.parse(JSON.parse(data.specs));
      this.fileData=data.prod_img;
      this.addProduct.patchValue({
        title: data.prod_name,
        description: data.prod_description,
        deliveryDate:data.prod_deliveryDate,
        qty:data.prod_qty,
        price: data.prod_price,
        status: data.prod_status,
        brand: data.brand_id,
        ram: data.prod_ram,
        processor: data.prod_processor,
        screen_size: data.prod_screensize,
        weight: specs.weight,
        usb: specs.usb,
        hdmi: specs.hdmi,
        clockSpeed:specs.clockSpeed,
        battery:specs.battery,
        touchScreen:specs.touchScreen,
        connectivity:specs.connectivity,
        webcam:specs.webcam,
        disk_type: data.prod_disktype,
        disk_size: data.prod_disksize,
        specifications:data.prod_specification,
        tenure: {
          oneMonth: data.prod_tenure[0][1],
          threeMonths:  data.prod_tenure[1][1],
          sixMonths:  data.prod_tenure[2][1],
          twelveMonths:  data.prod_tenure[3][1],
          eighteenMonths:  data.prod_tenure[4][1],
          twentyFourMonths:  data.prod_tenure[5][1]
        },
        category: data.prod_cat_id
      });

      this.prodImgs = data.prod_img;

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
    return `1:${this.addProduct.value.tenure.oneMonth}[--split--]3:${this.addProduct.value.tenure.threeMonths}[--split--]6:${this.addProduct.value.tenure.sixMonths}[--split--]12:${this.addProduct.value.tenure.twelveMonths}[--split--]18:${this.addProduct.value.tenure.eighteenMonths}[--split--]24:${this.addProduct.value.tenure.twentyFourMonths}`;
  }

  updateProducts() {  
    const tenureData = this.appendTenure();
    this.addProduct.patchValue({
      tenureFinal: tenureData
    });
    const formData = new FormData();
    for (let img of this.fileData) {
      formData.append('product_image', img);
    }
    const specs={
      weight: this.addProduct.value.weight,
      usb: this.addProduct.value.usb,
      hdmi: this.addProduct.value.hdmi,
      clockSpeed: this.addProduct.value.clockSpeed,
      battery: this.addProduct.value.battery,
      touchScreen: this.addProduct.value.touchScreen,
      connectivity: this.addProduct.value.connectivity,
      webcam: this.addProduct.value.webcam,
    };
    const dbSpecs=[];
    dbSpecs.push(JSON.stringify(specs));
    formData.append('title', this.addProduct.value.title);
    formData.append('description', this.addProduct.value.description);
    formData.append('qty', this.addProduct.value.qty);
    formData.append('price', this.addProduct.value.price);
    formData.append('deliveryDate', this.addProduct.value.deliveryDate);
    formData.append('status', this.addProduct.value.status);
    formData.append('brand', this.addProduct.value.brand);
    formData.append('ram', this.addProduct.value.ram);
    formData.append('processor', this.addProduct.value.processor);
    formData.append('screen_size', this.addProduct.value.screen_size);
    formData.append('specs', JSON.stringify(dbSpecs));
    formData.append('disk_type', this.addProduct.value.disk_type);
    formData.append('disk_size', this.addProduct.value.disk_size);
    formData.append('specifications', this.addProduct.value.specifications);
    formData.append('tenure', tenureData);

    this.addProduct.value.product_image = this.fileData;

    this.http.put(`http://localhost:3000/products/${this.prodId}`, formData).subscribe((res) => {
      console.log(res);
    });
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
                 (success) => {
                         alert('success');
                },
                (error) => alert(error))
          }
  }


}
