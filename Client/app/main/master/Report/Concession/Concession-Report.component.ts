import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../InterFace';

@Component({
    selector: 'Concession-Report',
    templateUrl: 'Concession-Report.component.html'
})

export class Concession_Report_Component implements OnInit {
    public ConcessionInfo: mlConcessionInfo;
    dsConcessionData: Array<InterFace.Idd>
    ConcessionList: mlConcessionList[];
    TotalAmount = 0;
    ConcessionAmount = 0;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Concession Report');
        lib.setPageTitle('Concession Report');
    }
    ngOnInit() {
        this.ConcessionInfo = new mlConcessionInfo();
        this.LoadLedger();
        this.ConcessionInfo.ToDate = moment().format('DD-MM-YYYY');
        this.ConcessionInfo.FromDate = moment().add(-1, 'M').format('DD-MM-YYYY');
    }
    LoadLedger() {
        this.http.get(this.lib.getApiUrl('dropdown/fee')).subscribe(
            (res) => {
                this.dsConcessionData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadData() {
        this.ConcessionList = [];
        if (this.lib.isValidModel(this.ConcessionInfo)) {
            this.http.post(this.lib.getApiUrl('fees/concession/list/concession-list'), this.ConcessionInfo).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.ConcessionList = res.result.data;
                        this.calculateCredit();
                        this.calculateDebit();
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    BtnPrint_Click() {
        // if (!this.lib.isNullOrUndefined(this.LedgerData)) {
        //     const url = 'Report/Bank-Ledger-report/' + this.LedgerData.LedgerSysID + '/' + this.LedgerData.FromDate + '/' + this.LedgerData.ToDate + '/PDF';
        //     window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        // }
    }
    btnView_click() {
        this.LoadData();
    }
    calculateCredit() {
        let Total = 0;
        this.TotalAmount = 0;
        if (this.ConcessionList) {
            this.ConcessionList.forEach(Data => {
                Total += Data.ActualAmount;
            });
        }
        this.TotalAmount += Total;
        return Total;
    }
    calculateDebit() {
        let Total = 0;
        this.ConcessionAmount = 0;
        if (this.ConcessionList) {
            this.ConcessionList.forEach(Data => {
                Total += Data.Amount;
            });
        }
        this.ConcessionAmount += Total;
        return Total;
    }
}
class mlConcessionInfo {
    FeeSysID: string;
    FromDate: string;
    ToDate: string;
}

class mlConcessionList {
    StudentSysID: number;
    AdmissionNo: string;
    StudentName: string;
    ConcessionDate: string;
    ClassName: string;
    SectionName: string;
    AcademicYearID: string;
    ActualAmount: number;
    Amount: number;
    FeeSysID: string;
    FeeName: string;
    CategoryName: string;
}