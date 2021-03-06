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
  taxes:FormGroup;
  successMsg = false;
  successMsg1 = false;

  constructor(private formBuilder: FormBuilder, private delvdate: DeliverydateService) { }

  ngOnInit() {
    this.days = this.formBuilder.group({
      bangalore: ['', Validators.required],
      mumbai: ['', Validators.required],
      pune: ['', Validators.required],
      hyderabad: ['', Validators.required],
    });

    this.taxes = this.formBuilder.group({
      bangalore: ['', Validators.required],
      mumbai: ['', Validators.required],
      pune: ['', Validators.required],
      hyderabad: ['', Validators.required],
    });

    this.delvdate.getAllCities().subscribe((res: any) => {
      if (res) {
        const a = res;
        this.days.patchValue({
          bangalore: a[0].tentitiveDeleivery,
          mumbai: a[1].tentitiveDeleivery,
          pune: a[2].tentitiveDeleivery,
          hyderabad: a[3].tentitiveDeleivery
        });

        this.taxes.patchValue({
          bangalore: a[0].taxes,
          mumbai: a[1].taxes,
          pune: a[2].taxes,
          hyderabad: a[3].taxes
        });
      }
    });
  }

  addDays() {
    this.delvdate.updateDeliveryDate(this.days.value).subscribe((res) => {
      this.successMsg = true;
    });
  }

  addTaxes() {
    this.delvdate.updateTaxes(this.taxes.value).subscribe((res) => {
      this.successMsg1 = true;
    });
  }

}
