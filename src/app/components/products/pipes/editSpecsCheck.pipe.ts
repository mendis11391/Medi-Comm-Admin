import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

export interface specValues {
  spec_id?: number,
  spec_value?: string,
  status?: boolean
}

@Pipe({
  name: 'editSpecCheck',
  pure: true
})
export class EditSpecPipe implements PipeTransform {

  specValues:any;
  result:any;
    constructor(private category:ProductService) { 
      this.category.getAllSpecValues().subscribe((res)=>{
        this.specValues=res
      })
    }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    console.log(args);
    if(Object.values(args).includes(value)){
        return true;
    } else{
        return false;
    }
  }


  getAllspecValuesBySpecId(id) {
    this.result = this.specValues.filter(item =>item.spec_id==id);
    return this.result;
  }
}
