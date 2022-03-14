import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-digital-accessories',
  templateUrl: './digital-accessories.component.html',
  styleUrls: ['./digital-accessories.component.scss']
})
export class DigitalAccessoriesComponent implements OnInit {

  public categories;
  mainCat='';
  subCat=[];
  subCatValue;
  accsImage;
  accsName='';
  getAllAccsName;
  getSpecName;
  specValue;
  editAccsValues;
  specValueStatus:boolean=false;
  specEdit={
    specId:'',
    specName:'',
    AccsId:'',
    AccsName:'',
    specValue:''
  }
  editAccsImage;
  addAccsImage;
  b_url = `${environment.apiUrl}/products`;
  public closeResult: string;
  constructor(private modalService: NgbModal,private category: ProductService,private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllAccs();    
    // this.getSubCategory(this.mainCat);
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getSubCategory(){
    this.subCat = this.categories.filter(item=>item.main_cat_name===this.mainCat);
    console.log(this.subCat[0].subItems);
  }

  getAllAccs(){
    this.category.getAllAccs().subscribe((res)=>{
      this.getAllAccsName = res
    });
  }

  addAccs(){
    this.http.post(`${environment.apiUrl}/products/postAccs`, {accsName:this.accsName, accsIMage:this.addAccsImage,accsStatus:1}).subscribe((res) => {
      alert("accessory added successfully");
      this.getAllAccs();
    });
  }

  // addSpecValue(){
  //   this.http.post(`${environment.apiUrl}/category/addSpecValue`, {specId:this.getSpecName,specValue:this.specValue}).subscribe((res) => {
  //     console.log(res);     
  //     this.specValueStatus=true;
  //     setTimeout(() => { this.specValueStatus = false; }, 2000);
  //   });
  // }

  addSpecValue(){
    this.http.post(`${environment.apiUrl}/category/addSpecValue`, {specId:this.specEdit.AccsId,specValue:this.specEdit.specValue}).subscribe((res) => {
      console.log(res);     
      this.specValueStatus=true;
      this.getAllAccs();
      this.modalService.dismissAll();
      setTimeout(() => { this.specValueStatus = false; }, 2000);
    });
  }

  getSpecValueByID(id){
    return this.http.get(this.b_url+'/getSpecsValuesById/'+id);
  }

  open(addSpec,AccsId, specName) {
    let allAccsValues;
    this.specEdit.AccsId=AccsId;
    this.specEdit.AccsName=specName;
    this.category.getAllAccs().subscribe((res)=>{
      allAccsValues=res;
      this.editAccsValues = allAccsValues.filter(item =>item.spec_id==AccsId);
    });
    this.modalService.open(addSpec, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onEditAccsValue(event):void {
    if (window.confirm('Are you sure you want to save?')) {
      console.log(event.newData);
      this.http.put(`${environment.apiUrl}/category/updateAccsValue`, event.newData).subscribe();
      this.getAllAccs(); 
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  public settings = {
    edit: {
      confirmSave: true
    },
    actions: {
      position: 'right'
    },
    columns: {      
      acceesory_name: {
        title: 'Accessory name'
      }
    },
  };

  addAccsImageUpdate(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files);
    var fReader = new FileReader();
    var imageData;
    var finalBlob;
    fReader.readAsDataURL(files[0]);
    fReader.onloadend = function(event){
      console.log(event.target.result);
      imageData = JSON.stringify(event.target.result);
      const contentType = 'image/png';
      const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);      
    }

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      finalBlob=b64Data;
    }
    
    setTimeout(()=>{
      this.addAccsImage=finalBlob;
    }, 100);
    
  }


  accsImageUpdate(event: Event,id) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files);
    var fReader = new FileReader();
    var imageData;
    var finalBlob;
    fReader.readAsDataURL(files[0]);
    fReader.onloadend = function(event){
      console.log(event.target.result);
      imageData = JSON.stringify(event.target.result);
      const contentType = 'image/png';
      const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);      
    }

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      finalBlob=b64Data;
    }
    
    setTimeout(()=>{
      this.editAccsImage=finalBlob;
      this.updateAccsImage(id)
    }, 100);
    
  }

  updateAccsImage(id){
    this.http.put(`${environment.apiUrl}/category/updateAccsImage`, {id:id, accs_image:this.editAccsImage}).subscribe();
    this.getAllAccs();
  }

}
