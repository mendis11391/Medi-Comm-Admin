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
const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'orders',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders",
          roles: [Role.admin]
        },
        component: OrdersComponent,
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
