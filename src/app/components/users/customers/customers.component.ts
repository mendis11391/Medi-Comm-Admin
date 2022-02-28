import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Orders, Assets } from "../../../shared/data/order";
import { Customers } from "../../../shared/data/customer";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { FormGroup,FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../products/services/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  public customers :Customers[] = [];
  public temp = [];
  public filteredCustomers=[];
  public orders=[]
  public orderItems=[];
  public products;
  public address=[];
  public defaultAddress=[];
  public cartDetails:any;
  public cartProducts:any;
  dropdownSettings:IDropdownSettings = {};
  customerId;
  modalReference;
  selectedItems;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('addressModal') addressModal;
  constructor(private ps:ProductService,private route: ActivatedRoute,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: FormBuilder) {
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
    this.getProductBycityId(1);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'product_id',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  getCustomers(id){
    this.os.getAllCustomersByid(id).subscribe((customers)=>{
      this.customers=customers;
      this.filteredCustomers=this.customers;
    });
  }

  getAllOrders(id){
    let products;
    let filteredProducts;
    let AllProductsOf=[];
    
    this.os.getAllOrdersByCustomerId(id).subscribe((orders)=>{
      this.orders = orders;
      console.log(this.orders)
      this.orders.forEach((res)=>{
        filteredProducts = res.orderItem;
        for(let k=0;k<filteredProducts.length;k++){
          AllProductsOf.push(filteredProducts[k]);
        }
        this.products =AllProductsOf;
        this.orderItems = this.products.filter(item=>item.status==1);
      });
    });
  }

  getCustomerCartDetails(id){
    this.ps.getCartByCustomerId(id).subscribe((cartRes)=>{
      console.log(cartRes);
      this.cartDetails = cartRes[0].products;
    })
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
    console.log(e);
  }
  onItemDeSelect(e){
    console.log(e);
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
      this.cartDetails.cart.push({
        ...product,
        quantity: qty,
        tenures:tenures,
        tenure_price:tenure_price
      })
    }
    
    const allAddedProducts = JSON.stringify(this.cartDetails.cart);
    const uid = localStorage.getItem("uid");
    console.log(allAddedProducts);
    // this.http.put(`http://localhost:3000/users/cart/${this.customerId}`, { cart: allAddedProducts }).subscribe((res) => {
    //   // console.log(res);
    // });
    return true;
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

  
}
