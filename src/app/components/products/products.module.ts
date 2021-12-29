import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductsRoutingModule } from './products-routing.module';
import { CategoryComponent } from './physical/category/category.component';
import { SubCategoryComponent } from './physical/sub-category/sub-category.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { DigitalCategoryComponent } from './digital/digital-category/digital-category.component';
import { DigitalSubCategoryComponent } from './digital/digital-sub-category/digital-sub-category.component';
import { DigitalListComponent } from './digital/digital-list/digital-list.component';
import { DigitalAddComponent } from './digital/digital-add/digital-add.component';
import { ProductDetailComponent } from './physical/product-detail/product-detail.component';
import { DigitalEditComponent } from './digital/digital-edit/digital-edit.component';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SharedModule } from 'src/app/shared/shared.module';
import { DigitalSpecsComponent } from './digital/digital-specs/digital-specs.component';
import { DigitalCategoryListComponent } from './digital/digital-category-list/digital-category-list.component';
import { DigitalSubCategoryListComponent } from './digital/digital-sub-category-list/digital-sub-category-list.component';
import { SpecPipe } from './pipes/spec.pipe';
import { TenurePipe } from './pipes/tenureByPriority.pipe';
import { CheckTenurePipe } from './pipes/checkTenure.pipe';

import { DigitalProductDetailsComponent } from './digital/digital-product-details/digital-product-details.component';
import { PricingSchemesComponent } from './digital/pricing-schemes/pricing-schemes.component';
import { DigitalAccessoriesComponent } from './digital/digital-accessories/digital-accessories.component';
import { EditSpecPipe } from './pipes/editSpecsCheck.pipe';
import { CategorySpecsPipe } from './pipes/categorySpecs.pipe';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};



@NgModule({
  declarations: [CategorySpecsPipe,EditSpecPipe,CheckTenurePipe,TenurePipe,SpecPipe,CategoryComponent, SubCategoryComponent, DigitalEditComponent,ProductListComponent, AddProductComponent, DigitalCategoryComponent, DigitalSubCategoryComponent, DigitalListComponent, DigitalAddComponent, ProductDetailComponent, DigitalSpecsComponent, DigitalCategoryListComponent, DigitalSubCategoryListComponent, DigitalProductDetailsComponent, PricingSchemesComponent, DigitalAccessoriesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    ProductsRoutingModule,
    Ng2SmartTableModule,
    NgbModule,
    DropzoneModule,
    GalleryModule.forRoot(),
    SharedModule
  ],
  exports: [CategorySpecsPipe,EditSpecPipe,CheckTenurePipe,SpecPipe, TenurePipe],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    NgbActiveModal
  ]
})
export class ProductsModule { }
