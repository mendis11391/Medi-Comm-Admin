import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from  '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const URL = ' http://localhost:3000/products/upload/';

@Component({
  selector: 'app-digital-add',
  templateUrl: './digital-add.component.html',
  styleUrls: ['./digital-add.component.scss']
})
export class DigitalAddComponent implements OnInit {

  addProduct: FormGroup;
  constructor(
    private router: Router,
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
  accessories;
  pricingSchemes;
  brands;
  categoryName;
  importExcel;

  cities;

  subCat=[];
  catSpecs;
  prodRequied:boolean=false;
  prodSuccessfull:boolean=false;
  finalBlob;
  highlights;

  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void { }

  productFields(){
    this.addProduct = this.formBuilder.group({
      mainCatName:['', Validators.required],
      subCatId:['', Validators.required],
      accessory:['', Validators.required],
      brandId:[1],
      // cityId:['', Validators.required],
      deliveryTimeline:[0],      
      productName:['', Validators.required],
      metaTitle:['', Validators.required],
      slug:['', Validators.required],
      prodImage:['', Validators.required],
      prodDescription:['', Validators.required],
      prodQty:[0],
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
    this.getAllCategories();
    this.getAllaccessories();
    this.getAllHighlights();
    this.getAllPricingSchemes();
    this.getAllBrands();
    this.getAllCities();
    this.getAllspecValuesBySpecId(1);
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getAllaccessories() {
    this.category.getAllAccs().subscribe(res => {
      this.accessories = res;
    });
  }

  getAllPricingSchemes() {
    this.category.getAllPricingSchemes().subscribe(res => {
      this.pricingSchemes = res;
    });
  }

  getSubCategory(){
    this.subCat = this.categories.filter(item=>item.id==this.addProduct.value.mainCatName);
    console.log(this.subCat[0].subItems);
  }

  getSpecsByCatId(){
    let sf:FormGroup = this.addProduct.get('specs') as FormGroup;
    sf.controls={};
    let id = this.addProduct.value.subCatId;
    this.category.getSpecsByCatId(id).subscribe((resp)=>{
      var cSpecs:any = resp;
      
      this.catSpecs=resp;
      for(let i=0; i<cSpecs.length;i++){
        let a = sf.addControl(cSpecs[i].spec_id , this.formBuilder.control(''));
      }
      console.log(sf.controls);
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
    formData.append('qty', '0');
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

    that.http.post(' http://localhost:3000/products/', formData).subscribe((res) => {
      console.log(res);
    });
    
  }

  addProducts() {
    this.addProduct.patchValue({
      prodImage:this.finalBlob
    });
    this.prodRequied=false;
    console.log(this.addProduct.value)
    if(this.addProduct.valid){
      alert('Products added successfully');
      this.router.navigate(['/products/digital/digital-product-list']);
      this.http.post(' http://localhost:3000/products', this.addProduct.value).subscribe((res) => {
        // this.addProduct.reset();
        
        // this.prodSuccessfull=true;
        // setTimeout(() => {
        //   this.prodSuccessfull=false;
        // }, 3000);
      });
      
    } else{
      this.prodRequied=true;
    }
    
  }

  imageChange(e) {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#product_image');

    var fReader = new FileReader();
    var imageData;
    var finalBlob;
    fReader.readAsDataURL(inputEl.files[0]);
    fReader.onloadend = function(event){
      console.log(event.target.result);
      imageData = JSON.stringify(event.target.result);
      // console.log(imageData.split(",")[1].slice(0,-1));
      const contentType = 'image/png';
      // const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  
      // const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);
      const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);

      
    }

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      finalBlob=b64Data;
    }
    
    setTimeout(()=>{
      this.finalBlob=finalBlob;
    }, 100);
    
  }

  getAllHighlights() {
    this.category.getAllHighlights().subscribe(res => {
      this.highlights = res;
    });
  }
  // imageChange(e) {
  //   let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#product_image');

  //   var fReader = new FileReader();
  //   var imageData;
  //   var finalBlob;
  //   fReader.readAsDataURL(inputEl.files[0]);
  //   fReader.onloadend = function(event){
  //     console.log(event.target.result);
  //     imageData = JSON.stringify(event.target.result);
  //     console.log(imageData.split(",")[1].slice(0,-1));
  //     const contentType = 'image/png';
  //     // const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  
  //     const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);

      
  //   }

  //   const b64toBlob = (b64Data, contentType)=>{
  //     const byteCharacters = atob(b64Data);

  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], {type: contentType});
  //     console.log(blob);
  //     finalBlob = byteArray;
  //     return blob;
  //   }
  //   setTimeout(()=>{
  //     this.finalBlob=finalBlob;
  //   }, 100);
    
  //   // this.addProduct.patchValue({
  //   //   prodImage:JSON.stringify(finalBlob)
  //   // });
  //   // console.log(this.addProduct.value);
  //   // const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  //   //   const byteCharacters = atob(b64Data);
  //   //   const byteArrays = [];
    
  //   //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //   //     const slice = byteCharacters.slice(offset, offset + sliceSize);
    
  //   //     const byteNumbers = new Array(slice.length);
  //   //     for (let i = 0; i < slice.length; i++) {
  //   //       byteNumbers[i] = slice.charCodeAt(i);
  //   //     }
    
  //   //     const byteArray = new Uint8Array(byteNumbers);
  //   //     byteArrays.push(byteArray);
  //   //     console.log(byteArrays);
  //   //   }
    
  //   //   const blob = new Blob(byteArrays, {type: contentType});
  //   //   return blob;
  //   // }

  //   // const contentType = 'image/png';
  //   // const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

  //   // const blob = b64toBlob(b64Data, contentType);

  //   // this.addProduct.patchValue({
  //   //   prodImage:JSON.stringify(imageData),
  //   //   prodQty:7
  //   // });
  //   // console.log(this.addProduct.value);
  // }

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
