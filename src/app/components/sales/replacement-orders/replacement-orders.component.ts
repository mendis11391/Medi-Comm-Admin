import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ProductService } from '../../products/services/product.service';
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { HttpClient} from '@angular/common/http';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-replacement-orders',
  templateUrl: './replacement-orders.component.html',
  styleUrls: ['./replacement-orders.component.scss']
})
export class ReplacementOrdersComponent implements OnInit {
  public order :Orders[] = [];
  public productsList;
  public filteredProducts=[];
  orderId: string;
  fullOrderDetails;
  productDetails;
  modalReference;
  replaceProduct;
  prodId:string;
  damageCharges:number=0;
  txnId;
  assets;
  assetId;
  p1Obj={};
  billStartDate = new Date();
  @ViewChild('productList') productList;
  @ViewChild('billingPeriod') billingPeriod;

  constructor(calendar: NgbCalendar,private ps:ProductService,private route: ActivatedRoute, private router:Router, private http: HttpClient,private os:OrdersService, private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.getAssets();
    this.loadProducts(); 
    this. getOrderById(this.orderId);
    this.transactionId();
  }

  getOrderById(ordId){
    this.http.get(`${environment.apiUrl}/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData.filter(item =>item.replacement==1 && item.ordered==1);
    });
  }

  openProductsList(){
    this.modalReference=this.modalService.open(this.productList, { windowClass : "product-list"});
  }

  openBillingPeriod(){
    this.modalReference=this.modalService.open(this.billingPeriod, { windowClass : "billing-period"});
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

  // filterByPrice(price){
  //   this.filteredProducts = this.filteredProducts.filter(item=>item.prod_price>=price)
  // }

  selectProduct(prodId,p1SecurityDeposit){
    this.filteredProducts = this.filteredProducts.filter(item=>item.prod_price>=p1SecurityDeposit)
    this.replaceProduct=this.filteredProducts;
    this.replaceProduct=this.replaceProduct.filter(item=>item.prod_id==prodId);
  }  

  getBillingRent(){

  }

  getAssets(){
    this.os.getAllassets().subscribe((assets)=>{
      this.assets=assets.filter(item => item.availability==true);
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
    

    this.http.get(`${environment.apiUrl}/assets/${p1AssetId}`).subscribe((assetRes) => { //for startdate & expirydate of that asset#

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
        id: filterP1[0].prod_id,
        prod_name:filterP1[0].prod_name,
        prod_price:filterP1[0].prod_price,
        prod_img:filterP1[0].prod_img,
        delvdate: filterP1[0].delvDate,
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
        renewed:filterP1[0].renewed,
        startDate:assetRes[0].startDate,
        expiryDate:assetRes[0].expiryDate,
        nextStartDate:assetRes[0].nextStartDate,
        overdew:filterP1[0].overdew,
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
        amount: totalAmount,
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
      

      this.http.post(`${environment.apiUrl}/payments/replace`,  replaceOrder).subscribe((res) => {
        this.http.get(`${environment.apiUrl}/products/ordDetails/${txnid}`).subscribe((resOrd) => {
          let cid = resOrd[0].checkoutItemData;
          cid.forEach(element => {
            if(element.indexs===filterP1[0].indexs){              
              element.replacement=2;
              element.billPeriod=filterP1[0].startDate+'-'+deliverDate;
              element.renewed=3;
              element.returnDate=deliverDate;
            }
          });     
          this.http.put(`${environment.apiUrl}/orders/updateCID/${txnid}`, {checkoutProducts:JSON.stringify(cid)}).subscribe();  
        });
        this.http.put(`${environment.apiUrl}/assets/update/${p1AssetId}`, {availability:1, startDate:'',expiryDate:'',nextStartDate:''}).subscribe();
        this.http.put(`${environment.apiUrl}/assets/update/${this.assetId}`, {availability:0, startDate:assetRes[0].startDate,expiryDate:assetRes[0].expiryDate,nextStartDate:assetRes[0].nextStartDate}).subscribe();
      });
    });

    
    
  }

}
