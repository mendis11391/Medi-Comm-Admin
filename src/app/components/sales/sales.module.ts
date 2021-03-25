import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { OthersComponent } from './others/others.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepositsComponent } from './deposits/deposits.component';

@NgModule({
  declarations: [OrdersComponent, TransactionsComponent, OthersComponent, DepositsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SalesModule { }
