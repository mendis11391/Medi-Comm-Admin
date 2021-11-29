import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-digital-specs',
  templateUrl: './digital-specs.component.html',
  styleUrls: ['./digital-specs.component.scss']
})
export class DigitalSpecsComponent implements OnInit {

  public categories;
  mainCat='';
  subCat=[];
  subCatValue;
  specImage;
  specName='';
  getAllSpecName;
  getSpecName;
  specValue;
  specValueStatus:boolean=false;
  constructor(private category: ProductService,private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSpecs();
    // this.getSubCategory(this.mainCat);
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getSubCategory(){
    this.subCat = this.categories.filter(item=>item.main_cat_name===this.mainCat);
    console.log(this.subCat[0].subItems);
  }

  getAllSpecs(){
    this.category.getAllSpecs().subscribe((res)=>{
      this.getAllSpecName = res
    });
  }

  addSpecs(){
    this.http.post('http://localhost:3000/products/postSpecs', {spec_name:this.specName, specIMage:this.specImage,spec_status:1}).subscribe((res) => {
      console.log(res);
    });
  }

  addSpecValue(){
    this.http.post('http://localhost:3000/category/addSpecValue', {specId:this.getSpecName,specValue:this.specValue}).subscribe((res) => {
      console.log(res);     
      this.specValueStatus=true;
      setTimeout(() => { this.specValueStatus = false; }, 2000);
    });
  }
}
