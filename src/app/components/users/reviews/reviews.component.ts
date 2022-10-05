import { Component, OnInit, Directive  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  public reviewForm: UntypedFormGroup;
  fromDate: NgbDate;
  rate:number=0;
  inputsRequired:boolean=false;
  reviews;

  public settings = {
    edit: {
      confirmSave: true
    },
    actions: {
      position: 'right'
    },
    columns: {      
      customer_id: {
        title: 'Customer #'
      },
      display_name: {
        title: 'Name'
      },
      display_mobile: {
        title: 'Mobile'
      },
      ratings: {
        title: 'Ratings',
      },
      review: {
        title: 'Review'
      },
      status: {
        title: 'Status'
      },
    },
  };

  constructor(private http: HttpClient,private formBuilder: UntypedFormBuilder) { 
    this.reviewForm = this.formBuilder.group({
      displayName: ['',Validators.required],
      displayMobile: ['',Validators.required],
      ratings: ['',Validators.required],
      review: [''],
      postDate: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(){
    this.http.get(`${environment.apiUrl}/reviews/getAllReviews`, this.reviewForm.value).subscribe((reviews)=>{
      this.reviews=reviews;
    });
  }

  postReview(){
    this.inputsRequired=false;
    if(this.reviewForm.valid){ 
      this.http.post(`${environment.apiUrl}/reviews/adminReview`, this.reviewForm.value).subscribe((res) => {
        this.reviewForm.reset();
        alert('Review submitted sucessfully')
      });
    } else{
      this.inputsRequired=true;
    }    
  }

  editReview(e){
    if (window.confirm('Are you sure you want to save?')) {
      console.log(e.newData);
      this.http.put(`${environment.apiUrl}/reviews/updateReviewValue`, e.newData).subscribe();
      this.loadReviews(); 
      e.confirm.resolve(e.newData);
    } else {
      e.confirm.reject();
    }
  }

}
