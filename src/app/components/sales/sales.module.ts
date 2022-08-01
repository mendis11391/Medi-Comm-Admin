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
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PrimaryOrderComponent } from './primary-order/primary-order.component';
import { RenewalOrderComponent } from './renewal-order/renewal-order.component';
import { ReplacementOrderComponent } from './replacement-order/replacement-order.component';
import { ReturnOrderComponent } from './return-order/return-order.component';
import { UpcomingRenewalsComponent } from './upcoming-renewals/upcoming-renewals.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CreateRenewalOrderComponent } from './create-renewal-order/create-renewal-order.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';

@NgModule({
  declarations: [OrdersComponent, TransactionsComponent, OthersComponent, DepositsComponent, OrdersPanelComponent, ReplacementOrdersComponent, UserRequestsComponent, ManageOrdersComponent, OrderDetailsComponent, PrimaryOrderComponent, RenewalOrderComponent, ReplacementOrderComponent, ReturnOrderComponent, UpcomingRenewalsComponent, CreateOrderComponent, AllOrdersComponent, CreateRenewalOrderComponent, CreateRequestComponent, CancelledOrdersComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class SalesModule { }
