import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';

import * as InterFace from '../../../InterFace';

@Component({
    selector: 'rptTransport-Fee-collection',
    templateUrl: 'Transport-Fee-Collection-Reprt.component.html'
})

export class Transport_Fee_Collection_report_Component implements OnInit {
    dsAcademicYear: Array<InterFace.Idd>
    public FeeEntry: mlTransFeeEntry;
    dsClass: Array<InterFace.Ims>;
    dsTerm: Array<InterFace.Ims>;
    dsType: Array<InterFace.Ims>;
    dsReportType: Array<InterFace.Idd>;
    paymentDisabled: Boolean = false;
    ReportTypeDisabled: Boolean = false;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Fee Report');
        lib.setPageTitle('Fee Report');
        this.FeeEntry = new mlTransFeeEntry();
    }

    ngOnInit() {
        this.LoadAcademicYear()
        this.dsType = [
            { label: 'Total', value: 'Total' },
            { label: 'Paid', value: 'Paid' },
            { label: 'Balance', value: 'Balance' }
        ];
        this.dsReportType = [
            { id: 'Arrear', text: 'Arrear' }, {
                id: 'Customised', text: 'Customised'
            }
        ];

    }
    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    ddlAcademicYear_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.http.get(this.lib.getApiUrl('dropdown/msget-yearwise-class/' + event.value)).subscribe(
                (res) => {
                    this.FeeEntry.selectedClass = [];
                    this.FeeEntry.selectedTerm = [];
                    this.FeeEntry.ReportSysID = '';
                    this.FeeEntry.selectedType = [];
                    this.dsClass = res.result.data;
                    this.LoadTerm();
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    LoadTerm() {
        this.http.get(this.lib.getApiUrl('dropdown/msFeeterm/' + this.FeeEntry.AcademicYearSysID + '/' + false)).subscribe(
            (res) => {
                this.dsTerm = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    Term_Change(event: any) {

        this.ReportTypeDisabled = true;
        if (this.FeeEntry.selectedTerm.length > 1) {
            this.FeeEntry.ReportSysID = 'Customised';
            this.FeeEntry.selectedType = [];
            this.ReportTypeDisabled = false;
        } else {
            this.FeeEntry.ReportSysID = '';
            this.ReportTypeDisabled = false;
        }
    }

    ReportType_Change(event: any) {
        this.paymentDisabled = true;
        if (this.lib.isValidSelectedValue(event.value)) {
            if (event.value === 'Arrear') {
                this.FeeEntry.ReportSysID = '';
                this.FeeEntry.selectedType = ['Balance'];
                this.paymentDisabled = false;
            } else {
                this.FeeEntry.selectedType = [];
                this.paymentDisabled = false;
            }
        }
    }
    btnViewPDF_click() {
        const selcls = this.FeeEntry.selectedClass.join();
        const selTerm = this.FeeEntry.selectedTerm.join();
        const selCols = this.FeeEntry.selectedType.join();
        const url = 'report/transport-fee-report/' + this.FeeEntry.AcademicYearSysID + '/' + selcls + '/' + selTerm + '/' + selCols + '/' + this.FeeEntry.ReportSysID + '/PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');

    }

    btnViewExcel_click() {
        const selcls = this.FeeEntry.selectedClass.join();
        const selTerm = this.FeeEntry.selectedTerm.join();
        const selCols = this.FeeEntry.selectedType.join();
        const url = 'report/transport-fee-report/' + this.FeeEntry.AcademicYearSysID + '/' + selcls + '/' + selTerm + '/' + selCols + '/' + this.FeeEntry.ReportSysID + '/Excel';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');

    }

}


export class mlTransFeeEntry {
    AcademicYearSysID: string;
    AcademicYear: string;
    selectedClass: string[] = [];
    selectedTerm: string[] = [];
    selectedType: string[] = [];
    ReportSysID: string;
}