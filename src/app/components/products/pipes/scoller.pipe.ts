import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

export interface specValues {
  spec_id?: number,
  spec_value?: string,
  status?: boolean
}

@Pipe({
  name: 'scrollerValues',
  pure: false
})
export class ScrollerPipe implements PipeTransform {

  scrollerValues:any;
  result:any;
    constructor(private category:ProductService) { 
      this.category.getAllScrollerValues().subscribe((res)=>{
        this.scrollerValues=res
      });
    }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    return this.getAllScrollerValuesByScrollId(value);
  }


  getAllScrollerValuesByScrollId(id) {
    this.result = this.scrollerValues.filter(item =>item.promotion_id==id);
    return this.result;
  }
}
