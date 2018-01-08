import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import * as moment from 'moment';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';
@Component({
    selector: 'transport-fees-collection',
    templateUrl: './transport-fees-collection.component.html'
})

export class Transport_Fees_Collection_Component {
    public mlData: InterFace.TransportData;
    public TransportApproveData: InterFace.mlTermWiseAmountList[];
    PaymentData: InterFace.ITransactionPaymode;
    dsTermData: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    dsCompanyBankName: Array<InterFace.Idd>;
    paymentDisabled: Boolean = false;
    CompanyBankDisabled: Boolean = false;
    minDate: Date;
    Receiptdate: string;
    TermSysID = '';
    @Output() onclose = new EventEmitter();

    @Input() StudentSysID = 0;
    @Input() FeeSysID = 0;
    @Input() AcademicYearSysID = 0;
    @Input() AccountSysID = 0;
    @Input() AccountName = '';
    @Input() AcademicYear = '';
    @Input() FeeName = '';
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        this.mlData = new InterFace.TransportData();
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterContentChecked() {
        this.calculateReceivable();
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.PaymentData = new InterFace.ITransactionPaymode();
        this.TransportApproveData = [];
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_BankData = this.http.get(this.lib.getApiUrl('dropdown/GetBank'));
        const Obs_CompanyBankData = this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + this.AccountSysID));
        Observable.forkJoin([Obs_PaymentTypeData, Obs_BankData, Obs_CompanyBankData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;
                this.dsBankName = lstRes[1].result.data;
                this.dsCompanyBankName = lstRes[2].result.data;
                this.getTransactionDate();
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
        this.LoadTerm();
    }
    dsPaymentTypeDataChanged(event: any) {
        this.paymentDisabled = false;
        this.CompanyBankDisabled = false;
        this.PaymentData.TransactionNo = '';
        this.PaymentData.TransactionDate = '';
        this.PaymentData.TransactionBankSysID = '';
        this.PaymentData.LedgerSysID = '';
        if (this.lib.isValidSelectedValue(event.value)) {
            this.paymentDisabled = (event.data[0].text === 'Cash');
            if (event.data[0].text !== 'Cash') {
                this.PaymentData.LedgerSysID = this.dsCompanyBankName[0].id;
            }
        }
    }
    LoadData(TermSysID: any) {
        this.http.get(this.lib.getApiUrl('fees/transport-fees-collection/term-wise-amount-list/' + this.StudentSysID + '/' + this.AcademicYearSysID + '/' + this.TermSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.TransportApproveData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadTerm() {
        this.http.get(this.lib.getApiUrl('dropdown/TransportFeeterm/' + this.FeeSysID + '/' + this.StudentSysID + '/' + this.AcademicYearSysID + '/' + true)).subscribe(
            (res) => {
                this.dsTermData = res.result.data;
                setTimeout(() => {
                    this.TermSysID = '-1';
                    this.dsTermDataChanged(this.TermSysID);
                }, 100);
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    dsTermDataChanged(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadData(value);
        }
    }
    BtnCancelAcedmicFeeCollection_Click() {
        this.onclose.emit();
    }
    getTransactionDate() {
        this.http.get(this.lib.getApiUrl('account/master/voucher/getTransactionDate/' + this.AccountSysID)).subscribe(
            (res) => {
                // this.Receiptdate = moment(res.result.data).format('DD-MM-YYYY');
                // this.minDate = new Date(res.result.data);
                this.Receiptdate = res.result.data;
                this.minDate = new Date(moment(res.result.data, 'DD-MM-YYYY').format('MM-DD-YYYY'));
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    frmPaymentInfo_submit() {
        // Master Data
        this.mlData.master = new InterFace.mlTransportFeeReceiptMaster();
        this.mlData.master.AcademicYearSysID = this.AcademicYearSysID;
        this.mlData.master.StudentSysID = this.StudentSysID;
        this.mlData.master.ReceiptDate = this.Receiptdate;
        // TransactionData
        let msg = '';
        this.mlData.trans = [];
        this.TransportApproveData.forEach(itm => {
            if ((itm.TotalAmount - itm.PaidAmount) >= itm.ReceivableAmount) {
                this.mlData.trans.push(itm);
            } else {
                msg += itm.TermName + ' ' + itm.CategoryName + ' Exceed\'s Balance Amount.';
            }
        });
        if (msg === '') {
            // Paymode Data
            this.mlData.paymode = new InterFace.ITransactionPaymode();
            this.mlData.paymode.PayModeSysID = this.PaymentData.PayModeSysID;
            this.mlData.paymode.TransctionRefType = this.PaymentData.TransctionRefType;
            this.mlData.paymode.TransctionRefTypeSysID = this.PaymentData.TransctionRefTypeSysID;
            this.mlData.paymode.PaymodeTypeSysID = this.PaymentData.PaymodeTypeSysID;
            this.mlData.paymode.TransactionNo = this.PaymentData.TransactionNo;
            this.mlData.paymode.TransactionDate = this.PaymentData.TransactionDate;
            this.mlData.paymode.TransactionBankSysID = this.PaymentData.TransactionBankSysID;
            this.mlData.paymode.LedgerSysID = this.PaymentData.LedgerSysID;
            this.mlData.paymode.Amount = this.PaymentData.Amount;
            this.mlData.paymode.IsDeleted = false;
            this.lib.notification.confirm('Do you want to save Transport Fee Collection', () => {
                this.http.post(this.lib.getApiUrl('fees/transport-fees-collection/save'), this.mlData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message)
                        window.open(this.lib.getApiUrl('/Report/transport-fee-receipt/' + res.result.data + '/PDF'), 'ReceiptPrint', 'height=500,width=500');
                        this.onclose.emit();
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning(msg);
        }
    }
    calculateTotal() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.TotalAmount;
            });
        }
        return Total;
    }
    calculatePaid() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.PaidAmount;
            });
        }
        return Total;
    }
    calculateReceivable() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.ReceivableAmount;
            });
        }
        this.PaymentData.Amount = Total;
        return Total;
    }
    calculateBalance() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.TotalAmount - Data.PaidAmount - Data.ReceivableAmount;
            });
        }
        return Total;
    }
}