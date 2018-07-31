import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(private router: Router, private api: ApiService) { }
  private user = { email: '', password: '', confirm: '' };

  ngOnInit() {
    this.api.tryConnect();

    if(this.api.isConnected()) {
      this.router.navigate(['/to-do']);
    }
  }

  async signUp() {
    if(this.user.password != this.user.confirm) return;
    try {
      console.log(await this.api.register(this.user.email, this.user.password));
      this.router.navigate(['/to-do']);
    } catch(ex) {
      console.error(ex);
    }
  }
}
