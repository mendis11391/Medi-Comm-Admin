import { Component } from '@angular/core';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'irentout-backend';
  userRole= JSON.parse(JSON.stringify(sessionStorage.getItem('u_role')));
  adminName = JSON.parse(JSON.stringify(sessionStorage.getItem('adminName')));
  token = JSON.parse(JSON.stringify(sessionStorage.getItem('token')));
  constructor(private auth:AuthService){
    this.auth.login(this.userRole);
    this.auth.getUserDetails(this.token).subscribe(resp => {
      console.log(resp);
      sessionStorage.setItem('user_id', resp.data[0].customer_id);
      sessionStorage.setItem('u_role', resp.data[0].login_type);
      sessionStorage.setItem('adminName', resp.data[0].firstName);
      // this.auth.login(resp.data[0].firstName);
    });
  }
}
