import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, Role } from '../_models';
import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    loading = false;
    users: User[] = [];
    user: User;
    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,  private router: Router
    ) {
        this.user = this.authenticationService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
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