import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

export interface specValues {
  spec_id?: number,
  spec_value?: string,
  status?: boolean
}

@Pipe({
  name: 'CategorySpecs',
  pure: false
})
export class CategorySpecsPipe implements PipeTransform {

  categorySpec:any;
  result:any;
    constructor(private category:ProductService) { 
      this.category.getAllCategorySpecs().subscribe((res)=>{
        this.categorySpec=res
      });
    }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    return this.getAllCategoryspecs(value);
  }


  getAllCategoryspecs(id) {
    this.result = this.categorySpec.filter(item =>item.cat_id==id);
    return this.result;
  }
}
