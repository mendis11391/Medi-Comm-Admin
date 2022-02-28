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
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {

  public order :Orders[] = [];
  public assets: Assets[]=[];
  public temp = [];
  @ViewChild('content') content;
  @ViewChild('orderDetails') orderDetails;
  @ViewChild('editOrder') editOrder;
  orderId;
  updateStatus: FormGroup;
  deliveryDateStatus: FormGroup;
  assetAssign:FormGroup;
  modalReference;
  fullOrderDetails;
  productDetails;
  public filteredOrders=[];

  //renewals var
  subTotal:number=0;
  renewTotal:number=0;
  ordersArr=[];
  productsArr=[];
  currentOrderId=[];
  dp=0;
  gst:number=0;
  taxInfo:string;
  currentDate=new Date();
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    this.temp=this.order;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.txnid.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredOrders = temp;
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
      this.order=orders.filter(item => item.status=='SUCCESS');
      this.filteredOrders=this.order;
    });
  }



  filterOrders(e){
    if(e=='All orders'){
      this.filteredOrders=this.order.filter(item => item.status=='SUCCESS');
    } else if(e=='Primary order'){
      this.filteredOrders=this.order.filter(item => item.order_type=='Primary order');
    } else if(e=='Renewal order'){
      this.filteredOrders=this.order.filter(item => item.order_type=='Renewal order');
    } else if(e=='Replacement order'){
      this.filteredOrders=this.order.filter(item => item.order_type=='Replacement order');
    } else if(e=='Return order'){
      this.filteredOrders=this.order.filter(item => item.order_type=='Return order');
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
    this.http.get(` http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.updateStatus.patchValue({
        deliveryStatus: res[0].delivery_status,
        refundStatus: res[0].refund_status
      });
    });
  }

  updateDeliveryStatus(id){
    this.http.put(` http://localhost:3000/orders/update/${id}`, this.updateStatus.value).subscribe((res) => {
      console.log(res);
      this.modalReference.close();
    });
  }

  


  getOrderById(ordId){
    this.modalReference=this.modalService.open(this.orderDetails, { windowClass : "order-details"});
    this.http.get(` http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData;
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
    this.http.put(` http://localhost:3000/orders/updateDelivery/${OrderId}`, {ordProducts:JSON.stringify(getAllProduct),checkoutProducts:JSON.stringify(forQtyProduct)}).subscribe((res) => {
      console.log(res);
      this.http.put(` http://localhost:3000/assets/update/${assetId}`, {availability:0}).subscribe();
      this.modalReference.close();
      // this.assetAssign.reset();
      window.location.reload();
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

  editOrderById(ordId){
    this.modalReference=this.modalService.open(this.editOrder, { windowClass : "edit-order"});
    this.http.get(` http://localhost:3000/products/ordDetails/${ordId}`).subscribe((res) => {
      this.fullOrderDetails=res;
      this.productDetails=res[0].checkoutItemData;
      this.http.get(' http://localhost:3000/cities').subscribe((resCity:any)=>{
      if (resCity) {
        const a = resCity.filter((city) => {
          if (city.cityname === res[0].city) {
            return city;
          }
        });
        this.gst = parseFloat(a[0].taxes);
      }
    });
    });
  }


  //Renewal code
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

  renewalsTotal(e, orders, products, coi, dp){
    let daysInDifference=0;
    let damageProtection=JSON.parse(dp);
    
    if(e.target.checked){
      
      if(damageProtection>0){
        this.dp=parseInt(e.target.value)*(8)/100;
      } else{
        this.dp=0;
      }
      this.subTotal +=parseInt(e.target.value)+this.dp;
      this.renewTotal = (this.subTotal)+((this.subTotal) * (this.gst)/100);
      this.ordersArr.push(orders);
      this.productsArr.push(products);
      this.currentOrderId.push(coi);
    } else {
      if(damageProtection>0){
        this.dp=parseInt(e.target.value)*(8)/100;
      } else{
        this.dp=0;
      }
      const orderIndex = this.ordersArr.indexOf(orders);
      const productIndex = this.productsArr.indexOf(products);
      const currentOrderIndex = this.currentOrderId.indexOf(coi);
      if (orderIndex > -1) {
        this.ordersArr.splice(orderIndex, 1);
      }
      if (productIndex > -1) {
        this.productsArr.splice(productIndex, 1);
      }
      if (currentOrderIndex > -1) {
        this.currentOrderId.splice(currentOrderIndex, 1);
      }
      // this.renewTotal -= parseInt(e.target.value);     
      this.subTotal -=parseInt(e.target.value)+this.dp;

      this.renewTotal = this.subTotal+(this.subTotal * (this.gst)/100); 
    }
  }

  // renew(){
  //   let allOrders = this.fullOrderDetails;
  //   let allProducts = [];
  //   let filteredProducts;
  //   let cON;
  //   this.currentOrderId =  this.currentOrderId.filter (function (value, index, array) { 
  //     return array.indexOf (value) == index;
  //   });
    
  //   for(let o=0;o<allOrders.length;o++){
  //     for(let p=0;p<allOrders[o].checkoutItemData.length;p++){
  //       allProducts.push(allOrders[o].checkoutItemData[p]);
  //     }
  //   }
  //     const productsId=[];
  //     let toBeRenewed=[];
  //     this.productsArr.forEach((res)=>{
  //       productsId.push(res.id);
  //     }); 
  //     const subCity = 'admin';
  //     const rand = Math.floor((Math.random() * 9999) + 1);
  //     const dte = new Date();
  //     const txnid = ""+subCity + rand +
  //     dte.getDay()+
  //     (dte.getMonth()+1) +
  //     dte.getFullYear() +
  //     dte.getHours() +
  //     dte.getMinutes() +
  //     dte.getSeconds();

  //     for(let i =0 ;i<this.productsArr.length;i++){
  //       let productExpiryDate = this.productsArr[i].expiryDate;
  //       let daysInDiff=this.dateDiffInDays(productExpiryDate);
  //       if(daysInDiff<=0 && this.productsArr[i].overdew!=1){ //for multiple rows overdue of same product
  //         cON=this.productsArr[i].currentOrderNo;
  //         filteredProducts=this.prodAll.filter(item => item.currentOrderNo == cON);
  //         this.productsArr[i].ordered=0;   
  //         this.productsArr[i].overdew=0; 
  //         this.productsArr[i].renewed=4;   
  //         this.productsArr[i].currentOrderNo=txnid;  
  //         toBeRenewed.push(this.productsArr[i]);
  //       } else{ //if overdue code
  //         cON=this.productsArr[i].currentOrderNo;
  //         filteredProducts=this.prodAll.filter(item => item.currentOrderNo == cON);
  //         this.productsArr[i].overdew=0;
  //         this.productsArr[i].renewed=4; 
  //         this.productsArr[i].currentOrderNo=txnid;  
  //         toBeRenewed.push(this.productsArr[i]);          
  //       }
  //       filteredProducts.forEach((indexFilter)=>{
  //         for(let pi=0;pi<this.productsArr.length;pi++){
  //           if(indexFilter.indexs===this.productsArr[pi].indexs){
  //             if(this.dateDiffInDays(indexFilter.startDate)<0){
  //               indexFilter.renewed=1;
  //             }else{
  //               indexFilter.renewed=4;
  //             }
  //             indexFilter.overdew=0;
  //             // indexFilter.ordered=1;
  //             indexFilter.currentOrderNo=cON;
  //           }
  //         }
  //       });
  //       let productsToUpdate={
  //         checkoutProductsInfo:  JSON.stringify(filteredProducts),
  //         txnid: cON,
  //       }
  //       // console.log(productsToUpdate);
  //       this.us.updateRenewProducts(productsToUpdate).subscribe();
  //     }
      
      

  //     let  products={
  //       uid: localStorage.getItem('uid'),
  //       txnid: txnid,
  //       amount: this.renewTotal,
  //       securityDeposit: 0,
  //       damageProtection:this.dp,
  //       checkoutProductsInfo:  JSON.stringify(toBeRenewed),
  //       pinfo: JSON.stringify(productsId),
  //       fname: this.ordersArr[0].fname,
  //       mobile: this.ordersArr[0].mobile,
  //       email: this.ordersArr[0].email,
  //       delvAddress:this.ordersArr[0].delivery_address,
  //       address: this.ordersArr[0].address,
  //       town: this.ordersArr[0].city,
  //       state: this.ordersArr[0].state,
  //       pincode: this.ordersArr[0].pincode
  //     }   
  //     this.us.renewProducts(products).subscribe((res)=>{
  //     window.location.reload();
        
  //     });
    
    

    
    
  //   // this.calcHash();
  // }
  //End of renewal code

}
