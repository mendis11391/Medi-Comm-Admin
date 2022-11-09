import { Component, OnInit, Directive  } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../../../shared/tables/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-digital-category',
  templateUrl: './digital-category.component.html',
  styleUrls: ['./digital-category.component.scss']
})
export class DigitalCategoryComponent implements OnInit {
  
  public closeResult: string;
  public categories;
  main_cat_name:string;
  main_cat_heading:string;
  main_slug:string;
  main_meta_title:string;
  main_meta_description:string;
  edit_main_cat_name:string;
  edit_main_cat_heading:string;
  edit_main_slug:string;
  edit_main_meta_title:string;
  edit_main_meta_description:string;
  cgId:number;

  constructor(private modalService: NgbModal, private category: ProductService) {
    // this.digital_categories = digitalCategoryDB.digital_category;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  edit(content, id) {
    this.cgId=id;
    let toBeEditedCategory=this.categories.filter(item => item.id==id);
    this.edit_main_cat_name=  toBeEditedCategory[0].main_cat_name;
    this.edit_main_cat_heading= toBeEditedCategory[0].main_cat_heading;
    this.edit_main_slug=  toBeEditedCategory[0].main_slug;
    this.edit_main_meta_title=  toBeEditedCategory[0].main_meta_title;
    this.edit_main_meta_description=  toBeEditedCategory[0].main_meta_description;
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

  public settings = {
    actions: {
      position: 'right'
    },
    columns: {      
      category_name: {
        title: 'Category'
      }
    },
  };

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addCategory() {
    let obj={
      main_cat_name:this.main_cat_name,
      main_cat_heading:this.main_cat_heading,
      main_slug:this.main_slug,
      main_meta_title:this.main_meta_title,
      main_meta_description:this.main_meta_description,
    }

    this.category.addMainCategory(obj).subscribe((res) => {
      if(res) {
        this.getAllCategories();
        let elm: HTMLElement = document.querySelector('#closemodal');
        elm.click();
      }
    });
  }

  editCategory() {
    let obj={
      main_cat_name:this.edit_main_cat_name,
      main_cat_heading:this.edit_main_cat_heading,
      main_slug:this.edit_main_slug,
      main_meta_title:this.edit_main_meta_title,
      main_meta_description:this.edit_main_meta_description,
      id:this.cgId
    }

    this.category.editMainCategory(obj).subscribe((res) => {
      if(res) {
        this.getAllCategories();
        let elm: HTMLElement = document.querySelector('#closemodal');
        elm.click();
      }
    });
  }

}
