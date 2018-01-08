
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
import * as InterFace from './../../../InterFace';


@Component({
    selector: 'Staff-Designation',
    templateUrl: './Designation.Component.html'
})
export class Designation_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    isAllowLock: boolean;
    dsShift: Array<InterFace.Idd>;
    dsAccount: Array<InterFace.Idd>;
    dsPayMode: Array<InterFace.Idd>;
    @ViewChild('mdLock') mdLock: ModalComponent;
    @ViewChild('frmDesignationEntry') frmDesignationEntry: NgForm;
    public DesignationList: IDesignation[];
    public DesignationEntry: IDesignation;
    public LockData: IDesignation;
    public isListMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Designation');
        lib.setPageTitle('Designation');
        this.isListMode = true;
    }
    ngOnInit() {
        this.DesignationList = [];
        this.DesignationEntry = new IDesignation();
        this.LockData = new IDesignation;
        this.LoadData();
        this.dsPayMode = [];
        this.dsShift = [];
        this.dsAccount = [];
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_ShiftData = this.http.get(this.lib.getApiUrl('payroll/Designation/shift'));
        const Obs_AccountData = this.http.get(this.lib.getApiUrl('dropdown/accounttype'));
        Observable.forkJoin([Obs_PaymentTypeData, Obs_ShiftData, Obs_AccountData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.dsPayMode = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.dsShift = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.dsAccount = lstRes[2].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    btnAdd_Click() {
        this.DesignationEntry = new IDesignation();
        this.isListMode = false;
    }
    LoadData() {
        this.DesignationList = [];
        this.http.get(this.lib.getApiUrl('payroll/Designation/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.DesignationList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSave_click() {
        this.lib.notification.confirm('Do you want to ' + (this.DesignationEntry.DesignationSysID === 0 ? 'Save' : 'Update') + ' Payroll-Designation' +
            '(' + this.DesignationEntry.Designation + ')', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/Designation/save'), this.DesignationEntry).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.DesignationEntry = new IDesignation();
                            this.isListMode = true;
                            this.LoadData();
                            this.frmDesignationEntry.resetForm();
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
    btnCancel_click() {
        this.DesignationEntry = new IDesignation();
        this.isListMode = true;
    }
    btnEdit_Click(DesignationList: IDesignation) {
        this.DesignationEntry.DesignationSysID = DesignationList.DesignationSysID;
        this.DesignationEntry.Designation = DesignationList.Designation;
        this.DesignationEntry.IsAllowLeaveReduction = DesignationList.IsAllowLeaveReduction;
        this.DesignationEntry.IsAllowPermissionReduction = DesignationList.IsAllowPermissionReduction;
        this.DesignationEntry.NoOfLeaveCL = DesignationList.NoOfLeaveCL;
        this.DesignationEntry.NoOfLeaveEL = DesignationList.NoOfLeaveEL;
        this.DesignationEntry.NoOfPermission = DesignationList.NoOfPermission;
        this.DesignationEntry.BasicPay = DesignationList.BasicPay;
        this.DesignationEntry.GradePay = DesignationList.GradePay;
        this.DesignationEntry.DA = DesignationList.DA;
        this.DesignationEntry.CA = DesignationList.CA;
        this.DesignationEntry.HRA = DesignationList.HRA;
        this.DesignationEntry.MA = DesignationList.MA;
        this.DesignationEntry.IsAllowPFReduction = DesignationList.IsAllowPFReduction;
        this.DesignationEntry.IsAllowEsiReduction = DesignationList.IsAllowEsiReduction;
        this.DesignationEntry.IsAllowTDSReduction = DesignationList.IsAllowTDSReduction;
        this.DesignationEntry.ShiftSysID = DesignationList.ShiftSysID;
        this.DesignationEntry.AccountSysID = DesignationList.AccountSysID;
        this.DesignationEntry.PayModeSysID = DesignationList.PayModeSysID;
        this.DesignationEntry.GraceHours = DesignationList.GraceHours;
        this.isListMode = false;
    }
    btnLock_Click(DesignationList: IDesignation, frmDesignationLock: NgForm) {
        this.LockData = new IDesignation();
        this.LockData = DesignationList;
        frmDesignationLock.resetForm();
        if (!DesignationList.Locked.IsLocked) {
            this.mdLock.open();
        } else {
            this.LockDesignation()
            this.LoadData();
        }
    }

    LockDesignation() {
        this.LockData.Locked.IsLocked = !this.LockData.Locked.IsLocked;
        if (this.lib.isValidModel(this.LockData)) {
            this.lib.notification.confirm('Do you want to ' + (this.LockData.Locked.IsLocked ? 'Lock' : 'Unlock') +
                ' Payroll-Designation' + '(' + this.LockData.Designation + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/Designation/Lock'), this.LockData).subscribe(
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
        } else {
            this.lib.notification.error('Lock Data is invalid');
        }
    }
    Chk_Leave_Change() {
        this.DesignationEntry.NoOfLeaveCL = 0;
        this.DesignationEntry.NoOfLeaveEL = 0;
    }
    Chk_Permission_Change() {
        this.DesignationEntry.NoOfPermission = 0;
    }
}

class IDesignation {
    DesignationSysID: number;
    Designation: string;
    ShiftName: string;
    ShiftSysID: string;
    IsAllowLeaveReduction: boolean;
    IsAllowPermissionReduction: boolean;
    NoOfLeaveCL: number;
    NoOfLeaveEL: number;
    NoOfPermission: number;
    BasicPay: number;
    GradePay: number;
    DA: number;
    CA: number;
    HRA: number;
    MA: number;
    IsAllowPFReduction: boolean;
    IsAllowEsiReduction: boolean;
    IsAllowTDSReduction: boolean;
    GraceHours: number;
    AccountSysID: string;
    PayModeSysID: string;
    Locked: InterFace.ILock;
    constructor() {
        this.Locked = new InterFace.ILock();
        this.DesignationSysID = 0;
        this.IsAllowLeaveReduction = false;
        this.NoOfLeaveCL = 0;
        this.NoOfLeaveEL = 0;
        this.NoOfPermission = 0;
        this.GraceHours = 0;
    }
}