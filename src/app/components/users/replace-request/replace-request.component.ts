import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { ProductService } from '../../products/services/product.service';
import { ActivatedRoute, Router} from '@angular/router';
import { ExcelService } from '../../sales/services/excel.service';
import { environment } from 'src/environments/environment';
import {DropdownFilterOptions} from 'primeng/dropdown';

@Component({
  selector: 'app-replace-request',
  templateUrl: './replace-request.component.html',
  styleUrls: ['./replace-request.component.scss']
})
export class ReplaceRequestComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public temp = [];
  toggleReplaceDetails:boolean;
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('returnRequest') returnRequest;
  @ViewChild('replacementRequest') replacementRequest;
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
  refundStatus:string = 'Refund initiated';
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
  matchedProducts2=[];
  filterValue = '';
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private route: ActivatedRoute, private router:Router,private excelService:ExcelService,private http: HttpClient,private ps:ProductService,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
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
    this.getAssets();
    // this.loadProducts();
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
    this.http.get(`${environment.apiUrl}/admin/getCustomerRequests`).subscribe((res) => {
      let a=[];
      a.push(res);
      this.orderitem =a[0];
      this.orderitem = this.orderitem.reverse();
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
    this.ps.getProductsBycityId(1).subscribe(res => {
      console.log(res);
      this.productsList = res;
      this.filteredProducts=this.productsList.filter(item=>item.prod_status==1 && item.prod_qty>0);
      let data2;
      let data = new Promise((resolve, reject)=>{
        this.filteredProducts.forEach((prodsRes)=>{
         data2 = new Promise((resolve2, reject)=>{
           this.http.get(`${environment.apiUrl}/products/tenures/${prodsRes.priority}`).subscribe((res)=>{
             let tenureMatched=res[0].filter(psItem => psItem.tenure_id==this.p1Tenure);
             if(tenureMatched.length>0){
               prodsRes.matchedTenurePrice = prodsRes.tenure_base_price-(prodsRes.tenure_base_price*tenureMatched[0].discount/100);
               this.matchedProducts2.push(prodsRes);
               console.log(this.matchedProducts2);
               resolve2('success');
               resolve('success');
             }
           });
         });
   
        });
       });
       Promise.all([data, data2]).then(values => {
         this.matchedProducts2 = this.matchedProducts2.filter(itemMP=>itemMP.matchedTenurePrice>=this.productDetails.tenure_price);
         
       });
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



  getAssets(){
    this.os.getAllassets().subscribe((assets)=>{
      this.assets=assets.filter(item => item.availability==true);
    });
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
    this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    // this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
    //   this.fullOrderDetails=res;
    //   this.productDetails=res[0].checkoutItemData;
    // });
  }

  transactionId() {
    const subCity = 'BLRR';
    const rand = Math.floor((Math.random() * 999) + 1);
    const dte = new Date();
    const txnid = ""+subCity +
    dte.getDate().toString().padStart(2, "0")+
    (dte.getMonth()+1).toString().padStart(2, "0") +
    dte.getFullYear().toString().substr(2,2) + rand;
    this.txnId=txnid;
  }

  returnProductOrderById(ordId,oiid,requestedProduct,assetId){
    let orderItem;
    this.modalReference=this.modalService.open(this.returnRequest, { windowClass : "return-request"});  
    this.productDetails= requestedProduct
    this.toBeRefunded=(this.productDetails.prod_price-0)-(this.returnDamageCharges+this.earlyReturnCharges);
    this.http.get(`${environment.apiUrl}/orders/orderId/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      orderItem = res[0].orderItem.filter(item=>item.order_item_id == oiid);
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
    var day = this.model.day;
    var month = this.model.month;
    var year = this.model.year;
    this.returnDate= day + '/' + month + '/' + year;

    let productToReturn = this.productDetails;

    let ucid={      
        indexs:productToReturn.indexs,
        id: productToReturn.id,
        prod_name:productToReturn.prod_name,
        prod_price:productToReturn.prod_price,
        prod_img:productToReturn.prod_img,
        delvdate: productToReturn.delvDate,
        qty: 1, 
        price: productToReturn.price, 
        tenure: productToReturn.tenure,
        primaryOrderNo:productToReturn.primaryOrderNo, 
        currentOrderNo: this.currentOrderId,
        renewed:3,
        startDate:productToReturn.startDate,
        expiryDate:productToReturn.expiryDate,
        nextStartDate:productToReturn.nextStartDate,
        overdew:productToReturn.overdew,
        ordered:1,
        assetId:productToReturn.assetId,
        deliveryStatus:productToReturn.deliveryStatus,
        deliveryAssigned:productToReturn.deliveryAssigned,
        dp:productToReturn.dp,
        replacement:productToReturn.replacement,
        returnDate:this.returnDate,
        billPeriod:productToReturn.startDate+'-'+this.returnDate,
        billAmount:0,
        p1Rent:0,
        damageCharges:this.returnDamageCharges,
        earlyReturnCharges:this.earlyReturnCharges,
        order_item_id:productToReturn.order_item_id,
        tenure_id:productToReturn.tenureBasePrice,
        tenureBasePrice:productToReturn.tenureBasePrice
    };    
    
    let cInfo=[];
    let pInfo=[];
    cInfo.push(ucid);
    let charges=0;
    let returnGrandTotal=0;
    charges = (this.productDetails.prod_price-0)-(this.returnDamageCharges+this.earlyReturnCharges);
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
      securityDeposit: 0,
      grandTotal: returnGrandTotal,
      discount: 0,
      firstName: this.fullOrderDetails[0].firstName,
      lastName:this.fullOrderDetails[0].lastName,
      mobile: this.fullOrderDetails[0].mobile,
      email: this.fullOrderDetails[0].email, 
      billingAddress:this.fullOrderDetails[0].billingAddress,
      shippingAddress:this.fullOrderDetails[0].shippingAddress,
      orderType:4,
      orderStatus:1,
      deliveryStatus:6,
      refundStatus:'To be Paid',
      createdBy:1,
      modifiedBy:1,
      createdAt: new Date(),
      modifiedAt:new Date(),
      products:JSON.stringify(cInfo)
    }; 

    let returnOrderItem={
      status:0,
      damageCharges:this.returnDamageCharges
    };

    let customerRequest={
      approvalStatus:1,
      requestStatus:0
    };

    this.http.post(`${environment.apiUrl}/payments/newReturn`,  returnOrder).subscribe((res) => {
      this.http.put(`${environment.apiUrl}/orders/updateOrderItemStatus/${this.currentOrderItemId}`,returnOrderItem).subscribe();
      this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${this.currentOrderItemId}`,customerRequest).subscribe();
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
      this.http.put(`${environment.apiUrl}/assets/update/${this.currentAssetId}`, {availability:1, startDate:0,expiryDate:0,nextStartDate:0}).subscribe();
      this.modalReference.close();
    });
  }

  returnReject(txnid, p1Indexs){
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

  selectProduct(prodId,p1SecurityDeposit,  p1Tenure, p1AssetId){
    let p2TenureArr;
    // let p2TenurePrice=0;
    // let p2DP=0;
    let p1RentBalance;
    let p2RentAmount;
    let currDate = new Date(this.billStartDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    let deliverDate =day + '/' + month + '/' + year;
    let tenures;
    this.filteredProducts = this.filteredProducts.filter(item=>item.securityDeposit>=p1SecurityDeposit)
    this.replaceProduct=this.filteredProducts;
    this.replaceProduct=this.replaceProduct.filter(item=>item.product_id==prodId);
    // let filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    this.securityDepositDiff = this.replaceProduct[0].securityDeposit-p1SecurityDeposit;
    
      this.http.get(`${environment.apiUrl}/assets/${p1AssetId}`).subscribe((assetRes) => {
        // p2TenureArr=this.replaceProduct[0].tenure_base_price;
        

        this.http.get(`${environment.apiUrl}/products/tenures/${this.replaceProduct[0].priority}`).subscribe((res)=>{
          p2TenureArr = res[0];
          for(let i=0;i<p2TenureArr.length;i++){
            if(p2TenureArr[i].tenure_id==p1Tenure){
              this.p2Tenure=p2TenureArr[i].tenure+' '+p2TenureArr[i].tenure_period;
              this.p2TenurePrice = this.replaceProduct[0].tenure_base_price-(this.replaceProduct[0].tenure_base_price*p2TenureArr[i].discount/100);
            }
          }
          if(this.productDetails.damage_protection>0){
            this.p2DP=this.p2TenurePrice*(8/100);
            } else{
            this.p2DP=0;
          }
          p1RentBalance = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, currDate,this.productDetails.end_date,this.productDetails.tenure_price, this.productDetails.damage_protection);
          p2RentAmount = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, currDate,this.productDetails.end_date,this.p2TenurePrice, this.p2DP);
          this.rentDifference = p2RentAmount-p1RentBalance;
        });

        // for(let i=0;i<p2TenureArr.length;i++){//this loop is for rent/mo of that specific month from p1
        //   if(p2TenureArr[i][0]==p1Tenure){
        //    this.p2TenurePrice=p2TenureArr[i][1];
        //    this.p2Tenure=p1Tenure;
        //   }
        // }

        
      });    
  }  
  

  resetFormData(){
    this.prodId='';
    this.assetId='';
  }

  replaceProductOrderById(ordId,oiid,requestedProduct, tenure_id, assetId){
    this.loadProducts();
    // this.modalReference=this.modalService.open(this.replacementRequest, { windowClass : "replacement-request"});   
    // this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
    //   this.fullOrderDetails=res;
    //   this.productDetails=res[0].checkoutItemData.filter(item =>item.replacement==1 && item.indexs===indexs);
    // }); 
    // this.currentOrderId=ordId;
    // this.currentAssetId=assetId;
    // this.currentIndexs=indexs;

    let orderItem;
    requestedProduct.tenure_id=tenure_id;
    this.productDetails=requestedProduct;
    // this.modalReference=this.modalService.open(this.returnRequest, { windowClass : "return-request"});   
    this.http.get(`${environment.apiUrl}/orders/orderId/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      orderItem = res[0].orderItem.filter(item=>item.order_item_id == oiid);
      
      // this.productDetails=orderItem[0].renewals_timline.slice(-1).pop();
      this.p1Tenure =tenure_id;
    this.currentIndexs=this.productDetails.indexs;
    }); 
    this.currentOrderItemId = oiid;
    this.currentOrderId=ordId;
    this.currentAssetId=assetId;
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
    // let p1SDate = this.dateConfig(p1startDate);
    // let p1EDate = this.dateConfig(p1EndDate);
    // let actualSDate = this.dateConfig(actualStartDate);
    // let actualEDate = this.dateConfig(actualEndDate);
    let p1SDate = p1startDate;
    let p1EDate = p1EndDate;
    let actualSDate = actualStartDate;
    let actualEDate = actualEndDate;
    let daysDiffForCD = this.dateDiffInDays(new Date(actualSDate),new Date(actualEDate)) +1;
    let daysDiffForED = this.dateDiffInDays(new Date(p1SDate),new Date(p1EDate)) +1;
    let rentDP = parseInt(p1Rent)+parseInt(p1DP);
    let p1Amount = (rentDP);
    let p1BillAmount = this.calcPriceInDays(p1Amount, daysDiffForED, daysDiffForCD);
    return Math.round(p1BillAmount);
  }

  replace(oiid,p1, p1Indexs,p1Tenure, p1DP,p1AssetId, p2, damageCharges){
    // let filterP1;
    let filterP2;
    let p2TenureArr;
    let p2TenurePrice;
    let p1Ten=p1Tenure+'';
    let currDate = new Date(this.billStartDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    // let deliverDate =day + '/' + month + '/' + year;
    let deliverDate =currDate;
    let expiryDate;
    let totalAmount;
    let dp;
    let p1RentAmount=0;
    let p2RentAmount=0;
    let p1RentBalance=0;
    let p2DP=0;
    // filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    filterP2 = this.productsList.filter(item => item.product_id==p2.product_id);
    console.log(filterP2);
    let securityDepositDiff = filterP2[0].securityDeposit-this.productDetails.security_deposit;
    
    // let log={orderID:txnid, request:'Replacement', adminResponse:'Replaced', replacedProdId:filterP1[0].id, replacedWith:filterP2[0].id}

    this.http.get(`${environment.apiUrl}/assets/${p1AssetId}`).subscribe((assetRes) => { //for startdate & expirydate of that asset#

      // p2TenureArr=filterP2[0].prod_tenure;
      // for(let i=0;i<p2TenureArr.length;i++){//this loop is for rent/mo of that specific month from p1
      //   if(p2TenureArr[i][0]===p1Ten){
      //     p2TenurePrice=p2TenureArr[i][1];
      //   }
      // }

      this.http.get(`${environment.apiUrl}/products/tenures/${this.replaceProduct[0].priority}`).subscribe((res)=>{
          p2TenureArr = res[0];
          for(let i=0;i<p2TenureArr.length;i++){
            if(p2TenureArr[i].tenure_id==p1Tenure){
              this.tenure_id = p2TenureArr[i].tenure_id;
              this.p2Tenure=p2TenureArr[i].tenure+' '+p2TenureArr[i].tenure_period;
              p2TenurePrice = this.replaceProduct[0].tenure_base_price-(this.replaceProduct[0].tenure_base_price*p2TenureArr[i].discount/100);
              console.log(p2TenurePrice);
            }
          }          
      });

      if(this.p2TenurePrice){
        if(this.productDetails.damage_protection>0){
          p2DP=this.p2TenurePrice*(8/100);
          } else{
          p2DP=0;
        }
  
        p1RentAmount=this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, this.productDetails.start_date, deliverDate, this.productDetails.tenure_price, this.productDetails.damage_protection);
        p1RentBalance = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, deliverDate,this.productDetails.end_date,this.productDetails.tenure_price, this.productDetails.damage_protection);
        p2RentAmount = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, deliverDate,this.productDetails.end_date,this.p2TenurePrice, p2DP);
        totalAmount=parseInt(filterP2[0].securityDeposit)+this.p2TenurePrice+p2DP;
  
        let returnedProduct={      
          // indexs:this.productDetails.indexs,
          order_item_id:oiid,
          id: this.productDetails.id,
          prod_name:this.productDetails.prod_name,
          prod_price:this.productDetails.security_deposit,
          // prod_img:this.productDetails.prod_img,
          // delvdate: this.productDetails.delvdate,
          // actualStartDate:this.productDetails.actualStartDate,
          qty: 1, 
          price: this.productDetails.tenure_price, 
          tenure: this.productDetails.tenure_period,
          primaryOrderNo:this.productDetails.primaryOrderNo, 
          currentOrderNo: this.txnId,
          // renewed:this.productDetails.renewed,
          startDate:this.oldDateFormat(this.productDetails.start_date),
          expiryDate:this.oldDateFormat(this.productDetails.end_date),
          // nextStartDate:this.productDetails.nextStartDate,
          // overdew:this.productDetails.overdew,
          // ordered:1,
          assetId:this.productDetails.asset_id,
          // deliveryStatus:this.productDetails.deliveryStatus,
          // deliveryAssigned:this.productDetails.deliveryAssigned,
          dp:this.productDetails.damage_protection,
          // replacement:this.productDetails.replacement,
          returnDate:this.oldDateFormat(deliverDate),
          billPeriod:this.oldDateFormat(this.productDetails.start_date)+'-'+this.oldDateFormat(deliverDate),
          billAmount:p1RentAmount,
          p1Rent:p1RentBalance,
          damageCharges:damageCharges,
        }; 
  
        console.log(returnedProduct);
        
        let ucid={      
          indexs:Math.floor((Math.random() * 9999) + 1),
          id: filterP2[0].id,
          prod_name:filterP2[0].prod_name,
          prod_price:filterP2[0].securityDeposit,
          prod_img:filterP2[0].prod_img,
          tenureBasePrice:filterP2[0].tenure_base_price,
          tenure_id:p1Tenure,
          delvdate: deliverDate,
          qty: 1, 
          price: this.p2TenurePrice, 
          tenure: this.productDetails.tenure_period,
          primaryOrderNo:this.productDetails.primaryOrderNo, 
          currentOrderNo: this.txnId,
          renewed:1,
          startDate:this.oldDateFormat(this.productDetails.start_date),
          expiryDate:this.oldDateFormat(this.productDetails.end_date),
          // nextStartDate:this.productDetails.nextStartDate,
          overdew:0,
          ordered:1,
          assetId:this.assetId,
          // deliveryStatus:this.productDetails.deliveryStatus,
          // deliveryAssigned:this.productDetails.deliveryAssigned,
          dp:p2DP,
          replacement:0,
          returnDate:'',
          billPeriod:this.oldDateFormat(deliverDate)+'-'+this.oldDateFormat(this.productDetails.end_date),
          actualSubscription:this.oldDateFormat(this.productDetails.start_date)+'-'+this.oldDateFormat(this.productDetails.end_date),
          billAmount:p2RentAmount,
          p2Rent:p2RentAmount,
          p1RentBalance:p1RentBalance,
          securityDepositDiff:securityDepositDiff,
          damageCharges:damageCharges,
          replaceId:Math.floor((Math.random() * 99999) + 1),
          returnedProduct:returnedProduct
        };    
        
        let cInfo=[];
        let pInfo=[];
        cInfo.push(ucid);
        // pInfo.push(filterP2[0].prod_id);
        let replaceOrder = {
          uid: this.fullOrderDetails[0].customer_id,
          primaryID: this.fullOrderDetails[0].primary_id,
          orderID: this.txnId,
          subTotal: (this.rentDifference)+this.damageCharges+this.totalTaxAmount((this.rentDifference)+this.damageCharges),
          damageProtection:p2DP,
          total:(this.rentDifference)+this.damageCharges+this.totalTaxAmount((this.rentDifference)+this.damageCharges)+p2DP,
          securityDeposit: filterP2[0].securityDeposit,
          grandTotal: (this.rentDifference)+this.damageCharges+this.totalTaxAmount((this.rentDifference)+this.damageCharges)+this.securityDepositDiff,
          discount: 0,
          firstName: this.fullOrderDetails[0].firstName,
          lastName:this.fullOrderDetails[0].lastName,
          mobile: this.fullOrderDetails[0].mobile,
          email: this.fullOrderDetails[0].email, 
          billingAddress:this.fullOrderDetails[0].billingAddress[0].address_id,
          shippingAddress:this.fullOrderDetails[0].shippingAddress[0].address_id,
          orderType:3,
          orderStatus:4,
          deliveryStatus:2,
          paymentStatus:this.replacePaymentStatus,
          refundStatus:this.replacePaymentStatus,
          createdBy:1,
          modifiedBy:1,
          createdAt: new Date(),
          modifiedAt:new Date(),
          products:JSON.stringify(cInfo)        
        };  
        this.http.post(`${environment.apiUrl}/payments/newReplace`,  replaceOrder).subscribe((res) => {
          let customerRequest={
            approvalStatus:1,
            requestStatus:0
          };
          this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${this.currentOrderItemId}`,customerRequest).subscribe();
          // this.http.get(`${environment.apiUrl}/orders/orderItemsByorderId/${this.currentOrderItemId}`).subscribe((resOrd) => {
          //   let cid = resOrd[0].renewals_timline;
          //   cid.forEach(element => {
          //     if(element.assetId===this.productDetails.assetId){              
          //       element.replacement=2;
          //     }
          //     if(element.indexs===this.productDetails.indexs){              
          //       element.replacement=2;
          //       element.billPeriod=this.productDetails.startDate+'-'+deliverDate;
          //       element.renewed=3;
          //       element.returnDate=deliverDate;
          //       this.http.put(`${environment.apiUrl}/orders/updateRenewalTimeline/${parseInt(this.productDetails.order_item_id)}`, {assetId:this.productDetails.assetId,renewalTimeline:JSON.stringify(cid), status:0}).subscribe();
          //       let customerRequest={
          //         approvalStatus:1,
          //         requestStatus:0
          //       };
          //       this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${this.currentOrderItemId}`,customerRequest).subscribe();
          //     }

          //   });     
            
              
          // });
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
        // this.http.post(`${environment.apiUrl}/backendActivity/createActivity`, activity).subscribe();
          // this.http.put(`${environment.apiUrl}/assets/update/${p1AssetId}`, {availability:1, startDate:'',expiryDate:'',nextStartDate:''}).subscribe();
          // this.http.put(`${environment.apiUrl}/assets/update/${this.assetId}`, {availability:0, startDate:assetRes[0].startDate,expiryDate:assetRes[0].EndDate,nextStartDate:assetRes[0].nextStartDate}).subscribe();
        });

        this.http.post(`${environment.apiUrl}/forgotpassword/notifyMailReplaceOrder`, {email:this.fullOrderDetails[0].email,returnedProduct:this.productDetails.prod_name, replacedProduct:filterP2[0].prod_name, p1AssetId:this.productDetails.assetId, p2assetId:this.assetId, orderNo:this.txnId, orderValue: replaceOrder.grandTotal, billPeriod: ucid.billPeriod, subscription: ucid.actualSubscription}).subscribe();
        // this.modalReference.close();
        this.toggleReplaceDetails=!this.toggleReplaceDetails;
      }

    });

    
    
  }


  oldDateFormat(myDate){
    let currDate = new Date(myDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    let convertedDate =day + '/' + month + '/' + year;
    return convertedDate;
  }

  reject(order_item_id){
    this.toggleReplaceDetails=!this.toggleReplaceDetails;
    let orderItem={approvalStatus:0, requestStatus:'0'}
    this.http.put(`${environment.apiUrl}/users/updatecustomerRequests/${this.currentOrderItemId}`,orderItem).subscribe((resOrd) => {
      // this.modalReference.close();
      // window.location.reload();
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.order, 'Orders');
  }

  calcModifiedPrice(p1Tenure,p1SecurityDeposit, p2TenurePrice, p2SD){
    console.log(p1SecurityDeposit);
    let p2TenureArr;
    // let p2TenurePrice=0;
    // let p2DP=0;
    let p1RentBalance;
    let p2RentAmount;
    let currDate = new Date(this.billStartDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    let deliverDate =day + '/' + month + '/' + year;
    let tenures;
    this.securityDepositDiff = p2SD-p1SecurityDeposit;
    if(this.productDetails.damage_protection>0){
      this.p2DP=this.p2TenurePrice*(8/100);
      } else{
      this.p2DP=0;
    }
    p1RentBalance = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, currDate,this.productDetails.end_date,this.productDetails.tenure_price, this.productDetails.damage_protection);
    p2RentAmount = this.calcDiffPrice(this.productDetails.start_date,this.productDetails.end_date, currDate,this.productDetails.end_date,p2TenurePrice, this.p2DP);
    this.rentDifference = p2RentAmount-p1RentBalance;  
  }

  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
}

}
