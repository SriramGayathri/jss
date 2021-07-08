import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  user: User;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
      this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
      return this.user && this.user.role === Role.Admin;
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/auth']);
  }


}
