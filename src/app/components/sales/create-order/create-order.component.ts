import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  public orderForm: FormGroup;
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
  constructor(private fb: FormBuilder) { 
    this.orderForm = this.fb.group({
                  uid: parseInt(localStorage.getItem('uid')),
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
  }

  ngOnInit(): void {
  }

}
