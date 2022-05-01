import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../products/services/orders.service';
import { KYC } from "../../../shared/data/kyc";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
declare const jQuery:any;

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent implements OnInit {

  currentDate = new Date();
  kycId;
  customerDetails;
  public kycDetails:KYC;
  kycImages:any;
  public closeResult: string;
  kycVariantDetails:KYC;
  kycStatusForm:FormGroup;
  value:string;
  
  aadharImage=[];
  selfieImage=[];
  pgImage=[];
  collageId=[];
  permanentaddress=[];
  ownEBill=[];
  rentedEBill=[];
  rentalAgreement=[];
  anyBill=[];
  gstCertificate=[];
  moa=[];
  aoa=[];
  purchaseOrder=[];

  viewImage:any;

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
    this.aadharImage = this.kycImages.filter(item=>item.proofId==1);
    this.selfieImage=this.kycImages.filter(item=>item.proofId==2);
    this.pgImage = this.kycImages.filter(item=>item.proofId==3);
    this.collageId = this.kycImages.filter(item=>item.proofId==4);
    this.permanentaddress = this.kycImages.filter(item=>item.proofId==5);
    this.ownEBill = this.kycImages.filter(item=>item.proofId==6);
    this.rentedEBill = this.kycImages.filter(item=>item.proofId==7);
    this.rentalAgreement = this.kycImages.filter(item=>item.proofId==8);
    this.anyBill = this.kycImages.filter(item=>item.proofId==9);
    this.gstCertificate = this.kycImages.filter(item=>item.proofId==10);
    this.moa = this.kycImages.filter(item=>item.proofId==11);
    this.aoa = this.kycImages.filter(item=>item.proofId==12);
    this.purchaseOrder = this.kycImages.filter(item=>item.proofId==13);
   }  
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  open(modal) {    
    this.modalService.open(modal, { windowClass : "my-modal",ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  updateStatus(id, field, value){
    this.os.updateKYCMainTableByid(id, {field:field, value:value}).subscribe((res)=>{   
      this.getKYCDetailsById(this.kycId);   
      this.modalService.dismissAll();
      this.value='';
    })
  }

  notifyMail(value, templateId){    
    console.log(this.customerDetails[0].email);
    this.os.getEmailTemplatesByid(templateId).subscribe((resp)=>{
      console.log(resp);
      this.os.kycNotifyMail({email:this.customerDetails[0].email,value:value, template:{template:resp[0].template }}).subscribe();
    });    
  }

  setExpiryDate(id){
    this.os.updateKYCMainTableExpiryDateByid(id,{expiryDate:new Date()}).subscribe();
  }

  downloadFile(content,fileType){
    saveAs(content, fileType)
  }

}



// notifyMail('eKYC approved', 1)