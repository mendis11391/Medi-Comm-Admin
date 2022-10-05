import { Component, OnInit, ViewChild, Directive  } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { Orders,OrderItems, Assets } from "../../../shared/data/order";
import { OrdersService } from '../../products/services/orders.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient} from '@angular/common/http';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
  asset:UntypedFormGroup;
  public order :OrderItems[] = [];
  public filteredOrders=[];
  filteredOrderItems=[];

  constructor( private formBuilder: UntypedFormBuilder,private http: HttpClient,private os:OrdersService, private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getOrders();
    this.asset = this.formBuilder.group({      
      assetId:['']
    });
  }

  addAsset(){
    this.http.post(`${environment.apiUrl}/assets/createAsset`, {assets:this.asset.value.assetId}).subscribe((res) => {
      alert("asset added");
      this.asset.reset();
    });
  }

  getOrders(){
    this.os.getAllOrderItems().subscribe((orderItems)=>{
      orderItems.reverse();
      this.order=orderItems.filter(item => item.status==true && (item.orderType_id==1 || item.orderType_id==3) );
      for(let o=0;o<this.order.length;o++){
        let otParse = JSON.parse(this.order[o].renewals_timline);
        for(let p=0;p<otParse.length;p++){
          this.filteredOrders.push(otParse[p]);
          this.filteredOrderItems = this.filteredOrders.filter(item=>item.renewed==0);
        }
      }
    });
  }

}
