import { Component, OnInit } from '@angular/core';
import { productDB } from 'src/app/shared/tables/product-list';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public productList;

  constructor(private productservice: ProductService, private router: Router) {
  }

  ngOnInit() {
    // this.get_All_Products();
  }

  // get_All_Products() {
  //   this.productservice.getAllProducts().subscribe((res) => {
  //     if(res) {
  //       this.productList = res;
  //     } else {
  //       this.productList = [];
  //     }
  //   }, (error) => {
  //     this.router.navigate(['/auth/login'])
  //   });
  // }


}
