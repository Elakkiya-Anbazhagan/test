import { SelectItem } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';

import * as InterFace from './../../../InterFace';

@Component({
    selector: 'student-info-report',
    templateUrl: 'Student-Info-Report.Component.html'
})

export class Student_Info_Report_Component implements OnInit {
    dsAcademicYear: Array<InterFace.Idd>
    dsClass: Array<InterFace.Ims>;
    dsSection: Array<InterFace.Ims>;
    StudentInfo: mlStudentInfo;
    StudentList: StudentList[];
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    dstypeData: Array<InterFace.Idd>;

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Student Information Report');
        lib.setPageTitle('Student Information Report');
        this.StudentInfo = new mlStudentInfo();
    }

    ngOnInit() {
        this.LoadAcademicYear()
        this.dstypeData = [{ id: 'Caste', text: 'Caste' }, { id: 'Gender', text: 'Gender' }, { id: 'Basic', text: 'Basic' }]
        setTimeout(() => {
            this.StudentInfo.TypeSysID = 'Basic';
        }, 100);

    }

    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
                setTimeout(() => {
                    this.StudentInfo.AcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
                    this.ddlAcademicYear_Change(this.StudentInfo.AcademicYearSysID);
                }, 100);
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    ddlAcademicYear_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + value + '/true')).subscribe(
                (res) => {
                    this.dsClass = res.result.data;
                    setTimeout(() => {
                        this.StudentInfo.selectedClass = '-1';
                        this.ddlClass_Change(this.StudentInfo.selectedClass);
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    ddlClass_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.StudentInfo.AcademicYearSysID + '/' + value + '/true')).subscribe(
                (res) => {
                    this.dsSection = res.result.data;
                    setTimeout(() => {
                        this.StudentInfo.selectedSection = '-1';
                        this.btnView_click()
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    btnPrint_Click() {
        if (this.StudentInfo.TypeSysID === 'Gender') {
            const url = 'Report/Gender-Student-Info-report/' + this.StudentInfo.AcademicYearSysID + '/' + this.StudentInfo.selectedClass + '/' + this.StudentInfo.selectedSection + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        } else if (this.StudentInfo.TypeSysID === 'Caste') {
            const url = 'Report/Caste-Student-Info-report/' + this.StudentInfo.AcademicYearSysID + '/' + this.StudentInfo.selectedClass + '/' + this.StudentInfo.selectedSection + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        } else {
            const url = 'Report/Student-Info-report/' + this.StudentInfo.AcademicYearSysID + '/' + this.StudentInfo.selectedClass + '/' + this.StudentInfo.selectedSection + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }

    btnView_click() {
        this.http.get(this.lib.getApiUrl('student/get-yearwise-basic-info-list/' + this.StudentInfo.AcademicYearSysID + '/'
            + this.StudentInfo.selectedClass + '/' +
            + this.StudentInfo.selectedSection)).subscribe(
            (res) => {
                this.StudentList = [];
                this.StudentList = res.result.data;
                this.dsClassFilter = this.lib.groupByAsSelectItem(this.StudentList, 'ClassName', true)
                this.dsSectionFilter = this.lib.groupByAsSelectItem(this.StudentList, 'SectionName', true)

            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

}

class mlStudentInfo {
    AcademicYearSysID: number;
    selectedClass: string;
    selectedSection: string;
    TypeSysID: string;
}
class StudentList {
    studentSysID: number;
    studentName: string;
    admissionNo: string;
    classSysID: number;
    className: string;
    sectionSysID: number;
    sectionName: string;
    mobile: string;
    ContactMobileNo: string;
}