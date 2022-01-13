import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-digital-scrollers',
  templateUrl: './digital-scrollers.component.html',
  styleUrls: ['./digital-scrollers.component.scss']
})
export class DigitalScrollersComponent implements OnInit {

  scrollerName:any;
  getAllScrollerNames;
  public closeResult: string;
  dropdownList = [];
  scrollerValues;
  selectedItems;
  dropdownSettings:IDropdownSettings = {};
  products;
  currentPromotionId;

  constructor(private modalService: NgbModal,private category: ProductService,private http: HttpClient) { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'prod_id',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.getAllScrollers();
    this.getAllProductsByCity(1);
    this.getAllPromoProds();
  }

  getAllProductsByCity(id){
    this.category.getAllProductsByCityId(id).subscribe((res)=>{
      this.products = res;
    })
  }

  getAllPromoProds(){
    this.category.getAllScrollerValues2().subscribe((res)=>{
      this.scrollerValues=res
    })
  }

  addScroller(){
    this.http.post('http://localhost:3000/products/postScroller', {scroller_name:this.scrollerName, scroller_status:1}).subscribe((res) => {
      console.log(res);
      // alert('scroller added successfully');
    });
  }

  getAllScrollers(){
    this.category.getAllScrollers().subscribe((res)=>{
      this.getAllScrollerNames = res
    });
  }

  open(addScroller) {
    this.modalService.open(addScroller, {size: 'lg', ariaLabelledBy: 'modal-basic-title', windowClass: 'my-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  getcurrentPromotionId(id){
    this.currentPromotionId=id;
    this.selectedItems = this.scrollerValues.filter(item => item.promotion_id==id);
  }

  onItemSelect(e){
    console.log(e);
    let promotionProduct = {promotion_id:this.currentPromotionId, product_id:e.id};
    this.http.post('http://localhost:3000/products/postPromotionalProducts', promotionProduct).subscribe((res) => {
        console.log(res);
        // alert('scroller item added successfully');
      });
  }

  onItemDeSelect(e){
    let promotionProduct = {promotion_id:this.currentPromotionId, product_id:e.id};
    let itemToDelete = this.scrollerValues.filter(item => item.promotion_id==this.currentPromotionId && item.id==e.id);

    this.http.delete(`http://localhost:3000/products/deletePromotionProduct/${itemToDelete[0].PPID}`).subscribe((res) => {
        // console.log(res);
      alert('scroller item deleted successfully');
    });
  }

}
