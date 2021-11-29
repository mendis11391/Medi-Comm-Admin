import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-renewal-order',
  templateUrl: './renewal-order.component.html',
  styleUrls: ['./renewal-order.component.scss']
})
export class RenewalOrderComponent implements OnInit {

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
  public filteredOrders=[];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.order = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
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

  getOrders(){
    this.os.getAllOrders().subscribe((orders)=>{
      orders.reverse();
      this.order=orders.filter(item =>  item.orderType_id==2);
      this.filteredOrders=this.order;
    });
  }

  filterOrders(e){
    if(e=='All orders'){
      this.filteredOrders=this.order.filter(item => item.paymentStatus=='Success');
    } else if(e=='Primary order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==1);
    } else if(e=='Renewal order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==2);
    } else if(e=='Replacement order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==3);
    } else if(e=='Return order'){
      this.filteredOrders=this.order.filter(item => item.orderType_id==4);
    }
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
    this.http.get(`http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }

  updateDeliveryStatus(id){
    this.http.put(`http://localhost:3000/orders/update/${id}`, this.updateStatus.value).subscribe((res) => {
      console.log(res);
      this.modalReference.close();
    });
  }

  


  getOrderById(ordId){
    this.subTotal=0;
    let orderedProducts;
    this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    this.http.get(`http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
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
    this.http.put(`http://localhost:3000/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
      console.log(res);
      this.http.put(`http://localhost:3000/assets/update/${assetId}`, {availability:0}).subscribe();
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
    this.http.put(`http://localhost:3000/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
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
