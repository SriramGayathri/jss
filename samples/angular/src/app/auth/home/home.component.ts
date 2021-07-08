import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


import { User, Role } from '../_models';
import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi: User;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,  private router: Router
    ) {
        this.user = this.authenticationService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }
    get isAdmin() {
        return this.user && this.user.role === Role.Admin;
    }
  
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
}