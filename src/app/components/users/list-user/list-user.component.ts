import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})

export class ListUserComponent implements OnInit {
  public order :Orders[] = [];
  public customers :Customers[] = [];
  public assets: Assets[]=[];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  orderId;
  updateStatus: FormGroup;
  deliveryDateStatus: FormGroup;
  assetAssign:FormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  subTotal=0;
  diffInRent=0;
  diffInDeposit=0;
  ddCharges=0;
  public filteredCustomers=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    this.temp=this.customers;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.mobile.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredCustomers = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0; 
  }

  ngOnInit() {    
    this.getCustomers();
  }

  getCustomers(){
    this.os.getAllCustomers().subscribe((customers)=>{
      customers.reverse();
      this.customers=customers;
      this.filteredCustomers=this.customers;
    });
  }

}

