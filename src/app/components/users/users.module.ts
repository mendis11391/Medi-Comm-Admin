import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './customers/customers.component';
import { ReplaceRequestComponent } from './replace-request/replace-request.component';
import { ReturnRequestComponent } from './return-request/return-request.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent, CustomersComponent, ReplaceRequestComponent, ReturnRequestComponent],
  imports: [
    CommonModule,
    NgbModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class UsersModule { }
