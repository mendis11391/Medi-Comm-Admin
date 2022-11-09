import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../products/services/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { KYC } from 'src/app/shared/data/kyc';
import { ExcelService } from '../../sales/services/excel.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  kycDetails:KYC;
  NoKYC:boolean;
  customerLogs:Customers;
  public customers :Customers[] = [];
  public temp = [];
  public filteredCustomers:Customers[]=[];
  public orders=[];
  product;
  public orderItems=[];
  public products;
  public address=[];
  public defaultAddress=[];
  public cartDetails=[];
  public cartProducts:any;
  editCustomer:boolean;
  dropdownSettings:IDropdownSettings = {};
  customerId;
  modalReference;
  selectedItems;
  firstName:string;
  lastName:string;
  email:string;
  fname:boolean;
  lname:boolean;
  eemail:boolean;

  displayName:boolean;
  nickName:boolean;
  firstNameAddress:boolean;
  address1:boolean;
  address2:boolean;
  landmark:boolean;
  city:boolean;
  pincode:boolean;
  mobile:boolean;
  eemail2:boolean;

  tenuresOfProduct;
  tenures:string;
  tenureId=0;
  tenure_price=0;
  tenure_period:string;
  security_deposit=0;
  productTenure;
  productTenureBasePrice=0;
  currentProduct;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('addressModal') addressModal;
  @ViewChild('prodModal') prodModal;
  @ViewChild('commentModal') commentModal;
  @ViewChild('tenure') tenure;
  Notes:any;
  datasource: Orders[];
  loading: boolean;
  totalRecords: number;
  selectedOrders: Orders[];
  cols: any[];
  exportColumns: any[];
  comment:string='';
  
  constructor(private excelService:ExcelService,private ps:ProductService,private route: ActivatedRoute,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    // this.order = orderDB.list_order;
  }

  updateFilter(event) {
    this.temp=this.customers;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.customer_id.toLowerCase().indexOf(val) !== -1 || d.delivery_status.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredCustomers = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {    
    this.customerId=this.route.snapshot.params['id'];
    this.getCustomers(this.customerId);
    this.getAllOrders(this.customerId);
    this.getAllAddresses(this.customerId);
    this.getCustomerCartDetails(this.customerId);
    this.getAllNotesByCustomerId(this.customerId);
    this.getProductBycityId(1);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'prod_id',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.getKycByCustomerId(this.customerId);
    this.getCustomerLogs(this.customerId);
  }

  getDate(date){
    let dateParts = date.split("/");

        // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1]-1, +dateParts[0]);
    return dateObject;
  }

  getCustomerLogs(id){
    this.os.getAllCustomerLogsById(id).subscribe((logs)=>{
      this.customerLogs = logs;
    });
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

  getCustomers(id){
    this.os.getAllCustomersByid(id).subscribe((customers)=>{
      this.customers=customers;
      this.filteredCustomers=this.customers;
    });
  }

  updateCustomer(uid, value, fieldName){
    let CustomerObj={
      value:value,
      fieldName:fieldName
    };
    this.os.updateCustomersDetails(uid,CustomerObj).subscribe((resp)=>{
      alert('customer details updated successfully');
      this.editCustomer=!this.editCustomer;
      this.getCustomers(uid);
      this.fname=false;
      this.lname=false;
      this.eemail=false;
    });
  }

  updateCustomerAddressFeild(addresssId, value, fieldName){
    let AddressObj={
      value:value,
      fieldName:fieldName
    };
    this.os.updateCustomerAddressFeild(addresssId,AddressObj).subscribe((resp)=>{
      alert('Address feild updated successfully');      
    });
  }

  getAllOrders(id){
    let products;
    let filteredProducts;
    let AllProductsOf=[];
    
    this.os.getAllOrdersByCustomerId(id).subscribe((orders)=>{
      this.orders = orders.filter(item=>item.paymentStatus=='Success' || item.orderType_id==3 || item.orderType_id==4 );
      this.orders.forEach((res)=>{
        if(res.orderType_id==1 || res.orderType_id==3 ){
          filteredProducts = res.orderItem;
          for(let k=0;k<filteredProducts.length;k++){
            AllProductsOf.push(filteredProducts[k]);
          }
          this.products =AllProductsOf;
          this.orderItems = this.products.filter(item=>item.status==1);
          this.orderItems.forEach(
            item => (item.startDate = new Date(item.startDate))
          );
        }
        
      });
    });
  }

  getCustomerCartDetails(id){
    this.ps.getCartByCustomerId(id).subscribe((cartRes)=>{
      console.log(cartRes);
      this.cartDetails = cartRes[0].products;
    })
  }

  getAllNotesByCustomerId(id){
    this.http.get(`${environment.apiUrl}/admin/getNotesByCustomerId/${id}`).subscribe((res)=>{
      this.Notes = res;
      this.Notes.forEach(
        item => (item.createdAt = new Date(item.createdAt))
      );
      this.cols = [
        { field: "order_id", header: "Order Id" },
        { field: "firstName", header: "First name" },
        { field: "notes", header: "Notes" },
        { field: "created_at", header: "Created at" },
      ];

      
      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));

      this.datasource = this.Notes;
      this.totalRecords = this.Notes.length;
    })
  }

  postNotes(){
    let sendObj = {
      comment:this.comment,
      uid: sessionStorage.getItem('user_id'),
      frontUid:this.customerId,
      orderId:0,
      orderType:0,
    };
    if(this.comment.replace(/ /g,'')){
      this.http.post(`${environment.apiUrl}/admin/insertNotes`,sendObj).subscribe((res)=>{
        this.getAllNotesByCustomerId(this.customerId);
        this.comment='';
        alert('Added note successfully');
      });
    }
    
  }



  getProductBycityId(id){
    this.ps.getAllProductsByCityId(id).subscribe((productRes)=>{
      this.cartProducts=productRes;
    })
  }


  editProduct(id){
    var state;
    const cartItem = state.cart.find(item => item.id === id);
    console.log(cartItem);
  }

  onItemSelect(e){
    let productTenure;
    let currDate= new Date();
    let product = this.cartProducts.filter(item=>item.id==e.id);
    product=product[0];
    this.product = product;
    this.ps.getProductPriority(this.product.priority).subscribe((res)=>{
      productTenure=res[0];
      // this.tenuresOfProduct=[];
      for(let i=0;i<productTenure.length;i++){
        if(productTenure[i].default_tenure==1){
          productTenure[i].isSelected=1;
          let tenures = productTenure[i].tenure+' '+ productTenure[i].tenure_period;
          let tenure_period = productTenure[i].tenure_period;
          let tenure_price = this.calcTenures(productTenure[i].discount);
          product.quantity =  1;
          product.tenure_id = productTenure[i].id;
          product.tenures=tenures;
          product.tenure_price=Math.round(tenure_price);
          product.tenure_period = tenure_period;
          product.delivery_date=currDate.setDate(currDate.getDate() + product.delivery_timeline);
          console.log(product);
          this.addToCart(product);
        }
      }
    });
  }

  onItemDeSelect(e){
    console.log(e);
  }

  calcTenures(discount){
    let tenurePrice=this.product.tenure_base_price;
    let discountPrice = tenurePrice*discount/100;
    let tenureDiscountPrice=tenurePrice-discountPrice;
    return tenureDiscountPrice;
  }

  public addToCart(product): any {
    const cartItem = this.cartDetails.find(item => item.id === product.id);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;

    const tenures= product.tenures;
    const tenure_price=product.tenure_price;
    

    if (cartItem) {
        cartItem.quantity += qty;
        cartItem.tenures = tenures;  
        cartItem.tenure_price = tenure_price;  
    } else {
      this.cartDetails.push({
        ...product,
        quantity: qty,
        tenures:tenures,
        tenure_price:tenure_price
      })
    }
    
    const allAddedProducts = JSON.stringify(this.cartDetails);
    console.log(allAddedProducts);
    this.http.put(`${environment.apiUrl}/users/cart/${this.customerId}`, { cart: allAddedProducts }).subscribe((res) => {
      // console.log(res);
    });
  }

  // Remove Cart items
  public removeCartItem(product): any {
    const index = this.cartDetails.indexOf(product);
    this.cartDetails.splice(index, 1);
    const allAddedProducts = JSON.stringify(this.cartDetails);
    const uid = this.customerId;
    this.http.put(`${environment.apiUrl}/users/cart/${uid}`, { cart: allAddedProducts }).subscribe((res) => {
      // console.log(res);
    });
    return true;
  }

  // Update Cart Quantity
  public updateCartQuantity(product, quantity: number) {
    const allAddedProducts = JSON.stringify(this.cartDetails);
    const uid = this.customerId;
    this.http.put(`${environment.apiUrl}/users/cart/${uid}`, { cart: allAddedProducts }).subscribe((res) => {
      // console.log(res);
    });
  }

  // Update Cart Quantity
  public updateCartTenurePrice(product) {
    const allAddedProducts = JSON.stringify(this.cartDetails);
    const uid = this.customerId;
    this.http.put(`${environment.apiUrl}/users/cart/${uid}`, { cart: allAddedProducts }).subscribe((res) => {
      // console.log(res);
    });
  }

  

  getAllAddresses(id){
    this.os.getAllAddressByCustomersByid(id).subscribe((address)=>{
      this.address = address;
      this.defaultAddress = this.address.filter(item => item.default_address==1)
    })
  }

  open() {
    this.modalReference=this.modalService.open(this.addressModal,{ windowClass: 'my-address'});
  }

  openProdModal() {
    this.modalReference=this.modalService.open(this.prodModal,{ windowClass: 'my-prod'});
  }

  openCommentModal() {
    this.modalReference=this.modalService.open(this.commentModal,{ windowClass: 'my-prod'});
  }


  async calcPrice(price,deposit, month,tenureId, tenure_base_price, product:any, quantity){
    this.tenuresOfProduct.forEach((res)=>{
      res.isSelected=0;
      if(tenureId==res.tenure_id){
        res.isSelected=1
      }
    })
    let tenurePrice=this.productTenureBasePrice;
    let discount = tenurePrice*price/100;
    this.tenure_price=Math.round(tenurePrice-discount);
    // this.tenure_price=price;
    this.security_deposit=deposit;
    this.tenures = month;
    this.tenureId =tenureId;
    this.currentProduct.tenure_id = this.tenureId;
    this.currentProduct.tenures=this.tenures;
    this.currentProduct.tenure_price=this.tenure_price;
    this.currentProduct.tenure_period = this.tenure_period;
    // this.productService.addToCart(product);
    const status = await this.removeCartItem(this.currentProduct);
    if(status){
      this.addToCart(this.currentProduct);
    }
  }

  openTenureModal(tenure, p, tenureId, tenureBasePrice, product) {
    this.modalService.open(tenure);
    this.productTenureBasePrice=tenureBasePrice;
    this.currentProduct=product;
    this.ps.getProductPriority(p).subscribe((res)=>{
      this.productTenure=res[0];
      this.tenuresOfProduct=[];
      for(let i=0;i<this.productTenure.length;i++){
        if(this.productTenure[i].tenure_id==tenureId){
          this.productTenure[i].isSelected=1;
          this.tenures = this.productTenure[i].tenure+' '+ this.productTenure[i].tenure_period;
          this.tenure_period = this.productTenure[i].tenure_period;
          this.tenure_price = this.calcTenures2(this.productTenure[i].discount, this.productTenure[i].tenure_base_price)
          this.tenuresOfProduct.push(this.productTenure[i]);
        } else{
          this.productTenure[i].isSelected=0;
          this.tenuresOfProduct.push(this.productTenure[i]);
        }
      }
    });
   }

   calcTenures2(discount, tenure_base_price){
    let tenurePrice=this.productTenureBasePrice;
    let discountPrice = tenurePrice*discount/100;
    let tenureDiscountPrice=tenurePrice-discountPrice;
    return Math.round(tenureDiscountPrice);
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.Notes, 'Orders');
  }

  toggleNotification(e){
    this.http.put(`${environment.apiUrl}/users/updateUsernotification/${this.customerId}`, { is_notification_enabled: e }).subscribe((res) => {
      // console.log(res);
    });
  }

  
}
