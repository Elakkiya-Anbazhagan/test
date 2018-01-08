import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Observable } from 'rxjs/Observable';

import * as InterFace from '../../../InterFace';

@Component({
    selector: 'Transport-Circular-List',
    templateUrl: 'transport-circular.component.html'
})

export class Transport_Circular_Component implements OnInit {
    dsAcademicYear: Array<InterFace.Idd>;
    dsClass: Array<InterFace.Idd>;
    dsSection: Array<InterFace.Idd>;
    dsRoute: Array<InterFace.Idd>;

    public mlTransCircular: mltransportInfo;

    public mlTransCircularList: mltransportInfo[];

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Transport Circular List');
        lib.setPageTitle('Transport Circular List');
        this.mlTransCircular = new mltransportInfo();
    }

    ngOnInit() {
        const Obs_academicYearData = this.http.get(this.lib.getApiUrl('dropdown/academicyear/false'));
        Observable.forkJoin([Obs_academicYearData]).subscribe(
            (lstRes) => {
                this.dsAcademicYear = lstRes[0].result.data;
                setTimeout(() => {
                    this.mlTransCircular.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
                    this.ddlYear_Change(this.mlTransCircular.AcademicYearSysID);
                }, 100);
            },
            (err) => {
                this.lib.notification.error(err.message);
            },

        );
    }
    ddlYear_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.mlTransCircularList = [];
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + this.mlTransCircular.AcademicYearSysID + '/' + true)).subscribe(
                (res) => {
                    this.dsClass = res.result.data;
                    setTimeout(() => {
                        this.mlTransCircular.ClassSysID = '-1';
                        this.ddlClass_Change('-1')
                    }, 100);

                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    ddlClass_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.mlTransCircularList = [];
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.mlTransCircular.AcademicYearSysID + '/' + value + '/' + true)).subscribe(
                (res) => {
                    this.dsSection = res.result.data;
                    setTimeout(() => {
                        this.mlTransCircular.SectionSysID = '-1';
                        this.ddlSection_Change(this.mlTransCircular.SectionSysID)
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    ddlSection_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.mlTransCircularList = [];
            this.btnView_Click();
        }
    }

    btnView_Click() {
        if (this.lib.isValidSelectedValue(this.mlTransCircular.AcademicYearSysID) &&
            this.lib.isValidSelectedValue(this.mlTransCircular.ClassSysID) &&
            this.lib.isValidSelectedValue(this.mlTransCircular.SectionSysID)) {

            this.http.get(this.lib.getApiUrl('fees/transport-fees-collection/transportFee-amount-list/' + this.mlTransCircular.AcademicYearSysID + '/'
                + this.mlTransCircular.ClassSysID + '/' +
                + this.mlTransCircular.SectionSysID)).subscribe(
                (res) => {
                    this.mlTransCircularList = [];
                    this.mlTransCircularList = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    btnPrint_Click() {
        const url = 'Report/Transport-Circular-List-report/' + this.mlTransCircular.AcademicYearSysID + '/' + this.mlTransCircular.ClassSysID + '/' + this.mlTransCircular.SectionSysID + '/PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }
}

export class mltransportInfo {
    RouteSysID: number;
    AcademicYearSysID: number;
    AcademicYear: string;
    ClassSysID: string;
    ClassName: string;
    SectionSysID: string;
    SectionName: string;
    AdmissionNo: string;
    StudentName: string;
    RouteName: string;
    VehicleNo: string;
    StopName: string;
    TripName: string;
    TotalAmount: string;
    TermName: string;
    ContactMobileNo: string;
}