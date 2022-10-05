import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.scss']
})
export class PincodesComponent implements OnInit {
  pincodes;
  public closeResult: string;
  pincodeObj={
    id:0,
    pincode:'',
    freeDelivery:false,
    twoWheelerCharges:0,
    fourWheelerCharges:0,
    status:false
  }


  constructor(private http: HttpClient,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllPincodes();
  }
  
  getAllPincodes() {
    this.http.get(`${environment.apiUrl}/cities/getAllDeliveryPincodes/1`).subscribe(res => {
      this.pincodes = res;
    });
  }

  updatePincode(obj){    
    this.http.put(`${environment.apiUrl}/cities/updatepincode/${obj.id}`,obj).subscribe((res)=>{
      this.modalService.dismissAll();
      alert('Updated');
      this.getAllPincodes();
    });
  }

  open2(addSpec, obj) {
    this.pincodeObj.id = obj.id;
    this.pincodeObj.pincode = obj.pincode;
    this.pincodeObj.freeDelivery = obj.free;
    this.pincodeObj.twoWheelerCharges = obj.delivery_2wheeler;
    this.pincodeObj.fourWheelerCharges= obj.delivery_4wheeler;
    this.pincodeObj.status = obj.status;
    
    this.modalService.open(addSpec, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
}
