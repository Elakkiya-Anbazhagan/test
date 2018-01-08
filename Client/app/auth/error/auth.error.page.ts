import { Component } from '@angular/core';
import { UtilityService } from 'systemic/helper';

@Component({
    selector: 'auth-error',
    templateUrl: './auth.error.page.html',
})
export class AuthErrorComponent {
    public Code: string;
    public Message: string;
    constructor(private us: UtilityService) {
        const params = us.getParams();
        if (params) {
            this.Code = us.getParams().code;
            if (this.Code === '401.3') {
                this.Message = 'You are not allow to access this page';
            } else if (this.Code === '404') {
                this.Message = 'Page Not Found';
            } else if (this.Code === '500') {
                this.Message = 'Something went wrong';
            } else if (this.Code === '403') {
                this.Message = 'Forbidden access';
            } else {
                this.Code = '501';
                this.Message = 'Something went wrong';
            }
        } else {
            this.Code = '501';
            this.Message = 'Something went wrong';
        }
    }
}
