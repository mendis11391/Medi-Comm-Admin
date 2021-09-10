import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { ProductService } from '../../products/services/product.service';
import { ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.scss']
})
export class UserRequestsComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('returnRequest') returnRequest;
  @ViewChild('replacementRequest') replacementRequest;
  orderId;
  updateStatus: FormGroup;
  deliveryDateStatus: FormGroup;
  assetAssign:FormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  returnDate;
  currentOrderId;
  currentAssetId;
  currentIndexs;
  txnId;
  replaceProduct;
  p2Tenure=0;
  p2TenurePrice=0;
  p2DP=0;
  billStartDate = new Date();
  returnDamageCharges:number=0;
  damageCharges:number=0;
  refundStatus:string = 'Refund initiated';
  assetId;
  prodId;
  securityDepositDiff=0;
  rentDifference=0;
  billPeriod;
  public productsList;
  public filteredProducts=[];
  public filteredOrders=[];
  orderitem=[];
  model: NgbDateStruct;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private route: ActivatedRoute, private router:Router,private excelService:ExcelService,private http: HttpClient,private ps:ProductService,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
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
    this.http.get(`http://localhost:3000/users/getCustomerRequests`).subscribe((res) => {
      this.orderitem.push(res[0]);
      this.orderitem =this.orderitem.filter(item=>item.request_status==1)
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
      this.filteredProducts=this.productsList;
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


  


  getOrderById(ordId){
    this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    this.http.get(`http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData;
    });
  }

  transactionId() {
    const subCity = 'Ban';
    const rand = Math.floor((Math.random() * 9999) + 1);
    const dte = new Date();
    const txnid = ""+subCity + rand +
    dte.getDay()+
    (dte.getMonth()+1) +
    dte.getFullYear() +
    dte.getHours() +
    dte.getMinutes() +
    dte.getSeconds();
    this.txnId=txnid;
  }

  returnProductOrderById(ordId,assetId, indexs){
    this.modalReference=this.modalService.open(this.returnRequest, { windowClass : "return-request"});   
    this.http.get(`http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData.filter(item =>item.renewed==2 && item.indexs===indexs);
    }); 
    this.currentOrderId=ordId;
    this.currentAssetId=assetId;
    this.currentIndexs=indexs;
  }

  returnProduct(){
    var day = this.model.day;
    var month = this.model.month;
    var year = this.model.year;
    this.returnDate= day + '/' + month + '/' + year;

    let productToReturn = this.productDetails.filter(item=>item.indexs===this.currentIndexs);

    let ucid={      
        indexs:productToReturn[0].indexs,
        id: productToReturn[0].prod_id,
        prod_name:productToReturn[0].prod_name,
        prod_price:productToReturn[0].prod_price,
        prod_img:productToReturn[0].prod_img,
        delvdate: productToReturn[0].delvDate,
        qty: 1, 
        price: productToReturn[0].price, 
        tenure: productToReturn[0].tenure,
        primaryOrderNo:productToReturn[0].primaryOrderNo, 
        currentOrderNo: this.currentOrderId,
        renewed:3,
        startDate:productToReturn[0].startDate,
        expiryDate:productToReturn[0].expiryDate,
        nextStartDate:productToReturn[0].nextStartDate,
        overdew:productToReturn[0].overdew,
        ordered:1,
        assetId:productToReturn[0].assetId,
        deliveryStatus:productToReturn[0].deliveryStatus,
        deliveryAssigned:productToReturn[0].deliveryAssigned,
        dp:productToReturn[0].dp,
        replacement:productToReturn[0].replacement,
        returnDate:this.returnDate,
        billPeriod:productToReturn[0].startDate+'-'+this.returnDate,
        billAmount:0,
        p1Rent:0,
        damageCharges:this.returnDamageCharges,
    };    
    
    let cInfo=[];
    let pInfo=[];
    cInfo.push(ucid);
    // pInfo.push(productToReturn[0].prod_id);

    let returnOrder={
      uid: this.fullOrderDetails[0].userId,
      txnid: this.txnId,
      amount: 0,
      securityDeposit: productToReturn[0].prod_price,
      checkoutProductsInfo: cInfo,
      pinfo: pInfo,
      fname: this.fullOrderDetails[0].fname,
      mobile: this.fullOrderDetails[0].mobile,
      email: this.fullOrderDetails[0].email,
      delvAddress:this.fullOrderDetails[0].delivery_address,
      address: this.fullOrderDetails[0].address,
      town: this.fullOrderDetails[0].city,
      state: this.fullOrderDetails[0].state,
      pincode: this.fullOrderDetails[0].pincode,
      selfPickup: false,
      damageProtection:0,
      refund_status:this.refundStatus
    }; 

    this.http.post(`http://localhost:3000/payments/return`,  returnOrder).subscribe((res) => {
      this.http.get(`http://localhost:3000/products/ordDetails/${this.currentOrderId}`).subscribe((resOrd) => {
        let cid = resOrd[0].checkoutItemData;
        cid.forEach(element => {
          if(element.assetId===this.currentAssetId){ 
            element.renewed=3;
            element.returnDate=this.returnDate;
          }
        });     
        this.http.put(`http://localhost:3000/orders/updateCID/${this.currentOrderId}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
      });
      this.http.put(`http://localhost:3000/assets/update/${this.currentAssetId}`, {availability:1, startDate:'',expiryDate:'',nextStartDate:''}).subscribe();
      this.modalReference.close();
    });
  }

  returnReject(txnid, p1Indexs){
    let filterP1;
    filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    this.http.get(`http://localhost:3000/products/ordDetails/${txnid}`).subscribe((resOrd) => {
      let cid = resOrd[0].checkoutItemData;
      cid.forEach(element => {
        if(element.indexs===filterP1[0].indexs){              
          element.replacement=0;
          element.returnDate='';
          element.renewed=1;
        }
      });     
      this.http.put(`http://localhost:3000/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
    });
  }

  //Replacement codes
  getBillPeriod(a){
    this.billPeriod=a;
  }

  selectProduct(prodId,p1SecurityDeposit, p1Indexs, p1Tenure, p1AssetId){
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
    this.filteredProducts = this.filteredProducts.filter(item=>item.prod_price>=p1SecurityDeposit)
    this.replaceProduct=this.filteredProducts;
    this.replaceProduct=this.replaceProduct.filter(item=>item.prod_id==prodId);
    let filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    this.securityDepositDiff = this.replaceProduct[0].prod_price-p1SecurityDeposit;

    
      this.http.get(`http://localhost:3000/assets/${p1AssetId}`).subscribe((assetRes) => {
        p2TenureArr=this.replaceProduct[0].prod_tenure;
        for(let i=0;i<p2TenureArr.length;i++){//this loop is for rent/mo of that specific month from p1
          if(p2TenureArr[i][0]==p1Tenure){
           this.p2TenurePrice=p2TenureArr[i][1];
           this.p2Tenure=p2TenureArr[i][0];
          }
        }

        if(filterP1[0].dp>0){
          this.p2DP=this.p2TenurePrice*(8/100);
          } else{
          this.p2DP=0;
        }
        p1RentBalance = this.calcDiffPrice(assetRes[0].startDate,assetRes[0].expiryDate, deliverDate,assetRes[0].expiryDate,filterP1[0].price, filterP1[0].dp);
        p2RentAmount = this.calcDiffPrice(assetRes[0].startDate,assetRes[0].expiryDate, deliverDate,assetRes[0].expiryDate,this.p2TenurePrice, this.p2DP);
        this.rentDifference = p2RentAmount-p1RentBalance;
      });    
  }  

  resetFormData(){
    this.prodId='';
    this.assetId='';
  }

  replaceProductOrderById(ordId,assetId, indexs){
    this.modalReference=this.modalService.open(this.replacementRequest, { windowClass : "replacement-request"});   
    this.http.get(`http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData.filter(item =>item.replacement==1 && item.indexs===indexs);
    }); 
    this.currentOrderId=ordId;
    this.currentAssetId=assetId;
    this.currentIndexs=indexs;
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

  replace(txnid,p1, p1Indexs,p1Tenure, p1DP,p1AssetId, p2, damageCharges){
    let filterP1;
    let filterP2;
    let p2TenureArr;
    let p2TenurePrice;
    let p1Ten=p1Tenure+'';
    let currDate = new Date(this.billStartDate);
    let day = currDate.getDate();
    let month = currDate.getMonth()+1;
    let year = currDate.getFullYear();
    let deliverDate =day + '/' + month + '/' + year;
    let expiryDate;
    let totalAmount;
    let dp;
    let p1RentAmount=0;
    let p2RentAmount=0;
    let p1RentBalance=0;
    let p2DP=0;
    filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    filterP2 = this.productsList.filter(item => item.prod_id===p2);
    let securityDepositDiff = filterP2[0].prod_price-filterP1[0].prod_price;
    
    let log={orderID:txnid, request:'Replacement', adminResponse:'Replaced', replacedProdId:filterP1[0].id, replacedWith:filterP2[0].id}

    this.http.get(`http://localhost:3000/assets/${p1AssetId}`).subscribe((assetRes) => { //for startdate & expirydate of that asset#

      p2TenureArr=filterP2[0].prod_tenure;
      for(let i=0;i<p2TenureArr.length;i++){//this loop is for rent/mo of that specific month from p1
        if(p2TenureArr[i][0]===p1Ten){
          p2TenurePrice=p2TenureArr[i][1];
        }
      }

      if(filterP1[0].dp>0){
        p2DP=p2TenurePrice*(8/100);
        } else{
        p2DP=0;
      }

      p1RentAmount=this.calcDiffPrice(assetRes[0].startDate,assetRes[0].expiryDate, assetRes[0].startDate, deliverDate, filterP1[0].price, filterP1[0].dp);
      p1RentBalance = this.calcDiffPrice(assetRes[0].startDate,assetRes[0].expiryDate, deliverDate,assetRes[0].expiryDate,filterP1[0].price, filterP1[0].dp);
      p2RentAmount = this.calcDiffPrice(assetRes[0].startDate,assetRes[0].expiryDate, deliverDate,assetRes[0].expiryDate,p2TenurePrice, p2DP);
      totalAmount=parseInt(filterP2[0].prod_price)+parseInt(p2TenurePrice)+p2DP;

      let returnedProduct={      
        indexs:filterP1[0].indexs,
        id: filterP1[0].id,
        prod_name:filterP1[0].prod_name,
        prod_price:filterP1[0].prod_price,
        prod_img:filterP1[0].prod_img,
        delvdate: filterP1[0].delvdate,
        actualStartDate:filterP1[0].actualStartDate,
        qty: 1, 
        price: filterP1[0].price, 
        tenure: filterP1[0].tenure,
        primaryOrderNo:filterP1[0].primaryOrderNo, 
        currentOrderNo: this.txnId,
        renewed:filterP1[0].renewed,
        startDate:filterP1[0].startDate,
        expiryDate:filterP1[0].expiryDate,
        nextStartDate:filterP1[0].nextStartDate,
        overdew:filterP1[0].overdew,
        ordered:1,
        assetId:filterP1[0].assetId,
        deliveryStatus:filterP1[0].deliveryStatus,
        deliveryAssigned:filterP1[0].deliveryAssigned,
        dp:filterP1[0].dp,
        replacement:filterP1[0].replacement,
        returnDate:deliverDate,
        billPeriod:assetRes[0].startDate+'-'+deliverDate,
        billAmount:p1RentAmount,
        p1Rent:p1RentBalance,
        damageCharges:damageCharges,
      }; 

      console.log(returnedProduct);
      
      let ucid={      
        indexs:Math.floor((Math.random() * 9999) + 1),
        id: filterP2[0].prod_id,
        prod_name:filterP2[0].prod_name,
        prod_price:filterP2[0].prod_price,
        prod_img:filterP2[0].prod_img,
        delvdate: deliverDate,
        qty: 1, 
        price: p2TenurePrice, 
        tenure: filterP1[0].tenure,
        primaryOrderNo:filterP1[0].primaryOrderNo, 
        currentOrderNo: this.txnId,
        renewed:1,
        startDate:assetRes[0].startDate,
        expiryDate:assetRes[0].expiryDate,
        nextStartDate:assetRes[0].nextStartDate,
        overdew:0,
        ordered:1,
        assetId:this.assetId,
        deliveryStatus:filterP1[0].deliveryStatus,
        deliveryAssigned:filterP1[0].deliveryAssigned,
        dp:p2DP,
        replacement:0,
        returnDate:'',
        billPeriod:deliverDate+'-'+assetRes[0].expiryDate,
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
      pInfo.push(filterP2[0].prod_id);
      let replaceOrder = {
        uid: this.fullOrderDetails[0].userId,
        txnid: this.txnId,
        amount: (this.rentDifference)+this.damageCharges+this.totalTaxAmount((this.rentDifference)+this.damageCharges)+this.securityDepositDiff,
        securityDeposit: filterP2[0].prod_price,
        checkoutProductsInfo: cInfo,
        pinfo: pInfo,
        fname: this.fullOrderDetails[0].fname,
        mobile: this.fullOrderDetails[0].mobile,
        email: this.fullOrderDetails[0].email,
        delvAddress:this.fullOrderDetails[0].delivery_address,
        address: this.fullOrderDetails[0].address,
        town: this.fullOrderDetails[0].city,
        state: this.fullOrderDetails[0].state,
        pincode: this.fullOrderDetails[0].pincode,
        selfPickup: false,
        damageProtection:p2DP
      };  
      

      this.http.post(`http://localhost:3000/payments/replace`,  replaceOrder).subscribe((res) => {
        this.http.get(`http://localhost:3000/products/ordDetails/${txnid}`).subscribe((resOrd) => {
          let cid = resOrd[0].checkoutItemData;
          cid.forEach(element => {
            if(element.assetId===filterP1[0].assetId){              
              element.replacement=2;
            }
            if(element.indexs===filterP1[0].indexs){              
              element.replacement=2;
              element.billPeriod=filterP1[0].startDate+'-'+deliverDate;
              element.renewed=3;
              element.returnDate=deliverDate;
            }
          });     
          this.http.put(`http://localhost:3000/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
        });
        const userId = localStorage.getItem('user_id');
        const uname = localStorage.getItem('uname');
        const uid = uname.substring(0, 3);
        const rand = Math.floor((Math.random() * 9999) + 1);
        const activityId = ""+uid + rand;
        let activity={
          activityId:activityId,
          userId:userId,
          activityLog:JSON.stringify(log),
        }
      this.http.post(`http://localhost:3000/backendActivity/createActivity`, activity).subscribe();
        this.http.put(`http://localhost:3000/assets/update/${p1AssetId}`, {availability:1, startDate:'',expiryDate:'',nextStartDate:''}).subscribe();
        this.http.put(`http://localhost:3000/assets/update/${this.assetId}`, {availability:0, startDate:assetRes[0].startDate,expiryDate:assetRes[0].expiryDate,nextStartDate:assetRes[0].nextStartDate}).subscribe();
      });
      this.modalReference.close();
    });

    
    
  }

  reject(txnid, p1Indexs){
    let filterP1;
    let log={orderID:txnid, request:'Replacement', adminResponse:'Rejected'}
    filterP1=this.productDetails.filter(item => item.indexs===p1Indexs);
    this.http.get(`http://localhost:3000/products/ordDetails/${txnid}`).subscribe((resOrd) => {
      let cid = resOrd[0].checkoutItemData;
      cid.forEach(element => {
        if(element.indexs===filterP1[0].indexs){              
          element.replacement=0;
          element.returnDate='';
          element.renewed=1;
        }
      });     

      const userId = localStorage.getItem('user_id');
      const uname = localStorage.getItem('uname');
      const uid = uname.substring(0, 3);
      const rand = Math.floor((Math.random() * 9999) + 1);
      const activityId = ""+uid + rand;
      let activity={
        activityId:activityId,
        userId:userId,
        activityLog:JSON.stringify(log),
      }
      this.http.post(`http://localhost:3000/backendActivity/createActivity`, activity).subscribe();
      this.http.put(`http://localhost:3000/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
    });
    this.modalReference.close();
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

}
