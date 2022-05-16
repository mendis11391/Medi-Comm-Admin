import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation  } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KYC } from 'src/app/shared/data/kyc';
import { OrdersService } from '../../products/services/orders.service';
import { Address } from "../../../shared/data/address";
import { ActivatedRoute, Router } from '@angular/router';

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

@Component({
  selector: 'app-create-edit-kyc',
  templateUrl: './create-edit-kyc.component.html',
  styleUrls: ['./create-edit-kyc.component.scss']
})
export class CreateEditKycComponent implements OnInit {

  resizeImage = (settings: IResizeImageOptions) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
      console.log(dataURI);
      return dataURI;
    };
    const resize = () => {
      let width = image.width;
      let height = image.height;
  
      if (width > height) {
          if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
          }
      } else {
          if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
          }
      }
  
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      let dataUrl = canvas.toDataURL('image/jpeg');
      console.log(dataURItoBlob(dataUrl));
      return dataURItoBlob(dataUrl);
    };
  
    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
          no(new Error("Not an image"));
          return;
        }

        reader.onload = (readerEvent: any) => {
          
          image.src = readerEvent.target.result;   
          readerEvent.blobImage =  image.onload = () => ok(resize());
          console.log(image.src);    
        };
        reader.readAsDataURL(file);
    })    
  };

  public closeResult: string;
  public kycForm: FormGroup;
  public kycCompanyForm: FormGroup;
  imageSrc;
  aadharImage=[];
  selfieImage=[];
  pgReceipt=[];
  collageId=[];
  permanentAddressProof=[];
  ownElectricitybill=[];
  rentedEletricityBill=[];
  retalAgreement=[];
  anyBill=[];

  kycData=[];

  fileList: File[] = [];
  listOfFiles: any[] = [];
  photoList: File[] = [];
  aadharList: File[] = [];
  addressProofList: File[] = [];
  photograph: any[] = [];
  aadhar: any[] = [];
  addressProof: any[] = [];
  kyc:boolean = false;
  uid:string;

  customerType:string = 'Individual';
  addressType:number;
  tc:boolean;
  kycStatus:KYC;

  updateForm:boolean;
  createNewKyc:boolean;

  billAddress:Address={};

  @ViewChild('photoId') photoId: any;
  @ViewChild('aadharId') aadharId: any;
  @ViewChild('addressProofId') addressProofId: any;
  @ViewChild('myTabSet') myTabSet;

  tab1:boolean=true;
  tab2:boolean;
  tab3:boolean;
  tab4:boolean;
  tab5:boolean;

  constructor( private router: Router,private route: ActivatedRoute,private os: OrdersService,private modalService: NgbModal,private sanitizer: DomSanitizer,private fb: FormBuilder,private el: ElementRef) {
    this.uid = this.route.snapshot.url[1].path;
      this.kycForm = this.fb.group({
        customer_id:this.uid,
        customerType:'Individual',
        alternateMobileNo: ['', [Validators.pattern('[0-9]{11}')]],
        company:[''],
        occupation:[''],
        socialLink: ['', [Validators.required]],
        aadharNo: ['', [Validators.required]],
        aadharImage: ['', [Validators.required]],
        selfieImage: ['', [Validators.required]],
        addressType:['', [Validators.required]],
        pgReceipt: ['', [Validators.required]],
        collageId: ['', [Validators.required]],
        permanentAddressProof: ['', [Validators.required]],
        ownElectricitybill: ['', [Validators.required]],
        rentedEletricityBill: ['', [Validators.required]],
        retalAgreement: ['', [Validators.required]],
        anyBill: ['', [Validators.required]],
        ref1Name: ['', [Validators.required]],
        ref1Relation: ['', [Validators.required]],
        ref1Phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        ref2Name: ['', [Validators.required]],
        ref2Relation: ['', [Validators.required]],
        ref2Phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
        tc:['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadKycByCustomerId(this.uid);
    this.os.getorders(this.uid).subscribe((orders)=>{
      let successOrders = orders.filter(item=> item.paymentStatus=='Success');
      if(this.uid && successOrders.length>0){
        this.kyc=true;
      } else{
        this.kyc=false;
      }
    });
    this.loadAddress();
  }

  loadAddress(){
    this.os.getUserDetailsByUid(this.uid).subscribe((dta:Address[]) => {
      let result = dta.filter(item=>item.default_address==1);
      this.billAddress = result[0];
      console.log(this.billAddress);
    });
  }

  loadKycByCustomerId(id){
    this.os.getKycByCustomerId(id).subscribe((res)=>{    
      let result;
      result = res;  
      console.log(res);
      result = result.filter(item=>item.status==1);
      console.log(result)
      if(result.length>0){
        
        this.kycData.length=1;
        this.kycStatus = result[0];
        this.loadIndividualTable(this.kycStatus.id);
        this.loadImageTable(this.kycStatus.id);
      }
    });
    // this.kycStatus = result.filter
   }

   async loadIndividualTable(id){
    let res:any = await this.os.getKYCIndividualDetailsById(id).toPromise();
    res=res[0];
    this.kycForm.patchValue({
      customer_id:this.uid,
      customerType:'Individual',
      alternateMobileNo: [res.alternate_mobile],
      socialLink: [res.social_link],
      aadharNo: [res.aadhar_no],
      addressType:[res.address_type],
      ref1Name: [res.ref1_name],
      ref1Relation: [res.ref1_relation],
      ref1Phone: [res.ref1_ph],
      ref2Name: [res.ref2_name],
      ref2Relation: [res.ref2_relation],
      ref2Phone: [res.ref2_ph]
    });
   }

   async loadImageTable(id){
    let res:any = await this.os.getKYCImagesById(id).toPromise();
    console.log(res);
    let aadharImage = res.filter(item=>item.proofId==1).map(image=>image.Image);
    let selfieImage = res.filter(item=>item.proofId==2).map(image=>image.Image);
    let pgReceipt = res.filter(item=>item.proofId==3).map(image=>image.Image);
    let collageId = res.filter(item=>item.proofId==4).map(image=>image.Image);
    let permanentAddressProof = res.filter(item=>item.proofId==5).map(image=>image.Image);
    let ownElectricitybill = res.filter(item=>item.proofId==6).map(image=>image.Image);
    let rentedEletricityBill = res.filter(item=>item.proofId==7).map(image=>image.Image);
    let retalAgreement = res.filter(item=>item.proofId==8).map(image=>image.Image);
    let anyBill = res.filter(item=>item.proofId==9).map(image=>image.Image);
    console.log(res);
    for(let i=0;i<res.length;i++){
      this.pushImage(res[i].proofId, res[i].Image);
    }

    this.kycForm.patchValue({
      aadharImage: aadharImage,//1
      selfieImage: selfieImage,//2
      pgReceipt: pgReceipt,//3
      collageId: collageId,//4
      permanentAddressProof: permanentAddressProof,//5
      ownElectricitybill: ownElectricitybill,//6
      rentedEletricityBill: rentedEletricityBill,//7
      retalAgreement: retalAgreement,//8
      anyBill: anyBill,//9
    });
   }


   pushImage(id, image){
    if(id == 1){
      if(image.startsWith('JVB')){
       let aadhar = 'data:application/pdf;base64,'+image;
       this.aadharImage.push({img:aadhar,file:'Aadhar', fileType:'pdf',fileData:image}); 
      } else{        
         let aadhar = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
         this.aadharImage.push({img:aadhar,file:'Aadhar', fileType:'jpeg',fileData:image}); 
      }
    } else if(id == 2){
     if(image.startsWith('JVB')){
       let selfie = 'data:application/pdf;base64,'+image;
       this.selfieImage.push({img:selfie,file:'selfie', fileType:'pdf',fileData:image}); 
      } else{        
       let selfie = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.selfieImage.push({img:selfie,file:'selfie', fileType:'jpeg',fileData:image}); 
     }
   } else if(id == 3){
     if(image.startsWith('JVB')){
       let pgReceipt = 'data:application/pdf;base64,'+image;
       this.pgReceipt.push({img:pgReceipt,file:'PG receipt', fileType:'pdf',fileData:image}); 
     }else{        
       let pgReceipt = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.pgReceipt.push({img:pgReceipt,file:'PG receipt', fileType:'jpeg',fileData:image}); 
     }
   } else if(id == 4){
     if(image.startsWith('JVB')){
       let collageId = 'data:application/pdf;base64,'+image;
       this.collageId.push({img:collageId,file:'Collage ID', fileType:'pdf',fileData:image});
     }else{
       let collageId = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.collageId.push({img:collageId,file:'Collage ID', fileType:'jpeg',fileData:image});
     }
      
   } else if(id == 5){
     if(image.startsWith('JVB')){
       let permanentAddressProof = 'data:application/pdf;base64,'+image;
       this.permanentAddressProof.push({img:permanentAddressProof,file:'Permanent address', fileType:'pdf',fileData:image});
     }else{
       let permanentAddressProof = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.permanentAddressProof.push({img:permanentAddressProof,file:'Permanent address', fileType:'jpeg',fileData:image});
     }
      
   } else if(id == 6){
     if(image.startsWith('JVB')){
       let ownElectricitybill = 'data:application/pdf;base64,'+image;
       this.ownElectricitybill.push({img:ownElectricitybill,file:'Electricity bill', fileType:'pdf',fileData:image});
     }else{
       let ownElectricitybill = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.ownElectricitybill.push({img:ownElectricitybill,file:'Electricity bill', fileType:'jpeg',fileData:image});
     }
      
   } else if(id == 7){
     if(image.startsWith('JVB')){
       let rentedEletricityBill = 'data:application/pdf;base64,'+image;
       this.rentedEletricityBill.push({img:rentedEletricityBill,file:'Electricity bill', fileType:'pdf',fileData:image});
     }else{
       let rentedEletricityBill = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.rentedEletricityBill.push({img:rentedEletricityBill,file:'Electricity bill', fileType:'jpeg',fileData:image});
     }
      
   } else if(id == 8){
     if(image.startsWith('JVB')){
       let retalAgreement = 'data:application/pdf;base64,'+image;
       this.retalAgreement.push({img:retalAgreement,file:'Rental agreement', fileType:'pdf',fileData:image}); 
     }else{
       let retalAgreement = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.retalAgreement.push({img:retalAgreement,file:'Rental agreement', fileType:'jpeg',fileData:image}); 
     }
     
   } else if(id == 9){
     if(image.startsWith('JVB')){
       let anyBill = 'data:application/pdf;base64,'+image;
       this.anyBill.push({img:anyBill,file:'Other bill', fileType:'pdf',fileData:image}); 
     }else{
       let anyBill = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+image);
       this.anyBill.push({img:anyBill,file:'Other bill', fileType:'jpeg',fileData:image}); 
     }
     
   }
  }

  async imageChange(id) {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector(`#${id}`);

    var imageData;
    var finalBlob=[];
    var resizedImage;
    for(let i=0;i<inputEl.files.length;i++){  
      if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
        const config = {
          file: inputEl.files[i],
          maxSize: 1000
        };
        resizedImage = await this.resizeImage(config); 
      } 
      
       
      var fReader = new FileReader();
      
      if(id=='aadharImage'){
        // this.aadharImage=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.aadharImage.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.aadharImage.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            
            if(img[1].startsWith('JVB')){
             this.aadharImage.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf', fileData:img[1]}); 
            } else{
              this.aadharImage.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg', fileData:img[1]});            
            }
            let arrImg=[];
            this.aadharImage.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              aadharImage:arrImg
            });
  
          }
                    
        }
        
      } else if(id=='selfieImage'){
        this.selfieImage=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>2400000){
            img = resizedImage.split(",");
            
          } else{
            img = event.target.result.split(",");
          }
          
           this.selfieImage.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]}); 
           let arrImg=[];
          this.selfieImage.forEach((resp)=>{
            arrImg.push(resp.fileData);
          });
          this.kycForm.patchValue({
            selfieImage:arrImg
          });
        }
        
      }else if(id=='pgReceipt'){
        // this.pgReceipt=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.pgReceipt.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.pgReceipt.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.pgReceipt.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf',fileData:img[1]}); 
            } else{
              this.pgReceipt.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]});
              
            }
            let arrImg=[];
            this.pgReceipt.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              pgReceipt:arrImg
            });
          }
          
        }
      }else if(id=='collageId'){
        // this.collageId=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.collageId.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.collageId.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.collageId.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf',fileData:img[1]}); 
            } else{
              this.collageId.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]});
            }
            let arrImg=[];
            this.collageId.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              collageId:arrImg
            });
          }
          
        }
      }else if(id=='permanentAddressProof'){
        // this.permanentAddressProof=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.permanentAddressProof.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.permanentAddressProof.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.permanentAddressProof.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf', fileData:img[1]}); 
            } else{
              this.permanentAddressProof.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg', fileData:img[1]});
            } 
            let arrImg=[];
            this.permanentAddressProof.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              permanentAddressProof:arrImg
            });
          }
          
        }
      }else if(id=='ownElectricitybill'){
        // this.ownElectricitybill=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.ownElectricitybill.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.ownElectricitybill.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.ownElectricitybill.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf', fileData:img[1]}); 
            } else{
              this.ownElectricitybill.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg', fileData:img[1]});
            }
            let arrImg=[];
            this.ownElectricitybill.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              ownElectricitybill:arrImg
            });
          }          
        }
      }else if(id=='rentedEletricityBill'){
        // this.rentedEletricityBill=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.rentedEletricityBill.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.rentedEletricityBill.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.rentedEletricityBill.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf',fileData:img[1]}); 
            } else{
              this.rentedEletricityBill.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]});
            } 
            let arrImg=[];
            this.rentedEletricityBill.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              rentedEletricityBill:arrImg
            });
          }
          
        }
      }else if(id=='retalAgreement'){
        // this.retalAgreement=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.retalAgreement.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.retalAgreement.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.retalAgreement.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf',fileData:img[1]}); 
            } else{
              this.retalAgreement.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]});
            }
            let arrImg=[];
            this.retalAgreement.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              retalAgreement:arrImg
            });
          }
          
        }
      }else if(id=='anyBill'){
        // this.anyBill=[];
        fReader.onload = (event:any) => {
          let img;
          if(inputEl.files[i].size>=3000000 && inputEl.files[i].type=="application/pdf"){
            this.kycForm.controls.anyBill.setErrors({fileSize:true});
          } else{
            this.kycForm.controls.anyBill.setErrors({fileSize:false});
            if(inputEl.files[i].size>2400000 && inputEl.files[i].type!="application/pdf"){
              img = resizedImage.split(",");
              
            } else {
              img = event.target.result.split(",");
            }
            if(img[1].startsWith('JVB')){
             this.anyBill.push({img:'data:application/pdf;base64,'+img[1],file:inputEl.files[i].name, fileType:'pdf',fileData:img[1]}); 
            } else{
              this.anyBill.push({img:event.target.result,file:inputEl.files[i].name, fileType:'jpeg',fileData:img[1]});
            } 
            let arrImg=[];
            this.anyBill.forEach((resp)=>{
              arrImg.push(resp.fileData);
            });
            this.kycForm.patchValue({
              anyBill:arrImg
            });
          }
          
        }
      }
      

      fReader.readAsDataURL(inputEl.files[i]);
      fReader.onloadend = function(event){
        imageData = JSON.stringify(event.target.result);
        const contentType = 'image/png';
        const blob = b64toBlob(imageData.split(",")[1].slice(0,-1), contentType);      
      }
      
      const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        finalBlob.push(b64Data);
      }
    }
    
    // if(id=='selfieImage'){
    //   setTimeout(()=>{
    //     this.kycForm.patchValue({
    //       selfieImage:finalBlob
    //     });
    //   }, 100);
    // } 
    
    
  }

  kycSubmit(){
    const controls = this.kycForm.controls;

    controls['tc'].markAsTouched();

    if(this.kycForm.value.tc){          
      this.tab5=false;  
      this.os.kycDetailsSubmit(this.kycForm.value).subscribe((resp)=>{
        // this.loadKycByCustomerId(this.uid);
        this.aadharImage=[];
        this.selfieImage=[];
        this.pgReceipt=[];
        this.collageId=[];
        this.permanentAddressProof=[];
        this.ownElectricitybill=[];
        this.rentedEletricityBill=[];
        this.retalAgreement=[];
        this.anyBill=[];
        this.loadKycByCustomerId(this.uid);
        this.kycStatus.kyc_status='eKYC submitted';
      });
    }
  }

  switchNgBTab(id: string) {
    const controls = this.kycForm.controls;
    
    if(id=='tab-2'){
      controls['aadharNo'].markAsTouched();
      controls['aadharImage'].markAsTouched();
      controls['selfieImage'].markAsTouched();
    } else if(id=='tab-3' && !this.kycForm.value.addressType){
      controls['addressType'].markAsTouched();
    } else if(id=='tab-3' && this.kycForm.value.addressType==1){
      controls['pgReceipt'].markAsTouched();
      controls['collageId'].markAsTouched();
      controls['permanentAddressProof'].markAsTouched();
    } else if(id=='tab-3' && this.kycForm.value.addressType==2){
      controls['ownElectricitybill'].markAsTouched();
    } else if(id=='tab-3' && this.kycForm.value.addressType==3){
      controls['rentedEletricityBill'].markAsTouched();
      controls['retalAgreement'].markAsTouched();
    } else if(id=='tab-4'){
      controls['ref1Name'].markAsTouched();
      controls['ref1Relation'].markAsTouched();
      controls['ref1Phone'].markAsTouched();
      controls['ref2Name'].markAsTouched();
      controls['ref2Relation'].markAsTouched();
      controls['ref2Phone'].markAsTouched();
    }  else if(id=='tab-5' && !this.kycForm.value.socialLink){
      controls['socialLink'].markAsTouched();
    }
    if(id=='tab-2' && this.kycForm.value.aadharNo && this.kycForm.value.aadharImage.length>0 && this.kycForm.value.selfieImage.length>0){
      this.tab1=false;
      this.tab2=true;
      this.myTabSet.select(id);   
    } else if(id=='tab-3' && this.kycForm.value.addressType==1 && this.kycForm.value.pgReceipt.length>0 && this.kycForm.value.collageId.length>0 && this.kycForm.value.permanentAddressProof.length>0){
      this.tab2=false;
      this.tab3=true;
      this.myTabSet.select(id); 
    } else if(id=='tab-3' && this.kycForm.value.addressType==2 && this.kycForm.value.ownElectricitybill.length>0){
      this.tab2=false;
      this.tab3=true;
      this.myTabSet.select(id);  
    } else if(id=='tab-3' && this.kycForm.value.addressType==3 && this.kycForm.value.rentedEletricityBill.length>0 && this.kycForm.value.retalAgreement.length>0){
      this.tab2=false;
      this.tab3=true;
      this.myTabSet.select(id);  
    } else if(id=='tab-4' && this.kycForm.value.ref1Name && this.kycForm.value.ref1Relation && this.kycForm.value.ref1Phone && this.kycForm.value.ref2Name && this.kycForm.value.ref2Relation && this.kycForm.value.ref2Phone){
      this.tab3=false;
      this.tab4=true;
      this.myTabSet.select(id);   
    } else if(id=='tab-5' && this.kycForm.value.socialLink ){
      this.tab4=false;
      this.tab5=true;
      this.myTabSet.select(id);     
    }

  }

  switchBackNgBTab(id: string) {
    
    if(id=='tab-1' ){
      this.tab1=true;
      this.tab2=false; 
      this.myTabSet.select(id);   
    } else if(id=='tab-2'){
      this.tab2=true;
      this.tab3=false;
      this.myTabSet.select(id); 
    } else if(id=='tab-3'){
      this.tab3=true;
      this.tab4=false;
      this.myTabSet.select(id); 
    } else if(id=='tab-4'){
      this.tab4=true;
      this.tab5=false;  
      this.myTabSet.select(id); 
    }

  }

  removeSelectedFile2(index, id) {
    if(id=='aadharImage'){
      this.aadharImage.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.aadharImage.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          aadharImage:arrImg
        });
      },100);
    } else if(id=='selfieImage'){
      this.selfieImage.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.selfieImage.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          selfieImage:arrImg
        });
      },100);
    } else if(id=='pgReceipt'){
      this.pgReceipt.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.pgReceipt.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          pgReceipt:arrImg
        });
      },100);
    }else if(id=='collageId'){
      this.collageId.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.collageId.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          collageId:arrImg
        });
      },100);
    }else if(id=='permanentAddressProof'){
      this.permanentAddressProof.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.permanentAddressProof.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          permanentAddressProof:arrImg
        });
      },100);
    }else if(id=='ownElectricitybill'){
      this.ownElectricitybill.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.ownElectricitybill.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          ownElectricitybill:arrImg
        });
      },100);
    }else if(id=='rentedEletricityBill'){
      this.rentedEletricityBill.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.rentedEletricityBill.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          rentedEletricityBill:arrImg
        });
      },100);
    }else if(id=='retalAgreement'){
      this.retalAgreement.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.retalAgreement.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          retalAgreement:arrImg
        });
      },100);
    }else if(id=='anyBill'){
      this.anyBill.splice(index, 1);
      setTimeout(()=>{
        let arrImg=[];
        this.anyBill.forEach((resp)=>{
          arrImg.push(resp.fileData);
        });
        this.kycForm.patchValue({
          anyBill:arrImg
        });
      },100);
    }
  }

  kycUpdateSubmit(){
    const controls = this.kycForm.controls;

    controls['tc'].markAsTouched();

    if(this.kycForm.value.tc){      
      this.os.kycDetailsSubmit(this.kycForm.value).subscribe((resp)=>{
        // this.loadKycByCustomerId(this.uid);
        this. loadKycByCustomerId(this.uid);
        this.kycStatus.kyc_status='KYC submitted';
      });
    }
  }


  updateKYCDetailsTab(id){
    this.os.updateKYCDetailsTab(id, this.kycForm.value).subscribe((res)=>{
      this.updateForm=!this.updateForm;
      this.kycStatus.kyc_status='eKYC submitted';
    });
    
  }

  updateKYCIdProofTab(id){
    this.os.updateKYCIdProofTab(id, this.kycForm.value).subscribe();
  }

  updateKYCAddressProofTab(id){
    this.os.updateKYCAddressProofTab(id, this.kycForm.value).subscribe();
  }

  updateKYCReferencesTab(id){
    this.os.updateKYCReferencesTab(id, this.kycForm.value).subscribe();
  }

  open(modal) {    
    this.modalService.open(modal, { windowClass : "my-modal",ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

}
