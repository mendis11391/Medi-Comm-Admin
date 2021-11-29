import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  inputsRequired:boolean=false;
  formSuccessfull:boolean=false;
  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
    this.createAccountForm();
    this.createPermissionForm();
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      phone: ['',Validators.required],
      email: ['',Validators.required],
      password: [1234]
    })
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
  }

  ngOnInit() {
  }

  onSubmit(){
    this.inputsRequired=false;
    if(this.accountForm.valid){
      this.http.post('http://localhost:3000/otpRegister', this.accountForm.value).subscribe((res) => {
       console.log(res);
       this.formSuccessfull=true;
        setTimeout(() => {
          this.formSuccessfull=false;
        }, 3000);
      });
    } else{
      this.inputsRequired=true;
    }
  }

}
