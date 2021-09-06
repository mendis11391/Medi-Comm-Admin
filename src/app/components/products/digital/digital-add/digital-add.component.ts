import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder } from  '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import * as XLSX from 'xlsx';
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
  categoryName;
  importExcel;

  cities;

  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void { }

  productFields(){
    this.addProduct = this.formBuilder.group({
      title: [''],
      offers: ['["oid1","oid2","oid3","oid4"]'],
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
      tenure: this.formBuilder.group({
        oneMonth: [0],
        threeMonths: [0],
        sixMonths: [0],
        twelveMonths: [0],
        eighteenMonths: [0],
        twentyFourMonths: [0]
      }),
      featured:[0],
      bestSeller:[0],
      newProducts:[0],
      category:[''],
      cities: []
    });
  }

  ngOnInit() {
    this.getAllCategories();
    this.getAllBrands();
    this.getAllCities();
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

  getAllCities() {
    this.category.getAllCities().subscribe((res) => {
      this.cities = res;
    })
  }

  onImageChange(evt){
    if(evt.target.files.length>0) {
      this.fileData = evt.target.files;
    }
  }

  appendTenure() {
    return `1:${this.addProduct.value.tenure.oneMonth}[--split--]3:${this.addProduct.value.tenure.threeMonths}[--split--]6:${this.addProduct.value.tenure.sixMonths}[--split--]12:${this.addProduct.value.tenure.twelveMonths}[--split--]18:${this.addProduct.value.tenure.eighteenMonths}[--split--]24:${this.addProduct.value.tenure.twentyFourMonths}`;
  }

  selectCities() {
    let arr;
    arr = this.addProduct.value.cities.join('[--split--]');
    return arr;
  }

  selectOffers() {
    let arr;
    arr = this.addProduct.value.offers.join('[--split--]');
    return arr;
  }

  getCategoryName() {
    this.categoryName = this.categories.filter((res) => {
      return res.cat_id === this.addProduct.value.category;
    });
  }
  
  specialProducts(e){
    let id=e.target.id;
    if(id=="featured"){
      this.addProduct.value.featured=e.target.checked ? 1 : 0;
    }
    else if(id=="bestSeller"){
      this.addProduct.value.bestSeller=e.target.checked ? 1 : 0;
    }
    else if(id=="newProducts"){
      this.addProduct.value.newProducts=e.target.checked ? 1 : 0;
    }   
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData.data);
      this.importExcel=JSON.parse(dataString);
      // fileData.forEach((element) => {
      //   document.getElementById('output').innerHTML = element.URL
      // });
    }
    reader.readAsBinaryString(file);
  }

  importExcelData(){    
    // this.importExcel.forEach(this.importProducts);
    for(let i=0;i<this.importExcel.length;i++){
      this.importProducts(this.importExcel[i]);
    }
  }

  importProducts(item) {
    var that = this;
    const specs={
      weight: item.Weight,
      usb: item.USBPorts,
      hdmi: item.HDMIPort,
      clockSpeed: item.ClockSpeed,
      battery: item.Battery,
      touchScreen: item.TouchScreen,
      connectivity: item.Connectivity,
      webcam: item.Webcam,
    };
    let category;
    if(item.Categories=='Laptops'){
      category='cat12345';
    } else if(item.Categories=='Desktops'){
      category='cat12348';
    } else if(item.Categories=='Camera'){
      category='cat12349';
    } 
    const tenureData = `1:${item.Month1}[--split--]3:${item.Month3}[--split--]6:${item.Month6}[--split--]12:${item.Month12}[--split--]18:${item.Month18}[--split--]24:${item.Month24}`;
    const dbSpecs=[];
    dbSpecs.push(JSON.stringify(specs));
    const formData = new FormData();

    formData.append('name', item.Title);
    formData.append('offers', item.Offers);
    formData.append('description', item.Url);
    formData.append('qty', item.Qty);
    formData.append('price', item.SecurityDeposit);
    formData.append('deliveryDate', item.DeliveryDate);
    formData.append('product_image', item.Images);
    formData.append('status', item.Status);
    formData.append('brand', item.Brand);
    formData.append('ram', item.Ram);
    formData.append('processor', item.Processor);
    formData.append('screen_size', item.ScreenSize);
    formData.append('specs', JSON.stringify(dbSpecs));
    formData.append('disk_type', item.DiskType);
    formData.append('disk_size', item.DiskSize);
    formData.append('specifications', item.Description);
    formData.append('tenure', tenureData);
    formData.append('featured', item.Featured);
    formData.append('bestSeller', item.BestSeller);
    formData.append('newProducts', item.NewProducts);
    formData.append('category', 'cat12345');
    formData.append('cities', item.Cities);
    formData.append('categoryName', item.Categories);

    that.http.post('http://localhost:3000/products/', formData).subscribe((res) => {
      console.log(res);
    });
    
  }

  addProducts() {
    const tenureData = this.appendTenure();
    const appendedcities: string = this.selectCities();
    const formVal = this.addProduct.value;
    const specs={
      weight: formVal.weight,
      usb: formVal.usb,
      hdmi: formVal.hdmi,
      clockSpeed: formVal.clockSpeed,
      battery: formVal.battery,
      touchScreen: formVal.touchScreen,
      connectivity: formVal.connectivity,
      webcam: formVal.webcam,
    };
    const dbSpecs=[];
    dbSpecs.push(JSON.stringify(specs));
    let categoryNameF: any = this.categoryName;
    categoryNameF = categoryNameF[0].cat_name;
    const formData = new FormData();
    for (let img of this.fileData) {
      formData.append('product_image', img);
    }
    formData.append('name', this.addProduct.value.title);
    formData.append('offers', this.addProduct.value.offers);
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
    formData.append('featured', this.addProduct.value.featured);
    formData.append('bestSeller', this.addProduct.value.bestSeller);
    formData.append('newProducts', this.addProduct.value.newProducts);
    formData.append('category', this.addProduct.value.category);
    formData.append('cities', appendedcities);
    formData.append('categoryName', categoryNameF);


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
                 (success) => {
                         alert('success');
                },
                (error) => alert(error))
          }
  }

}
