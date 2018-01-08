import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms/src/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';


import * as moment from 'moment';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'student-attendance-list',
    templateUrl: './student-attendance-list.component.html'
})

export class Student_Attendance_List_Component implements OnInit {
    public lstAttendacedata: Array<mlSchoolWiseAttendance>;
    public mlListGridFilter: mlListGridFilter;
    public mlPermission: mlPermission;
    constructor(public lib: UtilityService, private http: ApiService) {
        this.lib.setPageTitle('Attendance List');
        this.lib.setBrowserTitle('Attendance List');
        this.mlListGridFilter = new mlListGridFilter();
        this.lstAttendacedata = new Array<mlSchoolWiseAttendance>();
        this.load_list_grid_data();

        this.mlPermission = new mlPermission();
        this.lib.LoadPageAction(http, (res: any) => {
            this.mlPermission.isAllowApprove = this.lib.isActionAllowed('Approve');
            this.mlPermission.isAllowView = this.lib.isActionAllowed('View');
        });
    }
    ngOnInit(): void {
    }

    load_list_grid_data() {
        if (this.lib.isValidModel(this.mlListGridFilter)) {
            const url = this.lib.getApiUrl('student/attendance/list');
            this.http.post(url, this.mlListGridFilter).subscribe(
            (res) => {
                this.lstAttendacedata = new Array<mlSchoolWiseAttendance>();
                if (this.lib.isValidList(res.result.data)) {
                    this.lstAttendacedata = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
                this.lstAttendacedata = new Array<mlSchoolWiseAttendance>();
            });
        }
    }
    Edit_Attendance(AttendanceSysID: number) {
        this.lib.router.navigateByUrl(`/app/student/attendance/entry?mode=edit&id=${AttendanceSysID}`);
    }
    Approve_Attendance(AttendanceSysID: number) {
        this.lib.notification.confirm('Do you want to Approve Attendance Record', () => {
            try {
                    const url = this.lib.getApiUrl('student/attendance/approve/' + AttendanceSysID);
                    this.http.get(url).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.load_list_grid_data();
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    New_Attendance() {
        this.lib.router.navigateByUrl('/app/student/attendance/entry?mode=new');
    }
}

class mlListGridFilter {
    FromDate: string;
    ToDate: string;
    constructor() {
        this.ToDate = moment().format('DD-MM-YYYY');
        this.FromDate = moment().format('DD-MM-YYYY');
    }
}
class mlSchoolWiseAttendance {
    AttendanceSysID: number;
    Attn_Master_Date: string;
    Attn_Master_Status: string;
    PRESENT: number;
    ABSENT: number;
    LEAVE: number;
    Created_UsrFullname: string;
    Created_Date: string;
}
class mlClassSectionWiseAttendance extends mlSchoolWiseAttendance {
    ClassSysID: number;
    ClassName: string;
    ClassOrder: number;
    SectionSysID: number;
    SectionName: number;
}


class mlPermission {
    public isAllowView: boolean;
    public isAllowApprove: boolean;
    constructor() {
        this.isAllowView = false;
        this.isAllowApprove = false;
    }
}