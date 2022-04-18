import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../products/services/orders.service';
import { KYC } from "../../../shared/data/kyc";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare const jQuery:any;

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent implements OnInit {

  kycId;
  customerDetails;
  public kycDetails:KYC;
  kycImages:any;
  public closeResult: string;
  kycVariantDetails:KYC;
  kycStatusForm:FormGroup;

  constructor(private fb: FormBuilder,private modalService: NgbModal,private sanitizer: DomSanitizer,private os:OrdersService,private route: ActivatedRoute,private http: HttpClient) { 
    this.kycStatusForm = this.fb.group({
      kyc_status:'',
      comments:''
    });
  }

  ngOnInit(): void {
    this.kycId=this.route.snapshot.params['id'];
    this.getKYCDetailsById(this.kycId);
  }

  async getKYCDetailsById(id){
   var mainTableResult = await this.os.getKYCMainTableByid(id).toPromise();
   this.kycDetails = mainTableResult[0];  
   if(mainTableResult){
    var customerResult= await this.os.getAllCustomersByid(this.kycDetails.customer_id).toPromise();
    this.customerDetails = customerResult;

    if(this.kycDetails.customer_type=='Individual'){
      var individualDetails = await this.os.getKYCIndividualByid(id).toPromise();
      this.kycVariantDetails = individualDetails[0];
    }
    this.kycImages = await this.os.getKYCImage(id).toPromise();
   }  
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  open(modal) {    
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  updateStatus(id){
    this.os.updateKYCMainTableByid(id, this.kycStatusForm.value).subscribe((res)=>{   
      this.getKYCDetailsById(this.kycId);   
      this.modalService.dismissAll();
    })
  }
}
