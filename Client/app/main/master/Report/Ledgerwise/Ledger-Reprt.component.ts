import { UtilityService, ApiService } from 'systemic/helper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';

import * as InterFace from '../../../InterFace';

@Component({
    selector: 'Ledger-report',
    templateUrl: 'Ledger-Reprt.component.html'
})

export class Ledger_ReportComponent implements OnInit {

    public LedgerData: mlLedgerEntry;
    dsLedgerdata: Array<InterFace.Idd>;

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Ledger Report');
        lib.setPageTitle('Ledger Report');
        this.LedgerData = new mlLedgerEntry();

    }

    ngOnInit() {
        this.LoadLedger();

    }
    LoadLedger() {
        this.http.get(this.lib.getApiUrl('dropdown/ManualLedger')).subscribe(
            (res) => {
                this.dsLedgerdata = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSave_click() {
        if (!this.lib.isNullOrUndefined(this.LedgerData)) {
            console.log(this.LedgerData);
            const url = 'report/Ledger-report/' + this.LedgerData.LedgerSysID + '/' + this.LedgerData.FromDate + '/' + this.LedgerData.ToDate + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }
}
class mlLedgerEntry {
    LedgerSysID: string;
    FromDate: string;
    ToDate: string;

}