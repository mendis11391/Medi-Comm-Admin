import { Component, OnInit, Directive  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, User } from '../user';

interface Response {
  token: string,
  authenticated: boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public registerForm: UntypedFormGroup;
  loginError = false;
  public user;
  Role = Role;
  

  constructor(private formBuilder: UntypedFormBuilder, private login: AuthService, private router: Router) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to Irentout",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Irentout",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Irentout",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      userName: [''],
      password: [''],
      confirmPassword: [''],
    })
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.login.loginCheck(this.loginForm.value).subscribe((res: Response) => {
        
        if (res.authenticated) {
          this.login.getUserDetails(res.token).subscribe(resp => {
            sessionStorage.setItem('user_id', resp.data[0].customer_id);
            sessionStorage.setItem('u_role', resp.data[0].login_type);
            sessionStorage.setItem('adminName', resp.data[0].firstName);
            this.login.login(resp.data[0].firstName);
          });
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard/default']);
          setTimeout(()=>{
            window.location.reload();
          }, 100);
        } else {
          this.loginError = !res.authenticated;
        }
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }


  ngOnInit() {
    
  }

}
