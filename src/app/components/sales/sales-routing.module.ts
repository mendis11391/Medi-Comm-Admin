import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { OthersComponent } from './others/others.component';
import { AuthGuard } from '../auth/auth.guard';
import { DepositsComponent } from './deposits/deposits.component';
import { OrdersPanelComponent } from './orders-panel/orders-panel.component';
import { ReplacementOrdersComponent } from './replacement-orders/replacement-orders.component';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { User, Role } from '../auth/user';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PrimaryOrderComponent } from './primary-order/primary-order.component';
import { RenewalOrderComponent } from './renewal-order/renewal-order.component';
import { ReplacementOrderComponent } from './replacement-order/replacement-order.component';
import { ReturnOrderComponent } from './return-order/return-order.component';
import { UpcomingRenewalsComponent } from './upcoming-renewals/upcoming-renewals.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'all-orders',
        // canLoad: [AuthGuard],
        // canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders",
          roles: [Role.admin]
        },
        component: AllOrdersComponent,
      },
      {
        path: 'orders',
        // canLoad: [AuthGuard],
        // canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders",
          roles: [Role.admin]
        },
        component: OrdersComponent,
      },
      {
        path: 'orders/:id',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Order details",
          breadcrumb: "Order details",
          // roles: [Role.admin]
        },
        component: OrderDetailsComponent,
      },
      {
        path: 'upcoming-renewals',
        // canLoad: [AuthGuard],
        // canActivate: [AuthGuard],
        data: {
          title: "Upcoming renewals",
          breadcrumb: "upcoming renewals",
          // roles: [Role.admin]
        },
        component: UpcomingRenewalsComponent,
      },
      {
        path: 'primary-order',
        // canLoad: [AuthGuard],
        // canActivate: [AuthGuard],
        data: {
          title: "Primary orders",
          breadcrumb: "Primary-order",
          // roles: [Role.admin]
        },
        component: PrimaryOrderComponent,
      },
      {
        path: 'renewal-order',
        // canLoad: [AuthGuard],
        // canActivate: [AuthGuard],
        data: {
          title: "Renewal order",
          breadcrumb: "Renewal order",
          // roles: [Role.admin]
        },
        component: RenewalOrderComponent,
      },
      {
        path: 'replacement-order',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Replacement order",
          breadcrumb: "Replacement order",
          // roles: [Role.admin]
        },
        component: ReplacementOrderComponent,
      },
      {
        path: 'return-order',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Return order",
          breadcrumb: "Return order",
          // roles: [Role.admin]
        },
        component: ReturnOrderComponent,
      },
      {
        path: 'user-requests',
        component: UserRequestsComponent,
        data: {
          title: "User requests",
          breadcrumb: "User requests"
        }
      },
      {
        path: 'manage-orders',
        component: ManageOrdersComponent,
        data: {
          title: "Manage orders",
          breadcrumb: "Manage orders"
        }
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        data: {
          title: "Create order",
          breadcrumb: "Create order"
        }
      },
      {
        path: 'orders-panel',
        component: OrdersPanelComponent,
        data: {
          title: "Orders panel",
          breadcrumb: "Orders panel",
          roles: ['admin']
        }
      },
      {
        path: 'replacement-orders/:id',
        component: ReplacementOrdersComponent,
        data: {
          title: "Replacement orders",
          breadcrumb: "Replacement orders",
          roles: ['admin']
        }
      },
      {
        path: 'deposits',
        component: DepositsComponent,
        data: {
          title: "Deposits",
          breadcrumb: "Deposits"
        }
      },
      {
        path: 'others',
        component: OthersComponent,
        data: {
          title: "others",
          breadcrumb: "Others"
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: {
          title: "Transactions",
          breadcrumb: "Transactions"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
