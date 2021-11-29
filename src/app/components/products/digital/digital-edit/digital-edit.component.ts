import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
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
export class DigitalEditComponent implements OnInit, AfterViewInit {

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
      this.productFields();
  }

  fileData=[];
  imagePath;
  defaultBrand;

  subCat=[];
  catSpecs;
  cities

  productFields(){
    this.addProduct = this.formBuilder.group({
      mainCatName:['', Validators.required],
      subCatId:['', Validators.required],
      brandId:['', Validators.required],
      cityId:['', Validators.required],
      deliveryTimeline:['', Validators.required],      
      productName:['', Validators.required],
      metaTitle:['', Validators.required],
      slug:['', Validators.required],
      prodImage:['', Validators.required],
      prodDescription:['', Validators.required],
      prodQty:['', Validators.required],
      securityDeposit:['', Validators.required],
      tenureBasePrice:['', Validators.required],
      specs:new FormGroup({}),
      highlightType:['', Validators.required],
      prodStatus:[true],
      publishedAt:[new Date()],
      startsAt:[new Date()],
      endsAt:[new Date()],
      priority:['', Validators.required],
      createdBy:[1],
      modifiedBy:[1]
    });
  }

  ngOnInit() {
    this.prodId = this.route.snapshot.params['id'];
    this.getProducts(this.route.snapshot.params['id']);
    this.getAllCategories();
    this.getAllBrands();
    this.getAllCities();
    this.getAllspecValuesBySpecId(1);
  }

  ngAfterViewInit(){
    this.getSubCategory();
    this.getSpecsByCatId();
  }




  onImageChange(evt){
    if(evt.target.files.length>0) {
      this.fileData = evt.target.files;
    }
  }

  // getAllBrands() {
  //   this.brand.getAllBrands().subscribe((res) => {
  //     this.brands = res;
  //   });
  // }

  getProducts(id) {
    this.productsService.getProduct(id).subscribe((res: any) => {
      let data = res[0];
      // this.id = data.prod_id;
      // let specs= JSON.parse(JSON.parse(data.specs));
      // this.fileData=data.prod_img;
      this.addProduct.patchValue({
        mainCatName:data.main_cat_id,
        subCatId:data.cat_id,
        brandId:data.brand_id,
        cityId:data.city_id,
        deliveryTimeline:data.delivery_timeline,      
        productName:data.prod_name,
        metaTitle:data.metaTitle,
        slug:data.slug,
        prodImage:data.prod_image,
        prodDescription:data.prod_description,
        prodQty:data.prod_qty,
        securityDeposit:data.securityDeposit,
        tenureBasePrice:data.tenure_base_price,
        specs:new FormGroup({}),
        // highlightType:['', Validators.required],
        prodStatus:data.prod_status,
        publishedAt:[new Date()],
        startsAt:[new Date()],
        endsAt:[new Date()],
        priority:data.priority,
        createdBy:[1],
        modifiedBy:[1]
      });
      
      // this.prodImgs = data.prod_img;

      // if(this.addProduct.value.disk_type === '0') {
      //   let a: HTMLElement = document.querySelector('#edo-ani1');
      //   a.click();
      // } else {
      //   let a: HTMLElement = document.querySelector('#edo-ani');
      //   a.click();
      // }

      // if(this.addProduct.value.status === '0') {
      //   let a: HTMLElement = document.querySelector('#edo-ani4');
      //   a.click();
      // } else {
      //   let a: HTMLElement = document.querySelector('#edo-ani3');
      //   a.click();
      // }
    });
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getSubCategory(){
    this.subCat = this.categories.filter(item=>item.id==this.addProduct.value.mainCatName);
    console.log(this.subCat[0].subItems);
  }

  getSpecsByCatId(){
    let id = this.addProduct.value.subCatId;
    this.category.getSpecsByCatId(id).subscribe((resp)=>{
      var cSpecs:any = resp;
      let sf:FormGroup = this.addProduct.get('specs') as FormGroup;
      this.catSpecs=resp;
      for(let i=0; i<cSpecs.length;i++){
        let a = sf.addControl(cSpecs[i].spec_id , this.formBuilder.control(['']));
      }
      console.log(this.addProduct.value); 
    });
       
  }

  getAllBrands() {
    this.brand.getAllBrands().subscribe((res) => {
      this.brands = res;
    });
  }

  getAllCities() {
    this.category.getAllCities().subscribe((res) => {
      this.cities = res;
    })
  }


  getAllspecValuesBySpecId(id){
    this.category.getSpecValueByID(id).subscribe((res)=>{
      return res;
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
