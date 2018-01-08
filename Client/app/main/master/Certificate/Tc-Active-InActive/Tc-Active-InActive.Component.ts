import { SelectItem } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'Tc-Active-InActive.Component',
    templateUrl: 'Tc-Active-InActive.Component.html'
})

export class Tc_Active_InActive_Component implements OnInit {
    @ViewChild('mdInActive') mdInActive: ModalComponent;
    @ViewChild('frmInActive') FrmData: NgForm;
    dsAcademicYear: Array<InterFace.Idd>
    dsClass: Array<InterFace.Ims>;
    dsSection: Array<InterFace.Ims>;
    dstypeData: Array<InterFace.Idd>;
    StudentInfo: mlStudentInfo;
    StudentList: StudentList[];
    RequestData: RequestData;
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    public IsTcIssue: Boolean = false;

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Student Tc Issue & Active & InActive');
        lib.setPageTitle('Student Tc Issue & Active & InActive');
        this.StudentInfo = new mlStudentInfo();
        this.RequestData = new RequestData();
    }

    ngOnInit() {
        this.LoadAcademicYear()
        this.LoadType();
    }

    LoadType() {
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/Certificate_Request_Type/true')).subscribe(
            (res) => {
                this.dstypeData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
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

    btnBonafidePrint_click(Data: StudentList) {
        this.RequestData = new RequestData();
        this.RequestData.StudentSysID = Data.StudentSysID;

        this.lib.notification.confirm('Do you want to show Bonafide certificate ' + Data.StudentName, () => {
            const url = '/Report/Bonafide-certificate/' + Data.StudentSysID + '/' + 'PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');

        }, () => { });
    }

    btnTcSample_click(Data: StudentList) {
        this.RequestData = new RequestData();
        this.RequestData.StudentSysID = Data.StudentSysID;

        this.lib.notification.confirm('Do you want to show sample TC for ' + Data.StudentName, () => {
            const url = '/Report/TC-certificate/' + Data.StudentSysID + '/true/' + 'PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');

        }, () => { });
    }

    btnTcPrint_click(Data: any) {
        const url = '/Report/TC-certificate/' + Data.StudentSysID + '/false/PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }

    btnTcRequest_click(Data: StudentList) {
        this.RequestData = new RequestData();
        this.RequestData.AcademicYearSysId = this.StudentInfo.AcademicYearSysID;
        this.RequestData.TypeName = this.lib.MasterData.Certificate.TC_ISSUE;
        this.RequestData.StudentSysID = Data.StudentSysID;
        this.RequestData.StudentName = Data.StudentName;
        this.RequestData.ClassSysID = Data.ClassSysID;
        this.RequestData.SectionSysID = Data.SectionSysID;
        this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + this.StudentInfo.AcademicYearSysID)).subscribe(
            (res) => {
                if (res.result.data.isMiscellaneousFeeApproved === true) {
                    this.lib.notification.confirm('Do you want to request TC for ' + Data.StudentName, () => {
                        this.SendRequest();
                        if (this.IsTcIssue) {
                            const url = '/Report/TC-certificate/' + Data.StudentSysID + '/false/' + 'PDF';
                            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
                        }
                    }, () => { });
                } else {
                    this.lib.notification.warning('Miscellaneous Fee Not Approved For Selected Academic YearID');
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });

    }

    btnActiveRequest_click(Data: StudentList) {
        this.RequestData = new RequestData();
        this.RequestData.AcademicYearSysId = this.StudentInfo.AcademicYearSysID;
        this.RequestData.TypeName = this.lib.MasterData.Certificate.ACTIVE;
        this.RequestData.StudentSysID = Data.StudentSysID;
        this.RequestData.StudentName = Data.StudentName;
        this.RequestData.ClassSysID = Data.ClassSysID;
        this.RequestData.SectionSysID = Data.SectionSysID;
        this.RequestData.IsLocked = !Data.IsLocked;

        this.lib.notification.confirm('Do you want to Active ' + Data.StudentName, () => {
            this.SendRequest();
        }, () => { });
    }
    InActiveRoute() {
        this.lib.notification.confirm('Do you want to InActive ' + this.RequestData.StudentName, () => {
            this.SendRequest();
            this.FrmData.resetForm();
            this.mdInActive.close();
        }, () => { });
    }
    btnInActiveRequest_click(Data: StudentList) {
        this.RequestData = new RequestData();
        this.RequestData.AcademicYearSysId = this.StudentInfo.AcademicYearSysID;
        this.RequestData.TypeName = this.lib.MasterData.Certificate.INACTIVE;
        this.RequestData.StudentSysID = Data.StudentSysID;
        this.RequestData.StudentName = Data.StudentName;
        this.RequestData.ClassSysID = Data.ClassSysID;
        this.RequestData.SectionSysID = Data.SectionSysID;
        this.RequestData.IsLocked = !Data.IsLocked;
        this.mdInActive.open();
    }

    SendRequest() {
        try {
            this.http.post(this.lib.getApiUrl('student/certificate/save'), this.RequestData).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    if (this.RequestData.TypeName === this.lib.MasterData.Certificate.TC_ISSUE) {
                        this.IsTcIssue = true;
                    } else {
                        this.IsTcIssue = false;
                    }
                    this.btnView_click();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }
    }

    ddlAcademicYear_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + value + '/true')).subscribe(
                (res) => {
                    this.dsClass = res.result.data;
                    setTimeout(() => {
                        this.StudentInfo.selectedClass = '-1';
                        this.StudentInfo.TypeSysID = '-1';
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
                        // this.btnView_click()
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    btnView_click() {
        this.http.get(this.lib.getApiUrl('student/certificate/get-yearwise-student-status-list/' + this.StudentInfo.AcademicYearSysID + '/'
            + this.StudentInfo.selectedClass + '/' +
            + this.StudentInfo.selectedSection + '/' +
            + this.StudentInfo.TypeSysID)).subscribe(
            (res) => {
                this.StudentList = [];
                this.StudentList = res.result.data;
                if (this.lib.isValidList(this.StudentList)) {
                    this.dsClassFilter = this.lib.groupByAsSelectItem(this.StudentList, 'ClassName', true)
                    this.dsSectionFilter = this.lib.groupByAsSelectItem(this.StudentList, 'SectionName', true)
                }

            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
}

class mlStudentInfo {
    AcademicYearSysID = 0;
    selectedClass = '';
    selectedSection = '';
    TypeSysID = '';
}

class StudentList {
    StudentSysID = 0;
    StudentName = '';
    admissionNo = '';
    ClassSysID = 0;
    SectionSysID = 0;
    className = '';
    sectionName = '';
    mobile = '';
    IsTcIssued = false;
    IsLocked = false;
}

class RequestData {
    StudentSysID = 0;
    StudentName = '';
    AcademicYearSysId = 0;
    TypeName = '';
    ClassSysID = 0;
    SectionSysID = 0;
    IsLocked = false;
    LockedReason = '';
    isSampleCopy = false;
}