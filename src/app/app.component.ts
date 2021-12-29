import { Component } from '@angular/core';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'irentout-backend';
  userRole= JSON.parse(JSON.stringify(localStorage.getItem('u_role')));

  constructor(private auth:AuthService){
    this.auth.login(this.userRole);
  }
}
