import { Component, OnInit, Directive  } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from  '@angular/forms';
import { DeliverydateService } from '../services/deliverydate.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  days: UntypedFormGroup;
  taxes:UntypedFormGroup;
  padding:UntypedFormGroup;
  successMsg = false;
  successMsg1 = false;
  successMsg2 = false;

  constructor(private formBuilder: UntypedFormBuilder, private delvdate: DeliverydateService) { }

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

    this.padding = this.formBuilder.group({
      bangalore: ['', Validators.required],
      mumbai: ['', Validators.required],
      pune: ['', Validators.required],
      hyderabad: ['', Validators.required],
    });

    this.delvdate.getAllCities().subscribe((res: any) => {
      if (res) {
        const a = res;
        this.padding.patchValue({
          bangalore: a[0].city_invoice_padding
        })
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

  updatePadding() {
    this.delvdate.updatePadding(this.padding.value, 1).subscribe((res) => {
      this.successMsg2 = true;
    });
  }

}
