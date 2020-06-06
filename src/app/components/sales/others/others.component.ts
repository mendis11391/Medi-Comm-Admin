import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
import { DeliverydateService } from '../services/deliverydate.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  days: FormGroup;
  successMsg = false;

  constructor(private formBuilder: FormBuilder, private delvdate: DeliverydateService) { }

  ngOnInit() {
    this.days = this.formBuilder.group({
      bangalore: ['', Validators.required],
    });

    this.delvdate.getAllCities().subscribe((res: any) => {
      if (res) {
        var a = res.filter((res) => {
          if(res.cityname === 'Bangalore') {
            return res;
          }
      });
      this.days.patchValue({
        bangalore: a[0].tentitiveDeleivery
      });
      }
   });
  }

  addDays() {
    this.delvdate.updateDeliveryDate(this.days.value).subscribe((res) => {
      this.successMsg = true;
    });
  }


}
