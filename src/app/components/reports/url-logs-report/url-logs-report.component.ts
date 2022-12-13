import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../sales/services/excel.service';
import { UrlLogs } from 'src/app/shared/data/reports';

@Component({
  selector: 'app-url-logs-report',
  templateUrl: './url-logs-report.component.html',
  styleUrls: ['./url-logs-report.component.scss']
})
export class UrlLogsReportComponent implements OnInit {

  public urlLogs :UrlLogs[] = [];
  public temp = [];
  modalReference;
  filteredOrders:UrlLogs[]=[];
  datasource: UrlLogs[];
  loading: boolean;
  totalRecords: number;
  selectedOrders: UrlLogs[];
  cols: any[];
  exportColumns: any[];

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private excelService:ExcelService,private http: HttpClient,private os:OrdersService, private modalService: NgbModal, private formBuilder: UntypedFormBuilder) {
    this.getAllUrlLogs();
   
  }

  updateFilter(event) {
    this.temp=this.urlLogs;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.primary_id.toLowerCase().indexOf(val) !== -1 || d.delivery_status.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredOrders = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {
  }

  getAllUrlLogs(){
    this.os.getAllurlLogs().subscribe((results)=>{
      // orders.reverse();
      // this.order=orders.filter(item => item.paymentStatus=='Success');
      this.urlLogs=results;
      this.filteredOrders=this.urlLogs;
      this.filteredOrders.forEach(
        item => (item.created_at = new Date(item.created_at))
      );
      this.cols = [
        { field: "id", header: "Id" },
        { field: "customer_id", header: "customer#" },
        { field: "firstName", header: "First name" },
        { field: "mobile", header: "mobile" },
        { field: "session_id", header: "Session id" },
        { field: "url", header: "URL" },
        { field: "source", header: "Source" },
        { field: "conversion", header: "Conversion" },
        { field: "created_at", header: "Created Date" },
      ];

      
      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }



  






  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.urlLogs, 'Orders');
  }
}
