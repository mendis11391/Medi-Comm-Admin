import { Component, OnInit, Directive  } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pricing-schemes',
  templateUrl: './pricing-schemes.component.html',
  styleUrls: ['./pricing-schemes.component.scss']
})
export class PricingSchemesComponent implements OnInit {


  public categories;
  mainCat='';
  subCat=[];
  subCatValue;
  specImage;
  specName='';
  getAllPricingSchemes;
  getSpecName;
  specValue;
  editTenureValues;
  specValueStatus:boolean=false;
  tenureEdit={
    priority:'',
    specName:'',
    specValue:''
  }
  AllTenures;
  tenureByPriority;
  b_url = `${environment.apiUrl}/products`;
  public closeResult: string;
  schemeName:any;
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
    this.category.getAllPricingSchemes().subscribe((res)=>{
      this.getAllPricingSchemes = res
    });
  }

  getAllTenures(id) {
    this.category.getAllTenures().subscribe(allTenures => {
      this.category.getTenureByPriorityId(id).subscribe((tenureByPriority)=>{
        this.AllTenures = allTenures;
        this.tenureByPriority=tenureByPriority[0];
        for(let i=0;i<this.AllTenures.length;i++){
          console.log(this.AllTenures[i].tenure_id);
          this.AllTenures[i].checked=false;
          for(let j=0;j<this.tenureByPriority.length;j++){
            console.log(this.tenureByPriority[j].tenure_id);
              if(this.tenureByPriority[j].tenure_id==this.AllTenures[i].tenure_id){
                this.AllTenures[i].checked=true;
              }
          }
        }        
      });
    });
  }

  tenurePriorityActions(e,tenureId){
    let itemToDelete=this.tenureByPriority.find(item=> item.tenure_id==tenureId);
    let itemToAdd = {priority:this.tenureEdit.priority, tenure_id:tenureId};
    if(e.target.checked){
      this.category.postTenureDiscounts(itemToAdd).subscribe();
    }else{
      this.category.deleteTenureDiscountsById(itemToDelete.id).subscribe();
    }   
    
  }

  reload(){
    window.location.reload();
  }

  getSpecValueByID(id){
    return this.http.get(this.b_url+'/getSpecsValuesById/'+id);
  }

  open(addSpec,priority, specName) {
    let allTenureValues;
    this.tenureEdit.priority=priority;
    this.tenureEdit.specName=specName;
    this.getAllTenures(priority);
    this.category.getTenureByPriority().subscribe((res)=>{
      allTenureValues=res;
      this.editTenureValues = allTenureValues.filter(item =>item.priority==priority);
    });
    this.modalService.open(addSpec, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onEditTenureDiscount(event):void {
    if (window.confirm('Are you sure you want to save?')) {
      console.log(event.newData);
      this.http.put(`${environment.apiUrl}/products/updateTenureDiscounts`, event.newData).subscribe();
      this.getAllSpecs(); 
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
      position: 'right'
    },
    columns: {      
      tenure: {
        title: 'Tenure',
        editable:false,
      },
      tenure_period:{
        title: 'Tenure period',
        editable:false,
      },
      discount: {
        title: 'Discount %',
        editable:true,
      },
      default_tenure: {
        title: 'Default tenure',
        editable:true,
      }
    },
  };

  addPricing(){
    this.http.post(`${environment.apiUrl}/products/postPricingScheme`, {scheme_name:this.schemeName}).subscribe((res) => {
      console.log(res);
      alert('scroller added successfully');
    });
  }
}
