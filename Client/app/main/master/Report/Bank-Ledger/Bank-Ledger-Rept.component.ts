import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../InterFace';

@Component({
    selector: 'Bank-Book',
    templateUrl: 'Bank-Ledger-Rept.component.html'
})

export class Bank_Ledger_Component implements OnInit {
    public LedgerData: mlBankBookEntry;
    dsLedgerdata: Array<InterFace.Idd>
    BankBookList: BankLedegerRpt;
    public Credit = 0;
    public Debit = 0;
    public openingBalance = 0;
    public OutWardUnPresent = 0;
    public InWardUnPresent = 0;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Bank Book');
        lib.setPageTitle('Bank Book');
    }
    ngOnInit() {
        this.LedgerData = new mlBankBookEntry();
        this.BankBookList = new BankLedegerRpt();
        this.LoadLedger();
        this.Credit = 0;
        this.Debit = 0;
        this.openingBalance = 0;
        this.OutWardUnPresent = 0;
        this.InWardUnPresent = 0;
        this.LedgerData.ToDate = moment().format('DD-MM-YYYY');
        this.LedgerData.FromDate = moment().add(-1, 'M').format('DD-MM-YYYY');
    }
    LoadLedger() {
        this.http.get(this.lib.getApiUrl('dropdown/AllBankName')).subscribe(
            (res) => {
                this.dsLedgerdata = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    BtnPrint_Click() {
        if (!this.lib.isNullOrUndefined(this.LedgerData)) {
            const url = 'Report/Bank-Ledger-report/' + this.LedgerData.LedgerSysID + '/' + this.LedgerData.FromDate + '/' + this.LedgerData.ToDate + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }
    btnView_click() {
        this.LoadData();
    }
    LoadData() {
        if (this.LedgerData) {
            // tslint:disable-next-line:max-line-length
            const url = 'account/master/ledger/Bank-Ledger-Report?LedgerSysID=' + this.LedgerData.LedgerSysID + '&FromDate=' + encodeURIComponent(this.LedgerData.FromDate) + '&ToDate=' + encodeURIComponent(this.LedgerData.ToDate)
            this.http.get(this.lib.getApiUrl(url)).subscribe(
                (res) => {
                    console.log(res.result.data)
                    this.BankBookList = new BankLedegerRpt();
                    this.BankBookList = res.result.data;
                    this.calculateCredit();
                    this.calculateDebit();
                    this.openingBalance = this.BankBookList.ChequeTransaction.OpeningBalance
                    this.OutWardUnPresent = this.BankBookList.ChequeTransaction.OutWardUnPresent
                    this.InWardUnPresent = this.BankBookList.ChequeTransaction.InWardUnPresent
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }

    }
    calculateCredit() {
        let Total = 0;
        this.Credit = 0;
        if (this.BankBookList.LedgerTransaction) {
            this.BankBookList.LedgerTransaction.forEach(Data => {
                Total += Data.Credit;
            });
        }
        this.Credit += Total;
        return Total;
    }
    calculateDebit() {
        let Total = 0;
        this.Debit = 0;
        if (this.BankBookList.LedgerTransaction) {
            this.BankBookList.LedgerTransaction.forEach(Data => {
                Total += Data.Debit;
            });
        }
        this.Debit += Total;
        return Total;
    }
}
export class mlBankBookEntry {
    LedgerSysID: string;
    FromDate: string;
    ToDate: string;
}
export class mlBankBookList {
    JournalSysID: number;
    JournalDate: string;
    JournalNo: string;
    TransactionRefType: string;
    TransactionRefTypeSysID: number;
    Narration: string;
    BranchSysID: number;
    AccountYearSysID: number;
    AcademicYearSysId: number;
    AccountSysID: number;
    LedgerSysID: number;
    Credit: number;
    Debit: number;
    IsDeleted: boolean;
    constructor() {
        this.Credit = 0;
        this.Debit = 0;
    }
}
export class mlChequeTransaction {
    OutWardUnPresent: number;
    InWardUnPresent: number;
    OutWardPresent: number;
    InWardPresent: number;
    OutWardBounced: number;
    InWardBounced: number;
    OpeningBalance: number;
    constructor() {
        this.OutWardUnPresent = 0;
        this.InWardUnPresent = 0;
        this.OutWardPresent = 0;
        this.InWardPresent = 0;
        this.OutWardBounced = 0;
        this.InWardBounced = 0;
        this.OpeningBalance = 0;
    }
}
class BankLedegerRpt {
    LedgerTransaction: mlBankBookList[];
    ChequeTransaction: mlChequeTransaction
    constructor() {
        this.LedgerTransaction = new Array<mlBankBookList>();
        this.ChequeTransaction = new mlChequeTransaction();
    }

}