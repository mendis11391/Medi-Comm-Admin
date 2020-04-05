import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

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

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  loginError = false;

  constructor(private formBuilder: FormBuilder, private login: AuthService, private router: Router) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
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
        console.log(res);
        if (res.authenticated) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard/default']);
        } else {
          this.loginError = !res.authenticated;
        }
      });
    } else {

    }
  }


  ngOnInit() {
  }

}
