import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  public transactions = [];
  public filteredTransactions = [];
  datasource:[];
  loading: boolean;
  totalRecords: number;
  selectedOrders: [];
  cols: any[];
  exportColumns: any[];
  filteredValues:any;
  totalTransactionAmount:number=0;
  @ViewChild('dt1', { static: true }) dt1: any;

  constructor(private http: HttpClient,private excelService:ExcelService) {
    this.http.get(`${environment.apiUrl}/orders/getAllTransactions`).subscribe((resp:any)=>{
      this.transactions=resp;
      this.transactions.forEach((item) => {
        item.createdAt = new Date(item.createdAt);
        item.rent = item.order_amount-item.totalSecurityDeposit
      });
      
      this.filteredTransactions=this.transactions.filter(item=>item.orderType_id!=4);
      this.cols = [
        { field: "order_id", header: "Order Id" },
        { field: "transaction_id", header: "transaction_id" },
        { field: "order_amount", header: "order_amount" },
        { field: "firstName", header: "First name" },
        { field: "mobile", header: "mobile" },
        { field: "transaction_source", header: "transaction_source" },
        { field: "type", header: "type" },
        { field: "createdAt", header: "createdAt" }
      ];
      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    });
  }


  ngOnInit() {
  }

  onFilter(e:any) {
    this.filteredValues = e.filteredValue;
    this.totalTransactionAmount = this.filteredValues.reduce((acc,{order_amount})=>
      (acc) + (order_amount-0),0
    );
    console.log(this.filteredValues);
    sessionStorage.setItem("upcomingRenewalsFilters", JSON.stringify(e.filters));
  }
  onPagination(e:any){
    console.log(e);
    sessionStorage.setItem("upcomingRenewalsPage", JSON.stringify(e));
  }
  onSort(e:any){
    console.log(e);
    sessionStorage.setItem("upcomingRenewalsSort", JSON.stringify(e));
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filteredTransactions, 'Orders');
  }

  switchHeader(e){
    if(e.index==0){
      this.filteredTransactions=this.transactions.filter(item=>item.orderType_id!=4);
    }else if(e.index==1){
      this.filteredTransactions=this.transactions.filter(item=>item.orderType_id==4);
    }
  }
}
