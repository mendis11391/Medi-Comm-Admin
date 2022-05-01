import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {

  public customersKYC;
  public temp = [];
  public closeResult: string;
  customers;
  dropdownSettings:IDropdownSettings = {};
 
  public filteredCustomers=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private router: Router,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'customer_id',
      textField: 'mobile',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }


  ngOnInit() {    
    this.getCustomersKYC();
    this.getAllCustomers();
  }

  getAllCustomers(){
    this.http.get(`${environment.apiUrl}/users`).subscribe((users)=>{
      this.customers=users
    })
  }

  getCustomersKYC(){
    this.os.getAllCustomersKYC().subscribe((customersKYC:[])=>{
      customersKYC.reverse();
      this.customersKYC=customersKYC;
      this.filteredCustomers=this.customersKYC;
      console.log(this.filteredCustomers)
    });
  }

  open(modal) {    
    this.modalService.open(modal, { windowClass : "my-modal",ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onItemSelect(e){
    console.log(e);
    this.modalService.dismissAll();
    this.router.navigate([`/users/create-edit-kyc/${e.customer_id}`]);
  }

}
