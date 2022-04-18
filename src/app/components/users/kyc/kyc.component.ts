import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {

  public customersKYC;
  public temp = [];
 
  public filteredCustomers=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
  }


  ngOnInit() {    
    // this.getCustomersKYC();
  }

  getCustomersKYC(){
    this.os.getAllCustomersKYC().subscribe((customersKYC:[])=>{
      customersKYC.reverse();
      this.customersKYC=customersKYC;
      this.filteredCustomers=this.customersKYC;
    });
  }


}
