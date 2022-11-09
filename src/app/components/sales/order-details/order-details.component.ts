import { Component, OnInit, ViewChild, ChangeDetectorRef, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder, UntypedFormControl,Validators } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { KYC } from 'src/app/shared/data/kyc';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public kycDetails:KYC;
  NoKYC:boolean;
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('postTransaction') postTransaction;
  orderId;
  oid;
  updateStatus: UntypedFormGroup;
  deliveryDateStatus: UntypedFormGroup;
  assetAssign:UntypedFormGroup;
  deliveryStatus:UntypedFormGroup;
  updateField:UntypedFormGroup;
  addTransaction: UntypedFormGroup;
  updateTransactionData: UntypedFormGroup;
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
  orderStatuses;
  orderDeliveryStatus;
  orderField = '';
  orderDeliveryField='';
  paymentStatusActive:boolean = false;
  orderStatusActive:boolean = false;
  deliveryStatusActive:boolean = false;
  editStatus:boolean=false;
  paymentTypes;
  paymentStatuses;
  subTotal:number=0;
  Taxes:number=18;
  dp:number=0;
  role = sessionStorage.getItem('u_role');
  popupOrder;
  public closeResult: string;
  totalSecurityDeposit:number=0;
  comment:string='';
  notes:any = [];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private changeDetection: ChangeDetectorRef,private route: ActivatedRoute,private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
    this.oid = this.route.snapshot.url[1].path;
    this.getOrderById(this.route.snapshot.url[1].path);
    this.http.get(`${environment.apiUrl}/orders/getAllPaymenttypes`).subscribe((res) => {
      this.paymentTypes=res;
    });
    this.http.get(`${environment.apiUrl}/orders/getAllPaymentStatus`).subscribe((status) => {
      this.paymentStatuses=status;
    });
    this.http.get(`${environment.apiUrl}/orders/getAllOrderStatus`).subscribe((status) => {
      this.orderStatuses=status;
    });
    this.addTransaction = this.formBuilder.group({
      transactionNo:['', Validators.required],
      orderId:['', Validators.required],
      orderAmount:['', Validators.required],
      paymentStatus:['', Validators.required],
      paymentMode:['', Validators.required],
      txMsg:[''],
      tDate:[this.currDate]
    });
    this.updateTransactionData = this.formBuilder.group({
      transactionNo:['', Validators.required],
      orderAmount:['', Validators.required],
      paymentStatus:['', Validators.required],
      paymentMode:['', Validators.required],
      txMsg:[''],
      // tDate:[this.currDate]
    });
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
    // this.getOrders();
    // this.getAssets();
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
    this.http.get(`${environment.apiUrl}/orders/getAllPaymentStatus`).subscribe((res) => {
      this.paymentStatus=res;
    });

    this.http.get(`${environment.apiUrl}/orders/getAllDeliveryStatus`).subscribe((DSres) => {
      this.orderDeliveryStatus=DSres;
    });

    this.getNotesByOrderId(this.oid);
  }

  async getKycByCustomerId(id){
    var data = [];
    this.os.getKycBycustomerId(id).subscribe(async (res:[])=>{
      data= res;
      if(data.length>0){
        var mainTableResult = await this.os.getKYCMainTableByid(data[0].id).toPromise();
        this.kycDetails = mainTableResult[0]; 
      } else{
        this.NoKYC=true;
      } 
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

  openPostTransaction(modal){
    this.modalService.open(modal,{ windowClass: 'my-address'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  getNotesByOrderId(orderId){
    this.http.get(`${environment.apiUrl}/admin/getNotesByOrderId/${orderId}`).subscribe((notesRes)=>{
      this.notes = notesRes;
    })
  }

  postNotes(){
    let sendObj = {
      comment:this.comment,
      uid: sessionStorage.getItem('user_id'),
      frontUid:this.fullOrderDetails[0].customer_id,
      orderId:this.fullOrderDetails[0].id,
      orderType:this.fullOrderDetails[0].orderType_id,
    };
    if(this.comment.replace(/ /g,'')){
      this.http.post(`${environment.apiUrl}/admin/insertNotes`,sendObj).subscribe((res)=>{
        this.getNotesByOrderId(this.fullOrderDetails[0].id);
        this.comment='';
        alert('Added note successfully');
      });
    }
    
  }

  postTransactionData(){
    this.http.post(`${environment.apiUrl}/payments/postManualOrderTransaction`,this.addTransaction.value).subscribe((resp2)=>{
      if(this.addTransaction.value.paymentStatus==1 || this.addTransaction.value.paymentStatus==4){
        this.http.put(`${environment.apiUrl}/payments/updatePaymentStatus`, {paymentStatus: this.addTransaction.value.paymentStatus, orderId: this.oid}).subscribe(()=>{
          this.http.post(`${environment.apiUrl}/payments/postInvoice`,{orderId:this.addTransaction.value.orderId}).subscribe();
        });       
      }
      alert('Transaction posted successfully');      
      this.modalService.dismissAll();
    });
  }

  postReturnTransactionData(){
    this.http.post(`${environment.apiUrl}/payments/postManualOrderTransaction2`,this.addTransaction.value).subscribe((resp2)=>{
      this.http.put(`${environment.apiUrl}/payments/updatePaymentStatus`, {paymentStatus: this.addTransaction.value.paymentStatus, orderId: this.oid}).subscribe(()=>{
        this.http.post(`${environment.apiUrl}/payments/postInvoice`,{orderId:this.addTransaction.value.orderId}).subscribe();
      });
      alert('Transaction posted successfully');      
      this.modalService.dismissAll();
    });
  }

  updateTransactionManual(){
    this.http.put(`${environment.apiUrl}/payments/updateTransaction/${this.fullOrderDetails[0].t_id}`,this.updateTransactionData.value).subscribe((resp)=>{
      this.http.put(`${environment.apiUrl}/payments/updatePaymentStatus`, {paymentStatus: this.updateTransactionData.value.paymentStatus, orderId: this.oid}).subscribe((resp2)=>{
        alert('Transaction Updated successfully');  
        this.modalService.dismissAll();
      });      
    });
  }

  updatePaymentStatus(){
    this.http.put(`${environment.apiUrl}/payments/updatePaymentStatus`, {paymentStatus: this.addTransaction.value.paymentStatus, orderId: this.oid}).subscribe(()=>{
      this.http.post(`${environment.apiUrl}/payments/postInvoice`,{orderId:this.addTransaction.value.orderId}).subscribe();
    }); 
  }

  placeReturnRequest(oid,oiid,renewals_timline){
    
    let returnAsset = renewals_timline.filter(item=>item.renewed==1 || item.renewed==4 || item.ordered ==1);
    let renewalsData = returnAsset.slice(-1)[0];
    let orderItem={
      order_item_id:oiid,
      order_id:oid,
      renewals:JSON.stringify(renewalsData),
      request_id:2,
      requested_date:new Date(),
      approval_status:0,
      approval_date:0,
      request_status:1
    }
    console.log(orderItem);
    this.http.post(`${environment.apiUrl}/users/updateorderItem`,orderItem).subscribe();
  }

  open(ordId) {
    this.modalReference=this.modalService.open(this.content);
    this.orderId=ordId;
    this.http.get(`${environment.apiUrl}/orders/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }

  updateDeliveryStatus(id){
    this.http.put(`${environment.apiUrl}/orders/update/${id}`, this.updateStatus.value).subscribe((res) => {      
    });
  }


  getOrderById(ordId){
    this.fullOrderDetails=[];
    this.http.get(`${environment.apiUrl}/orders/orderId/${ordId}`).subscribe((res) => {
      this.fullOrderDetails.push(res[0]);
      this.customer_id = res[0].customer_id
      this.productDetails=res[0].orderItem;
      this.productDetails.forEach((prods)=>{
        this.subTotal += prods.tenure_price;
        this.totalSecurityDeposit +=prods.security_deposit;
      })
      console.log(res[0]);
      this.addTransaction.patchValue({
        orderId:res[0].order_id,
        orderAmount:res[0].grandTotal
      });
      this.updateTransactionData.patchValue({
        transactionNo: res[0].transaction_id,
        orderAmount: res[0].transactionAmount,
        paymentStatus: res[0].status_id,
        paymentMode: res[0].type,
        txMsg: res[0].transaction_msg,
        // tDate: res[0].transactionDate
      });
      this.http.get(`${environment.apiUrl}/users/getCustomerById/${this.customer_id}`).subscribe((customerDetails)=>{
        this.customerDetails = customerDetails;
      });
      this.getKycByCustomerId(this.customer_id);
    });
  }

  addOrderField(field){
    this.updateField.addControl(field,new UntypedFormControl(''));
  }

  updateTransactionField(txnId, field,value){
    this.http.put(`${environment.apiUrl}/orders/updateAnytransactionField/${txnId}`, {transactionField: field, transactionValue: value}).subscribe();
    this.editStatus=false;
    // this.getOrderById(this.oid);
  }

  updateOrderField(ordId, field, value){
    this.http.put(`${environment.apiUrl}/orders/updateAnyOrderField/${ordId}`, {orderField: field, orderValue: value}).subscribe();
    this.paymentStatusActive=false;
    this.orderStatusActive=false;
    this.getOrderById(this.oid);
    // this.changeDetection.detectChanges();
    // console.log(this.orderField)
  }

  updateAnyOrderItemField(itemId, field,value){
    this.http.put(`${environment.apiUrl}/orders/updateAnyOrderItemField/${itemId}`, {field: field, fieldValue: value}).subscribe();
    this.editStatus=false;
  }

  updateOrderDeliveryField(ordId, field, value){
    this.http.put(`${environment.apiUrl}/orders/updateAnyOrderField/${ordId}`, {orderField: field, orderValue: value}).subscribe();
    this.deliveryStatusActive=!this.deliveryStatusActive;
    this.getOrderById(this.oid);
    this.os.getRenewalsByCustomerId(this.customer_id);
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
  //   this.http.put(`${environment.apiUrl}/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
  //     console.log(res);
  //     this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0}).subscribe();
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
    this.http.get(`${environment.apiUrl}/orders/orderItemsByorderId/${OrderId}`).subscribe((res) => {
      orderItem=res;
      getAllProduct=orderItem[0].renewals_timline;
      currentAssetId=getAllProduct[0].assetId ;
      if(orderItem[0].asset_id=='To be assigned'){
        getAllProduct[0].assetId = assetId;
        this.http.put(`${environment.apiUrl}/orders/updateOrderItemAsset/${OrderId}`, {assetId:assetId,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {});
          
        this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
        this.assetAssign.reset();
        this.getAssets();
        this.getOrderById(this.oid);
        // this.modalReference.close();
        // window.location.reload();
      } else{
        getAllProduct[0].assetId = assetId;
        this.http.put(`${environment.apiUrl}/orders/updateOrderItemAsset/${OrderId}`, {assetId:assetId,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {});
          
        this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
        this.http.put(`${environment.apiUrl}/assets/update/${currentAssetId}`, {availability:1, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
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
    //   this.http.put(`${environment.apiUrl}/orders/updateOD/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct)}).subscribe((res) => {});
    //     this.http.put(`${environment.apiUrl}/orders/updateCID/${OrderId}`, {checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
    //     console.log(res);
        
    //     this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0, startDate:startDate, expiryDate:expiryDate, nextStartDate:nextStartDate}).subscribe();
    //     this.http.put(`${environment.apiUrl}/assets/update/${currentAssetId}`, {availability:1, startDate:'', expiryDate:'', nextStartDate:''}).subscribe();
    //     this.assetAssign.reset();
    //     this.getAssets();
    //     this.modalReference.close();
    //     // window.location.reload();
    //   });
    // });    
    
  }

  updateDeliveryDate(OrderId, OIT){
    console.log(OIT);
    let getOrder;
    let getAllProduct=[];
    let forQtyProduct;
    this.formError=false;
    let orderItem;
    let currentAssetId;
      let assetId;
      let getdeliveryDate:Date;
      if(this.deliveryDateStatus.value.deliveryDate=='' || this.deliveryDateStatus.value.deliveryDate==null){
        getdeliveryDate=new Date();
      }else{
        getdeliveryDate=new Date(this.deliveryDateStatus.value.deliveryDate);
      }


      
      let db= getdeliveryDate.getDate()+'/'+(getdeliveryDate.getMonth()+1)+'/'+getdeliveryDate.getFullYear();

      this.http.get(`${environment.apiUrl}/orders/orderItemsByorderId/${OrderId}`).subscribe((res) => {
        
        orderItem=res;
        getAllProduct.push(orderItem[0].renewals_timline[0]);
        currentAssetId=orderItem[0].asset_id ;
        let expiryDate=this.getDates(db);
        let edb=expiryDate.getDate()+'/'+(expiryDate.getMonth()+1)+'/'+expiryDate.getFullYear();
        let ndb=this.getDates(db);
        ndb.setDate(ndb.getDate() + 1);
        let nextStartDate = ndb.getDate()+'/'+(ndb.getMonth()+1)+'/'+ndb.getFullYear();
        let exp=this.getDates(db);
        exp.setDate(exp.getDate() );

        if(orderItem[0].fully_paid_tenure==1){
          expiryDate=this.getTenureEndDates(db, orderItem[0].tenure);
          edb=expiryDate.getDate()+'/'+(expiryDate.getMonth()+1)+'/'+expiryDate.getFullYear();
          ndb=this.getTenureEndDates(db, orderItem[0].tenure);
          ndb.setDate(ndb.getDate() + 1);
          nextStartDate = ndb.getDate()+'/'+(ndb.getMonth()+1)+'/'+ndb.getFullYear();
          exp=this.getTenureEndDates(db, orderItem[0].tenure);
          exp.setDate(exp.getDate() );
        }
        

        getAllProduct[0].renewed=0;
        getAllProduct[0].overdew=0;
        getAllProduct[0].actualStartDate=db;
        getAllProduct[0].startDate=db;
        getAllProduct[0].expiryDate=edb;
        getAllProduct[0].nextStartDate=nextStartDate;      
        getAllProduct[0].billPeriod = db+'-'+edb; 
        getAllProduct[0].deliveryDateAssigned=1;
        console.log(getAllProduct);
      
        if(currentAssetId!='To be assigned'){
          this.formError=false;
          console.log(getdeliveryDate);
          console.log(exp);
          this.http.put(`${environment.apiUrl}/orders/updateOrderItemDeliveryDate/${OrderId}`, {deliveryDate:getdeliveryDate, expiryDate:exp,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {
              console.log(res);
              this.http.put(`${environment.apiUrl}/assets/update/${currentAssetId}`, {availability:0, startDate:db, expiryDate:edb, nextStartDate:nextStartDate}).subscribe();
              this.http.get(`${environment.apiUrl}/admin/getOrderRenewalById/${OrderId}`).subscribe((orderRenewals:[])=>{
                
                if(orderRenewals.length>0){
                  this.http.put(`${environment.apiUrl}/admin/updateOrderRenewal/${OrderId}`, {start_date:getdeliveryDate, end_date:exp}).subscribe();
                }else{
                  this.http.post(`${environment.apiUrl}/admin/insertOrderRenewal`, {order_item_id:OrderId, renewal_price:OIT.tenure_price, start_date:getdeliveryDate, end_date:exp, is_renewed:1}).subscribe();
                }
              });
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

  updateProductDeliveryStatus(OrderId,OIT){
    let getOrder;
    let getAllProduct=[];
    let forQtyProduct;
    let orderItem;
    let currentAssetId;
    let delvStatus = this.deliveryStatus.value.deliveryStatus;
    this.http.get(`${environment.apiUrl}/orders/orderItemsByorderId/${OrderId}`).subscribe((res) => {

      orderItem=res;
      getAllProduct.push(orderItem[0].renewals_timline[0]);
      currentAssetId=orderItem[0].asset_id ;
    
      if(currentAssetId!='To be assigned'){
        this.http.put(`${environment.apiUrl}/orders/updateRenewTimline/${OrderId}`, {deliveryStatus:delvStatus, orderId:this.oid}).subscribe((res)=>{
          // this.modalReference.close();
          this.deliveryStatus.reset();
          this.http.get(`${environment.apiUrl}/orders/${this.customer_id}`).subscribe();
          this.http.put(`${environment.apiUrl}/orders/updateOrderItemDeliveryDate/${OrderId}`, {deliveryDate:OIT.startDate, expiryDate:OIT.endDate,renewalTimeline:JSON.stringify(getAllProduct)}).subscribe((res) => {
            
            
            this.http.get(`${environment.apiUrl}/admin/getOrderRenewalById/${OrderId}`).subscribe((orderRenewals:[])=>{
              
              if(orderRenewals.length>0){
                this.http.put(`${environment.apiUrl}/admin/updateOrderRenewal/${OrderId}`, {start_date:OIT.startDate, end_date:OIT.endDate}).subscribe();
              }else{
                this.http.post(`${environment.apiUrl}/admin/insertOrderRenewal`, {order_item_id:OrderId, renewal_price:OIT.tenure_price, start_date:OIT.startDate, end_date:OIT.endDate, is_renewed:1}).subscribe();
              }
            });
            this.deliveryDateStatus.reset();
            // this.modalReference.close();
            // window.location.reload();
          });
          this.getOrderById(this.oid);
              // window.location.reload();
        });
      }else{
        this.formError=true;
      }
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
    //     this.http.put(`${environment.apiUrl}/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
    //       console.log(res);
    //       // this.http.put(`${environment.apiUrl}/assets/update/${assetId}`, {availability:0}).subscribe();
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

  getTenureEndDates(date, tenure){
    let dateParts = date.split("/");
    let ned
    // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
    let dd= dateObject.getDate();
    let mm=dateObject.getMonth();
    let yy=dateObject.getFullYear();

    let Days=new Date(yy, mm+1+tenure, 0).getDate();

    if(Days<dd){             
      ned  = new Date(yy, mm+tenure, Days);
    }else{					
      ned = new Date(yy, mm+tenure, dd-1);
      
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

  public async  downloadAsPDF() {
    // const pdfTable = document.getElementById(uid);
    let getOrder;
    getOrder=this.fullOrderDetails[0];

    this.popupOrder=await getOrder.orderItem;

    // console.log(getOrder);
    let subTotal;

  //   let sum=getOrder.renewals_timline.reduce(function(sum,elem){
  //     return sum+parseInt(elem.price);
  //  },0);
  subTotal=getOrder.subTotal+getOrder.damageProtection+getOrder.deliveryCharges;
    
   let invoiceDate = new Date(getOrder.createdAt).toJSON().slice(0,10).split('-').reverse().join('/');
    const doc: jsPDF = new jsPDF("p", "pt", "a4", false);

    var img = new Image()
    img.src = 'https://irentout.com/assets/images/icon/logo-12.png';
    doc.addImage(img, 'png', 40, 30, 137, 26.32);


    doc.setFontSize(10);
    doc.text('Invoice #              :    '+getOrder.invoice_id, 40, 100);
    doc.text('Invoice Date        :    '+invoiceDate, 40, 112);    
    doc.text('Payment status   :    '+getOrder.paymentStatus, 40, 124); 

    doc.text('Order type         :   '+getOrder.order_type, 350, 100);
    doc.text('Order #              :   '+getOrder.order_id, 350, 112);
    if(getOrder.orderType_id == 1 || getOrder.orderType_id == 3){
      doc.text('Delivery status  :   '+getOrder.delivery_status, 350, 124); 
    }
    


    doc.setLineWidth(20.0); 
    doc.setDrawColor(243, 110, 2);

    doc.line(40, 155, 560, 155);
    doc.setTextColor('white');
    doc.text('Bill To', 50, 158);
    if(getOrder.orderType_id == 1 || getOrder.orderType_id == 3){
      doc.text('Ship To', 350, 158);
    }
    
    doc.setTextColor('black');
    doc.setFontSize(10);
    doc.text(getOrder.billingAddress[0].display_name, 50, 185);
    doc.text(getOrder.billingAddress[0].address_line1, 50, 197);
    doc.text(getOrder.billingAddress[0].address_line2, 50, 209);
    doc.text(getOrder.billingAddress[0].city+'-'+getOrder.billingAddress[0].pincode, 50, 221);
    // doc.text('Bengaluru, Karnataka 560111,', 50, 236);

    if(getOrder.orderType_id == 1 || getOrder.orderType_id == 3){
      doc.text(getOrder.shippingAddress[0].display_name, 350, 185);
      doc.text(getOrder.shippingAddress[0].address_line1, 350, 197);
      doc.text(getOrder.shippingAddress[0].address_line2, 350, 209);
      doc.text(getOrder.shippingAddress[0].city+'-'+getOrder.shippingAddress[0].pincode, 350, 221);
    }
    

    // doc.setLineWidth(1.0); 
    // doc.line(40, 100, 560, 100);

    // doc.setFontSize(12);
    // doc.text('Bill To:', 40, 130);
    doc.setFontSize(10);
    let splitAddress = doc.splitTextToSize(getOrder.billingAddress[0]+',', 180);
    // doc.text(splitAddress, 40, 145);
    // doc.text(getOrder.city+'-'+getOrder.pincode, 40, 167);
    // doc.text(getOrder.email, 40, 179);

    // doc.setFontSize(12);
    // doc.text('Order # : '+uid, 40, 210);
    // function convertDate(inputFormat) {
    //   function pad(s) { return (s < 10) ? '0' + s : s; }
    //   var d = new Date(inputFormat)
    //   return [pad(d.getDate()), pad(d.toLocaleString('default', { month: 'short' })), d.getFullYear()].join('/')
    // }
    // doc.text('Order date : '+convertDate(getOrder.createdAt), 40, 225);
    setTimeout(()=>{
      autoTable(doc, { html: '#order-table', 
                     margin: {top: 240},
                     didParseCell: function (data) {
                      var col = data.column.index;
                      if( col==1 || col==2 || col==3 || col==4 || col==5){
                          data.cell.styles.halign = 'center';
                      } 
                      var rows = data.table.body;
                      if (data.row.index === 0) {
                          data.cell.styles.fillColor = '#f36f02';
                          data.cell.styles.textColor = '#ffffff';
                      }
                  }
      });
      

      if(getOrder.damageProtection>0 && getOrder.deliveryCharges>0){
        autoTable(doc, { margin: {top: 0, left:405},body: [
            ['Sub total', 'INR '+getOrder.subTotal], 
            ['Damage protection', 'INR '+getOrder.damageProtection], 
            ['Delivery charges', 'INR '+getOrder.deliveryCharges],               
            ['GST @ 18%', 'INR '+subTotal*18/100],
            ['Invoice Value', 'INR '+getOrder.total],
            ['Security Deposit', 'INR '+getOrder.totalSecurityDeposit],
            ['Grand Total', 'INR '+getOrder.grandTotal],
          ],
          didParseCell: function (data) {
            var Totals = data.column.index;
            var rows = data.table.body;
            data.cell.styles.halign = 'right';
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = '#f36f02';
                data.cell.styles.textColor = '#ffffff';                   
            } 
          },
          tableWidth: 150
        });
    }else if(getOrder.damageProtection>0 && getOrder.deliveryCharges==0){
      autoTable(doc, { margin: {top: 0, left:405},body: [
            ['Sub total', 'INR '+getOrder.subTotal], 
            ['Damage protection', 'INR '+getOrder.damageProtection],             
            ['GST @ 18%', 'INR '+subTotal*18/100],
            ['Invoice Value', 'INR '+getOrder.total],
            ['Security Deposit', 'INR '+getOrder.totalSecurityDeposit],
            ['Grand Total', 'INR '+getOrder.grandTotal],
          ],
          didParseCell: function (data) {
            var Totals = data.column.index;
            var rows = data.table.body;
            data.cell.styles.halign = 'right';
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = '#f36f02';
                data.cell.styles.textColor = '#ffffff';                   
            } 
          },
          tableWidth: 150
      });
    }else if(getOrder.damageProtection==0 && getOrder.deliveryCharges>0){
      autoTable(doc, { margin: {top: 0, left:405},body: [
            ['Sub total', 'INR '+getOrder.subTotal], 
            ['Delivery charges', 'INR '+getOrder.deliveryCharges],               
            ['GST @ 18%', 'INR '+subTotal*18/100],
            ['Invoice Value', 'INR '+getOrder.total],
            ['Security Deposit', 'INR '+getOrder.totalSecurityDeposit],
            ['Grand Total', 'INR '+getOrder.grandTotal],
          ],
          didParseCell: function (data) {
            var Totals = data.column.index;
            var rows = data.table.body;
            data.cell.styles.halign = 'right';
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = '#f36f02';
                data.cell.styles.textColor = '#ffffff';                   
            } 
          },
          tableWidth: 150
      });
    } else {
      autoTable(doc, { margin: {top: 0, left:405},body: [
            ['Sub total', 'INR '+getOrder.subTotal],              
            ['GST @ 18%', 'INR '+subTotal*18/100],
            ['Invoice Value', 'INR '+getOrder.total],
            ['Security Deposit', 'INR '+getOrder.totalSecurityDeposit],
            ['Grand Total', 'INR '+getOrder.grandTotal],
          ],
          didParseCell: function (data) {
            var Totals = data.column.index;
            var rows = data.table.body;
            data.cell.styles.halign = 'right';
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = '#f36f02';
                data.cell.styles.textColor = '#ffffff';                   
            } 
          },
          tableWidth: 150
      });
    } 

    autoTable(doc, { margin: {top: 15, left:40},body: [
        ['Terms & Conditions'], 
        ['1. The above mentioned assets are rented out by Futureol Pvt Ltd through irentout.com'],   
        ['2. The above mentioned products are given on rent on advance rental basis'],   
        ['3. The monthly rental should be paid in advance within 5 days of previous subscription end date'], 
        ['4. Any returns should be informed to irentout.com through web portal or by phone call at least 2 days prior to end of subscription to avoid next billing'],
        ['5. Non intimation of return will be considered as an extension of rental tenure by default'],
        ['6. All products with monthly rental below INR 5000 will attract late payment charges of INR 60/ day per line item after 5 days of previous subscription expiry'],
        ['7. All products with monthly rental above INR 5000 will attract late payment charges of INR 125/ day per line item after 5 days of previous subscription expiry'],
        ['8. Any loss or damages caused by the customer will be charged as per market price to the customer'],                
      ],
      didParseCell: function (data) {
        var Totals = data.column.index;
        var rows = data.table.body;
        data.cell.styles.halign = 'left';
        data.cell.styles.fillColor = 'white';
        data.cell.styles.cellPadding = 0;
      },
      tableWidth: 500
    });

    doc.save('Invoice.pdf');
    },1000)
    
  }

}
