import { Academic_Fees_Collection_Component } from './academic/academic-fees-collection.component';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit, Directive } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'fees-collection',
    templateUrl: './fees-collection.component.html'
})

export class Fees_Collection_Component implements OnInit {
    public CurrentAcademicYearSysId = 0;
    public StudentInfo: mlStudentInfo;
    public StudentInfo2: mlStudentInfo;
    public AdmissionNo = '';
    dsClassData: Array<InterFace.Idd>;
    dsSectionData: Array<InterFace.Idd>;
    dsStudentData: Array<InterFace.Idd>;
    public dsFeeInfoList: mlFeeInfo[];
    public ViewAcademicPaydetail: Boolean;
    public isTransportPayMode: Boolean = false;
    public isOtherFeePayMode: Boolean = false;
    public Account: mlFeeInfo;
    public isAllowAcademicCollection: boolean;
    public isAllowTransportCollection: boolean;
    public PageAccess: any;
    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Fee Collection');
        lib.setPageTitle('Fee Collection');
        // this.CurrentAcademicYearSysId = 6;
        this.CurrentAcademicYearSysId = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId
        this.Account = new mlFeeInfo();
        this.StudentInfo = new mlStudentInfo();
        this.AdmissionNo = '';
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAcademicCollection = this.lib.isActionAllowed('ACADEMIC FEE');
            this.isAllowTransportCollection = this.lib.isActionAllowed('TRANSPORT FEE');
        });

    }
    foo(action: string): boolean {
        console.log(1);
        return false;
    }
    ngOnInit() {
        this.LoadClass();
        this.dsFeeInfoList = [];
        this.ViewAcademicPaydetail = false;
        this.isOtherFeePayMode = false;
    }
    LoadClass() {
        this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + this.CurrentAcademicYearSysId)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsClassData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnStudentFee_Click() {
        if (!this.lib.isNullOrUndefined(this.StudentInfo)) {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-collection/amount-list/' + this.StudentInfo.StudentSysID)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsFeeInfoList = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    ddlClass_Valuechanged(ClassSysID: any, SectionSysID?: any, StudentSysID?: any) {
        this.dsSectionData = [];
        this.dsStudentData = [];
        if (this.lib.isValidSelectedValue(ClassSysID)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.CurrentAcademicYearSysId + '/' + ClassSysID + '/true')).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsSectionData = res.result.data;
                        if (this.lib.isValidSelectedValue(SectionSysID)) {
                            setTimeout(() => {
                                this.StudentInfo.SectionSysID = SectionSysID;
                                this.ddlSection_Valuechanged(SectionSysID, StudentSysID);
                            }, 100);
                        } else {
                            this.AdmissionNo = '';
                        }
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    ddlSection_Valuechanged(SectionSysID: any, StudentSysID?: any) {
        this.dsStudentData = [];
        if (this.lib.isValidSelectedValue(SectionSysID)) {
            this.http.get(this.lib.getApiUrl('dropdown/yearwise-student-list/' + this.CurrentAcademicYearSysId + '/' + this.StudentInfo.ClassSysID + '/' + SectionSysID)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsStudentData = res.result.data;
                        if (this.lib.isValidSelectedValue(StudentSysID)) {
                            setTimeout(() => {
                                this.StudentInfo.StudentSysID = StudentSysID;
                                this.btnStudentFee_Click();
                            }, 100);
                        } else {
                            this.AdmissionNo = '';
                        }
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    btnFeePay_click(Data: mlFeeInfo) {
        this.ViewAcademicPaydetail = false;
        this.isTransportPayMode = false;
        this.isOtherFeePayMode = false;
        this.Account.AccountName = Data.AccountName;
        this.Account.AcademicYearID = Data.AcademicYearID;
        this.Account.FeeName = Data.FeeName;
        this.StudentInfo.AcademicYearSysID = Data.AcademicYearSysID;

        this.StudentInfo.FeeSysID = Data.FeeSysID;
        this.StudentInfo.AccountSysID = Data.AccountSysID;
        if (Data.FeeName === this.lib.MasterData.FeeName.ACADEMICFEE) {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + Data.AcademicYearSysID)).subscribe(
                (res) => {
                    if (res.result.data.isAcdemicFeeApproved === true) {
                        this.ViewAcademicPaydetail = true;
                        this.isTransportPayMode = false;
                        this.isOtherFeePayMode = false;
                    } else {
                        this.lib.notification.warning(Data.AcademicYearID + ' Academic Fee Not Approved ');
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } else if (Data.FeeName === this.lib.MasterData.FeeName.TRANSPORTFEE) {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + Data.AcademicYearSysID)).subscribe(
                (res) => {
                    if (res.result.data.isTransportFeeApproved === true) {
                        this.ViewAcademicPaydetail = false;
                        this.isTransportPayMode = true;
                        this.isOtherFeePayMode = false;
                    } else {
                        this.lib.notification.warning(Data.AcademicYearID + ' Transport Fee Not Approved ');
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } else if (Data.FeeName === this.lib.MasterData.FeeName.OTHERFEE) {
            this.ViewAcademicPaydetail = false;
            this.isTransportPayMode = false;
            this.isOtherFeePayMode = true;
        } else {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + Data.AcademicYearSysID)).subscribe(
                (res) => {
                    if (res.result.data.isMiscellaneousFeeApproved === true) {
                        this.ViewAcademicPaydetail = false;
                        this.isTransportPayMode = false;
                        this.isOtherFeePayMode = false;
                    } else {
                        this.lib.notification.warning(Data.AcademicYearID + ' Miscellaneous Fee Not Approved ');
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    onClose() {
        this.ViewAcademicPaydetail = false;
        this.isTransportPayMode = false;
        this.isOtherFeePayMode = false;
        this.StudentInfo = new mlStudentInfo();
        this.dsFeeInfoList = [];
    }
    LoadStudentDetails() {
        if (this.AdmissionNo !== '') {
            const url = 'student/get-yearwise-Student-info?AcademicYearSysID=' + encodeURIComponent(this.CurrentAcademicYearSysId.toString()) + '&AdmissionNo=' + encodeURIComponent(this.AdmissionNo)
            this.http.get(this.lib.getApiUrl(url)).subscribe(
                (res) => {
                    if (this.lib.isValidModel(res.result.data)) {
                        this.StudentInfo2 = res.result.data;
                        this.StudentInfo2.AcademicYearSysID = this.StudentInfo2.AcademicYearSysID;
                        this.StudentInfo2.FeeSysID = this.StudentInfo2.FeeSysID;
                        this.StudentInfo2.AccountSysID = this.StudentInfo2.AccountSysID;
                        setTimeout(() => {
                            this.StudentInfo.ClassSysID = this.StudentInfo2.ClassSysID;
                            this.ddlClass_Valuechanged(this.StudentInfo2.ClassSysID, this.StudentInfo2.SectionSysID, this.StudentInfo2.StudentSysID);
                        }, 100);
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } else {
            this.lib.notification.warning('Please Enter Admission No.');
        }
    }
    calculateGroupTotal(FeeName: string) {
        let total = 0;
        if (this.lib.isValidList(this.dsFeeInfoList)) {
            for (const fee of this.dsFeeInfoList) {
                if (fee.FeeName === FeeName) {
                    total += fee.BalanceAmount;
                }
            }
        }

        return total;
    }
}
class mlStudentInfo {
    StudentName = '';
    StudentSysID = 0;
    ClassName = '';
    ClassSysID = 0;
    SectionName = '';
    SectionSysID = 0;
    AcademicYearSysID = 0;
    FeeSysID = 0;
    AccountSysID = 0;
}
export class mlFeeInfo {
    AcademicYearSysID = 0;
    AcademicYearID = '';
    BalanceAmount = 0;
    ConcessionAmount = 0;
    FeeSysID = 0;
    FeeName = '';
    AccountName = '';
    AccountSysID = 0;
}