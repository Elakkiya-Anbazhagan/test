import { HttpService } from './../../REVIEWED/helper/service/api/src/http.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, AfterContentChecked, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'SpecialDay',
    templateUrl: './SpecialDay.Component.html'
})

export class SpecialDay_Component implements OnInit, AfterContentChecked {
    SpecialDayList: mlSpecialDayMaster[];
    SpecialDayData: mlSpecialDayMaster;
    StaffList: mlSpecialDayTrans[];
    dsStatus: Array<InterFace.Idd>;
    isListMode: boolean;
    isEditMode: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    @ViewChild('frmSpecialDayCancel') frmSpecialDayCancel: NgForm;
    @ViewChild('mdSpecialDayEntry') mdSpecialDayEntry: ModalComponent;
    @ViewChild('frmSpecialDay') frmSpecialDay: NgForm;


    @Output() onclose = new EventEmitter();
    @Input() HolidaySysID = 0;
    @Input() SpecialDayDate = '';

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('SpecialDay Management');
        lib.setPageTitle('SpecialDay Management');
        this.SpecialDayData = new mlSpecialDayMaster();
        this.isListMode = true;
        this.isEditMode = false;
    }
    ngAfterContentChecked() {
        if (this.HolidaySysID !== 0) {

            this.SpecialDayData.HolidaySysID = this.HolidaySysID;
            this.SpecialDayData.SpecialDayDate = this.SpecialDayDate;
            // this.StaffList.forEach((data) => {
            //     data.IsPaidWorkingDay = true;
            //     data.IsAllowLeaveReducation = true;
            //     data.IsAllowPermissionReducation = true;
            // })
            this.isListMode = false;
        }
    }

    ngOnInit() {
        this.LoadSpecialDayList();
        if (this.HolidaySysID !== 0) {
            this.StaffList = [];
            this.http.get(this.lib.getApiUrl('payroll/specialday/readall-staffdetails/' + this.HolidaySysID)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.StaffList = res.result.data;
                    } else {
                        this.lib.notification.warning('No Staff Found.');
                        this.onclose.emit();
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });

        }
    }

    LoadSpecialDayList() {
        this.SpecialDayList = [];
        this.http.get(this.lib.getApiUrl('payroll/specialday/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.SpecialDayList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnEdit_Click(EditData: mlSpecialDayMaster) {
        this.StaffList = [];
        this.http.get(this.lib.getApiUrl('payroll/specialday/readall-staffdetails/' + EditData.HolidaySysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.StaffList = res.result.data;
                    this.SpecialDayData = new mlSpecialDayMaster();
                    this.SpecialDayData.SpecialDaySysID = EditData.SpecialDaySysID;
                    this.SpecialDayData.SpecialDayDate = EditData.SpecialDayDate;
                    this.SpecialDayData.HolidaySysID = EditData.HolidaySysID;
                    this.SpecialDayData.Reason = EditData.Reason;
                    this.SpecialDayData.IsApproved = EditData.IsApproved;
                    this.SpecialDayData.IsCancelled = EditData.IsCancelled;
                    this.SpecialDayData.CancelledReason = EditData.CancelledReason;
                    this.SpecialDayData.Trans = [];
                    EditData.Trans.forEach(data => this.StaffList.filter((sdata) => {
                        if (sdata.StaffSysID === data.StaffSysID) {
                            sdata.IsPaidWorkingDay = data.IsPaidWorkingDay;
                            sdata.IsAllowLeaveReducation = data.IsAllowLeaveReducation;
                            sdata.IsAllowPermissionReducation = data.IsAllowPermissionReducation;
                            this.SpecialDayData.Trans.push(sdata);
                        }
                    }));
                    // this.SpecialDayData.Trans = this.SpecialDayData.Trans.slice();
                    // this.StaffList = this.StaffList.slice();
                    this.isListMode = false;
                    this.isEditMode = true;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSpecialDay_Cancel_Click(CancelData: mlSpecialDayMaster) {
        this.SpecialDayData = new mlSpecialDayMaster();
        this.SpecialDayData.SpecialDaySysID = CancelData.SpecialDaySysID;
        this.SpecialDayData.SpecialDayDate = CancelData.SpecialDayDate;
        this.SpecialDayData.HolidaySysID = CancelData.HolidaySysID;
        this.SpecialDayData.Reason = CancelData.Reason;
        this.SpecialDayData.IsApproved = CancelData.IsApproved;
        this.SpecialDayData.IsCancelled = CancelData.IsCancelled;
        this.SpecialDayData.CancelledReason = CancelData.CancelledReason;
        this.mdCancel.open();
    }

    btnSave_Click() {
        if (this.lib.isValidModel(this.SpecialDayData) && this.lib.isValidList(this.SpecialDayData.Trans)) {
            this.lib.notification.confirm('Do you want to ' + (this.SpecialDayData.SpecialDaySysID === 0 ? 'Save' : 'Update') + ' SpecialDay', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/specialday/save'), this.SpecialDayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.SpecialDayData = new mlSpecialDayMaster();
                            this.frmSpecialDay.resetForm();
                            this.StaffList.forEach((data) => {
                                data.IsPaidWorkingDay = true;
                                data.IsAllowLeaveReducation = true;
                                data.IsAllowPermissionReducation = true;
                            })
                            this.isListMode = true;
                            if (!this.isEditMode) {
                                this.onclose.emit();
                            }
                            this.isEditMode = false;
                            this.LoadSpecialDayList();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.lib.notification.warning('Invalid SpecialDay data');
        }
    }

    btnCancel_Click() {
        if (this.lib.isValidModel(this.SpecialDayData)) {
            this.lib.notification.confirm('Do you want to Cancel SpecialDay', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/specialday/cancel'), this.SpecialDayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.SpecialDayData = new mlSpecialDayMaster();
                            this.frmSpecialDayCancel.resetForm();
                            this.LoadSpecialDayList();
                            this.mdCancel.close();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });

        } else {
            this.lib.notification.warning('SpecialDay Record Is Not valid.');
        }
    }

    btnEntryCancel_Click() {
        this.SpecialDayData = new mlSpecialDayMaster();
        this.frmSpecialDay.resetForm();
        this.StaffList.forEach((data) => {
            data.IsPaidWorkingDay = true;
            data.IsAllowLeaveReducation = true;
            data.IsAllowPermissionReducation = true;
        })
        this.isListMode = true;
        if (!this.isEditMode) {
            this.onclose.emit();
        }
        this.isEditMode = false;
    }

    btnApprove_Click(SpecialDayData: mlSpecialDayMaster) {
        if (this.lib.isValidModel(SpecialDayData)) {
            this.lib.notification.confirm('Do you want to Approve SpecialDay', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/specialday/approve'), SpecialDayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.SpecialDayData = new mlSpecialDayMaster();
                            this.LoadSpecialDayList();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });

        } else {
            this.lib.notification.warning('SpecialDay Record Is Not valid.');
        }
    }
}

class mlSpecialDayMaster {
    SpecialDaySysID = 0;
    SpecialDayDate: string;
    HolidaySysID: number;
    Reason: string;
    IsApproved: boolean;
    IsCancelled: boolean;
    CancelledReason: string;
    Trans: mlSpecialDayTrans[];
    const() {
        this.Trans = [];
    }
}

class mlSpecialDayTrans {
    StaffSysID: number;
    StaffID: number;
    StaffName: string;
    IsPaidWorkingDay: boolean;
    IsAllowLeaveReducation: boolean;
    IsAllowPermissionReducation: boolean;
    DepartmentSysID: number;
    Department: string;
    DesignationSysID: number;
    Designation: string;
}