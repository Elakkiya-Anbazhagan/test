
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';


@Component({
    selector: 'transport-route',
    templateUrl: './transport-route.component.html'
})
export class Transport_Route_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    isAllowLock: boolean;
    @ViewChild('mdRouteEntry') mdRouteEntry: ModalComponent;
    @ViewChild('mdLock') mdLock: ModalComponent;
    public RouteList: InterFace.IRoute[];
    public RouteEntry: InterFace.IRoute;
    public formLock: InterFace.IRoute;
    public isEditMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Transport Route');
        lib.setPageTitle('Transport Route');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
            this.isAllowLock = this.lib.isActionAllowed('Lock');
            this.isAllowUnLock = this.lib.isActionAllowed('UnLock');
        });
    }
    ngOnInit() {
        this.RouteList = [];
        this.RouteEntry = new InterFace.IRoute();
        this.formLock = new InterFace.IRoute;
        this.LoadData();
    }
    btnAdd_Click() {
        this.RouteEntry = new InterFace.IRoute();
        this.isEditMode = false;
        this.mdRouteEntry.open();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('transport/master/route/readall')).subscribe(
            (res) => {
                this.RouteList = [];
                this.RouteList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSave_click(RouteEntry: InterFace.IRoute, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.RouteEntry.RouteSysID === 0 ? 'insert' : 'Update') + ' Transport-Route' + '(' + this.RouteEntry.RouteName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/route/save'), this.RouteEntry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        fromdata.resetForm();
                        this.mdRouteEntry.close();
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
    btnEdit_Click(RouteList: InterFace.IRoute) {
        this.RouteEntry.RouteSysID = RouteList.RouteSysID;
        this.RouteEntry.RouteName = RouteList.RouteName;
        this.isEditMode = true;
        this.mdRouteEntry.open();
    }
    btnLock_Click(RouteList: InterFace.IRoute, frmRouteLock: NgForm) {
        this.formLock = new InterFace.IRoute();
        this.formLock = RouteList;
        frmRouteLock.resetForm();
        if (!RouteList.Locked.IsLocked) {
            this.mdLock.open();
        } else {
            this.LockRoute()
            this.LoadData();
        }
    }

    LockRoute() {
        this.formLock.Locked.IsLocked = !this.formLock.Locked.IsLocked;
        this.lib.notification.confirm('Do you want to ' + (this.RouteEntry.RouteSysID === 0 ? 'Lock' : 'Unlock') + ' Transport-Route' + '(' + this.formLock.RouteName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/route/Lock'), this.formLock).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdLock.close();
                        this.LoadData();
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
}


