import { HttpService } from './../../REVIEWED/helper/service/api/src/http.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Holiday',
    templateUrl: './Holiday.Component.html'
})

export class Holiday_Component implements OnInit {
    HolidayList: mlHolidayMaster[];
    HolidayData: mlHolidayMaster;
    DepartmentList: mlHolidayTrans[];
    dsStatus: Array<InterFace.Idd>;
    MeridianData: Array<InterFace.Idd>;
    isSpecialDay: boolean;
    isEditMode: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    @ViewChild('frmHolidayCancel') frmHolidayCancel: NgForm;
    @ViewChild('mdHolidayEntry') mdHolidayEntry: ModalComponent;
    @ViewChild('frmHoliday') frmHoliday: NgForm;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Holiday Management');
        lib.setPageTitle('Holiday Management');
        this.HolidayData = new mlHolidayMaster();
        this.isSpecialDay = false;
        this.isEditMode = false;
        const Obs_StatusData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Holiday_type'));
        const Obs_DepartmentData = this.http.get(this.lib.getApiUrl('payroll/department/readallactiveDepartment'));
        const Obs_MeridianData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Meridian_Type'));
        Observable.forkJoin([Obs_StatusData, Obs_DepartmentData, Obs_MeridianData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.dsStatus = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.DepartmentList = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.MeridianData = lstRes[2].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }

    ngOnInit() {
        this.LoadHolidayList();
    }

    onClose() {
        this.lib.setBrowserTitle('Holiday Management');
        this.lib.setPageTitle('Holiday Management');
        this.isSpecialDay = false;
        this.LoadHolidayList();
    }

    LoadHolidayList() {
        this.HolidayList = [];
        this.http.get(this.lib.getApiUrl('payroll/holiday/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.HolidayList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnAdd_Click() {
        this.HolidayData = new mlHolidayMaster();
        this.isEditMode = false;
        this.mdHolidayEntry.open();
    }

    btnEdit_Click(EditData: mlHolidayMaster) {
        this.HolidayData = new mlHolidayMaster();
        this.HolidayData.HolidaySysID = EditData.HolidaySysID;
        this.HolidayData.HolidayDate = EditData.HolidayDate;
        this.HolidayData.Reason = EditData.Reason;
        this.HolidayData.Meridian = EditData.Meridian;
        this.HolidayData.MeridianSysID = EditData.MeridianSysID;
        this.HolidayData.Status = EditData.Status;
        this.HolidayData.StatusSysID = EditData.StatusSysID;
        this.HolidayData.IsApproved = EditData.IsApproved;
        this.HolidayData.IsCancelled = EditData.IsCancelled;
        this.HolidayData.CancelledReason = EditData.CancelledReason;
        this.HolidayData.Trans = EditData.Trans;
        this.isEditMode = true;
        this.mdHolidayEntry.open();
    }

    btnHoliday_Cancel_Click(CancelData: mlHolidayMaster) {
        this.HolidayData = new mlHolidayMaster();
        this.HolidayData.HolidaySysID = CancelData.HolidaySysID;
        this.HolidayData.HolidayDate = CancelData.HolidayDate;
        this.HolidayData.Reason = CancelData.Reason;
        this.HolidayData.Meridian = CancelData.Meridian;
        this.HolidayData.MeridianSysID = CancelData.MeridianSysID;
        this.HolidayData.StatusSysID = CancelData.StatusSysID;
        this.HolidayData.IsApproved = CancelData.IsApproved;
        this.HolidayData.IsCancelled = CancelData.IsCancelled;
        this.HolidayData.CancelledReason = CancelData.CancelledReason;
        this.isEditMode = false;
        this.mdCancel.open();
    }

    btnSpecialDay_Click(SpecialData: mlHolidayMaster) {
        this.HolidayData = new mlHolidayMaster();
        this.HolidayData.HolidaySysID = SpecialData.HolidaySysID;
        this.HolidayData.HolidayDate = SpecialData.HolidayDate;
        this.isSpecialDay = true;
        this.isEditMode = false;
    }

    btnSave_Click() {
        if (this.lib.isValidModel(this.HolidayData) && this.lib.isValidList(this.HolidayData.Trans)) {
            this.lib.notification.confirm('Do you want to ' + (this.HolidayData.HolidaySysID === 0 ? 'Save' : 'Update') + ' Holiday', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/holiday/save'), this.HolidayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.HolidayData = new mlHolidayMaster();
                            this.frmHoliday.resetForm();
                            this.mdHolidayEntry.close();
                            this.isEditMode = false;
                            this.LoadHolidayList();
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
            this.lib.notification.warning('Invalid Holiday data');
        }
    }

    btnCancel_Click() {
        if (this.lib.isValidModel(this.HolidayData)) {
            this.lib.notification.confirm('Do you want to Cancel Holiday', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/holiday/cancel'), this.HolidayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.HolidayData = new mlHolidayMaster();
                            this.frmHolidayCancel.resetForm();
                            this.LoadHolidayList();
                            this.isEditMode = false;
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
            this.lib.notification.warning('Holiday Record Is Not valid.');
        }
    }

    btnEntryCancel_Click() {
        this.HolidayData = new mlHolidayMaster();
        this.frmHoliday.resetForm();
        this.isEditMode = false;
        this.mdHolidayEntry.close();
    }

    btnApprove_Click(HolidayData: mlHolidayMaster) {
        if (this.lib.isValidModel(HolidayData)) {
            this.lib.notification.confirm('Do you want to Approve Holiday', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/holiday/approve'), HolidayData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.HolidayData = new mlHolidayMaster();
                            this.isEditMode = false;
                            this.LoadHolidayList();
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
            this.lib.notification.warning('Holiday Record Is Not valid.');
        }
    }
}

class mlHolidayMaster {
    HolidaySysID = 0;
    HolidayDate: string;
    Reason: string;
    Meridian: string;
    MeridianSysID: string;
    Status: string;
    StatusSysID: number;
    IsApproved: boolean;
    IsCancelled: boolean;
    CancelledReason: string;
    IsSpecialDay: boolean;
    Trans: mlHolidayTrans[];
    const() {
        this.Trans = [];
    }
}
class mlHolidayTrans {
    Department: string;
    DepartmentSysID: number;
}