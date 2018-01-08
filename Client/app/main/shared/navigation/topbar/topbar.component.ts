import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgForm } from '@angular/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'systemic-topbar',
    templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
    public mlchange: mlchangePassword;
    @ViewChild('mdChangePassword') mdChangePassword: ModalComponent;
    UserImage: string;
    Fullname: string;
    constructor(private router: Router, private http: ApiService, private lib: UtilityService) {
    }
    ngOnInit() {
        this.mlchange = new mlchangePassword();
        this.UserImage = '/assets/images/avatars/user1.png';
        this.Fullname = this.lib.authData().Profile.FullName;
        this.mlchange.UserName = this.lib.authData().Profile.Username;
    }
    btnChangePassword() {
        // this.mdChangePassword.open('md');
        // this.mlchange = new mlchangePassword();
    }
    btnChange(formdata: NgForm) {
        this.mlchange.UserSysID = this.lib.authData().Profile.SysId
        this.http.post(this.lib.getApiUrl('/Profile/ChangePassword/' + this.mlchange.UserSysID + '/' + this.mlchange.OldPassword + '/' + this.mlchange.NewPassword)).subscribe(
            (res) => {
                this.lib.notification.success(res.message);
                this.mdChangePassword.close();
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    btnLogOut() {
        this.lib.notification.confirm('Do you want to  LogOut', () => {
            window.location.href = '/app/signout';
        }, () => { });
    }

}
export class mlchangePassword {
    UserSysID: number;
    UserName: string;
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}