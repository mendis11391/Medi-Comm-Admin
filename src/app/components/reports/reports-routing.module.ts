import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AuthGuard } from '../auth/auth.guard';
import { User, Role } from '../auth/user';
import { UrlLogsReportComponent } from './url-logs-report/url-logs-report.component';

const routes: Routes = [
  {
    path: '',
    // component: ReportsComponent,
    // data: {
    //   title: "Reports",
    //   breadcrumb: "Reports"
    // },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'url-logs-report',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {
          title: "Url logs report",
          breadcrumb: "Url logs report",
          roles: [Role.superAdmin,Role.admin,Role.sales]
        },
        component: UrlLogsReportComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
