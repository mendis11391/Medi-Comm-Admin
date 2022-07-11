import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders,OrderItems, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upcoming-renewals',
  templateUrl: './upcoming-renewals.component.html',
  styleUrls: ['./upcoming-renewals.component.scss']
})
export class UpcomingRenewalsComponent implements OnInit {

  public order :OrderItems[] = [];
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
  public filteredOrders=[];
  filteredOrderItems=[];

  myFromDate:Date;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('d') d;
  constructor(calendar: NgbCalendar,private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  updateFilter(event) {
    this.order = this.filteredOrders
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.customer_id.toLowerCase().indexOf(val) !== -1 || d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.order = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
    this.getOrders();
    this.updateStatus = this.formBuilder.group({
      deliveryStatus: [''],
      refundStatus:['']
    });
    this.deliveryDateStatus = this.formBuilder.group({
      deliveryDate: ['']
    });
    this.assetAssign = this.formBuilder.group({
      assetId: ['']
    });
  }

  getOrders(){
    this.os.getAllOrderItems2().subscribe((orderItems)=>{
      orderItems.reverse();
      this.order=orderItems.filter(item => item.status==true && item.delivery_status==4 );
      for(let o=0;o<this.order.length;o++){
        let otParse = JSON.parse(this.order[o].renewals_timline);
        
        this.os.getRenewalsByCustomerId2(this.order[o].customer_id).subscribe();
        for(let p=0;p<otParse.length;p++){
          if(otParse[p].order_item_id==this.order[o].order_item_id){
            otParse[p].firstName=this.order[o].firstName;
            otParse[p].mobile=this.order[o].mobile;
            otParse[p].customer_id = this.order[o].customer_id;
            otParse[p].order_id=this.order[o].order_id;
          }          
          this.filteredOrders.push(otParse[p]);
          this.filteredOrderItems = this.filteredOrders.filter(item=>item.renewed==0);
        }
      }
      this.loadFilterDataByDate();
    });
  }




  getDates(date){
    let dateParts = date.split("/");
    let ned;
    // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
    let dd= dateObject.getDate();
    let mm=dateObject.getMonth();
    let yy=dateObject.getFullYear();

    let Days=new Date(yy, mm+2, 0).getDate();

    if(Days<dd){             
      ned  = new Date(yy, mm+1, Days);
    }else{					
      ned = new Date(yy, mm+1, dd-1);
      
    }
    return ned;
  }

  dueDate(d){
    let dateParts = d.split("/");

		// month is 0-based, that's why we need dataParts[1] - 1
		let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
		let dd= dateObject.getDate();
		let mm=dateObject.getMonth();
		let yy=dateObject.getFullYear();

    let db = mm+'/'+dd+'/'+yy;

    let dueDate = new Date(yy, mm, dd);
    dueDate.setDate(dueDate.getDate() + 4);
    return dueDate.toLocaleDateString('pt-PT');
  }

  totalTaxAmount(rentPrice) {
    const gst=18;
    return (parseInt(rentPrice) * (gst)/100);
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.order, 'Orders');
  }

  //dates
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  filterDataByDate(){ 
    console.log(this.fromDate);
    this.filteredOrderItems = this.filteredOrders.filter(item=>item.renewed==0);
    let myFromDate = new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day);
    this.os.tillDate=myFromDate;
    let myEndDate = new Date(this.toDate.year, this.toDate.month-1, this.toDate.day);
    this.filteredOrderItems = this.filteredOrderItems.filter(
    m => this.parseDate(m.startDate) <= new Date(myFromDate)
    );

    // this.filteredOrderItems = this.filteredOrderItems.filter(
    //   m => this.parseDate(m.expiryDate) >= new Date(myFromDate) && this.parseDate(m.expiryDate) <= new Date(myEndDate)
    //   );
    // for(var index in this.filteredOrderItems) {
    //   var obj = this.filteredOrderItems[index];
    //   var date = this.parseDate(obj.expiryDate);
    //   // let dateParts = obj.expiryDate.split("/");

    //   // month is 0-based, that's why we need dataParts[1] - 1
    //   // let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);
    //   // console.log(dateObject);
    //   // var mydate = dateObject;
    //   console.log(date);
     
    //   // if(date > new Date(2021, 09, 1) && date < new Date(2021,10, 12)){
    //   //   this.filteredOrderItems.push(obj);
    //   // }          
    // }
  }

  loadFilterDataByDate(){ 
    this.filteredOrderItems = this.filteredOrders.filter(item=>item.renewed==0);
    let myFromDate = new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day);
    
    if(this.os.tillDate){
      myFromDate = this.os.tillDate;
      this.fromDate.year = this.os.tillDate.getFullYear();
      this.fromDate.month = this.os.tillDate.getMonth()+1;
      this.fromDate.day = this.os.tillDate.getDate();
      this.d.navigateTo(this.fromDate);
      console.log(this.fromDate);
    }else{
      this.os.tillDate=myFromDate;
    }
    let myEndDate = new Date(this.toDate.year, this.toDate.month-1, this.toDate.day);
    this.filteredOrderItems = this.filteredOrderItems.filter(
    m => this.parseDate(m.startDate) <= new Date(myFromDate)
    );

  }

  parseDate(dateStr) {
    var date = dateStr.split('/');
    var day = date[0];
    var month = date[1] - 1; //January = 0
    var year = date[2];
    console.log(new Date(year, month, day));
    return new Date(year, month, day); 
  }

  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  
}
