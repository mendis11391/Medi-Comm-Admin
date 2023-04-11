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
import { CreateRenewalOrderComponent } from './create-renewal-order/create-renewal-order.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';
import { NotesComponent } from './notes/notes.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'all-orders',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        },
        component: AllOrdersComponent,
      },
      {
        path: 'orders',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders",
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
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
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
        },
        component: OrderDetailsComponent,
      },
      {
        path: 'upcoming-renewals',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Upcoming renewals",
          breadcrumb: "upcoming renewals",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        },
        component: UpcomingRenewalsComponent,
      },
      {
        path: 'notes',
        data: {
          title: "Notes",
          breadcrumb: "Notes",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        },
        component: NotesComponent,
      },
      {
        path: 'primary-order',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Primary orders",
          breadcrumb: "Primary-order",
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
        },
        component: PrimaryOrderComponent,
      },
      {
        path: 'cancelled-orders',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "cancelled orders",
          breadcrumb: "cancelled-orders",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        },
        component: CancelledOrdersComponent,
      },
      {
        path: 'renewal-order',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Renewal order",
          breadcrumb: "Renewal order",
          roles: [Role.superAdmin,Role.admin,Role.sales]
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
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
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
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
        },
        component: ReturnOrderComponent,
      },
      {
        path: 'user-requests',
        component: UserRequestsComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "User requests",
          breadcrumb: "User requests",
          roles: [Role.superAdmin,Role.admin,Role.sales]
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
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Create order",
          breadcrumb: "Create order",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'create-request',
        component: CreateRequestComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Create request",
          breadcrumb: "Create request",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'create-renewal-order',
        component: CreateRenewalOrderComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Create renewal order",
          breadcrumb: "Create renewal order",
          roles: [Role.superAdmin,Role.admin,Role.sales]
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
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Replacement orders",
          breadcrumb: "Replacement orders",
          roles: [Role.superAdmin,Role.admin,Role.sales,Role.delivery]
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
