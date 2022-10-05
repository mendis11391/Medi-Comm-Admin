import { Component, OnInit, Directive  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbDateStruct, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  public generalForm: UntypedFormGroup;
  public restrictionForm: UntypedFormGroup;
  public usageForm: UntypedFormGroup;
  public model: NgbDateStruct;
  public date: { year: number, month: number };
  public modelFooter: NgbDateStruct;

  constructor(private formBuilder: UntypedFormBuilder, private calendar: NgbCalendar, private http:HttpClient) {
    this.createGeneralForm();
    this.createRestrictionForm();
    this.createUsageForm();
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  createGeneralForm() {
    this.generalForm = this.formBuilder.group({
      coupon_title: [''],
      coupon_code: [''],
      start_date: [''],
      end_date: [''],
      free_shipping: [''],
      quantity: [''],
      discount_type: [''],
      status: [''],
    });
  }

  createRestrictionForm() {
    this.restrictionForm = this.formBuilder.group({
      products: [''],
      category: [''],
      min: [''],
      max: ['']
    })
  }

  createUsageForm() {
    this.usageForm = this.formBuilder.group({
      limit: [''],
      customer: ['']
    })
  }
  ngOnInit() {

  }

  onSubmit() {

    this.http.post(`${environment.apiUrl}/coupons`, this.generalForm).subscribe((res) => {
      console.log(res);
    });
  }

}
