import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  constructor( private router: Router, private api: ApiService ) { }
  private user = { email: '', password: '' };

  ngOnInit() {
    if(this.api.isConnected()) {
      this.router.navigate(['/to-do']);
    }
  }

  async logIn() {
    try {
      await this.api.login(this.user.email, this.user.password);
      this.router.navigate(['/to-do']);      
    } catch(ex) {
      console.error(ex);
    }
  }

}
