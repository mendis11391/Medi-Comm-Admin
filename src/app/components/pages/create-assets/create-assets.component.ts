import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
  asset:FormGroup;

  constructor( private formBuilder: FormBuilder,private http: HttpClient) { }

  ngOnInit(): void {
    this.asset = this.formBuilder.group({      
      assetId:['']
    });
  }

  addAsset(){
    this.http.post(`http://localhost:3000/assets/createAsset`, {assets:this.asset.value.assetId}).subscribe((res) => {
      alert("asset added");
      this.asset.reset();
    });
  }

}
