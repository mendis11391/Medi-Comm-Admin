import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent implements OnInit {
  public order :Orders[] = [];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  orderId;
  updateStatus: FormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  public filteredOrders=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.os.getAllOrders().subscribe((orders)=>{
      orders.reverse();
      this.order=orders.filter(item => item.status=='SUCCESS');
      this.filteredOrders=this.order;
    });
  }

  filterOrders(e){
    if(e=='All orders'){
      this.filteredOrders=this.order.filter(item => item.status=='SUCCESS');
    } else if(e=='Active orders'){
      this.filteredOrders=this.order.filter(item => item.delivery_status!='Returned');
    } else if(e=='Refunded orders'){
      this.filteredOrders=this.order.filter(item => item.refund_status=='Deposit refunded');
    } else if(e=='Renewed orders'){
      this.filteredOrders=this.order.filter(item => item.delivery_status=='Renewed');
    }
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filteredOrders, 'Deposits');
  }


}
