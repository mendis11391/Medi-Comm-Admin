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
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Customer Logs",
          breadcrumb: "Customer Logs",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'customers/:id',
        component: CustomersComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Customer Details",
          breadcrumb: "Customer Details",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'customers',
        component: ListUserComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Customer List",
          breadcrumb: "Customer List",
          roles: [Role.superAdmin,Role.admin,Role.sales]
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
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'kyc-list',
        component: KycComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "KYC",
          breadcrumb: "KYC",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'kyc-list/:id',
        component: KycDetailsComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "KYC details",
          breadcrumb: "KYC details",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'create-edit-kyc/:id',
        component: CreateEditKycComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Create or Edit eKYC",
          breadcrumb: "Create or edit eKYC",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'create-customer',
        component: CreateUserComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Create Customer",
          breadcrumb: "Create Customer",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'replacement-request',
        component: ReplaceRequestComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Replacement request",
          breadcrumb: "Replacement request",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        }
      },
      {
        path: 'return-request',
        component: ReturnRequestComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Return request",
          breadcrumb: "Return request",
          roles: [Role.superAdmin,Role.admin,Role.sales]
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
