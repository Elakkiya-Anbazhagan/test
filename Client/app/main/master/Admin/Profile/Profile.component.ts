import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as moment from 'moment';

import { UtilityService, ApiService } from 'systemic/helper';

import * as InterFace from './../../../InterFace';
import * as common from './../../../InterFace/ICommon';
import { Idd } from './../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../InterFace/IVoucher';

@Component({
    selector: 'User-Profile',
    templateUrl: 'Profile.component.html'
})

export class ProfileComponent implements OnInit {
    @ViewChild('mdLock') mdLock: ModalComponent;
    public mlProfile: mlProfile;
    public dsProfileList: mlProfileList[];
    public ProfileLock: mlProfile;

    public dsRole: Array<InterFace.Idd>;
    PanelEntry: Boolean = false;
    PanelList: Boolean = true;
    public isEditMode: boolean;

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('User-Profile');
        lib.setPageTitle('User-Profile');
        this.dsProfileList = [];
        this.mlProfile = new mlProfile();
        this.ProfileLock = new mlProfile;
        const Obs_dsRoleData = this.http.get(this.lib.getApiUrl('dropdown/GetRole'));

        Observable.forkJoin([Obs_dsRoleData]).subscribe(
            (lstRes) => {
                this.dsRole = lstRes[0].result.data;

            },
            (err) => {
                this.lib.notification.error(err.message);
            },

        );

    }
    ngOnInit() {
        this.LoadData();

    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('Profile/ReadAll')).subscribe(
            (res) => {
                this.dsProfileList = [];
                this.dsProfileList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnEdit_Click(profile: mlProfileList) {
        this.PanelList = false;
        this.PanelEntry = true;
        this.isEditMode = true;
        this.mlProfile.UserSysID = profile.UserSysID;
        if (this.lib.isNullOrUndefined(this.mlProfile.UserSysID)) {
            this.mlProfile.UserSysID = profile.UserSysID;
        }
        this.mlProfile.RoleSysID = profile.RoleSysID;
        this.mlProfile.UserName = profile.UserName;
        this.mlProfile.FullName = profile.FullName;
        this.mlProfile.Password = profile.Password;
    }
    btnLock_Click(profileList: mlProfileList, frmProfileLock: NgForm) {
        this.ProfileLock = new mlProfile();
        this.ProfileLock = profileList;
        frmProfileLock.resetForm();
        if (!profileList.Locked.IsLocked)
        // for Lock
        // tslint:disable-next-line:one-line
        {
            this.mdLock.open();
        } else // for un-lock
        // tslint:disable-next-line:one-line
        {
            this.LockRoute()
            this.LoadData();
        }
    }

    LockRoute() {
        this.ProfileLock.Locked.IsLocked = !this.ProfileLock.Locked.IsLocked;
        this.lib.notification.confirm('Do you want to ' + (this.mlProfile.UserSysID === 0 ? 'Lock' : 'Unlock') + ' User-Profile' + '(' + this.ProfileLock.UserName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('Profile/Lock'), this.ProfileLock).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdLock.close();
                        this.LoadData();
                        this.PanelList = true;
                        this.PanelEntry = false;
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    })
                this.LoadData();
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }

    btnAdd_Click() {
        this.mlProfile = new mlProfile();
        this.PanelEntry = true;
        this.PanelList = false;
        this.isEditMode = false;
    }
    btnSave_click() {
        if (!this.lib.isNullOrUndefined(this.mlProfile)) {
            this.lib.notification.confirm('Do you want to create profile', () => {
                this.http.post(this.lib.getApiUrl('Profile/Save'), this.mlProfile).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadData();
                        this.PanelList = true;
                        this.PanelEntry = false;
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }, () => {

            });
        }
    }
    btnCancel_Click() {
        this.PanelEntry = false;
        this.PanelList = true;

    }
}
class mlProfile {
    UserSysID: number;
    FullName: string;
    StaffImage: string;
    UserName: string;
    Password: string;
    RoleSysID: number;
    CompanyID: string;
    isAllowLogin: boolean;

    Locked = new common.ILock();

}

class mlProfileList {
    UserSysID: number;
    RoleSysID: number;
    FullName: string;
    UserName: string;
    Password: string;
    StaffImage: string;
    isAllowLogin: boolean;
    RoleName: string;
    IsRoleLocked: boolean;
    BranchSysID: number;
    BranchLogo: string;
    CompanyID: string;
    IsBranchLocked: boolean;
    CompanyName: string;
    IsCompanyLocked: boolean;
    Locked = new common.ILock();
}