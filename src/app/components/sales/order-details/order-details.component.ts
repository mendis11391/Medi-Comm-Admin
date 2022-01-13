import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  orderId;
  oid;
  updateStatus: FormGroup;
  deliveryDateStatus: FormGroup;
  assetAssign:FormGroup;
  deliveryStatus:FormGroup;
  updateField:FormGroup;
  modalReference;
  fullOrderDetails=[];
  productDetails;
  currDate=new Date();
  customer_id;
  customerDetails;
  assetId;
  formError:boolean;
  urlParam;
  paymentStatus;
  orderField = '';
  paymentStatusActive:boolean = false;
  editStatus:boolean=false;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private changeDetection: ChangeDetectorRef,private route: ActivatedRoute,private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
    this.oid = this.route.snapshot.url[1].path;
    this.getOrderById(this.route.snapshot.url[1].path);
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
    // this.orderId=this.route.snapshot.url[1].path;
    this.updateStatus = this.formBuilder.group({
      deliveryStatus: [''],
      refundStatus:['']
    });
    this.updateField = this.formBuilder.group({
      orderField: [''],
      orderValue:['']
    });
    this.deliveryDateStatus = this.formBuilder.group({
      deliveryDate: ['']
    });
    this.assetAssign = this.formBuilder.group({
      assetId: ['']
    });
    this.deliveryStatus = this.formBuilder.group({      
      deliveryStatus:['']
    });
    // this.getOrderById(this.route.snapshot.url[1].path);
    this.http.get(` http://localhost:3000/orders/getAllPaymentStatus`).subscribe((res) => {
      this.paymentStatus=res;
    });
  }

  getOrders(){
    this.os.getAllOrders().subscribe((orders)=>{
      orders.reverse();
      this.order=orders.filter(item => item.paymentStatus.toLowerCase()=='success' && item.orderType_id===1);
    });
  }

  getAssets(){
    this.os.getAllassets().subscribe((assets)=>{
      this.assets=assets.filter(item => item.availability==true);
    });
  }

  open(ordId) {
    this.modalReference=this.modalService.open(this.content);
    this.orderId=ordId;
    this.http.get(` http://localhost:3000/orders/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }

  updateDeliveryStatus(id){
    this.http.put(` http://localhost:3000/orders/update/${id}`, this.updateStatus.value).subscribe((res) => {
      
    });
  }


  getOrderById(ordId){
    this.fullOrderDetails=[];
    this.http.get(` http://localhost:3000/orders/orderId/${ordId}`).subscribe((res) => {
      this.fullOrderDetails.push(res[0]);
      this.customer_id = res[0].customer_id
      this.productDetails=res[0].orderItem;
      this.http.get(` http://localhost:3000/users/getCustomerById/${this.customer_id}`).subscribe((customerDetails)=>{
        this.customerDetails = customerDetails;
      });
    });
  }

  addOrderField(field){
    this.updateField.addControl(field,new FormControl(''));
  }

  updateOrderField(ordId, field, value){
    this.http.put(` http://localhost:3000/orders/updateAnyOrderField/${ordId}`, {orderField: field, orderValue: value}).subscribe();
    this.paymentStatusActive=!this.paymentStatusActive;
    this.getOrderById(this.oid);
    // this.changeDetection.detectChanges();
    // console.log(this.orderField)
  }

  trackByIndex = (index, item) => index;
  
  // assignAssetId(OrderId, prodId, indexId){
  //   let getOrder;
  //   let getAllProduct;
  //   let forQtyProduct;
  //   let assetId=this.assetAssign.value.assetId;
  //   getOrder=this.order.filter(res=>res.txnid===OrderId);
  //   getAllProduct=JSON.parse(getOrder[0].orderedProducts);
  //   forQtyProduct=JSON.parse(getOrder[0].checkoutItemData);
  //   Array.prototype.forEach.call(getAllProduct, res => {
  //     if(res.id===prodId){
  //       res.assetId.push(assetId);
  //     }
  //   });
  //   Array.prototype.forEach.call(forQtyProduct, res => {
  //     if(res.id===prodId){
  //       if(res.indexs===indexId){
  //         res.assetId=assetId;
  //       }
  //     }
  //   });
  //   console.log(forQtyProduct);
  //   console.log(getAllProduct);
  //   this.http.put(` http://localhost:3000/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
  //     console.log(res);
  //     this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0}).subscribe();
  //     this.modalReference.close();
  //     // this.assetAssign.reset();
  //     window.location.reload();
  //   });
  // }
  updateAssetId(OrderId){
    let getOrder;
    let getAllProduct;
    let forQtyProduct;
    let currentAssetId;
    let assetId=this.assetAssign.value.assetId;
    let startDate;
    let expiryDate;
    let nextStartDate;
    let orderItem;
    this.http.get(` http://localhost:3000/orders/orderItemsByorderId/${OrderId}`).subscribe((res) => {
      orderItem=res;
      getAllProduct=orderItem[0].renewals_timline;
      currentAssetId=getAllProduct[0].assetId ;
      if(orderItem[0].asset_id=='To be assigned'){
        getAllProduct[0].assetId = assetId;
        this.http.put(` http://localhost:3000/orders/updateOrderItemAsset/${OrderId}`, {assetId:assetId,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {});
          
        this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
        this.assetAssign.reset();
        this.getAssets();
        this.getOrderById(this.oid);
        // this.modalReference.close();
        // window.location.reload();
      } else{
        getAllProduct[0].assetId = assetId;
        this.http.put(` http://localhost:3000/orders/updateOrderItemAsset/${OrderId}`, {assetId:assetId,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {});
          
        this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
        this.http.put(` http://localhost:3000/assets/update/${currentAssetId}`, {availability:1, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
        this.assetAssign.reset();
        this.getAssets();
        this.getOrderById(this.oid);
        // this.modalReference.close();
        // window.location.reload();

      }
    });
    
    // forQtyProduct=getOrder[0].checkoutItemData;

    // let od = new Promise((resolve, reject) => {
    //   Array.prototype.forEach.call(getAllProduct, res => {
    //     if(res.id===prodId){
    //       res.assetId=[];
    //       resolve('OD success');
    //     }
    //   });
    // });

    // let cid = new Promise((resolve, reject) => {
    //   Array.prototype.forEach.call(forQtyProduct, res => {
    //     if(res.id===prodId){
    //       if(res.indexs===indexId){
    //         if(res.assetId){
    //           currentAssetId=res.assetId;
    //         }
    //         if(assetId!==''){              
    //           res.assetId=assetId;
    //         }
    //       }
    //       startDate = res.startDate;
    //       expiryDate = res.expiryDate;
    //       nextStartDate = res.nextStartDate;
    //       resolve('cid success');
    //     }
    //   });
    // });

    // Promise.all([od,cid]).then((success)=>{
    //   console.log(success);
    //   this.http.put(` http://localhost:3000/orders/updateOD/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct)}).subscribe((res) => {});
    //     this.http.put(` http://localhost:3000/orders/updateCID/${OrderId}`, {checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
    //     console.log(res);
        
    //     this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
    //     this.http.put(` http://localhost:3000/assets/update/${currentAssetId}`, {availability:1, startDate:'', expiryDate:'', nextStartDate:''}).subscribe();
    //     this.assetAssign.reset();
    //     this.getAssets();
    //     this.modalReference.close();
    //     // window.location.reload();
    //   });
    // });    
    
  }

  updateDeliveryDate(OrderId){
    let getOrder;
    let getAllProduct=[];
    let forQtyProduct;
    this.formError=false;
    let orderItem;
    let currentAssetId;
    // let log={orderID:OrderId,  adminResponse:`Updated delivery date to: ${this.deliveryDateStatus.value.deliveryDate}`, Product_id:prodId }

    // const controls = this.deliveryDateStatus.controls;

    // Object.keys(controls).forEach(key => {
    //   controls[key].markAsTouched();
    // });

    // if(this.deliveryDateStatus.valid){
         
    // }

    // let delvStatus = this.deliveryDateStatus.value.deliveryStatus;
      let assetId;
      let getdeliveryDate;
      if(this.deliveryDateStatus.value.deliveryDate==''){
        getdeliveryDate=new Date();
      }else{
        getdeliveryDate=new Date(this.deliveryDateStatus.value.deliveryDate);
      }
      
      let db= getdeliveryDate.getDate()+'/'+(getdeliveryDate.getMonth()+1)+'/'+getdeliveryDate.getFullYear();

      this.http.get(` http://localhost:3000/orders/orderItemsByorderId/${OrderId}`).subscribe((res) => {

        orderItem=res;
        getAllProduct.push(orderItem[0].renewals_timline[0]);
        currentAssetId=getAllProduct[0].assetId ;
        let expiryDate=this.getDates(db);
        let edb=expiryDate.getDate()+'/'+(expiryDate.getMonth()+1)+'/'+expiryDate.getFullYear();
        let ndb=this.getDates(db);
        ndb.setDate(ndb.getDate() + 1);
        let nextStartDate = ndb.getDate()+'/'+(ndb.getMonth()+1)+'/'+ndb.getFullYear();
        let exp=this.getDates(db);
        exp.setDate(exp.getDate() + 1);

        getAllProduct[0].renewed=0;
        getAllProduct[0].overdew=0;
        getAllProduct[0].actualStartDate=db;
        getAllProduct[0].startDate=db;
        getAllProduct[0].expiryDate=edb;
        getAllProduct[0].nextStartDate=nextStartDate;      
        getAllProduct[0].billPeriod = db+'-'+edb; 
        getAllProduct[0].deliveryDateAssigned=1;
        console.log(getAllProduct);
        // let cid = new Promise((resolve, reject) => {
        //   Array.prototype.forEach.call(forQtyProduct, res => {
        //     if(res.id===prodId){          
        //       assetId=res.assetId;   
        //       if(res.indexs===indexId){
        //         // res.deliveryAssigned=1;
        //         res.actualStartDate=db;
        //         res.startDate=db;
        //         res.expiryDate=edb;
        //         res.nextStartDate=nextStartDate;
        //         res.billPeriod = db+'-'+edb;  
        //         res.deliveryDateAssigned=1;
        //         // res.deliveryStatus=delvStatus;
        //         // const index = res.assetId.indexOf(res.assetId[0]);
        //         //   if (index > -1) {
        //         //     res.assetId.splice(index, 1);
        //         //   }
        //         // if(assetId!==''){              
        //         //   res.assetId=assetId;
        //         // }
        //       }
        //       resolve('cid success')
        //     }
        //   });
        // });
      
        if(currentAssetId!='To be assigned'){
          this.formError=false;
          console.log(getdeliveryDate);
          console.log(exp);
          this.http.put(` http://localhost:3000/orders/updateOrderItemDeliveryDate/${OrderId}`, {deliveryDate:getdeliveryDate, expiryDate:exp,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {
              console.log(res);
              this.http.put(` http://localhost:3000/assets/update/${currentAssetId}`, {availability:0, startDate:db, expiryDate:edb, nextStartDate:nextStartDate}).subscribe();
              // const userId = localStorage.getItem('user_id');
              // const uname = localStorage.getItem('uname');
              // const uid = uname.substring(0, 3);
              // const rand = Math.floor((Math.random() * 9999) + 1);
              // const activityId = ""+uid + rand;
              // let activity={
              //   activityId:activityId,
              //   userId:userId,
              //   activityLog:JSON.stringify(log),
              // }
              // this.http.post(` http://localhost:3000/backendActivity/createActivity`, activity).subscribe();
              this.deliveryDateStatus.reset();
              this.getAssets();
              this.getOrderById(this.oid);
              // this.modalReference.close();
              // window.location.reload();
            });
        } else{
          this.formError=true;
        }

      });
      
      
  }

  updateProductDeliveryStatus(OrderId){
    let getOrder;
    let getAllProduct;
    let forQtyProduct;
    let orderItem;
    let currentAssetId;
    let delvStatus = this.deliveryStatus.value.deliveryStatus;
    this.http.put(` http://localhost:3000/orders/updateRenewTimline/${OrderId}`, {deliveryStatus:delvStatus, orderId:this.oid}).subscribe((res)=>{
      // this.modalReference.close();
      this.deliveryStatus.reset();
      this.http.get(` http://localhost:3000/orders/${this.customer_id}`).subscribe();
      this.getOrderById(this.oid);
          // window.location.reload();
    });
    // console.log(forQtyProduct);
    // let od = new Promise((resolve, reject) => {
    //   Array.prototype.forEach.call(getAllProduct, res => {
    //     if(res.id===prodId){
    //       res.deliveryAssigned=1;      
    //       res.deliveryStatus=delvStatus;
    //       resolve('OD Success');
    //     }
    //   });
    // });
    
    // let cid = new Promise((resolve, reject) => {
    //   Array.prototype.forEach.call(forQtyProduct, res => {
    //     if(res.id===prodId){
    //       if(res.indexs===indexId){
    //         res.deliveryAssigned=1;
    //         res.deliveryStatus=delvStatus;
    //         this.assetId=res.assetId;
    //         resolve('CID success');
    //       }
    //     }
    //   });
    // });
    
    // Promise.all([od,cid]).then((success)=>{
    //   if(this.assetId!=''){
    //     this.http.put(` http://localhost:3000/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
    //       console.log(res);
    //       // this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0}).subscribe();
    //       this.deliveryStatus.reset();
    //       this.modalReference.close();
    //       window.location.reload();
    //     });
    //   }
    // });
    
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

  totalTaxAmount(rentPrice) {
    const gst=18;
    return (parseInt(rentPrice) * (gst)/100);
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.order, 'Orders');
  }

}
