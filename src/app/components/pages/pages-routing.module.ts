import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './list-page/list-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { CreateAssetsComponent } from './create-assets/create-assets.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-page',
        component: ListPageComponent,
        data: {
          title: "List Page",
          breadcrumb: "List Page"
        }
      },
      {
        path: 'create-page',
        component: CreatePageComponent,
        data: {
          title: "Create Page",
          breadcrumb: "Create Page"
        }
      },
      {
        path: 'create-assets',
        component: CreateAssetsComponent,
        data: {
          title: "asset Page",
          breadcrumb: "Asset Page"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
