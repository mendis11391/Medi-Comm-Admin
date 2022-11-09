import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

export interface tenurePriority {
  discount?:number,
  id?: number,
  default_tenure?: number,
  priority?: number,
  scheme_name?: string,
  tenure?: number,
  tenure_id?: number,
  tenure_period?: string
}

@Pipe({
  name: 'tenurePriority',
  pure: false
})
export class TenurePipe implements PipeTransform {

  tenureValues:any;
  result:any;
    constructor(private category:ProductService) { 
      this.category.getTenureByPriority().subscribe((res)=>{
        this.tenureValues=res
      })
    }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    return this.getTenureByPriority(value);
  }


  getTenureByPriority(id){
    this.result = this.tenureValues.filter(item =>item.priority==id);
    return this.result;
  }
}
