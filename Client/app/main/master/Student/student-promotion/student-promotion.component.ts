import { Component, OnInit, NgZone } from '@angular/core';
import { routerTransition, hostStyle } from '../../../../router.animations';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms/src/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'student-promotion',
    templateUrl: './student-promotion.component.html'
})

export class Student_Promotion_Component implements OnInit {
    PromoteFrom: InterFace.AcademicInfo;
    PromoteTo: InterFace.AcademicInfo;
    dsAcademicYear: InterFace.Idd[];

    // Promote To
    dsCurYrClass: InterFace.Idd[];
    dsCurYrSection: InterFace.Idd[];
    isCurYrAcademicYrDisabled: boolean;
    curYrStudentList: InterFace.IPromotionInfo[];
    // Promote For
    dsPrvYrClass: InterFace.Idd[];
    dsPrvYrSection: InterFace.Idd[];
    isPrvYrAcademicYrDisabled: boolean;
    ActiveAcademicYear: number;
    prvYrStudentList: InterFace.IPromotionInfo[];
    prvYrSelectedStudentList: InterFace.IPromotionInfo[]
    public feeaprove: Boolean;

    constructor(private lib: UtilityService, private http: ApiService, public zone: NgZone) {
        lib.setBrowserTitle('Student Promotion');
        lib.setPageTitle('Student Promotion');
        this.PromoteFrom = new InterFace.AcademicInfo();
        this.PromoteTo = new InterFace.AcademicInfo();
        this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId)).subscribe(
            (res) => {
                this.feeaprove = res.result.data.isAcdemicFeeApproved
                if (res.result.data.isAcdemicFeeApproved === false) {
                    this.lib.notification.warning('Please approve academic fee structure');
                    this.isCurYrAcademicYrDisabled = true;
                } else {
                    this.LoadData();
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    ngOnInit() {

    }
    AcademicYear_SelectedIndexChange(ddl: any, type: string) {
        if (type === 'from') {
            this.dsPrvYrClass = [];
            this.dsPrvYrSection = [];
            this.prvYrStudentList = [];
            if (this.lib.isValidSelectedValue(ddl.value)) {
                this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + ddl.value)).subscribe(
                    (res) => {
                        this.dsPrvYrClass = res.result.data;
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }
        }
    }

    Class_SelectedIndexChange(ddl: any, type: string) {
        if (type === 'from') {
            this.dsPrvYrSection = [];
            this.prvYrStudentList = [];
            if (this.lib.isValidSelectedValue(this.PromoteFrom.AcademicYearSysID) && this.lib.isValidSelectedValue(ddl.value)) {
                this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section-New/' + this.PromoteFrom.AcademicYearSysID + '/' + ddl.value + '/' + true)).subscribe(
                    (res) => {
                        this.dsPrvYrSection = res.result.data;
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }
        } else {
            this.curYrStudentList = [];
        }
    }

    Section_SelectedIndexChange(ddl: any, type: string) {
        if (type === 'from') {
            this.prvYrStudentList = [];
            if (this.lib.isValidSelectedValue(this.PromoteFrom.AcademicYearSysID)
                && this.lib.isValidSelectedValue(this.PromoteFrom.ClassSysID)
                && this.lib.isValidSelectedValue(ddl.value)) {
                if (ddl.data[0].text === 'New') {
                    this.http.get(this.lib.getApiUrl('student/get-yearwise-new-basic-info-list/' + this.PromoteFrom.AcademicYearSysID
                        + '/' + this.PromoteFrom.ClassSysID + '/' + ddl.value)).subscribe(
                        (res) => {
                            this.prvYrStudentList = res.result.data;
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                } else {
                    this.http.get(this.lib.getApiUrl('student/get-yearwise-basic-info-list/' + this.PromoteFrom.AcademicYearSysID
                        + '/' + this.PromoteFrom.ClassSysID + '/' + ddl.value)).subscribe(
                        (res) => {
                            this.prvYrStudentList = res.result.data;
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                }
            }

        } else {
            this.curYrStudentList = [];
            if (this.lib.isValidSelectedValue(this.PromoteTo.AcademicYearSysID)
                && this.lib.isValidSelectedValue(this.PromoteTo.ClassSysID)
                && this.lib.isValidSelectedValue(ddl.value)) {
                this.http.get(this.lib.getApiUrl('student/get-yearwise-basic-info-list/' + this.PromoteTo.AcademicYearSysID
                    + '/' + this.PromoteTo.ClassSysID + '/' + ddl.value)).subscribe(
                    (res) => {
                        this.curYrStudentList = res.result.data;
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }
        }
    }

    LoadStudentList(AcademicYearSysID: number, ClassSysID: number, SectionSysID: number, Type: string) {

    }
    LoadData() {
        const Obs_academicYearData = this.http.get(this.lib.getApiUrl('dropdown/academicyear/false'));
        const Obs_classData = this.http.get(this.lib.getApiUrl('dropdown/get-class'));
        const Obs_sectionData = this.http.get(this.lib.getApiUrl('dropdown/get-section'));
        Observable.forkJoin([Obs_academicYearData, Obs_classData, Obs_sectionData]).subscribe(
            (lstRes) => {
                this.dsAcademicYear = lstRes[0].result.data;
                this.dsCurYrClass = lstRes[1].result.data;
                this.dsCurYrSection = lstRes[2].result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
            () => {
                this.ActiveAcademicYear = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
                this.isPrvYrAcademicYrDisabled = false;
                this.isCurYrAcademicYrDisabled = true;
            }
        );
    }

    frmPromotion_Submit(formData: NgForm) {

        if (typeof this.prvYrSelectedStudentList === 'undefined' || this.prvYrSelectedStudentList.length === 0) {
            this.lib.notification.warning('Please select students for promotion');
            // tslint:disable-next-line:max-line-length
        } else if (this.PromoteFrom.AcademicYearSysID === this.PromoteTo.AcademicYearSysID && this.PromoteFrom.ClassSysID === this.PromoteTo.ClassSysID && this.PromoteFrom.SectionSysID === this.PromoteTo.SectionSysID) {
            this.lib.notification.warning('Please check student promotion details are same.');
            // tslint:disable-next-line:max-line-length
        } else {
            const promote = new InterFace.PromoteStudents();
            promote.academicInfo.AcademicYearSysID = this.PromoteTo.AcademicYearSysID;
            promote.academicInfo.ClassSysID = this.PromoteTo.ClassSysID;
            promote.academicInfo.SectionSysID = this.PromoteTo.SectionSysID;
            promote.prvYrStudentList = this.prvYrSelectedStudentList;
            this.lib.notification.confirm('Do you want to ', () => {
                try {
                    this.http.post(this.lib.getApiUrl('student/promotion/Save'), promote).subscribe(
                        (res) => {
                            this.zone.run(() => {
                                this.lib.notification.success(res.message);
                                // Load Previous Year Students
                                const ddl = { value: this.PromoteFrom.SectionSysID, data: [{ id: this.PromoteFrom.SectionSysID, text: '' }] };
                                this.Section_SelectedIndexChange(ddl, 'from');
                                // Load Current Year Students
                                ddl.value = this.PromoteTo.SectionSysID;
                                this.Section_SelectedIndexChange(ddl, 'to');
                            });
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
    }
}