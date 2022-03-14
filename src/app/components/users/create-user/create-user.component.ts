import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: FormGroup;
  public billingAddressForm: FormGroup;
  public permissionForm: FormGroup;
  inputsRequired:boolean=false;
  formSuccessfull:boolean=false;
  otherAddress;
  dropdownSettings:IDropdownSettings = {};

  customers:any;
  selectedItems;
  allAddresses;
  isHome:boolean;
  isWork:boolean;
  public temp = [];
  customerExist:boolean;

  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
    this.getAllCustomers();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'customer_id',
      textField: 'mobile',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.createAccountForm();
    this.createPermissionForm();
    
  }

  updateFilter(event) {
    this.temp=this.customers;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.mobile.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    if(temp.length>=1){
      this.customerExist= true;
    } else{
      this.customerExist= false;
    }
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0; 
  }

  getAllCustomers(){
    this.http.get(`${environment.apiUrl}/users`).subscribe((users)=>{
      this.customers=users
    })
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      phone: ['',Validators.required],
      email: ['',Validators.required],
      password: [1234]
    });

    this.billingAddressForm = this.formBuilder.group({
      addresstype:['', Validators.required],
      Name: ['', [Validators.required, Validators.maxLength(30)]],
      nickname:['',Validators.required],
      Contact:['',[Validators.maxLength(11)]],
      addressLine1: ['', [Validators.required, Validators.maxLength(200)]],
      addressLine2: ['', [Validators.maxLength(200)]],
      landmark: ['', [Validators.maxLength(200)]],
      town: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  setAddressValue(){
    if(this.otherAddress!='Other'){      
      this.billingAddressForm.patchValue({
        nickname:this.otherAddress
      });
    } else{
      this.billingAddressForm.patchValue({
        nickname:''
      });
    }
  }

  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
  }

  ngOnInit() {
  }

  onSubmit(){
    this.inputsRequired=false;
    if(!this.customerExist){
      if(this.accountForm.valid){
        this.http.post(`${environment.apiUrl}/otpRegister`, this.accountForm.value).subscribe((res) => {
        //  this.formSuccessfull=true;       
         this.accountForm.reset();
          alert('Customer added successfully')
        });
      } else{
        this.inputsRequired=true;
      }
    }     
  }

  async addBillAddress() {
    const controls = this.billingAddressForm.controls;

    Object.keys(controls).forEach(key => {
      controls[key].markAsTouched();
    });

    this.http.get(`${environment.apiUrl}/users/getUserAddressInfo/${this.selectedItems}`).subscribe((addresses)=>{
      this.allAddresses = addresses;
      if(this.billingAddressForm.valid){
        const formVal = this.billingAddressForm.value;
          const addr = {
            uid:this.selectedItems,
            displayName:formVal.Name,
            nickName:formVal.nickname,
            addressMobile: formVal.Contact,
            address1:formVal.addressLine1,
            address2: formVal.addressLine2,
            landmark:formVal.landmark,
            city: formVal.town,
            state: formVal.state,
            pincode: formVal.pincode,
            address_type: formVal.addresstype,
            default_address: false,
            status:1
          };
  
          if(this.allAddresses.length>0){
            addr.default_address=false;
          } else{
            addr.default_address=true;
          }
  
          this.http.post(`${environment.apiUrl}/users/addresses`, addr).subscribe((address)=>{
            alert('Address added successfully');          
            this.billingAddressForm.reset();
          });
      }
    });
    
  }

  

  onItemSelect(e){
    this.selectedItems = e.customer_id;
  }

}
