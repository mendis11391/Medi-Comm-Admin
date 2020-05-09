import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from  '@angular/forms';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  days: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.days = this.formBuilder.group({
      days: [''],
    });
  }

  addDays() {
  }

  

}
