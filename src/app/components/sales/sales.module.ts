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
import { OrdersPanelComponent } from './orders-panel/orders-panel.component';
import { ReplacementOrdersComponent } from './replacement-orders/replacement-orders.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';


@NgModule({
  declarations: [OrdersComponent, TransactionsComponent, OthersComponent, DepositsComponent, OrdersPanelComponent, ReplacementOrdersComponent, UserRequestsComponent, ManageOrdersComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class SalesModule { }
