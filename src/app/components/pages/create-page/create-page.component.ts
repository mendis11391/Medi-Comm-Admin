import { Component, OnInit, Directive  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  public generalForm: UntypedFormGroup;
  public seoForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.createGeneralForm();
    this.createSeoForm();
  }

  createGeneralForm() {
    this.generalForm = this.formBuilder.group({
      name: [''],
      desc: [''],
      status: ['']
    })
  }
  createSeoForm() {
    this.seoForm = this.formBuilder.group({
      title: [''],
      keyword: [''],
      meta_desc: ['']
    })
  }

  ngOnInit() {
  }

}
