import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './physical/category/category.component';
import { SubCategoryComponent } from './physical/sub-category/sub-category.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { DigitalCategoryComponent } from './digital/digital-category/digital-category.component';
import { DigitalSubCategoryComponent } from './digital/digital-sub-category/digital-sub-category.component';
import { DigitalListComponent } from './digital/digital-list/digital-list.component';
import { DigitalAddComponent } from './digital/digital-add/digital-add.component';
import { ProductDetailComponent } from './physical/product-detail/product-detail.component';
import { AuthGuard } from '../auth/auth.guard';
import { DigitalEditComponent } from './digital/digital-edit/digital-edit.component';
import { DigitalSpecsComponent } from './digital/digital-specs/digital-specs.component';
import { DigitalSubCategoryListComponent } from './digital/digital-sub-category-list/digital-sub-category-list.component';
import { PricingSchemesComponent } from './digital/pricing-schemes/pricing-schemes.component';
import { DigitalAccessoriesComponent } from './digital/digital-accessories/digital-accessories.component';
import { DigitalScrollersComponent } from './digital/digital-scrollers/digital-scrollers.component';
import { User, Role } from '../auth/user';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'physical/category',
        component: CategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'physical/sub-category',
        component: SubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
      {
        path: 'physical/product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'physical/product-detail',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'physical/add-product',
        component: AddProductComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'digital/digital-category',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalCategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-sub-category-list',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalSubCategoryListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-sub-category',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalSubCategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-specs',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalSpecsComponent,
        data: {
          title: "Specifications",
          breadcrumb: "Specifications",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-scrollers',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalScrollersComponent,
        data: {
          title: "Scrollers",
          breadcrumb: "Scrollers",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-product-list',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-add-product',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalAddComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/digital-edit-product/:id',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalEditComponent,
        data: {
          title: "Edit Products",
          breadcrumb: "Edit Product",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/pricing-schemes',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: PricingSchemesComponent,
        data: {
          title: "Pricing Schemes",
          breadcrumb: "Pricing Schemes",
          roles: [Role.admin]
        }
      },
      {
        path: 'digital/accessories',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: DigitalAccessoriesComponent,
        data: {
          title: "Accessories",
          breadcrumb: "Accessories",
          roles: [Role.admin]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
