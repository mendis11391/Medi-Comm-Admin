import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-last-renewal',
  templateUrl: './asset-last-renewal.component.html',
  styleUrls: ['./asset-last-renewal.component.scss']
})
export class AssetLastRenewalComponent implements OnInit {

  assetData:any;
  constructor(public http:HttpClient) { }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/admin/get_allActiveAssetsWithLastRenewal`).subscribe((res)=>{
      this.assetData=res;
    })
  }

}
