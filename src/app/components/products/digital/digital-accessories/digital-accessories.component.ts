import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
  b_url = ` http://localhost:3000/products`;
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
    this.http.post(' http://localhost:3000/products/postAccs', {accsName:this.accsName, accsIMage:this.accsImage,accsStatus:1}).subscribe((res) => {
      console.log(res);
    });
  }

  // addSpecValue(){
  //   this.http.post(' http://localhost:3000/category/addSpecValue', {specId:this.getSpecName,specValue:this.specValue}).subscribe((res) => {
  //     console.log(res);     
  //     this.specValueStatus=true;
  //     setTimeout(() => { this.specValueStatus = false; }, 2000);
  //   });
  // }

  addSpecValue(){
    this.http.post(' http://localhost:3000/category/addSpecValue', {specId:this.specEdit.AccsId,specValue:this.specEdit.specValue}).subscribe((res) => {
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
      this.http.put(' http://localhost:3000/category/updateAccsValue', event.newData).subscribe();
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

}
