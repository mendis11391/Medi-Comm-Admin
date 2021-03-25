import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { OthersComponent } from './others/others.component';
import { AuthGuard } from '../auth/auth.guard';
import { DepositsComponent } from './deposits/deposits.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: "Orders",
          breadcrumb: "Orders",
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
