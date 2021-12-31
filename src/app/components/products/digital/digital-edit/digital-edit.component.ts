import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
import { ProductService } from '../../services/product.service';
import { fileURLToPath } from 'url';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
const URL = ' http://localhost:3000/products/upload/';

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
  
  public closeResult: string;
  pricingSchemes;

 // variables for edit
 mainCatId=0;
 subCatId=0;
 specsCheck;
 accsID;
 finalBlob;
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
      slug:['', Validators.required],
      prodImage:[''],
      prodDescription:['', Validators.required],
      // prodQty:['', Validators.required],
      securityDeposit:['', Validators.required],
      tenureBasePrice:['', Validators.required],
      specs:new FormGroup({}),
      highlightType:['', Validators.required],
      prodStatus:[true],
      priority:['', Validators.required]
    });
  }

  ngOnInit() {
    this.prodId = this.route.snapshot.params['id'];
    this.getProducts(this.route.snapshot.params['id']);
    this.getAllCategories();
    this.getAllaccessories();
    this.getAllPricingSchemes();
    this.getAllBrands();
    this.getAllCities();
    this.getAllspecValuesBySpecId(1);
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
        slug:data.slug,
        prodImage:data.prod_image,
        prodDescription:data.prod_description,
        // prodQty:data.prod_qty,
        securityDeposit:data.securityDeposit,
        tenureBasePrice:data.tenure_base_price,
        specs:new FormGroup({}),
        // highlightType:['', Validators.required],
        prodStatus:data.prod_status,
        priority:data.priority
      });

      this.getAllAccessories(id);
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

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
      this.getSubCategory();
      this.getSpecsByCatId();
    });
  }

  getAllAccessories(id) {
    let accsIdArr=[];
    this.productsService.getAllAccsByProductId(id).subscribe((acc)=>{      
      for(let k=0;k<acc[0].length;k++){
        accsIdArr.push(acc[0][k].accessory_id)
      }
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

  accsActions(e,id){
    let accs=[];
    accs=this.accsID;
    if(e.target.checked){
      accs.push(id);
      this.accsID=accs;
      this.addProduct.patchValue({
        accessory:this.accsID
      });
    }else{
      const index = accs.indexOf(id);
      if (index > -1) {
        accs.splice(index, 1);
      }
      this.accsID=accs;
      this.addProduct.patchValue({
        accessory:this.accsID
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

  getSpecsByCatId(){
    let id = this.addProduct.value.subCatId;
    let specsCheckArray=[];
    this.category.getSpecsByCatId(this.subCatId).subscribe((resp)=>{
      var cSpecs:any = resp;
      let sf:FormGroup = this.addProduct.get('specs') as FormGroup;
      this.catSpecs=resp;
      for(let j in this.specsCheck){
        specsCheckArray.push(this.specsCheck[j])
      }
      for(let i=0; i<cSpecs.length;i++){
        
          let a = sf.addControl(cSpecs[i].spec_id , this.formBuilder.control(specsCheckArray[i]));
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

  updateProducts() {  
    if(this.finalBlob){
      this.addProduct.patchValue({
        prodImage:this.finalBlob
      });
    }
    console.log(this.addProduct.value);

    this.http.put(` http://localhost:3000/products/${this.prodId}`, this.addProduct.value).subscribe((res) => {
      alert('Product modified successfully');
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
}
