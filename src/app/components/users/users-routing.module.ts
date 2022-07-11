import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { CustomersComponent } from './customers/customers.component';
import { ReplaceRequestComponent } from './replace-request/replace-request.component';
import { ReturnRequestComponent } from './return-request/return-request.component';
import { AuthGuard } from '../auth/auth.guard';
import { ReviewsComponent } from './reviews/reviews.component';
import { KycComponent } from './kyc/kyc.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import { CreateEditKycComponent } from './create-edit-kyc/create-edit-kyc.component';
import { CustomerLogsComponent } from './customer-logs/customer-logs.component';
import { User, Role } from '../auth/user';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [      
      {
        path: 'customers/logs',
        component: CustomerLogsComponent,
        data: {
          title: "Customer Logs",
          breadcrumb: "Customer Logs"
        }
      },
      {
        path: 'customers/:id',
        component: CustomersComponent,
        data: {
          title: "Customer Details",
          breadcrumb: "Customer Details"
        }
      },
      {
        path: 'customers',
        component: ListUserComponent,
        data: {
          title: "Customer List",
          breadcrumb: "Customer List"
        }
      },
      {
        path: 'reviews',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: ReviewsComponent,
        data: {
          title: "Reviews",
          breadcrumb: "reviews",
          roles: [Role.admin]
        }
      },
      {
        path: 'kyc-list',
        component: KycComponent,
        data: {
          title: "KYC",
          breadcrumb: "KYC"
        }
      },
      {
        path: 'kyc-list/:id',
        component: KycDetailsComponent,
        data: {
          title: "KYC details",
          breadcrumb: "KYC details"
        }
      },
      {
        path: 'create-edit-kyc/:id',
        component: CreateEditKycComponent,
        data: {
          title: "Create or Edit eKYC",
          breadcrumb: "Create or edit eKYC"
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
