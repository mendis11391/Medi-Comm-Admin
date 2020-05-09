import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { OthersComponent } from './others/others.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: "Orders",
          breadcrumb: "Orders"
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
