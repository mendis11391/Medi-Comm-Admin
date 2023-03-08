import { Component, OnInit, ViewChild, Directive, AfterContentInit  } from '@angular/core';
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

export class ListUserComponent implements OnInit, AfterContentInit {
  public order :Orders[] = [];
  public customers :Customers[] = [];
  public assets: Assets[]=[];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('dt1', { static: true }) dt1: any;
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
  first;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
    // this.dt1.filter('22', 'woid', 'contains');
    // this.getFilters();
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
    // this.getFilters();
  }

  ngAfterContentInit(){
    this.getFilters();
  }

  getFilters(){
    const filters:any = JSON.parse(sessionStorage.getItem("listUserFilters"));
    console.log(filters);
    if(filters.registeredAt[0].value){
      filters.registeredAt[0].value = new Date(filters.registeredAt[0].value);
    }
    if(filters.lastLogin[0].value){
      filters.lastLogin[0].value = new Date(filters.lastLogin[0].value);
    }
    const sort:any = JSON.parse(sessionStorage.getItem("listUserSort"));
    const page:any = JSON.parse(sessionStorage.getItem("listUserPage"));
    if (filters) {
      this.dt1.filters = filters;
    }
    if(sort){
      this.dt1.field = sort.field;
      this.dt1.order = sort.order;
    }
    if(page){
      this.first=page.first+1;
      this.dt1.first = page.first+1;
      this.dt1.rows = page.rows+1;
      // this.dt1.first = Math.floor(this.dt1.totalRecords / this.table.rows) * this.table.rows;
      // this.dt1.firstChange.emit(this.dt1.first);
      // this.dt1.onLazyLoad.emit(this.dt1.createLazyLoadMetadata());
    }
  }

  onFilter(e:any) {
    console.log(this.dt1.filters);
    sessionStorage.setItem("listUserFilters", JSON.stringify(e.filters));
    // sessionStorage.setItem("listUserFilterValues", JSON.stringify(this.dt1.filteredValue));
  }
  onPagination(e:any){
    console.log(e);
    sessionStorage.setItem("listUserPage", JSON.stringify(e));
  }
  onSort(e:any){
    console.log(e);
    sessionStorage.setItem("listUserSort", JSON.stringify(e));
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
        { field: "customer_id", header: "customer_id" },
        { field: "firstName", header: "firstName" },
        { field: "lastName", header: "lastName" },
        { field: "mobile", header: "mobile" },
        { field: "email", header: "email" },
        { field: "registeredAt", header: "registeredAt" },
        { field: "lastLogin", header: "lastLogin" }
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

