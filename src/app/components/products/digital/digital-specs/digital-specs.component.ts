import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-digital-specs',
  templateUrl: './digital-specs.component.html',
  styleUrls: ['./digital-specs.component.scss']
})
export class DigitalSpecsComponent implements OnInit {

  public categories;
  mainCat='';
  subCat=[];
  subCatValue;
  specImage;
  specName='';
  getAllSpecName;
  getSpecName;
  specValue;
  editspecValues;
  specValueStatus:boolean=false;
  specEdit={
    specId:'',
    specName:'',
    specValue:''
  }
  b_url = ` http://localhost:3000/products`;
  public closeResult: string;
  constructor(private modalService: NgbModal,private category: ProductService,private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSpecs();    
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

  getAllSpecs(){
    this.category.getAllSpecs().subscribe((res)=>{
      this.getAllSpecName = res
    });
  }

  addSpecs(){
    this.http.post(' http://localhost:3000/products/postSpecs', {spec_name:this.specName, specIMage:this.specImage,spec_status:1}).subscribe((res) => {
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
    this.http.post(' http://localhost:3000/category/addSpecValue', {specId:this.specEdit.specId,specValue:this.specEdit.specValue}).subscribe((res) => {
      console.log(res);     
      this.specValueStatus=true;
      this.getAllSpecs();
      this.modalService.dismissAll();
      setTimeout(() => { this.specValueStatus = false; }, 2000);
    });
  }

  getSpecValueByID(id){
    return this.http.get(this.b_url+'/getSpecsValuesById/'+id);
  }

  open(addSpec,specId, specName) {
    let allSpecValues;
    this.specEdit.specId=specId;
    this.specEdit.specName=specName;
    this.category.getAllSpecValues().subscribe((res)=>{
      allSpecValues=res;
      this.editspecValues = allSpecValues.filter(item =>item.spec_id==specId);
    });
    this.modalService.open(addSpec, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onEditSpecValue(event):void {
    if (window.confirm('Are you sure you want to save?')) {
      console.log(event.newData);
      this.http.put(' http://localhost:3000/category/updateSpecValue', event.newData).subscribe();
      this.getAllSpecs(); 
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
      spec_value: {
        title: 'Specification value'
      }
    },
  };
}
