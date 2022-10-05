import { Component, OnInit, Directive  } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-digital-sub-category-list',
  templateUrl: './digital-sub-category-list.component.html',
  styleUrls: ['./digital-sub-category-list.component.scss']
})
export class DigitalSubCategoryListComponent implements OnInit {

  public categories;

  constructor(private category: ProductService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.category.getCategories().subscribe(res => {
      this.categories=res;
    });
  }

}
