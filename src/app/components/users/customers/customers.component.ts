import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  public customers :Customers[] = [];
  public temp = [];
  public filteredCustomers=[];
  customerId;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private route: ActivatedRoute,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    this.temp=this.customers;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.customer_id.toLowerCase().indexOf(val) !== -1 || d.delivery_status.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredCustomers = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
    this.customerId=this.route.snapshot.params['id'];
    this.getCustomers(this.customerId);
  }

  getCustomers(id){
    this.os.getAllCustomersByid(id).subscribe((customers)=>{
      this.customers=customers;
      this.filteredCustomers=this.customers;
    });
  }

  
}
