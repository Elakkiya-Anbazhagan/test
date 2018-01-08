import { UtilityService, ApiService } from 'systemic/helper'
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, ElementRef, OnInit } from '@angular/core';

import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'transport-vehicle',
    templateUrl: './transport-vehicle.component.html'
})
export class Transport_Vehicle_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowLock: boolean;
    isAllowEdit: boolean;
    isAllowAdd: boolean;
    @ViewChild('mdVehicleEntry') mdVehicleEntry: ModalComponent;
    @ViewChild('mdLock') mdLock: ModalComponent;
    public isEditMode: boolean;
    public VehicleEntry: InterFace.IVehicle;
    public VehicleList: InterFace.IVehicle[];
    public VehicleLock: InterFace.IVehicle;
    public VehicleData: Array<InterFace.Idd>;

    @ViewChild('VehicleNo') vc: ElementRef;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Transport Vehicle');
        lib.setPageTitle('Transport Vehicle');

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
            this.isAllowLock = this.lib.isActionAllowed('Lock');
            this.isAllowUnLock = this.lib.isActionAllowed('UnLock');
        });
    }

    ngOnInit() {
        this.LoadVehicle();
        this.VehicleEntry = new InterFace.IVehicle;
        this.VehicleList = [];
        this.VehicleLock = new InterFace.IVehicle;
        this.LoadData();
    }

    LoadData() {
        this.http.get(this.lib.getApiUrl('transport/master/vehicle/readall')).subscribe(
            (res) => {
                this.VehicleList = [];
                this.VehicleList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadVehicle() {
        this.http.get(this.lib.getApiUrl('dropdown/vehicletype')).subscribe(
            (res) => {
                this.VehicleData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnAdd_Click() {
        this.VehicleEntry = new InterFace.IVehicle();
        this.isEditMode = false;
        this.mdVehicleEntry.open('lg');
    }

    btnSave_click(frmVehicleEntry: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.VehicleEntry.VehicleSysID === '0' ? 'insert' : 'Update ') + ' Transport-Vehicle' + '(' + this.VehicleEntry.VehicleNo + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/vehicle/save'), this.VehicleEntry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        frmVehicleEntry.resetForm();
                        this.mdVehicleEntry.close();
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
    btnEdit_Click(VehicleList: InterFace.IVehicle) {
        this.VehicleEntry.VehicleSysID = VehicleList.VehicleSysID;
        if (this.lib.isNullOrUndefined(this.VehicleEntry.VehicleTypeSysID)) {
            this.VehicleEntry.VehicleTypeSysID = VehicleList.VehicleTypeSysID;
        }
        this.VehicleEntry.DeviceID = VehicleList.DeviceID;
        this.VehicleEntry.VehicleNo = VehicleList.VehicleNo;
        this.isEditMode = true;
        this.mdVehicleEntry.open();
    }


    btnLock_Click(VehicleList: InterFace.IVehicle, frmRouteLock: NgForm) {
        this.VehicleLock = new InterFace.IVehicle();
        this.VehicleLock = VehicleList;
        frmRouteLock.resetForm();
        if (!VehicleList.Locked.IsLocked)
        // for Lock
        // tslint:disable-next-line:one-line
        {
            this.mdLock.open();
        }
        // tslint:disable-next-line:one-line
        else // for un-lock
        // tslint:disable-next-line:one-line
        {
            this.LockVehicle();
            this.LoadData();
        }
    }

    LockVehicle() {
        this.VehicleLock.Locked.IsLocked = !this.VehicleLock.Locked.IsLocked;
        this.lib.notification.confirm('Do you want to ' + (this.VehicleLock.Locked.IsLocked ? 'Lock ' : 'Unlock ') + ' Transport-Vehicle' + '(' + this.VehicleLock.VehicleNo + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('transport/master/vehicle/Lock'), this.VehicleLock).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdLock.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    });
                this.LoadData();
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }

        }, () => { });
    }

}
