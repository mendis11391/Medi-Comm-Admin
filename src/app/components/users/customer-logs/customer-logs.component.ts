import { Component, OnInit } from '@angular/core';
import { Customers } from 'src/app/shared/data/customer';
import { OrdersService } from '../../products/services/orders.service';

@Component({
  selector: 'app-customer-logs',
  templateUrl: './customer-logs.component.html',
  styleUrls: ['./customer-logs.component.scss']
})
export class CustomerLogsComponent implements OnInit {

  customerLogs:Customers;

  constructor(private os:OrdersService,) { }

  ngOnInit(): void {

    this.os.getAllCustomerLogs().subscribe((logs)=>{
      this.customerLogs = logs;
    });
  }

}
