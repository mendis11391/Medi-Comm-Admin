import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../products/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateOrderComponent implements OnInit {

  public orderForm: FormGroup;
  city:string;
  taxInfo = '';
  gst: number=0;
  deliveryFee = 200;
  damageProtection=0;
  dp=0;
  subtotal;
  total;
  securityDeposit;
  grandTotal;
  txnId;
  getTotal;
  getDepositTotal;
  billAddressId;
  shipAddressId;
  customers;
  dropdownSettings:IDropdownSettings = {};
  productDropdownSettings:IDropdownSettings = {};
  selectedItems;
  customerDetails={};
  ProductDetails=[];
  security_deposit = 0;
  productTenure;
  tenuresOfProduct;
  tenures;
  tenure_period;
  tenure_price;
  tenureId;
  currentDate = new Date();
  public address=[];
  public defaultAddress=[];
  products:any;
  productId;
  defaultAddressFields = {
    address_id:'',
    displayName:'',
    firstName: '',
    lastName:'',
    nickName:'',
    address_type:'',
    mobile: '',
    address_line1: '',
    address_line2:'',
    city: '',
    state: '',
    pincode: '',
    default_address:'',
    landmark:''
  };
  
  defaultBillAddressFields = {
    address_id:'',
    displayName:'',
    firstName: '',
    lastName:'',
    nickName:'',
    address_type:'',
    mobile: '',
    address_line1: '',
    address_line2:'',
    city: '',
    state: '',
    pincode: '',
    default_address:'',
    landmark:''
  };

  modalReference;
  public closeResult: string;
  tenureTotalPrice:number=0;
  totalDepositPrice:number=0;
  @ViewChild('addressModal') addressModal;
  @ViewChild('billAddressModal') billAddressModal;
  @ViewChild('tenure') tenure;
  @ViewChild('customerModal') customerModal;
  @ViewChild('productModal') productModal;
  quantity:number=1;

  constructor(private ps:ProductService,private modalService: NgbModal,private os:OrdersService,private http: HttpClient,private fb: FormBuilder) { 
    this.orderForm = this.fb.group({
      uid: '',
      orderID: this.txnId,
      subTotal: this.getTotal,
      damageProtection:this.dp,
      total:this.total,
      securityDeposit: this.getDepositTotal,
      grandTotal: this.grandTotal,
      discount: 0,
      firstName: 'Manjesh',
      lastName:'Sham',
      mobile: 8971870126,
      email: 'manjeshwar17@gmail.com', 
      billingAddress:this.billAddressId,
      shippingAddress:this.shipAddressId,
      orderType:1,
      orderStatus:8,
      deliveryStatus:'Delivered',
      refundStatus:'Paid',
      createdBy:1,
      modifiedBy:1,
      createdAt: new Date(),
      modifiedAt:new Date(),
      products:'',
      orderId:'',
      orderAmount:'',
      customerName:'',
      customerEmail:'',
      customerPhone:'',
      appId:'',
      notifyUrl:'',
      returnUrl:'',
      signature:'',
      orderName:'Primary'
    });

                this.dropdownSettings = {
                  singleSelection: true,
                  idField: 'customer_id',
                  textField: 'mobile',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 1,
                  allowSearchFilter: true
                };
                this.productDropdownSettings = {
                  singleSelection: false,
                  idField: 'id',
                  textField: 'prod_id',
                  selectAllText: 'Select All',
                  unSelectAllText: 'UnSelect All',
                  itemsShowLimit: 15,
                  allowSearchFilter: true
                };
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getAllProductBycity(1);
    this.transactionId();
  }

  getAllCustomers(){
    this.http.get('http://localhost:3000/users').subscribe((users)=>{
      this.customers=users
    })
  }

  getAllProductBycity(id){
    this.ps.getProductsBycityId(id).subscribe((prods)=>{
      this.products = prods;
      console.log(this.products);
    })
  }

  onItemSelect(e){
    this.selectedItems = e.customer_id;
    let filterCustomer = this.customers.filter(item=>item.customer_id ==this.selectedItems)
    this.customerDetails = filterCustomer[0];
    this.getAllAddresses(this.selectedItems);
    this.modalService.dismissAll();
  }

  getAllAddresses(id){
    this.os.getAllAddressByCustomersByid(id).subscribe((address)=>{
      this.address = address;
      this.defaultAddress = this.address.filter(item => item.default_address==1);
      this.patchFormValues(this.defaultAddress[0]);
      this.patchBillForm(this.defaultAddress[0]);
    })
  }


  changeAddr(id) {
    this.shipAddressId = id;
    this.orderForm.patchValue({shippingAddress:id});
    const addrFields = this.address.filter(res => res.address_id === id);
    this.patchFormValues(addrFields[0]);
    this.modalService.dismissAll();
  }

  changeDefaultBillAddr(id) {
    this.billAddressId=id;
    this.orderForm.patchValue({billingAddress:id});
    const billAddrFields = this.address.filter(res => res.address_id === id);
    this.patchBillForm(billAddrFields[0]);
    this.modalService.dismissAll();
  }

  patchFormValues(addrFields) {
    this.defaultAddressFields = {
      address_id:addrFields.address_id,
      displayName:addrFields.display_name,
      firstName: addrFields.firstName,
      lastName: addrFields.lastName,
      nickName:addrFields.nickName,
      address_type: addrFields.address_type,
      mobile: addrFields.addressMobile,
      address_line1: addrFields.address_line1,
      address_line2:addrFields.address_line2,
      city: addrFields.city,
      state: addrFields.state,
      pincode: addrFields.pincode,
      default_address:addrFields.default_address,
      landmark:addrFields.landmark
    };  
  }

  patchBillForm(addrFields){
    this.defaultBillAddressFields = {
      address_id:addrFields.address_id,
      displayName:addrFields.display_name,
      firstName: addrFields.firstName,
      lastName: addrFields.lastName,
      nickName:addrFields.nickName,
      address_type: addrFields.address_type,
      mobile: addrFields.addressMobile,
      address_line1: addrFields.address_line1,
      address_line2:addrFields.address_line2,
      city: addrFields.city,
      state: addrFields.state,
      pincode: addrFields.pincode,
      default_address:addrFields.default_address,
      landmark: addrFields.landmark
    };
  }

  onProductSelect(e){
    this.productId = e.id;
    let filterProduct = this.products.filter(item=>item.id ==this.productId);

    this.ProductDetails.push(filterProduct[0]);
    console.log(this.ProductDetails);
    this.ProductDetails.forEach((products)=>{
      this.http.get(`http://localhost:3000/products/productsDetailsByCityIdAndSlug/1/${products.slug}`).subscribe((prodDetails)=>{
        products.quantity=1;
        let defaultTenure = prodDetails[0].tenures.filter(item=>item.default_tenure==1);
        products.tenures = defaultTenure[0].tenure+' '+ defaultTenure[0].tenure_period;
        products.tenure_price = this.calcTenures(defaultTenure[0].discount, products.tenure_base_price);
        products.tenure_id = defaultTenure[0].tenure_id;
        this.tenureTotalAmount();
      });
    });
    
  }

  onProductDeSelect(e){
    this.productId = e.id;
    this.ProductDetails = this.ProductDetails.filter(item=>item.id !=this.productId);
    console.log(this.ProductDetails);
    this.tenureTotalAmount();
  }


  open(modal,p, tenureId) {
    this.modalService.open(modal,{ windowClass: 'my-address'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
    this.ps.getProductPriority(p).subscribe((res)=>{
      this.productTenure=res[0];
      this.tenuresOfProduct=[];
      for(let i=0;i<this.productTenure.length;i++){
        if(this.productTenure[i].tenure_id==tenureId){
          this.productTenure[i].isSelected=1;
          this.tenures = this.productTenure[i].tenure+' '+ this.productTenure[i].tenure_period;
          this.tenure_period = this.productTenure[i].tenure_period;
          this.tenure_price = this.calcTenures(this.productTenure[i].discount, this.productTenure[i].tenure_base_price)
          this.tenuresOfProduct.push(this.productTenure[i]);
        } else{
          this.productTenure[i].isSelected=0;
          this.tenuresOfProduct.push(this.productTenure[i]);
        }
      }
    });
   }

  async calcPrice(price,deposit, month,tenureId, tenure_base_price, product:any, quantity){
    this.tenuresOfProduct.forEach((res)=>{
      res.isSelected=0;
      if(tenureId==res.tenure_id){
        res.isSelected=1
      }
    })
    let tenurePrice=tenure_base_price;
    let discount = tenurePrice*price/100;
    this.tenure_price=Math.round(tenurePrice-discount);
    // this.tenure_price=price;
    this.security_deposit=deposit;
    this.tenures = month;
    this.tenureId =tenureId;
    product.tenure_id = this.tenureId;
    product.tenures=this.tenures;
    product.tenure_price=this.tenure_price;
    product.tenure_period = this.tenure_period;
    this.tenureTotalAmount();
  }

  calcTenures(discount, tenure_base_price){
    let tenurePrice=tenure_base_price;
    let discountPrice = tenurePrice*discount/100;
    let tenureDiscountPrice=tenurePrice-discountPrice;
    return Math.round(tenureDiscountPrice);
  }

  public tenureTotalAmount() {
    this.tenureTotalPrice=0;
    this.totalDepositPrice=0;
    console.log(this.tenureTotalPrice);
    this.ProductDetails.forEach((product) => {
      this.tenureTotalPrice+=product.tenure_price * product.quantity;
      this.totalDepositPrice+=product.securityDeposit * product.quantity;
    });
  }

  transactionId() {
    this.city='Bangalore';
    
    let subCity = '';
    if(this.city==='Bangalore'){
      subCity = 'BLR'
    } else if(this.city==='Hyderabad'){
      subCity = 'HYD'
    } if(this.city==='Mumbai'){
      subCity = 'BOM'
    } if(this.city==='PUNE'){
      subCity = 'PNQ'
    }
    const rand = Math.floor((Math.random() * 999) + 1);
    const dte = new Date();
    const txnid = ""+subCity +
    dte.getDate().toString().padStart(2, "0")+
    (dte.getMonth()+1).toString().padStart(2, "0") +
    dte.getFullYear().toString().substr(2,2) + rand;
    this.txnId=txnid;
    // console.log(this.txnId);
    this.orderForm.patchValue({
      orderID:txnid
    });
  }
  

}
