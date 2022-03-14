import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient} from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from '../../products/services/orders.service';
import { Orders,OrderItems, Assets } from "../../../shared/data/order";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {

  public orders:   Orders[] = [];
  public products;
  public filteredProducts:   Orders[] = [];
  customers;
  customerDetails={
    firstName:'',
    mobile:'',
    email:''
  };
  public address=[];
  public defaultAddress=[];
  billAddressId;
  shipAddressId;
  uid;
  dropdownSettings:IDropdownSettings = {};
  public closeResult: string;

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
  currentDate=new Date();
  @ViewChild('customerModal') customerModal;
  @ViewChild('addressModal') addressModal;
  @ViewChild('billAddressModal') billAddressModal;

  constructor(private router: Router,private os:OrdersService,private http: HttpClient,private modalService: NgbModal) {
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
    
  }

  getAllCustomers(){
    this.http.get(`${environment.apiUrl}/users`).subscribe((users)=>{
      this.customers=users
    })
  }

  onItemSelect(e){
    this.uid = e.customer_id;
    let filterCustomer = this.customers.filter(item=>item.customer_id ==this.uid)
    this.customerDetails = filterCustomer[0];
    this.getAllAddresses(this.uid);   
    this.getOrders();
    this.modalService.dismissAll();
  }

  getAllAddresses(id){
    this.os.getAllAddressByCustomersByid(id).subscribe((address)=>{
      this.address = address;
      this.defaultAddress = this.address.filter(item => item.default_address==1);
      this.billAddressId = this.defaultAddress[0].address_id;
      this.shipAddressId = this.defaultAddress[0].address_id;
      
      this.patchFormValues(this.defaultAddress[0]);
      this.patchBillForm(this.defaultAddress[0]);
    })
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

  open(modal) {
    this.modalService.open(modal,{ windowClass: 'my-address'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
   }

   getOrders(){
    let successOrders;
    let products;
    let filteredProducts;
    let AllProductsOf=[];
    let assetId=[];
    let cid = new Promise((resolve, reject) => {
      this.os.getAllOrdersByCustomerId(this.uid).subscribe((orders)=>{
        successOrders=orders.filter((successOrders)=>{
          // if(successOrders.overdue==1){
          //   this.overdue=1;
          // }
         return (successOrders.paymentStatus.toLowerCase()=='success' || successOrders.orderType_id==3) && (successOrders.order_type==='Primary order' || successOrders.order_type==='Replacement order');
        });
        this.orders=successOrders.reverse();

          this.orders.forEach((res)=>{
            filteredProducts = res.orderItem;
            for(let k=0;k<filteredProducts.length;k++){
              AllProductsOf.push(filteredProducts[k]);
            }
            // console.log(this.products);
            this.products =AllProductsOf;
            // this.products2 = res.orderItem;
            // this.products=this.products.filter(item=>(item.status==1));              
              
            // this.filteredProducts.push(this.products[0]);
            this.filteredProducts = this.products.filter(item=>item.status==1 && item.deliveryStatus_id==4);
            this.filteredProducts.forEach((order_item)=>{
              this.os.getCustomerRequests(order_item.order_item_id).subscribe((requests:any)=>{
                let defaultRequest=[{"request_status":0, "request_id":0}];
                if(requests.length>0){
                  order_item.request_status=requests[0].request_status;
                  order_item.request_id=requests[0].request_id;
                } else{
                  order_item.request_status=defaultRequest[0].request_status;
                  order_item.request_id=defaultRequest[0].request_id;
                }

              });
            })
          });

          
          resolve('cid success');

      }, error => {
        // console.log(error);
      }); 
    });
     
    cid.then((success)=>{
      // console.log(success);
      // this.filteredProducts = this.filteredProducts.filter(function(item, pos) {
      //   return this.filteredProducts.indexOf(item) == pos;
      // });   
      this.filteredProducts=this.uniq(this.filteredProducts);
      // console.log(this.filteredProducts);
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
      request_reason:'',
      request_message:'',
      approval_status:0,
      approval_date:0,
      request_status:1
    }
    console.log(orderItem);
    this.http.post(`${environment.apiUrl}/users/updateorderItem`,orderItem).subscribe(()=>{
      this.router.navigate(['../users/return-request']);
    });
  }

  placeReplaceRequest(oid,oiid,renewals_timline){
    
    let returnAsset = renewals_timline.filter(item=>item.renewed==1 || item.renewed==4 || item.ordered ==1);
    let renewalsData = returnAsset.slice(-1)[0];
    let orderItem={
      order_item_id:oiid,
      order_id:oid,
      renewals:JSON.stringify(renewalsData),
      request_id:1,
      requested_date:new Date(),
      request_reason:'',
      request_message:'',
      approval_status:0,
      approval_date:0,
      request_status:1
    }
    console.log(orderItem);
    this.http.post(`${environment.apiUrl}/users/updateorderItem`,orderItem).subscribe(()=>{
      this.router.navigate(['../users/replacement-request']);
    });
  }

  uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  }

}
