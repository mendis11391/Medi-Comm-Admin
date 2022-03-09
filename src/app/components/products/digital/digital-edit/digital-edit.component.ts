import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
import { ProductService } from '../../services/product.service';
import { fileURLToPath } from 'url';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
const URL = 'http://localhost:3000/products/upload/';

@Component({
  selector: 'app-digital-edit',
  templateUrl: './digital-edit.component.html'
})
export class DigitalEditComponent implements OnInit, AfterViewInit {

  addProduct: FormGroup;
  id:string = '';
  prodId: string;
  prodById:string;
  categories;
  brands;
  prodImgs;
  
  public closeResult: string;
  pricingSchemes;

 // variables for edit
 mainCatId=0;
 subCatId=0;
 specsCheck;
 accsID;
 HighlightsID;
 finalBlob;
 ckEdit:boolean=false;
 
  constructor(
    private modalService: NgbModal,
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
  cities;
  accessories;
  highlights;
  editProducts;
  productFields(){
    this.addProduct = this.formBuilder.group({
      mainCatName:['', Validators.required],
      subCatId:['', Validators.required],
      // brandId:['', Validators.required],
      // cityId:['', Validators.required],
      // deliveryTimeline:['', Validators.required],  
      accessory:['', Validators.required],    
      productName:['', Validators.required],
      metaTitle:['', Validators.required],
      metaDescription:['', Validators.required],
      metaKeywords:['', Validators.required],
      slug:['', Validators.required],
      prodImage:[''],
      prodDescription:['', Validators.required],
      // prodQty:['', Validators.required],
      securityDeposit:['', Validators.required],
      tenureBasePrice:['', Validators.required],
      specs:new FormGroup({}),
      highlightType:['', Validators.required],
      prodStatus:[true],
      priority:['', Validators.required],
      position:['', Validators.required]
    });
  }

  ngOnInit() {
    let data = new Promise((resolve, reject)=>{
      this.prodId = this.route.snapshot.params['id'];
      this.getProducts(this.route.snapshot.params['id']);
      resolve('successs');
    });

    data.then((success)=>{  
      this.getAllCategories();
      this.getAllHighlights();
      this.getAllaccessories();
      this.getAllPricingSchemes();
      // this.getAllBrands();
      this.getAllCities();
      // this.getAllspecValuesBySpecId(1);
    });
    
    
  }

  ngAfterViewInit(){
    
    // this.getSubCategory();
    // this.getSpecsByCatId();
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
      console.log(data);
      this.prodById = data.prod_id;
      this.specsCheck = data.specs;
      console.log(this.specsCheck);
      // this.id = data.prod_id;
      // let specs= JSON.parse(JSON.parse(data.specs));
      // this.fileData=data.prod_img;
      this.mainCatId = data.main_cat_id;
      this.subCatId = data.cat_id;
      this.addProduct.patchValue({
        mainCatName:data.main_cat_id,
        subCatId:data.cat_id,
        // brandId:data.brand_id,
        // cityId:data.city_id,
        deliveryTimeline:data.delivery_timeline,      
        productName:data.prod_name,
        metaTitle:data.metaTitle,
        metaDescription:data.metaDescription,
        metaKeywords:data.metaKeywords,
        slug:data.slug,
        prodImage:data.prod_image,
        prodDescription:data.prod_description,
        // prodQty:data.prod_qty,
        securityDeposit:data.securityDeposit,
        tenureBasePrice:data.tenure_base_price,
        specs:new FormGroup({}),
        // highlightType:['', Validators.required],
        prodStatus:data.prod_status,
        priority:data.priority,
        position:data.position
      });

      this.getAllAccessories(id);
      this.getAllHighlightsByPID(id);
      this.getCityTimelineProductById(id);
      // this.productsService.getAllAccsByProductId(id).subscribe((acc)=>{
      //   let accessoryId = acc[0];
      //   let accsArr=[];
      //   for(let accI=0;accI<accessoryId.length;accI++){
      //     accsArr.push(accessoryId[accI].accessory_id);
      //   }
      //   this.accsID=accsArr;
      //   console.log(this.accsID);
      //   if(this.accsID.includes(1)){
      //     console.log(true)
      //   }
      //   this.addProduct.patchValue({
      //     accessory:accsArr
      //   });
      // });
      

    });


  }

  onChange(e){
    console.log(e);
  }

  getCityTimelineProductById(id){
    this.productsService.getCityTimelineByProductId(id).subscribe((acc)=>{ 
      this.editProducts=acc;
    });
  }

  getAllCategories() {
    let data = new Promise((resolve, reject)=>{
      this.category.getCategories().subscribe(res => {
        this.categories = res;      
        resolve('data success');
      });
    });
    data.then((success)=>{      
      this.getSubCategory();
      this.getSpecsByCatId();
    });
  }

  getAllAccessories(id) {
    let accsIdArr=[];
    this.productsService.getAllAccsByProductId(id).subscribe((acc)=>{  
      for(let k=0;k<acc[0].length;k++){
        accsIdArr.push(acc[0][k].accessory_id);
      }
      this.addProduct.patchValue({
        accessory:accsIdArr
      });
      this.accsID=accsIdArr;
      console.group(this.accsID);
      for(let i=0;i<this.accessories.length;i++){
        this.accessories[i].checked=false;
        for(let j=0;j<this.accsID.length;j++){
          if(this.accsID[j]==this.accessories[i].id){
            this.accessories[i].checked=true;
          }
        }
      }      
    });
  }

  getAllHighlightsByPID(id) {
    let highlisghtsIdArr=[];
    let HL;
    this.productsService.getAllHighlightsByProductId(id).subscribe((highlights)=>{ 
      HL=highlights;   
      for(let k=0;k<HL.length;k++){
        highlisghtsIdArr.push(HL[k].highlight_type)
      }
      this.addProduct.patchValue({
        highlightType:highlisghtsIdArr
      });
      this.HighlightsID=highlisghtsIdArr;
      for(let i=0;i<this.highlights.length;i++){
        this.highlights[i].checked=false;
        for(let j=0;j<this.HighlightsID.length;j++){
          if(this.HighlightsID[j]==this.highlights[i].id){
            this.highlights[i].checked=true;
          }
        }
      }      
    });
  }

  callGetAccByID(){
    this.getAllAccessories(this.prodById);
  }

  callGetHighlightsByID(){
    this.getAllHighlightsByPID(this.prodById);
  }

  accsActions(e,id){
    let accs=[];
    accs=this.accsID;
    let uniqueAccsArr;
    if(e.target.checked){
      accs.push(id);
      this.accsID=accs;
      uniqueAccsArr = this.accsID.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      console.log(uniqueAccsArr);
      this.addProduct.patchValue({
        accessory:uniqueAccsArr
      });
    }else{
      const index = accs.indexOf(id);
      if (index > -1) {
        accs.splice(index, 1);
      }
      this.accsID=accs;
      uniqueAccsArr = this.accsID.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      console.log(uniqueAccsArr);
      this.addProduct.patchValue({
        accessory:uniqueAccsArr
      });
    }
  }

  highlightsActions(e,id){
    let highlights=[];
    highlights=this.HighlightsID;
    let uniqueSpecsArr;
    if(e.target.checked){
      highlights.push(id);
      this.HighlightsID=highlights;
      uniqueSpecsArr = this.HighlightsID.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      this.addProduct.patchValue({
        highlightType:this.HighlightsID
      });
    }else{
      const index = highlights.indexOf(id);
      if (index > -1) {
        highlights.splice(index, 1);
      }
      this.HighlightsID=highlights;
      uniqueSpecsArr = this.HighlightsID.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      this.addProduct.patchValue({
        highlightType:this.HighlightsID
      });
    }
  }

  getSubCategory(){
    this.subCat = this.categories.filter(item=>item.id==this.mainCatId);
    this.subCat = this.subCat[0].subItems;
  }

  getAllaccessories() {
    this.category.getAllAccs().subscribe(res => {
      this.accessories = res;
    });
  }

  getAllHighlights() {
    this.category.getAllHighlights().subscribe(res => {
      this.highlights = res;
    });
  }

  getSpecsByCatId(){
    let id = this.addProduct.value.subCatId;
    let specsCheckArray=[];
    let prevSpecId=[];
    this.category.getSpecsByCatId(this.subCatId).subscribe((resp)=>{
      var cSpecs:any = resp;
      let sf:FormGroup = this.addProduct.get('specs') as FormGroup;
      this.catSpecs=resp;
      console.log(this.specsCheck);
      // if(Object.keys(this.specsCheck).length>0){        
      //   for(let j in this.specsCheck){
      //     specsCheckArray.push(this.specsCheck[j]);
      //     console.log(this.specsCheck[j]);
      //     let a = sf.addControl(j , this.formBuilder.control(this.specsCheck[j]));
      //   }
      // } else{
      //   for(let i=0; i<cSpecs.length;i++){
      //     console.log(cSpecs[i]);
      //     let a = sf.addControl(cSpecs[i].spec_id , this.formBuilder.control('0'));
      //     console.log(specsCheckArray[i]);
      //   }
      // }
      for(let j in this.specsCheck){
        specsCheckArray.push(this.specsCheck[j]);
        prevSpecId.push(j);
      } 
      
      for(let i=0; i<cSpecs.length;i++){
        
        if(prevSpecId.includes(JSON.stringify(cSpecs[i].spec_id))){
          for(let j in this.specsCheck){
            specsCheckArray.push(this.specsCheck[j]);
            console.log(this.specsCheck[j]);
            let a = sf.addControl(j , this.formBuilder.control(this.specsCheck[j]));
          }
        } else{
          let a = sf.addControl(cSpecs[i].spec_id , this.formBuilder.control(''));
        }    
      }
      
      console.log(this.addProduct.value); 
    });
       
  }

  getAllPricingSchemes() {
    this.category.getAllPricingSchemes().subscribe(res => {
      this.pricingSchemes = res;
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

  updateprodStatus(e){
    console.log(e);
  }

  updateProducts() {  
    if(this.finalBlob){
      this.addProduct.patchValue({
        prodImage:this.finalBlob
      });
    }
    console.log(this.addProduct.value);

    this.http.put(`${environment.apiUrl}/products/${this.prodId}`, this.addProduct.value).subscribe((res) => {
      alert('Product modified successfully');
      this.router.navigate(['/products/digital/digital-product-list']);
    });
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
      const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);

      
    }

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      finalBlob=b64Data;
    }
    
    setTimeout(()=>{
      this.finalBlob=finalBlob;
    }, 100);
    
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


  open(addSpec) {
    let allTenureValues;
    this.category.getTenureByPriority().subscribe((res)=>{
      allTenureValues=res;
      // this.editTenureValues = allTenureValues.filter(item =>item.priority==priority);
      // console.log(this.editTenureValues);
    });
    this.modalService.open(addSpec, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  mainCatNameActions(e,mainCatId){
    this.addProduct.patchValue({
      mainCatName:mainCatId
    });
  }

  subCatNameActions(e,subCatId){
    this.addProduct.patchValue({
      subCatId:subCatId
    });
  }

  onEditStockUpdate(event):void {
    if (window.confirm('Are you sure you want to save?')) {
      console.log(event.newData);
      this.http.put('http://localhost:3000/products/productStocksAndTimeline', event.newData).subscribe();
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  public settings = {
    hideSubHeader: true,
    edit: {
      confirmSave: true
    },
    actions: {
      add: false,
      delete:false,
      position: 'right'
    },
    columns: {      
      city_name: {
        title: 'City',
        editable:false,
      },
      quantity:{
        title: 'Quantity',
        editable:true,
      },
      delivery_timeline: {
        title: 'Delivery Timeline',
        editable:true,
      }
    },
  };
  

}
