import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms/src/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';


import * as moment from 'moment';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'student-attendance-entry',
    templateUrl: './student-attendance-entry.component.html'
})

export class Student_Attendance_Entry_Component implements OnInit {
    public mlAttendanceInfo: mlAttendanceEntry;
    public mlStudentClassSection: mlStudentClassSection;
    public lstStudentInfo: Array<mlStudentAttendance>;
    public lstStu_Attendance_Status: Array<InterFace.Ims>;
    public mlPermission: mlPermission;
    @ViewChild('mdStudentList') mdStudentList: ModalComponent;
    constructor(public lib: UtilityService, private http: ApiService, private _routeParams: ActivatedRoute) {
        this.lib.setPageTitle('Attendance Entry');
        this.lib.setBrowserTitle('Attendance Entry');

        this.mlAttendanceInfo = new mlAttendanceEntry();
        this.mlStudentClassSection = new mlStudentClassSection();
        this.lstStudentInfo = new Array<mlStudentAttendance>();
        this.lstStu_Attendance_Status = new Array<any>();

        this.mlPermission = new mlPermission();


        if (this.lib.getParams()) {
            if (!this.lib.isNullOrUndefined(this.lib.getParams().mode)) {
                if (this.lib.getParams().mode === 'new') {
                    this.lib.LoadPageAction(http, (res: any) => {
                        this.mlPermission.isAllowApprove = false;
                        this.mlPermission.isAllowSave = this.lib.isActionAllowed('Save');
                    });
                    this.lib.setPageTitle('New Attendance Entry');
                    this.lib.setBrowserTitle('New Attendance Entry');

                    this.load_attendance_status_data();
                    this.New_Attendance();
                } else if (this.lib.getParams().mode === 'edit') {
                    if (!this.lib.isNullOrUndefined(this.lib.getParams().id)) {
                        this.lib.LoadPageAction(http, (res: any) => {
                            this.mlPermission.isAllowApprove = this.lib.isActionAllowed('Approve');
                            this.mlPermission.isAllowSave = this.lib.isActionAllowed('Save');
                        });
                        this.lib.setPageTitle('Edit Attendance Entry');
                        this.lib.setBrowserTitle('Edit Attendance Entry');
                        this.load_attendance_status_data();
                        this.Edit_Attendance(this.lib.getParams().id);
                    } else {
                        this.lib.router.navigateByUrl('/app/student/attendance/list');
                    }
                } else {
                    this.lib.router.navigateByUrl('/app/student/attendance/list');
                }
            } else {
                this.lib.router.navigateByUrl('/app/student/attendance/list');
            }
        } else {
            this.lib.router.navigateByUrl('/app/student/attendance/list');
        }
        // this._routeParams.params.subscribe(params => {
        //     const mode = params['mode'];
        //     if (this.lib.isNullOrUndefined(mode)) {
        //         this.lib.setPageTitle('New Attendance Entry');
        //         this.lib.setBrowserTitle('New Attendance Entry');
        //         this.New_Attendance();
        //     } else if (mode === 'new') {
        //         this.lib.setPageTitle('New Attendance Entry');
        //         this.lib.setBrowserTitle('New Attendance Entry');
        //         this.New_Attendance();
        //     } else if (mode === 'edit') {

        //     } else {
        //         this.New_Attendance();
        //     }
        // });
    }
    ngOnInit(): void {

    }
    load_attendance_status_data() {
        const url = this.lib.getApiUrl('student/attendance/status-list');
        this.http.get(url).subscribe(
            (res) => {
                this.lstStu_Attendance_Status = new Array<InterFace.Ims>();
                if (this.lib.isValidList(res.result.data)) {
                    this.lstStu_Attendance_Status = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
                this.lstStu_Attendance_Status = new Array<InterFace.Ims>();
            });
    }
    Save_Student_Attendance() {
        const mlClassSection = this.mlStudentClassSection;
        if (mlClassSection !== undefined) {
            const lstGroup = this.lib.groupBy(this.mlStudentClassSection.lstStudentInfo, 'StatusSysID');
            this.lstStu_Attendance_Status.forEach(stu => {
                const lstStatus = this.mlStudentClassSection.lstStudentInfo.filter(fil => fil.StatusSysID.toString() === stu.value.toString());
                if (stu.label === 'PRESENT') {
                    mlClassSection.PRESENT = (lstStatus !== undefined) ? lstStatus.length : 0;
                } else if (stu.label === 'ABSENT') {
                    mlClassSection.ABSENT = (lstStatus !== undefined) ? lstStatus.length : 0;
                } else if (stu.label === 'LEAVE') {
                    mlClassSection.LEAVE = (lstStatus !== undefined) ? lstStatus.length : 0;
                }
                //   this.mlAttendanceInfo. this.lib.GetListSummary(this.mlAttendanceInfo.lstClassSection, stu.label).total
            });


            this.mdStudentList.close();
        }
    }
    Show_Student(data: mlStudentClassSection, ClassSysID: number, SectionSysID: number) {
        this.mlStudentClassSection = data;
        this.mdStudentList.open();
    }
    New_Attendance() {
        const url = this.lib.getApiUrl('student/attendance/new');
        this.http.get(url).subscribe(
            (res) => {
                this.mlAttendanceInfo = new mlAttendanceEntry();
                if (this.lib.isValidList(res.result.data)) {
                    this.mlAttendanceInfo = res.result.data;
                    if (this.mlAttendanceInfo.IsApproved) {
                        this.mlPermission.isAllowApprove = false;
                        this.mlPermission.isAllowSave = false;
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
                this.mlAttendanceInfo = new mlAttendanceEntry();
            });
    }
    Edit_Attendance(AttendanceSysID: number) {
        const url = this.lib.getApiUrl(`student/attendance/edit/${AttendanceSysID}`);
        this.http.get(url).subscribe(
            (res) => {
                this.mlAttendanceInfo = new mlAttendanceEntry();
                if (this.lib.isValidList(res.result.data)) {
                    this.mlAttendanceInfo = res.result.data;
                    if (this.mlAttendanceInfo.IsApproved) {
                        this.mlPermission.isAllowApprove = false;
                        this.mlPermission.isAllowSave = false;
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
                this.lib.router.navigateByUrl('/app/student/attendance/list');
            });

    }
    Save_Attendance() {
        this.lib.notification.confirm('Do you want to ' + (this.mlAttendanceInfo.AttendanceSysID === 0 ? 'Insert' : 'Update') + ' Attendance Record', () => {
            try {
                const url = this.lib.getApiUrl('student/attendance/save');
                if (this.lib.isValidModel(this.mlAttendanceInfo)) {
                    this.http.post(url, this.mlAttendanceInfo).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.lib.router.navigateByUrl('/app/student/attendance/list');
                        }, (err) => {
                            this.lib.notification.error(err.message);
                            this.mlAttendanceInfo = new mlAttendanceEntry();
                        });
                } else {
                    this.lib.notification.warning('can\'t save your attendance data please try again after refresh your screen');
                    this.lib.router.navigateByUrl('/app/student/attendance/list');
                }
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    Approve_Attendance() {
        this.lib.notification.confirm('Do you want to Approve Attendance Record', () => {
            try {
                if (this.lib.isValidModel(this.mlAttendanceInfo)) {
                    const url = this.lib.getApiUrl('student/attendance/approve/' + this.mlAttendanceInfo.AttendanceSysID);
                    this.http.get(url, this.mlAttendanceInfo).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.lib.router.navigateByUrl('/app/student/attendance/list');
                        }, (err) => {
                            this.lib.notification.error(err.message);
                            this.mlAttendanceInfo = new mlAttendanceEntry();
                        });
                } else {
                    this.lib.notification.warning('can\'t approve your attendance data please try again after refresh your screen');
                    this.lib.router.navigateByUrl('/app/student/attendance/list');
                }
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
}


class mlAttendanceEntry {
    AttendanceSysID: number;
    AcademicYearSysID: number;
    Attn_Date: number;
    IsApproved: boolean;
    lstClassSection: Array<mlStudentClassSection>;
    constructor() {
        this.lstClassSection = Array<mlStudentClassSection>();
    }
}
class mlStudentClassSection {
    ClassSysID: number;
    ClassName: string;
    ClassOrder: number;
    SectionSysID: number;
    SectionName: number;
    Total: number;
    PRESENT: number;
    ABSENT: number;
    LEAVE: number;
    lstStudentInfo: Array<mlStudentAttendance>;
    constructor() {
        this.lstStudentInfo = Array<mlStudentAttendance>();
    }
}

class mlStudentAttendance {
    AttendanceSysID: number;
    Attn_Date: string;
    IsApproved: boolean;
    AttendanceTransSysID: number;
    AcademicYearSysID: number;
    StatusSysID: number;
    StudentSysID: number;
    AdmissionNo: string;
    StudentName: string;
    ClassSysID: number;
    ClassName: string;
    ClassOrder: number;
    SectionSysID: number;
    SectionName: string;
    fam_type: string;
    fam_name: string;
    fam_mobile: string;
}

class mlPermission {
    public isAllowSave: boolean;
    public isAllowApprove: boolean;
    constructor() {
        this.isAllowSave = false;
        this.isAllowApprove = false;
    }
}