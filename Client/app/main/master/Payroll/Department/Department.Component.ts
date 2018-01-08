
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
    selector: 'Staff-Department',
    templateUrl: './Department.Component.html'
})
export class Department_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    isAllowLock: boolean;
    @ViewChild('mdDepartmentEntry') mdDepartmentEntry: ModalComponent;
    @ViewChild('mdLock') mdLock: ModalComponent;
    public DepartmentList: IDepartment[];
    public DepartmentEntry: IDepartment;
    public LockData: IDepartment;
    public isEditMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Department');
        lib.setPageTitle('Department');
        // this.lib.LoadPageAction(http, (res: any) => {
        //     this.isAllowAdd = this.lib.isActionAllowed('Add');
        //     this.isAllowEdit = this.lib.isActionAllowed('Edit');
        //     this.isAllowLock = this.lib.isActionAllowed('Lock');
        //     this.isAllowUnLock = this.lib.isActionAllowed('UnLock');
        // });
    }
    ngOnInit() {
        this.DepartmentList = [];
        this.DepartmentEntry = new IDepartment();
        this.LockData = new IDepartment;
        this.LoadData();
    }
    btnAdd_Click() {
        this.DepartmentEntry = new IDepartment();
        this.isEditMode = false;
        this.mdDepartmentEntry.open();
    }
    LoadData() {
        this.DepartmentList = [];
        this.http.get(this.lib.getApiUrl('payroll/department/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.DepartmentList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSave_click(DepartmentEntry: IDepartment, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.DepartmentEntry.DepartmentSysID === 0 ? 'Save' : 'Update') + ' Payroll-Department' +
            '(' + this.DepartmentEntry.Department + ')', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/department/save'), this.DepartmentEntry).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            fromdata.resetForm();
                            this.mdDepartmentEntry.close();
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
    btnEdit_Click(DepartmentList: IDepartment) {
        this.DepartmentEntry.DepartmentSysID = DepartmentList.DepartmentSysID;
        this.DepartmentEntry.Department = DepartmentList.Department;
        this.isEditMode = true;
        this.mdDepartmentEntry.open();
    }
    btnLock_Click(DepartmentList: IDepartment, frmDepartmentLock: NgForm) {
        this.LockData = new IDepartment();
        this.LockData = DepartmentList;
        frmDepartmentLock.resetForm();
        if (!DepartmentList.Locked.IsLocked) {
            this.mdLock.open();
        } else {
            this.LockDepartment()
            this.LoadData();
        }
    }

    LockDepartment() {
        this.LockData.Locked.IsLocked = !this.LockData.Locked.IsLocked;
        if (this.lib.isValidModel(this.LockData)) {
            this.lib.notification.confirm('Do you want to ' + (this.LockData.Locked.IsLocked ? 'Lock' : 'Unlock') + ' Payroll-Department' + '(' + this.LockData.Department + ')', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/department/Lock'), this.LockData).subscribe(
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
}

class IDepartment {
    DepartmentSysID: number;
    Department: string;
    Locked: InterFace.ILock;
    constructor() {
        this.Locked = new InterFace.ILock();
        this.DepartmentSysID = 0;
    }
}