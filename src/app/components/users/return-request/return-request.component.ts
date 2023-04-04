import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbDateStruct, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { ProductService } from '../../products/services/product.service';
import { ActivatedRoute, Router} from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-return-request',
  templateUrl: './return-request.component.html',
  styleUrls: ['./return-request.component.scss']
})
export class ReturnRequestComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public temp = [];
  toggleReplaceDetails:boolean;
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('returnRequest') returnRequest;
  @ViewChild('replacementRequest') replacementRequest;
  @ViewChild('dt1', { static: true }) dt1: any;
  orderId;
  updateStatus: UntypedFormGroup;
  deliveryDateStatus: UntypedFormGroup;
  assetAssign:UntypedFormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  returnDate;
  currentOrderId;
  currentOrderItemId;
  currentAssetId;
  currentIndexs;
  txnId;
  replaceProduct;
  p1Tenure=0;
  p2Tenure;
  p2TenurePrice=0;
  tenure_id=0;
  p2DP=0;
  billStartDate = new Date();
  returnDamageCharges:number=0;
  damageCharges:number=0;
  earlyReturnCharges:number=0;
  refundStatus = 5;
  replacePaymentStatus:string = 'To be paid';
  assetId;
  prodId;
  securityDepositDiff=0;
  rentDifference=0;
  toBeRefunded=0;
  billPeriod;
  public productsList;
  public filteredProducts=[];
  public filteredOrders=[];
  orderitem=[];
  model: NgbDateStruct;
  paymentStatus;
  requestDetails={request_message:''};
  comment:string;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  checkedProducts=[];
  totalSecurityDeposit:number=0;
  disableReturn:boolean=false;
  datasource:[];
  loading: boolean;
  totalRecords: number;
  selectedOrders:[];
  cols: any[];
  exportColumns: any[];
  first;
  approvals;

  constructor(private calendar: NgbCalendar,private route: ActivatedRoute, private router:Router,private http: HttpClient,private ps:ProductService,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
    this.model = this.calendar.getToday();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.primary_id.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.order = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
    // this.getOrders();
    // this.getAssets();
    this.approvals = [
      { name: "Approved" },
      { name: "Rejected" },
      { name: "Requested" },
    ];
    this.loadProducts();
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
    this.transactionId();
    this.getFilters();
    this.http.get(`${environment.apiUrl}/admin/getReturnCustomerRequests`).subscribe((res) => {
      let a=[];
      a.push(res);
      this.orderitem =a[0];
      this.orderitem.forEach((item) => {
        item.requested_date = new Date(item.requested_date);
        if(item.approval_status==0 && item.request_status==1){
          item.approval_statusText={name:"Requested"};
        }else if(item.approval_status==0 && item.request_status==0){
          item.approval_statusText={name:"Rejected"};
        }else if(item.approval_status==1 && item.request_status==0){
          item.approval_statusText={name:"Approved"};
        }
      });
    });
    this.http.get(`${environment.apiUrl}/orders/getAllPaymentStatus`).subscribe((res) => {
      this.paymentStatus=res;
    });
  }

  getOrders(){
    this.os.getAllOrders().subscribe((orders)=>{
      orders.reverse();
      this.order=orders.filter(item => item.status=='SUCCESS');
      this.filteredOrders=this.order;
      
    });
  }

  loadProducts() {
    this.ps.getProducts().subscribe(res => {
      this.productsList = res;
      this.filteredProducts=this.productsList.filter(item=>item.cat_id==1 && item.city_id==1);
    }, error => {
      if (error.status === 401) {
        this.router.navigate(['/auth/login']);
      } else if(error.status === 403) {
        alert('session expired');
      }
    });
  }

  totalTaxAmount(rentPrice) {
    let gst = 18;
    return (parseInt(rentPrice) * (gst)/100);
  }

  postNotes(orderDBId){
    let sendObj = {
      comment:this.comment,
      uid: sessionStorage.getItem('user_id'),
      frontUid:this.fullOrderDetails[0].customer_id,
      orderId:orderDBId,
      orderType:4,
    };
    if(this.comment.replace(/ /g,'')){
      this.http.post(`${environment.apiUrl}/admin/insertNotes`,sendObj).subscribe((res)=>{
        this.comment='';
        alert('Added note successfully');
      });
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
    this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }


  


  getOrderById(ordId){
    // this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      // this.productDetails=res[0].checkoutItemData;
    });
  }

  transactionId() {
    const subCity = 'BLR';
    const rand = Math.floor((Math.random() * 999) + 1);
    const dte = new Date();
    const txnid = ""+subCity +
    dte.getDate().toString().padStart(2, "0")+
    (dte.getMonth()+1).toString().padStart(2, "0") +
    dte.getFullYear().toString().substr(2,2) + rand;
    this.txnId=txnid;
  }

  returnProductOrderById(ordId,oiid,requestedProduct,assetId, requestDetails){
    let orderItem;

    this.requestDetails = requestDetails;
    // this.modalReference=this.modalService.open(this.returnRequest, { windowClass : "return-request"});  
    this.productDetails= requestedProduct;
    console.log(this.productDetails);
    this.toBeRefunded=(this.productDetails.security_deposit-0)-(this.returnDamageCharges+this.earlyReturnCharges);
    this.http.get(`${environment.apiUrl}/orders/orderId/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      orderItem = res[0].orderItem.filter(item=>item.order_item_id == oiid);
      // this.productDetails=orderItem[0].renewals_timline.filter(item =>item.renewed==0 );
      // this.productDetails=orderItem[0].renewals_timline.slice(-1).pop();
    this.currentIndexs=this.productDetails.indexs;
    
    }); 
    this.currentOrderItemId = oiid;
    this.currentOrderId=ordId;
    this.currentAssetId=assetId;
  }

  // getRefundAmount(){
  //   this.toBeRefunded=(this.productDetails.prod_price-0)-(this.returnDamageCharges+this.earlyReturnCharges);
  // }

  returnProduct(){
    this.disableReturn=true;
    var day = this.model.day;
    var month = this.model.month;
    var year = this.model.year;
    this.returnDate= day + '/' + month + '/' + year;
    
    let cInfo=[];
    let pInfo=[];
    let productToReturn;
    this.checkedProducts.forEach((item)=>{
      productToReturn=item;
      let ucid={      
        id: productToReturn.product_id,
        prod_name:productToReturn.prod_name,
        prod_price:productToReturn.security_deposit,
        prod_img:productToReturn.prod_image,
        delvdate: productToReturn.startDate,
        qty: 1, 
        price: productToReturn.tenure_price, 
        tenure: productToReturn.tenure_period,
        primaryOrderNo:productToReturn.primaryOrderNo, 
        currentOrderNo: this.currentOrderId,
        renewed:3,
        startDate:this.oldDateFormat(productToReturn.startDate),
        expiryDate:this.oldDateFormat(productToReturn.endDate),
        // nextStartDate:productToReturn.nextStartDate,
        // overdew:productToReturn.overdew,
        ordered:1,
        assetId:productToReturn.asset_id,
        // deliveryStatus:productToReturn.deliveryStatus,
        // deliveryAssigned:productToReturn.deliveryAssigned,
        dp:productToReturn.damage_protection,
        // replacement:productToReturn.replacement,
        returnDate:this.returnDate,
        billPeriod:this.oldDateFormat(productToReturn.startDate)+'-'+this.returnDate,
        billAmount:0,
        p1Rent:0,
        damageCharges:this.returnDamageCharges,
        earlyReturnCharges:this.earlyReturnCharges,
        order_item_id:item.order_item_id,
        tenure_id:productToReturn.tenure_id,
        tenureBasePrice:productToReturn.tenure_base_price
      };    
    
      cInfo.push(ucid);

    });

    // let productToReturn = this.productDetails;

    
    var charges=0;
    let returnGrandTotal=0;
    charges = (this.totalSecurityDeposit-0)-(this.returnDamageCharges+this.earlyReturnCharges);
    // pInfo.push(productToReturn.prod_id);
    if(charges>=0){
      returnGrandTotal=0;
    } else{
      returnGrandTotal=Math.abs(charges);
    }

    let returnOrder={
      uid: this.fullOrderDetails[0].customer_id,
      primaryID:this.fullOrderDetails[0].primary_id,
      orderID: this.txnId,
      subTotal: this.returnDamageCharges+this.earlyReturnCharges,
      damageProtection:0,
      total:this.returnDamageCharges+this.earlyReturnCharges,
      actualSecurityDeposit: (this.totalSecurityDeposit-0),
      securityDeposit: 0,
      currentRefundAmount:charges,
      grandTotal: returnGrandTotal,
      discount: 0,
      firstName: this.fullOrderDetails[0].firstName,
      lastName:this.fullOrderDetails[0].lastName,
      mobile: this.fullOrderDetails[0].mobile,
      email: this.fullOrderDetails[0].email, 
      billingAddress:this.fullOrderDetails[0].billingAddress[0].address_id,
      shippingAddress:this.fullOrderDetails[0].shippingAddress[0].address_id,
      orderType:4,
      orderStatus:1,
      paymentStatus:this.refundStatus,
      deliveryStatus:6,
      refundStatus:'To be Paid',
      createdBy:1,
      modifiedBy:1,
      createdAt: new Date(),
      modifiedAt:new Date(),
      products:JSON.stringify(cInfo),
      returnDate:this.returnDate,
    }; 

    let returnOrderItem={
      status:0,
      damageCharges:this.returnDamageCharges
    };

    let customerRequest={
      approvalStatus:1,
      requestStatus:0
    };

    this.http.post(`${environment.apiUrl}/payments/newReturn`,  returnOrder).subscribe((res:any) => {
      
      this.checkedProducts.forEach((item)=>{
        this.http.put(`${environment.apiUrl}/orders/updateOrderItemStatus/${item.order_item_id}`,returnOrderItem).subscribe();
        this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${item.order_item_id}`,customerRequest).subscribe(); 
        this.http.put(`${environment.apiUrl}/users/updatecustomerRequestsMessage/${item.order_item_id}`,this.requestDetails).subscribe();
      });
      this.http.post(`${environment.apiUrl}/forgotpassword/notifyMailReturnOrder`,  returnOrder).subscribe();
      this.postNotes(res.orderDBId);
      // if(this.refundStatus==6){
      //   this.http.post(`${environment.apiUrl}/forgotpassword/depositRefundedMail`,  returnOrder).subscribe();
      // }      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
        // this.http.get(`${environment.apiUrl}/products/ordDetails/${this.currentOrderId}`).subscribe((resOrd) => {
        //   let cid = resOrd[0].checkoutItemData;
        //   cid.forEach(element => {
        //     if(element.assetId===this.currentAssetId){ 
        //       element.renewed=3;
        //       element.returnDate=this.returnDate;
        //     }
        //   });     
        //   this.http.put(`${environment.apiUrl}/orders/updateCID/${this.currentOrderId}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
        // });
        // this.http.put(`${environment.apiUrl}/assets/update/${this.currentAssetId}`, {availability:1, startDate:0,expiryDate:0,nextStartDate:0}).subscribe();
        // this.modalReference.close();
    });
  }

  returnReject(txnid, p1Indexs){
    this.toggleReplaceDetails=!this.toggleReplaceDetails;
    let filterP1;
    filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    this.http.get(`${environment.apiUrl}/products/ordDetails/${txnid}`).subscribe((resOrd) => {
      let cid = resOrd[0].checkoutItemData;
      cid.forEach(element => {
        if(element.indexs===filterP1[0].indexs){              
          element.replacement=0;
          element.returnDate='';
          element.renewed=1;
        }
      });     
      this.http.put(`${environment.apiUrl}/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
    });
  }

  //Replacement codes
  getBillPeriod(a){
    this.billPeriod=a;
  }
 

  resetFormData(){
    this.checkedProducts=[];
    this.totalSecurityDeposit=0;
    this.prodId='';
    this.assetId='';
  }


  dateConfig(date){
    let dateParts = date.split("/");
    // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
    let dd= dateObject.getDate();
    let mm=dateObject.getMonth();
    let yy=dateObject.getFullYear();

    let db = mm+1+'/'+dd+'/'+yy;
    let dateResult= new Date(db);
    return dateResult;
  }

  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  calcPriceInDays(p1,daysInMonth,usedDays){
    let pricePerDay = p1/daysInMonth;
    return pricePerDay*usedDays;
  }

  calcDiffPrice(p1startDate,p1EndDate,actualStartDate,actualEndDate,p1Rent, p1DP){
    let gst = 18;
    let currDate = new Date();
    let p1SDate = this.dateConfig(p1startDate);
    let p1EDate = this.dateConfig(p1EndDate);
    let actualSDate = this.dateConfig(actualStartDate);
    let actualEDate = this.dateConfig(actualEndDate);
    let daysDiffForCD = this.dateDiffInDays(actualSDate,actualEDate) +1;
    let daysDiffForED = this.dateDiffInDays(p1SDate,p1EDate) +1;
    let rentDP = parseInt(p1Rent)+parseInt(p1DP);
    let p1Amount = (rentDP);
    let p1BillAmount = this.calcPriceInDays(p1Amount, daysDiffForED, daysDiffForCD);
    return Math.round(p1BillAmount);
  }


  reject(){
    this.checkedProducts.forEach((cpRes)=>{
      let orderItem={approvalStatus:0, requestStatus:'0'}
      this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${cpRes.order_item_id}`,orderItem).subscribe((resOrd) => {
        // this.modalReference.close();
        
      });
    });
    
    this.checkedProducts=[];
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    // let filterP1;
    // let log={orderID:txnid, request:'Replacement', adminResponse:'Rejected'}
    // filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    // this.http.get(`${environment.apiUrl}/products/ordDetails/${txnid}`).subscribe((resOrd) => {
    //   let cid = resOrd[0].checkoutItemData;
    //   cid.forEach(element => {
    //     if(element.indexs===filterP1[0].indexs){              
    //       element.replacement=0;
    //       element.returnDate='';
    //       element.renewed=1;
    //     }
    //   });     

    //   const userId = localStorage.getItem('user_id');
    //   const uname = localStorage.getItem('uname');
    //   const uid = uname.substring(0, 3);
    //   const rand = Math.floor((Math.random() * 9999) + 1);
    //   const activityId = ""+uid + rand;
    //   let activity={
    //     activityId:activityId,
    //     userId:userId,
    //     activityLog:JSON.stringify(log),
    //   }
    //   this.http.post(`${environment.apiUrl}/backendActivity/createActivity`, activity).subscribe();
    //   this.http.put(`${environment.apiUrl}/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
    // });
    
  }

  //End of replacement codes
  


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

  oldDateFormat(myDate){
    let currDate = new Date(myDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    let convertedDate =day + '/' + month + '/' + year;
    return convertedDate;
  }

  productsToReturn(e, productData:any){
    let orderItem;
    if(e.target.checked){
      this.checkedProducts.push(productData);
    }else{
      const productIndex = this.checkedProducts.indexOf(productData);
      if (productIndex > -1) {
        this.checkedProducts.splice(productIndex, 1);
      }
    }
    console.log(this.checkedProducts);
    this.http.get(`${environment.apiUrl}/orders/orderId/${this.checkedProducts[0].order_id}`).subscribe((res) => {
      this.fullOrderDetails=res;
      orderItem = res[0].orderItem.filter(item=>item.order_item_id == this.checkedProducts[0].order_item_id);

    
    }); 
  }

  createOrderPlatform(){    
    this.checkedProducts.forEach((item)=>{
      this.totalSecurityDeposit +=item.security_deposit;
    });
  }

  onFilter(e:any) {
    console.log(this.dt1.filters);
    sessionStorage.setItem("returnRequestFilters", JSON.stringify(e.filters));
    // sessionStorage.setItem("listUserFilterValues", JSON.stringify(this.dt1.filteredValue));
  }
  onPagination(e:any){
    console.log(e);
    sessionStorage.setItem("returnRequestPage", JSON.stringify(e));
  }
  onSort(e:any){
    console.log(e);
    sessionStorage.setItem("returnRequestSort", JSON.stringify(e));
  }

  getFilters(){
    const filters = JSON.parse(sessionStorage.getItem("returnRequestFilters"));
    
    const sort:any = JSON.parse(sessionStorage.getItem("returnRequestSort"));
    const page:any = JSON.parse(sessionStorage.getItem("returnRequestPage"));
    if (filters) {
      if(filters.startDate[0].value){
        filters.startDate[0].value = new Date(filters.startDate[0].value);
      }
      if(filters.requested_date[0].value){
        filters.requested_date[0].value = new Date(filters.requested_date[0].value);
      }
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

}
