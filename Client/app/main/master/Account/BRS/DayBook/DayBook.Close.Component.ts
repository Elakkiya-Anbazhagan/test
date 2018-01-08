import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';

import * as InterFace from './../../../../InterFace';
import { Idd } from './../../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../../InterFace/IVoucher';

@Component({
    selector: 'daybook_close',
    templateUrl: './DayBook.Close.Component.html'
})
export class DayBook_Close_Component implements OnInit {
    public DayBookData: InterFace.mlDayBook;
    public DayBookCloseData: InterFace.DayBookCloseData;
    public dsAccountData: Array<InterFace.Idd>;
    public AccountName: string;
    public AccountSysID: string;
    public Credit = 0;
    public Debit = 0;
    @ViewChild('mdDenomination') mdDenomination: ModalComponent;
    @ViewChild('frmDenomination') frmDenomination: NgForm;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('DayBook');
        lib.setPageTitle('DayBook');
        this.AccountName = '';
        this.DayBookData = new InterFace.mlDayBook();
    }
    ngOnInit() {
        this.ClearControl();
        this.LoadAccountType();
    }
    ClearControl() {
        this.Credit = 0;
        this.Debit = 0;
        this.DayBookData = new InterFace.mlDayBook();

    }
    LoadAccountType() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.dsAccountData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    AccountTypeChanged(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.AccountSysID = event.value;
            this.LoadData(event.value);
            this.AccountName = event.data[0].text;
        }
    }
    LoadData(AccountSysID: string) {
        this.http.get(this.lib.getApiUrl('account/brs/daybook/list/' + AccountSysID)).subscribe(
            (res) => {
                this.ClearControl();
                this.DayBookData = res.result.data;
                this.calculateCredit();
                this.calculateDebit();
            },
            (err) => {
                this.lib.notification.error(err.message);
            })
    }
    btnClose_Click() {
        this.DayBookCloseData = new InterFace.DayBookCloseData();
        let Income = 0;
        let Expense = 0;
        if (this.lib.isValidList(this.DayBookData.DayBookList)) {
            this.DayBookData.DayBookList.forEach(Data => {
                Income += Data.Credit;
                Expense += Data.Debit;
            });
        }
        this.DayBookCloseData.Master.ClosingDate = this.DayBookData.Details.JournalDate;
        this.DayBookCloseData.Master.LedgerSysID = this.DayBookData.Details.LedgerSysID;
        this.DayBookCloseData.Master.Income = Income;
        this.DayBookCloseData.Master.Expense = Expense;
        this.DayBookCloseData.Master.OpeningBalance = this.DayBookData.OpeningBalance;
        if (this.DayBookCloseData.Master.LedgerSysID !== 0) {
            this.lib.notification.confirm('Do you want to Close DayBook ?', () => {
                this.http.post(this.lib.getApiUrl('account/brs/daybook/close'), this.DayBookCloseData).subscribe(
                    (res) => {
                        this.ClearControl();
                        this.lib.notification.success(res.message);
                        this.LoadData(this.AccountSysID);
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    })
            }, () => { });
        } else {
            this.lib.notification.warning('Please Select Account.');
        }

    }
    btnCancel_Click() {
        this.ClearControl();
    }
    calculateCredit() {
        let Total = 0;
        this.Credit = 0;
        if (this.DayBookData.DayBookList) {
            this.DayBookData.DayBookList.forEach(Data => {
                Total += Data.Credit;
            });
        }
        this.Credit += Total;
        return Total;
    }
    calculateDebit() {
        let Total = 0;
        if (this.DayBookData.DayBookList) {
            this.DayBookData.DayBookList.forEach(Data => {
                Total += Data.Debit;
            });
        }
        this.Debit += Total;
        return Total;
    }
}
