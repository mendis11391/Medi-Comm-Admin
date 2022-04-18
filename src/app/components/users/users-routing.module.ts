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

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
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
        component: ReviewsComponent,
        data: {
          title: "Reviews",
          breadcrumb: "reviews"
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
