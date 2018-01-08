import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Attendance-master',
    templateUrl: './Staff-Attendance-Approval.Component.html'
})

export class Staff_Attendance_Approval_Component implements OnInit {
    AttendanceList: mlAttendanceData[];
    AttendanceData: mlAttendanceData;
    AttedanceViewData: AttedanceViewData;
    StaffData: Array<InterFace.Idd>;
    TypeData: Array<InterFace.Idd>;
    isListMode: boolean;
    public isLeave: Boolean = false;
    public isPermission: Boolean = false;
    isAllowLeave: boolean;
    isAllowPermission: boolean;
    isAllowApprove: boolean;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Attendance');
        lib.setPageTitle('Staff Attendance');
        this.AttendanceData = new mlAttendanceData();
        this.AttedanceViewData = new AttedanceViewData();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowApprove = this.lib.isActionAllowed('Approve');
            this.isAllowLeave = this.lib.isActionAllowed('Leave');
            this.isAllowPermission = this.lib.isActionAllowed('Permission');
        });
    }
    ngOnInit() {
        const Obs_LPData = this.http.get(this.lib.getApiUrl('payroll/attendance/attendancetype/Permission_Status_Type/Leave_Status_Type/true'));
        Observable.forkJoin([Obs_LPData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.TypeData = lstRes[0].result.data;
                    setTimeout(() => {
                        this.isLeave = false;
                        this.isPermission = false;
                        this.AttedanceViewData.StatusSysID = '-1';
                        this.AttedanceViewData.FromDate = moment().format('DD-MM-YYYY');
                        this.AttedanceViewData.ToDate = moment().format('DD-MM-YYYY');
                        this.LoadAttendanceData();
                    }, 100);
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    LoadAttendanceData() {
        this.AttendanceList = [];
        this.http.post(this.lib.getApiUrl('payroll/attendance/readall'), this.AttedanceViewData).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.AttendanceList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnLeave_Click(EditData: mlAttendanceData) {
        this.AttendanceData = new mlAttendanceData();
        this.AttendanceData.AttendanceSysID = EditData.AttendanceSysID;
        this.AttendanceData.StaffSysID = EditData.StaffSysID;
        this.AttendanceData.StaffName = EditData.StaffName;
        this.AttendanceData.StaffID = EditData.StaffID;
        this.AttendanceData.AttendanceDate = EditData.AttendanceDate;
        this.AttendanceData.FNStatusSysID = EditData.FNStatusSysID;
        this.AttendanceData.FNStatusName = EditData.FNStatusName;
        this.AttendanceData.ANStatusSysID = EditData.ANStatusSysID;
        this.AttendanceData.ANStatusName = EditData.ANStatusName;
        this.isLeave = true;
        this.isPermission = false;
    }
    btnPermission_Click(EditData: mlAttendanceData) {
        this.AttendanceData = new mlAttendanceData();
        this.AttendanceData.AttendanceSysID = EditData.AttendanceSysID;
        this.AttendanceData.StaffSysID = EditData.StaffSysID;
        this.AttendanceData.StaffName = EditData.StaffName;
        this.AttendanceData.StaffID = EditData.StaffID;
        this.AttendanceData.AttendanceDate = EditData.AttendanceDate;
        this.AttendanceData.FNStatusSysID = EditData.FNStatusSysID;
        this.AttendanceData.FNStatusName = EditData.FNStatusName;
        this.AttendanceData.ANStatusSysID = EditData.ANStatusSysID;
        this.AttendanceData.ANStatusName = EditData.ANStatusName;
        this.isLeave = false;
        this.isPermission = true;
    }
    btnApprove_Click() {
        if (this.lib.isValidList(this.AttendanceList)) {
            this.lib.notification.confirm('Do you want to Approve Staff Attendance', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/attendance/approve'), this.AttendanceList).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.AttendanceList = [];
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
            this.lib.notification.warning('Staff Attendance Record Is Not valid.');
        }
    }
    onClose() {
        this.isLeave = false;
        this.isPermission = false;
        this.LoadAttendanceData();
    }
    btnView_click() {
        this.LoadAttendanceData();
    }
}

class mlAttendanceData {
    AttendanceSysID: number;
    AttendanceDate: string;
    StaffSysID: number;
    InTime: string;
    OutTime: string;
    FNStatusSysID: number;
    ANStatusSysID: number;
    IsApproved: boolean;
    StaffID: string;
    StaffName: string;
    FNStatusName: string;
    ANStatusName: string;
    ShiftSysID: string;
    ShiftName: string;
    IsAllowLeaveReduction: boolean;
    IsAllowPermissionReduction: boolean;
    PermissionHours: number;
}
class AttedanceViewData {
    FromDate: string;
    ToDate: string;
    StatusSysID: string;
}