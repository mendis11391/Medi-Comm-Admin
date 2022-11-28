import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Directive, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../products/services/orders.service';
import { KYC } from "../../../shared/data/kyc";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
declare const jQuery:any;

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent implements OnInit {
  @ViewChild('addressModal') addressModal;
  currentDate = new Date();
  kycId;
  customerDetails;
  public kycDetails:KYC;
  kycImages:any;
  public closeResult: string;
  kycVariantDetails:KYC;
  kycStatusForm:UntypedFormGroup;
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

  public orders=[];

  public address=[];
  public defaultAddress=[];

  modalReference;

  displayName:boolean;
  nickName:boolean;
  firstNameAddress:boolean;
  address1:boolean;
  address2:boolean;
  landmark:boolean;
  city:boolean;
  pincode:boolean;
  mobile:boolean;
  eemail2:boolean;

  constructor(private fb: UntypedFormBuilder,private modalService: NgbModal,private sanitizer: DomSanitizer,private os:OrdersService,private route: ActivatedRoute,private http: HttpClient) { 
    this.kycStatusForm = this.fb.group({
      kyc_status:'',
      comments:''
    });
  }

  ngOnInit(): void {
    this.kycId=this.route.snapshot.params['id'];
    this.getKYCDetailsById(this.kycId);
    
  }

  getAllorders(id){
    this.os.getAllOrdersByCustomerId(id).subscribe((orders)=>{
      this.orders=orders.filter(item=>(item.paymentStatus=='Success' && item.orderType_id==1) && item.deliveryStatus!='4');
    });
  }

  getAllAddresses(id){
    this.os.getAllAddressByCustomersByid(id).subscribe((address)=>{
      this.address = address;
      this.defaultAddress = this.address.filter(item => item.default_address==1)
    })
  }

  updateCustomerAddressFeild(addresssId, value, fieldName){
    let AddressObj={
      value:value,
      fieldName:fieldName
    };
    this.os.updateCustomerAddressFeild(addresssId,AddressObj).subscribe((resp)=>{
      alert('Address feild updated successfully');      
    });
  }

  openAddressModal() {
    this.modalReference=this.modalService.open(this.addressModal,{ windowClass: 'my-address'});
  }


  updateOrderDeliveryStatus(deliveryStatusValue){
    this.orders.forEach((res)=>{
      console.log(res);
      this.http.put(`${environment.apiUrl}/orders/updateAnyOrderField/${res.order_id}`, {orderField: 'deliveryStatus', orderValue: deliveryStatusValue}).subscribe();
    });
  }

  async getKYCDetailsById(id){
   var mainTableResult = await this.os.getKYCMainTableByid(id).toPromise();
   this.kycDetails = mainTableResult[0];  
   if(mainTableResult){
    this.getAllorders(this.kycDetails.customer_id);
    var customerResult= await this.os.getAllCustomersByid(this.kycDetails.customer_id).toPromise();
    this.customerDetails = customerResult;
    this.getAllAddresses(this.customerDetails[0].customer_id);

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
    var html = this.kycDetails.comments;
    html=html.replace(/<li>/g, '👉 ').replace(/<\/?[^>]+(>|$)/g, "").replace("/\n/g", "").replace("/\t/g", "").replace(/\s\s+/g, '');
    var div = document.createElement("div");
    div.innerHTML = html;
    this.os.updateKYCMainTableByid(id, {field:field, value:value,comments:div.innerText, mobile:this.customerDetails[0].mobile, fullName:this.customerDetails[0].firstName+' '+this.customerDetails[0].lastName}).subscribe((res)=>{   
      this.getKYCDetailsById(this.kycId);   
      this.modalService.dismissAll();
      this.value='';
    })
  }

  notifyMail(value, templateId){    
    console.log(this.customerDetails[0].email);
    this.os.getEmailTemplatesByid(templateId).subscribe((resp)=>{
      this.os.kycNotifyMail({email:this.customerDetails[0].email,value:value,comments:this.kycDetails.comments, template:resp[0]}).subscribe();
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