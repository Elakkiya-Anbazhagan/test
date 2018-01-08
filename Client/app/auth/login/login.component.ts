import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UtilityService, notyTheme, notyType, ApiService } from 'systemic/helper';

const Noty = require('noty');
declare var Velocity: any;
@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    login: MlAuthData;
    constructor(public titleService: Title, private http: ApiService, private router: Router, private lib: UtilityService) {
        this.titleService.setTitle('Login');
        this.login = {
            Username: '',
            Password: ''
        };
    }
    btnLoginclick() {
        this.http.post('/app/SignIn', this.login).subscribe(
            (res) => {
                this.router.navigate(['/app/dashboard']);
                this.lib.notification.success('Login Success');

            },
            (err) => {
                console.log(err);
                this.lib.notification.error(err.message);
            }
        );
    }

    public ngOnInit() {
    }
}

class MlAuthData {
    Username: string;
    Password: string;
}


