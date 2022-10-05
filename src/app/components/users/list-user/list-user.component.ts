import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { ExcelService } from '../../sales/services/excel.service';

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
  updateStatus: UntypedFormGroup;
  deliveryDateStatus: UntypedFormGroup;
  assetAssign:UntypedFormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  subTotal=0;
  diffInRent=0;
  diffInDeposit=0;
  ddCharges=0;
  public filteredCustomers:Customers[]=[];
  datasource:Customers[];
  loading: boolean;
  totalRecords: number;
  selectedOrders:Customers[];
  cols: any[];
  exportColumns: any[];

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    this.temp=this.filteredCustomers;
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
      // this.customers=customers;
      this.filteredCustomers=customers;

      this.filteredCustomers.forEach(
        item => (item.registeredAt = new Date(item.registeredAt), item.lastLogin = new Date(item.lastLogin))
      );
      this.cols = [
        { field: "order_id", header: "Order Id" },
        { field: "createdAt", header: "Order date" },
        { field: "firstName", header: "First name" },
        { field: "mobile", header: "mobile" },
        { field: "totalSecurityDeposit", header: "Security deposit" },
        { field: "grandTotal", header: "Transaction value" },
        { field: "paymentStatus", header: "Payment status" },
        { field: "delivery_status", header: "Delivery status" }
      ];

      
      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));

      this.datasource = this.filteredCustomers;
      this.totalRecords = this.filteredCustomers.length;
    });
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filteredCustomers, 'Primary orders');
  }

}

