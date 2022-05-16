import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {

  public order :Orders[] = [];
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
  orderName:string;
  public filteredOrders=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.getOrders();
    this.getAssets();
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

  updateFilter(event) {
    this.temp=this.order;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.primary_id.toLowerCase().indexOf(val) !== -1 || d.delivery_status.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredOrders = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
    // this.getOrders();
    // this.getAssets();
    // this.updateStatus = this.formBuilder.group({
    //   deliveryStatus: [''],
    //   refundStatus:['']
    // });
    // this.deliveryDateStatus = this.formBuilder.group({
    //   deliveryDate: ['']
    // });
    // this.assetAssign = this.formBuilder.group({
    //   assetId: ['']
    // });
  }

  getOrders(){
    this.os.getAllOrders2().subscribe((orders)=>{
      // orders.reverse();
      // this.order=orders.filter(item => item.paymentStatus=='Success');
      this.order=orders;
      this.filteredOrders=this.order;
      this.orderName='All orders';
    });
  }

  filterOrders(e){    
    if(e=='All orders'){
      this.filteredOrders=this.order;
    } else if(e=='New orders'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==1 && item.deliveryStatus!='4' && item.paymentStatus=='Success');
    } else if(e=='Primary order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==1 && item.paymentStatus=='Success');
    } else if(e=='Renewal order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==2 && item.paymentStatus=='Success');
    } else if(e=='Replacement order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==3);
    } else if(e=='Return order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==4);
    }
    this.orderName=e;
  }

  getAssets(){
    this.os.getAllassets().subscribe((assets)=>{
      this.assets=assets.filter(item => item.availability==true);
    });
    console.log(this.assets);
  }

  open(ordId) {
    this.modalReference=this.modalService.open(this.content);
    this.orderId=ordId;
    this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }

  updateDeliveryStatus(id){
    this.http.put(`${environment.apiUrl}/orders/update/${id}`, this.updateStatus.value).subscribe((res) => {
      console.log(res);
      this.modalReference.close();
    });
  }

  


  getOrderById(ordId){
    this.subTotal=0;
    let orderedProducts;
    this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData;
      orderedProducts=JSON.parse(res[0].orderedProducts);
      for(let i=0;i<orderedProducts.length;i++){
        if(!orderedProducts[i].returnedProduct){
          this.subTotal+=parseInt(orderedProducts[i].price)+parseInt(orderedProducts[i].dp);
        } else{
          this.diffInRent= orderedProducts[i].p2Rent-orderedProducts[i].returnedProduct.p1Rent;
          this.diffInDeposit = orderedProducts[i].prod_price-orderedProducts[i].returnedProduct.prod_price;
          this.ddCharges = orderedProducts[i].damageCharges;
          this.subTotal+=parseInt(orderedProducts[i].price)+parseInt(orderedProducts[i].dp);
        }
        
      }
    });    
  }
  
  assignAssetId(OrderId, prodId, indexId){
    let getOrder;
    let getAllProduct;
    let forQtyProduct;
    let assetId=this.assetAssign.value.assetId;
    getOrder=this.order.filter(res=>res.txnid===OrderId);
    getAllProduct=JSON.parse(getOrder[0].orderedProducts);
    forQtyProduct=JSON.parse(getOrder[0].checkoutItemData);
    Array.prototype.forEach.call(getAllProduct, res => {
      if(res.id===prodId){
        res.assetId.push(assetId);
      }
    });
    Array.prototype.forEach.call(forQtyProduct, res => {
      if(res.id===prodId){
        if(res.indexs===indexId){
          res.assetId=assetId;
        }
      }
    });
    console.log(forQtyProduct);
    console.log(getAllProduct);
    this.http.put(`${environment.apiUrl}/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
      console.log(res);
      this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0}).subscribe();
      this.modalReference.close();
      // this.assetAssign.reset();
      window.location.reload();
    });
  }

  updateDeliveryDate(OrderId, prodId, indexId){
    let getOrder;
    let getAllProduct;
    let forQtyProduct;
    let getdeliveryDate=new Date(this.deliveryDateStatus.value.deliveryDate);
    let db= getdeliveryDate.getDate()+'/'+(getdeliveryDate.getMonth()+1)+'/'+getdeliveryDate.getFullYear();
    getOrder=this.order.filter(res=>res.txnid===OrderId);
    getAllProduct=JSON.parse(getOrder[0].orderedProducts);
    forQtyProduct=JSON.parse(getOrder[0].checkoutItemData);
    let expiryDate=this.getDates(db);
    let edb=expiryDate.getDate()+'/'+(expiryDate.getMonth()+1)+'/'+expiryDate.getFullYear();
    let ndb=this.getDates(db);
    ndb.setDate(ndb.getDate() + 1);
    let nextStartDate = ndb.getDate()+'/'+(ndb.getMonth()+1)+'/'+ndb.getFullYear();
    // getProduct=getAllProduct.filter(res=>res.id===prodId);
    Array.prototype.forEach.call(getAllProduct, res => {
      if(res.id===prodId){
        res.deliveryAssigned=1;
        res.startDate=db;
        res.expiryDate=edb;
        res.nextStartDate=nextStartDate;
      }
    });
    Array.prototype.forEach.call(forQtyProduct, res => {
      if(res.id===prodId){
        if(res.indexs===indexId){
          res.deliveryAssigned=1;
          res.startDate=db;
          res.expiryDate=edb;
          res.nextStartDate=nextStartDate;
        }
      }
    });
    console.log(forQtyProduct);
    this.http.put(`${environment.apiUrl}/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
      console.log(res);
      this.modalReference.close();
    });
  }

  getDates(date){
    let dateParts = date.split("/");
    let ned
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
}
