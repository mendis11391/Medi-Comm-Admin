import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './customers/customers.component';
import { ReplaceRequestComponent } from './replace-request/replace-request.component';
import { ReturnRequestComponent } from './return-request/return-request.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReviewsComponent } from './reviews/reviews.component';
import { KycComponent } from './kyc/kyc.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import { ProductsModule } from '../products/products.module';

import { CKEditorModule } from 'ngx-ckeditor';
import { CreateEditKycComponent } from './create-edit-kyc/create-edit-kyc.component';
import { CustomerLogsComponent } from './customer-logs/customer-logs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {TableModule} from 'primeng/table';
import { ButtonModule } from "primeng/button";

import { UiSwitchModule } from 'ngx-ui-switch';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent, CustomersComponent, ReplaceRequestComponent, ReturnRequestComponent, ReviewsComponent, KycComponent, KycDetailsComponent, CreateEditKycComponent, CustomerLogsComponent],
  imports: [
    CommonModule,
    NgbModule,
    // Ng2SmartTableModule,
    FormsModule,
    ProductsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    CKEditorModule,
    SharedModule,
    TableModule,
    ButtonModule,
    UiSwitchModule,
    DropdownModule,
    MultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class UsersModule { }
