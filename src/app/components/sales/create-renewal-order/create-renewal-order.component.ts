import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';

declare const $ :any;
declare const bolt :any;
declare const jQuery:any;


export interface TableData {
  data: any;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-create-renewal-order',
  templateUrl: './create-renewal-order.component.html',
  styleUrls: ['./create-renewal-order.component.scss']
})
export class CreateRenewalOrderComponent implements OnInit {

  tableData: TableData[] = [];
  allChecked:boolean = false;
  checked:boolean = false;
  customerDetails={};
  public closeResult: string;
  public products=[];
  public orders = [];
  public renewForm: FormGroup;
  uid;
  city=1;
  expiryDate:Date;
  subTotal:number=0;
  renewTotal:number=0;
  ordersArr=[];
  productsArr=[];
  currentOrderId=[];
  totalPenalty:number=0;
  overdue:number=0; //boolean
  errorStatus=0;
  displayReturn=false;
  model2;
  returnDate:string;
  currentDate = new Date();
  popupOrder;
  displayOrder=false;
  noCheck=0;
  gst:number=18;
  taxInfo:string;
  pro=[];
  prodAll=[];
  allCheck:boolean = false;
  dp=0;
  txnId;
  daysCondition=1;
  url;
  customers;
  dropdownSettings:IDropdownSettings = {};

  transactionNo;
  paymentTypes;
  paymentStatus:string;
  Description:string;
  paymentType:string;
  transactionDate:Date;
  currDate=new Date();
  orderValidated:boolean=true;

  constructor(private router: Router,private http: HttpClient,private os:OrdersService,private modalService: NgbModal) {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'customer_id',
      textField: 'mobile',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
   }

  ngOnInit(): void {
    this.getAllCustomers();
    this.transactionId();
    this.http.get(` http://localhost:3000/orders/getAllPaymenttypes`).subscribe((res) => {
      this.paymentTypes=res;
    });
  }

  getAllCustomers(){
    this.http.get('http://localhost:3000/users').subscribe((users)=>{
      this.customers=users
    })
  }

  onItemSelect(e){
    this.uid = e.customer_id;
    let filterCustomer = this.customers.filter(item=>item.customer_id ==this.uid)
    this.customerDetails = filterCustomer[0];
    this.getOrders(this.uid);
    this.modalService.dismissAll();
  }

  // Fetches orders Details
  getOrders(uid){
    this.uid=uid;
    let successOrders=[];
    let allOrders=[];
    let productsOverdue=[];
    let allProducts=[];
    this.os.getRenewalsByCustomerId(uid).subscribe((orders)=>{
      allOrders=orders;
      successOrders=allOrders.filter((successOrdersRes)=>{
        // if(successOrders.overdue==1){
        //   this.overdue=1;
        // }
       return successOrdersRes.paymentStatus!='8' && successOrdersRes.orderType_id==1 || successOrdersRes.orderType_id==3;
      });
      this.orders=successOrders.reverse();

      for(let o=0;o<this.orders.length;o++){
        for(let p=0;p<this.orders[o].renewals_timline.length;p++){
          this.products.push(this.orders[o].renewals_timline[p]);
          allProducts.push(this.orders[o].renewals_timline[p]);
        }
      }
      // (dateDiffInMonths(p.nextStartDate, currentDate)<=2 && p.ordered!=1 && p.renewed!=4 && p.replacement!=2)&&(p.renewed==0 || p.renewed==-1 || p.renewed==2)
      this.products = this.products.filter(item=>(this.dateDiffInDays(item.startDate)>=0 && this.dateDiffInMonths(item.nextStartDate, this.currentDate)<=2 && item.ordered!=1 && item.renewed!=4 && item.replacement!=2)&&(item.renewed==0 || item.renewed==-1 || item.renewed==2));
      this.loadTableData(this.products);
      this.updateStatus();
      for(let o=0;o<allProducts.length;o++){
        if(allProducts[o].ordered!=1){
          productsOverdue.push(allProducts[o].overdew);
          // productsOverdue.push(allProducts[op].overdue);
        }          
      }

      if(productsOverdue.includes(1)){
        this.overdue=1;
      } else{
        this.overdue=0;
      }

      this.generateOrder();
      // this.overdue();
      // this.orders=orders.reverse();
    }, error => {
      // console.log(error);
    });      
  }

  //New code for checkbox
  loadTableData(td: any) {
    td.forEach((d: any) => {
      this.tableData.push({ data: d, isSelected: false, isDisabled: false });
    });
  }

  updateStatus() {
    let hasZeroStatus = false;
    let allOneStatuSelected = false;
    let oneStatusCount = 0;
    let selectedOneStatusCount = 0;

    this.tableData.forEach(d => {
      if (d.data.overdew === 1) {
        oneStatusCount += 1;

        if (d.isSelected) {
          selectedOneStatusCount += 1;
        }
      }
    });

    if (this.tableData.length !== oneStatusCount) {
      hasZeroStatus = true;
    }

    allOneStatuSelected = oneStatusCount === selectedOneStatusCount;

    if (hasZeroStatus) {
      if (allOneStatuSelected) {
        this.tableData
          .filter(td => td.data.overdew === 0 && !td.isSelected)
          .forEach(td => {
            td.isDisabled = false;
            td.isSelected = false;
          });
      } else {
        this.tableData
          .filter(td => td.data.overdew === 0)
          .forEach(td => {
            td.isDisabled = true;
            td.isSelected = false;
          });
      }
    }
  }

  checkItem(e: any, record: TableData) {
    const isChecked = e.target.checked;
    this.productsArr=[];
    this.tableData.find(d => d === record).isSelected = isChecked;
    
    this.updateStatus();
    this.subTotal = this.getSubTotal();
    this.renewTotal = (this.subTotal)+((this.subTotal) * (this.gst)/100);
    this.allChecked = !this.isAllItemsChecked();
    let td=this.tableData.filter(d => d.isSelected === true);
    td.forEach((res)=>{
      this.productsArr.push(res.data);
    });
  }

  isAllItemsChecked(): boolean {
    return this.tableData.some(td => !td.isSelected);
  }

  getSubTotal() {
    let sum = 0;
    this.tableData
      .filter(td => td.isSelected)
      .forEach(td => (sum += parseInt(td.data.price)+parseInt(td.data.dp)));
    return sum;
  }

  checkAllItems(e: any) {
    this.subTotal = 0;
    this.renewTotal=0;
    if (e.target.checked) {
      this.tableData.forEach(d => {
        d.isSelected = true;
        d.isDisabled = false;
        // this.subTotal += d.data.price;
        this.productsArr.push(d.data);
        this.subTotal +=parseInt(d.data.price)+parseInt(d.data.dp);
        this.renewTotal = (this.subTotal)+((this.subTotal) * (this.gst)/100);
      });
      this.allChecked = true;
    } else {
      this.tableData.forEach(d => {
        d.isSelected = false;
        if (d.data.overdew === 0) {
          d.isDisabled = true;
        }
        const productIndex = this.productsArr.indexOf(d.data);
        if (productIndex > -1) {
          this.productsArr.splice(productIndex, 1);
        }
      });
      this.allChecked = false;
    }
    this.updateStatus();
  }

  // End of new code
  generateOrder(){
      
    let products;
    let AllProductsOf=[];
    this.orders.forEach((res)=>{
      products=res.renewals_timline;    
      for(let p=0;p<products.length;p++){
        let ucid={ 
          indexs:products[p].indexs,
          id: products[p].id,
          prod_name:products[p].prod_name,
          prod_price:products[p].prod_price,
          prod_img:products[p].prod_img,
          delvdate: products[p].delvdate,
          actualStartDate:products[p].actualStartDate,
          qty: products[p].qty, 
          price: products[p].price, 
          tenure: products[p].tenure,
          primaryOrderNo:products[p].primaryOrderNo, 
          currentOrderNo: products[p].currentOrderNo,
          renewed:products[p].renewed,
          startDate:products[p].startDate,
          expiryDate:products[p].expiryDate,
          nextStartDate:products[p].nextStartDate,
          overdew:products[p].overdew,
          ordered:products[p].ordered,
          assetId:products[p].assetId,
          deliveryStatus:'renewed',
          dp:products[p].dp,
          deliveryAssigned:products[p].deliveryAssigned,
          replacement:products[p].replacement,
          returnDate:products[p].returnDate,
          billPeriod:products[p].billPeriod,
          billAmount:products[p].billAmount,
          damageCharges:products[p].damageCharges,
          order_item_id:products[p].order_item_id,
          p2Rent:products[p].p2Rent,
          securityDepositDiff:products[p].securityDepositDiff,
          returnedProduct: products[p].returnedProduct,
          tenureBasePrice:products[p].tenureBasePrice,
          tenure_id:products[p].tenure_id
        }
        AllProductsOf.push(ucid);
      }  
    });

    for(let i=0;i<AllProductsOf.length;i++){
      this.prodAll.push(AllProductsOf[i]);
      if((this.dateDiffInMonths(AllProductsOf[i].expiryDate, this.currentDate)<=2 && AllProductsOf[i].ordered!=1 && AllProductsOf[i].renewed!=4)&&(AllProductsOf[i].renewed==0 || AllProductsOf[i].renewed==-1 || AllProductsOf[i].renewed==2)){            
        this.pro.push(AllProductsOf[i]);
      }
    }
  }



  

  expiryDates(d){
    let dateParts = d.split("/");

		// month is 0-based, that's why we need dataParts[1] - 1
		let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
		let dd= dateObject.getDate();
		let mm=dateObject.getMonth();
		let yy=dateObject.getFullYear();

    // let db = mm+'/'+dd+'/'+yy;

    // let deliveredDate = new Date(db);
    let Days=new Date(yy, mm+2, 0).getDate();

    if(Days<dd){
      this.expiryDate  = new Date(yy, mm+1, Days);
		}else{					
				this.expiryDate = new Date(yy, mm+1, dd-1);
		}
		
    return this.expiryDate.toLocaleDateString('pt-PT');
    // deliveredDate.setDate(deliveredDate.getDate()); 
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

  returnDueDate(d){
    let dateParts = d.split("/");
    
		// month is 0-based, that's why we need dataParts[1] - 1
		let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
		let dd= dateObject.getDate();
		let mm=dateObject.getMonth();
		let yy=dateObject.getFullYear();

    let db = mm+'/'+dd+'/'+yy;

    let dueDate = new Date(yy, mm, dd);
    dueDate.setDate(dueDate.getDate() + 5);
    if(this.currentDate>dueDate){
      return true;
    }else{
      return false;
    }
  }

  dateDiffInDays(a) {
    let dateParts = a.split("/");

              // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
    let dd= dateObject.getDate();
    let mm=dateObject.getMonth();
    let yy=dateObject.getFullYear();
    let db = mm+1+'/'+dd+'/'+yy;
    let expiryDate= new Date(db);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    const utc2 = Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
  // console.log(Math.floor((utc2 - utc1) / _MS_PER_DAY));
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  dateDiffInMonths(a, b) {
    let days=0;
    let dateParts = a.split("/");

		// month is 0-based, that's why we need dataParts[1] - 1
		let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);	
		let dd= dateObject.getDate();
		let mm=dateObject.getMonth();
		let yy=dateObject.getFullYear();

    let db = mm+1+'/'+dd+'/'+yy;
    let expiryDate= new Date(db);
    const expMonth=expiryDate.getMonth();
    const curMonth=b.getMonth();
    days = expMonth - curMonth + (12 * (expiryDate.getFullYear() - b.getFullYear()));
    return days;
  }

  renewalsTotal(e, products, coi, dp){
    let daysInDifference=0;
    let orders;
    let damageProtection=JSON.parse(dp);
    
    if(e.target.checked){
      
      // if(damageProtection>0){
      //   this.dp=parseInt(e.target.value)*(8)/100;
      // } else{
      //   this.dp=0;
      // }
      // this.subTotal +=parseInt(e.target.value)+this.dp;
      // this.renewTotal = (this.subTotal)+((this.subTotal) * (this.gst)/100);
      this.ordersArr.push(orders);
      // this.productsArr.push(products);
      this.currentOrderId.push(coi);
      
      // this.productsArr.forEach((res)=>{
      //   daysInDifference=this.penalty(res.expiryDate);
      //   if(daysInDifference==-2){
      //     this.renewTotal +=200;
      //   }
      // });
    } else {
      // if(damageProtection>0){
      //   this.dp=parseInt(e.target.value)*(8)/100;
      // } else{
      //   this.dp=0;
      // }
      this.allCheck=false;
      const orderIndex = this.ordersArr.indexOf(orders);
      // const productIndex = this.productsArr.indexOf(products);
      const currentOrderIndex = this.currentOrderId.indexOf(coi);
      if (orderIndex > -1) {
        this.ordersArr.splice(orderIndex, 1);
      }
      if (currentOrderIndex > -1) {
        this.currentOrderId.splice(currentOrderIndex, 1);
      }
    }
  }

  getDate(){    
    var day = this.model2.day;
    var month = this.model2.month;
    var year = this.model2.year;
    this.returnDate= day + '/' + month + '/' + year;
    // console.log(this.deliveryDate);
  }


  transactionId() {
    const subCity = 'BLR';
    const rand = Math.floor((Math.random() * 9999) + 1);
    const dte = new Date();
    const txnid = ""+subCity + rand +
    dte.getDay()+
    (dte.getMonth()+1) +
    dte.getFullYear();
    // dte.getHours() +
    // dte.getMinutes() +
    // dte.getSeconds();
    this.txnId=txnid;
  }

  renew(){
    let allOrders = this.orders;
    let allProducts = [];
    let productsOverdue = [];
    let checkedProducts=[];
    let filteredProducts;
    let cON;
    let order_item_id;
    let dew=0;
    let billAddressId;
    let shipAddressId;
    let addrFields=[];
    let allDelvAddress;
    let shippingAddress;

    if(this.transactionNo && this.paymentType && this.paymentStatus && this.Description && this.transactionDate){
      this.os.getUserDetailsByUid(this.uid).subscribe((dta) => {
        if(dta[0]) {
          addrFields.push(dta);
          allDelvAddress = addrFields;
          shippingAddress = allDelvAddress[0].filter(item=>item.default_address==1);
          billAddressId = shippingAddress[0].address_id;
          shipAddressId =shippingAddress[0].address_id;     
        
        this.currentOrderId =  this.currentOrderId.filter (function (value, index, array) { 
          return array.indexOf (value) == index;
        });
        
        for(let op=0;op<this.products.length;op++){
          // if(allProducts[op].ordered!=1){
            productsOverdue.push(this.products[op].overdew);
            // productsOverdue.push(allProducts[op].overdue);
          // }
          
        }
      

        if(productsOverdue.includes(1)){
          this.overdue=1;
        } else{
          this.overdue=0;
        }
      
        for(let r=0;r<this.productsArr.length;r++){
          checkedProducts.push(this.productsArr[r].overdew);
        }
        if(checkedProducts.includes(1)){
          dew=1;      
        }
        if(this.overdue==1 && dew==0){
          this.errorStatus=1;
        }else if((this.overdue==1 && dew==1) || (this.overdue==0 && dew==0) ){
          this.errorStatus=0;
          const productsId=[];
          let toBeRenewed=[];
          this.productsArr.forEach((res)=>{
            productsId.push(res.id);
          }); 

          for(let i =0 ;i<this.productsArr.length;i++){
            let productExpiryDate = this.productsArr[i].expiryDate;
            let daysInDiff=this.dateDiffInDays(productExpiryDate);
            if(daysInDiff<=0 && this.productsArr[i].overdew!=1){ //for multiple rows overdue of same product
              cON=this.productsArr[i].currentOrderNo;
              order_item_id = this.productsArr[i].order_item_id;
              filteredProducts=this.prodAll.filter(item => item.order_item_id == order_item_id);
              this.productsArr[i].ordered=0;   
              this.productsArr[i].overdew=0; 
              this.productsArr[i].renewed=4;   
              this.productsArr[i].currentOrderNo=this.txnId;  
              toBeRenewed.push(this.productsArr[i]);
            } else{ //if overdue code
              cON=this.productsArr[i].currentOrderNo;
              order_item_id = this.productsArr[i].order_item_id;
              // this.productsArr[i].renewed=4;
              filteredProducts=this.prodAll.filter(item => item.order_item_id == order_item_id);
              this.productsArr[i].overdew=0;
              this.productsArr[i].renewed=4; 
              this.productsArr[i].currentOrderNo=this.txnId;  
              toBeRenewed.push(this.productsArr[i]);          
            }
            filteredProducts.forEach((indexFilter)=>{
              for(let pi=0;pi<this.productsArr.length;pi++){
                if(indexFilter.indexs===this.productsArr[pi].indexs){
                  if(this.dateDiffInDays(indexFilter.startDate)<0){
                    indexFilter.renewed=1;
                  }else{
                    indexFilter.renewed=4;
                  }
                  indexFilter.overdew=0;
                  // indexFilter.ordered=1;
                  indexFilter.currentOrderNo=cON;
                }
              }
            });
            let productsToUpdate={
              checkoutProductsInfo:  JSON.stringify(filteredProducts),
              txnid: order_item_id
            }
            this.os.updateNewRenewProducts(productsToUpdate).subscribe();
          }
          
          let  products={
            uid: this.uid,
            primaryID:cON,
            orderID: this.txnId,
            subTotal: this.renewTotal,
            damageProtection:this.dp,
            total:this.renewTotal,
            securityDeposit: 0,
            grandTotal: this.renewTotal,
            discount: 0,
            firstName: dta[0].firstName,
            lastName:dta[0].lastName,
            mobile: dta[0].mobile,
            email: dta[0].email, 
            billingAddress:billAddressId,
            shippingAddress:shipAddressId,
            orderType:2,
            orderStatus:'Initiated',
            deliveryStatus:4,
            refundStatus:'Paid',
            createdBy:1,
            modifiedBy:1,
            createdAt: new Date(),
            modifiedAt:new Date(),
            products:JSON.stringify(toBeRenewed)
          };   
          let transaction = {
            transactionNo:this.transactionNo,
            orderId:this.txnId,
            orderAmount:this.renewTotal,
            paymentMode:this.paymentType,
            txMsg:this.Description,
            tDate:this.transactionDate,
            paymentStatus:this.paymentStatus
          };
          this.os.newRenewProducts(products).subscribe((resp1)=>{
            this.http.post(`http://localhost:3000/payments/postManualRenewalOrderTransaction`,transaction).subscribe((resp2)=>{
              alert('Renewal Order created successfully');
              this.router.navigate(['/sales/renewal-order']);
            });
          });
          
          }
        }
        this.orderValidated=true;
      });      
    } else{
      this.orderValidated=false;
    }
  }

  open(modal,p, tenureId) {
    this.modalService.open(modal,{ windowClass: 'my-address'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
  

}
