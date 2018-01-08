import { UtilityService, ApiService } from 'systemic/helper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../InterFace';

@Component({
    selector: 'Cash-Book',
    templateUrl: 'Day-Book-Rept.component.html'
})

export class Day_Book_Component implements OnInit {
    public DayBookData: mlDayBookEntry;
    dsAccount: Array<InterFace.Idd>
    constructor(public lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Cash Book');
        lib.setPageTitle('Cash Book');
    }
    ngOnInit() {
        this.DayBookData = new mlDayBookEntry();
        this.LoadAccount();
        this.DayBookData.ToDate = moment().format('DD-MM-YYYY');
        this.DayBookData.FromDate = moment().add(-1, 'M').format('DD-MM-YYYY');
    }
    LoadAccount() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.dsAccount = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnView_click() {
        if (!this.lib.isNullOrUndefined(this.DayBookData)) {
            console.log(this.DayBookData);
            const url = 'Report/DayBook-report/' + this.DayBookData.AccountSysID + '/' + this.DayBookData.FromDate + '/' + this.DayBookData.ToDate + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }
}
export class mlDayBookEntry {
    AccountSysID: string;
    FromDate: string;
    ToDate: string;
}