import { Component, OnInit, Directive  } from '@angular/core';
import { digitalSubCategoryDB } from 'src/app/shared/tables/digital-sub-category';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from  '@angular/forms';

@Component({
  selector: 'app-digital-sub-category',
  templateUrl: './digital-sub-category.component.html',
  styleUrls: ['./digital-sub-category.component.scss']
})
export class DigitalSubCategoryComponent implements OnInit {
  public closeResult: string;
  public digital_sub_categories = []
  public categorygroup;
  public categories;
  public specs;
  addcategory: UntypedFormGroup;
  currentCatId;
  AllSpecs;
  catSpecs;

  catId:number=0;
  editMainCatId:number=0;
  editSubCatName:string;
  editCatHeading:string;
  editSubCatSlug:string;
  editSubCatMetaTitle:string;
  editSubCatMetaDescription:string;
  editSubCatSeoContent:string;

  constructor(private formBuilder: UntypedFormBuilder,private modalService: NgbModal,private category: ProductService,private http: HttpClient) {
    // this.digital_sub_categories = digitalSubCategoryDB.digital_sub_category;
    this.addcategory = this.formBuilder.group({
      mainCatName:['', Validators.required],
      subCatName:['', Validators.required],
      catHeading:['', Validators.required],
      specNames:['', Validators.required],
      subCatSlug:['', Validators.required],
      subCatMetaTitle:['', Validators.required],
      subCatMetaDescription:['', Validators.required],
      status:[true]
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllSpecsForCat(id) {
    this.currentCatId=id;
    this.category.getAllSpecs().subscribe((specs) =>{
      this.AllSpecs = specs;
      this.category.getSpecsByCatId(id).subscribe((catSpecs)=>{
        this.catSpecs=catSpecs;
        console.log(this.catSpecs)
        for(let i=0;i<this.AllSpecs.length;i++){
          this.AllSpecs[i].checked=false;
          for(let j=0;j<this.catSpecs.length;j++){
              if(this.catSpecs[j].spec_id==this.AllSpecs[i].spec_id){
                this.AllSpecs[i].checked=true;
              }
          }
        } 
      });
    });
  }

  catSpecsActions(e,SpecId){
    let itemToDelete=this.catSpecs.find(item=> item.spec_id==SpecId);
    let itemToAdd = {cat_id:this.currentCatId, spec_id:SpecId};
    if(e.target.checked){
      this.category.postCategorySpecs(itemToAdd).subscribe();
    }else{
      this.category.deleteCategorySpecsById(itemToDelete.cs_id).subscribe();
    }   
  }

  reload(){
    window.location.reload();
  }

  public settings = {
    actions: {
      position: 'right'
    },
    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      product_name: {
        title: 'Name'
      },
      price: {
        title: 'Price'
      },
      status: {
        title: 'Status',
        type: 'html',
      },
      category: {
        title: 'Sub Category',
      }
    },
  };

  ngOnInit() {
    this.getAllCategoryGroup();
    this.getAllCategories();
    this.getAllSpecs();
  }


  getAllCategoryGroup() {
    this.category.getCategories().subscribe(res => {
      this.categorygroup=res;
    });
  }

  getAllCategories(){
    this.category.getAllCategories().subscribe(res => {
      this.categories=res[0];
    });
  }

  getAllSpecs(){
    this.category.getSpecs().subscribe((res)=>{
      this.specs=res;
    });
  }

  addCategoryandSpecs(){
    if(this.addcategory.valid){
      this.category.addCategory(this.addcategory.value).subscribe((res)=>{
        this.getAllCategoryGroup();
        this.getAllCategories();
        this.getAllSpecs();
        alert('Success');
      });
    }
  }

  editCategory(content, catRes) {
    this.catId = catRes.cat_id;
    this.editMainCatId = catRes.cat_group;
    this.editSubCatName = catRes.cat_name;
    this.editCatHeading = catRes.cat_heading;
    this.editSubCatSlug = catRes.slug;
    this.editSubCatMetaTitle = catRes.metaTitle;
    this.editSubCatMetaDescription = catRes.metaDescription;
    this.editSubCatSeoContent = catRes.cat_schema;
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateCategory(){
    let obj = {
      catId:  this.catId,
      mainCatId: this.editMainCatId,
      subCatName: this.editSubCatName,
      catHeading: this.editCatHeading,
      subCatSlug: this.editSubCatSlug,
      subCatMetaTitle: this.editSubCatMetaTitle,
      subCatMetaDescription: this.editSubCatMetaDescription,
      subCatMetaSeoContent: this.editSubCatSeoContent
    };
    this.category.editCategory(obj).subscribe((res) => {
      if(res) {
        this.getAllCategoryGroup();
        this.getAllCategories();
        this.getAllSpecs();
        this.modalService.dismissAll();
      }
    });
  }

}
