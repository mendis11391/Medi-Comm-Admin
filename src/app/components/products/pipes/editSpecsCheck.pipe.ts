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
      // this.category.getAllSpecValues().subscribe((res)=>{
      //   this.specValues=res
      // });
      this.category.getAllProductSpecs().subscribe((res)=>{
        this.specValues=res
      });
    }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    // this.category.getAllSpecsByProductId(args).subscribe((res)=>{
    //   this.specValues=res[0];
    //   this.result = this.specValues.filter(item =>item.Spec_Value_Id==value);
    //   console.log(this.result);
     
      
    // })
    // console.log(args);
    // if(Object.values(args).includes(value)){
    //     return true;
    // } else{
    //     return false;
    // }
    return this.getAllspecValuesBySpecId(value, args);
  }


  getAllspecValuesBySpecId(id, prodId) {
    this.result='';
    this.result = this.specValues.find(item =>item.Spec_Value_Id==id && item.product_id==prodId);
    console.log(this.result);
    if(this.result){
      return true;
    } else{ 
      return false;
    }
    // return this.result;
  }
}
