import { UtilityService, ApiService } from 'systemic/helper';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';

import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'transport-stoppage',
    templateUrl: './transport-stoppage.component.html'
})
export class Transport_Stoppage_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowLock: boolean;
    isAllowEdit: boolean;
    isAllowAdd: boolean;
    @ViewChild('mdStopEntry') mdStopEntry: ModalComponent;
    @ViewChild('mdLock') mdLock: ModalComponent;
    public RouteData: Array<InterFace.Idd>;
    public StopList: InterFace.IStop[];
    public StopEntry: InterFace.IStop;
    public formLock: InterFace.IStop;
    public isEditMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Transport Stop');
        lib.setPageTitle('Transport Stop');

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
            this.isAllowLock = this.lib.isActionAllowed('Lock');
            this.isAllowUnLock = this.lib.isActionAllowed('UnLock');
        });
    }
    ngOnInit() {
        this.LoadRoute();
        this.StopList = [];
        this.StopEntry = new InterFace.IStop();
        this.formLock = new InterFace.IStop;
        this.LoadData();
    }
    btnAdd_Click() {
        this.StopEntry = new InterFace.IStop();
        this.isEditMode = false;
        this.mdStopEntry.open();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('transport/master/stop/readall')).subscribe(
            (res) => {
                this.StopList = [];
                this.StopList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadRoute() {
        this.http.get(this.lib.getApiUrl('dropdown/route')).subscribe(
            (res) => {
                this.RouteData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click(stopEntry: InterFace.IStop, formData: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.StopEntry.StopSysID === 0 ? 'insert' : 'Update ') + ' Transport-Stop' + '(' + this.StopEntry.StopName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/stop/save'), this.StopEntry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        formData.resetForm();
                        this.mdStopEntry.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    btnEdit_Click(StopList: InterFace.IStop) {
        this.StopEntry.StopSysID = StopList.StopSysID;
        this.StopEntry.StopName = StopList.StopName;
        this.StopEntry.Lat = StopList.Lat;
        this.StopEntry.Long = StopList.Long;
        this.isEditMode = true;
        this.mdStopEntry.open();
    }
    btnLock_Click(StopList: InterFace.IStop, frmStopLock: NgForm) {
        this.formLock = new InterFace.IStop();
        this.formLock = StopList;
        frmStopLock.resetForm();
        if (!StopList.Locked.IsLocked) {
            this.mdLock.open();
        } else {
            this.LockStop();
        }
    }

    LockStop() {
        this.formLock.Locked.IsLocked = !this.formLock.Locked.IsLocked;
        this.lib.notification.confirm('Do you want to ' + (this.formLock.Locked.IsLocked ? 'Lock' : 'Unlock ') + ' Transport-Stop' + '(' + this.formLock.StopName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/stop/Lock'), this.formLock).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdLock.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    });
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
}
