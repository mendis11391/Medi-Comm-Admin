import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { CustomersComponent } from './customers/customers.component';
import { ReplaceRequestComponent } from './replace-request/replace-request.component';
import { ReturnRequestComponent } from './return-request/return-request.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'customers/:id',
        component: CustomersComponent,
        data: {
          title: "Customer List",
          breadcrumb: "Customer List"
        }
      },
      {
        path: 'customers',
        component: ListUserComponent,
        data: {
          title: "User List",
          breadcrumb: "User List"
        }
      },
      {
        path: 'create-customer',
        component: CreateUserComponent,
        data: {
          title: "Create Customer",
          breadcrumb: "Create Customer"
        }
      },
      {
        path: 'replacement-request',
        component: ReplaceRequestComponent,
        data: {
          title: "Replacement request",
          breadcrumb: "Replacement request"
        }
      },
      {
        path: 'return-request',
        component: ReturnRequestComponent,
        data: {
          title: "Return request",
          breadcrumb: "Return request"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
