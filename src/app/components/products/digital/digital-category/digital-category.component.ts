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

  addCategory(cname) {
    this.category.addCategory(cname).subscribe((res) => {
      if(res) {
        this.getAllCategories();
        let elm: HTMLElement = document.querySelector('#closemodal');
        elm.click();
      }
    });
  }

}
