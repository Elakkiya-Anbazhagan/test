import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit, Directive, Input, EventEmitter, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'academic-fees-collection',
    templateUrl: './academic-fees-collection.component.html'
})

export class Academic_Fees_Collection_Component implements OnInit {
    public mlData: InterFace.AcademicData;

    public AcademicApproveData: InterFace.mlAcademicData[];
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
        this.mlData = new InterFace.AcademicData();
        this.Receiptdate = '';
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterContentChecked() {
        this.calculateReceivable();
    }
    ngOnInit() {
        this.PaymentData = new InterFace.ITransactionPaymode();
        this.AcademicApproveData = [];
        this.LoadTerm();
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
    getTransactionDate() {
        this.http.get(this.lib.getApiUrl('account/master/voucher/getTransactionDate/' + this.AccountSysID)).subscribe(
            (res) => {
                this.Receiptdate = res.result.data;
                this.minDate = new Date(moment(res.result.data, 'DD-MM-YYYY').format('MM-DD-YYYY'));
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadData(TermSysID: string) {
        if (TermSysID !== '' && TermSysID !== 'undefined') {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-collection/term-wise-amount-list/' + TermSysID
                + '/' + this.StudentSysID + '/' + this.AcademicYearSysID + '/' + this.AccountSysID)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.AcademicApproveData = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    LoadTerm() {
        this.http.get(this.lib.getApiUrl('dropdown/Feeterm/' + this.FeeSysID + '/' + this.StudentSysID + '/' + this.AcademicYearSysID + '/' + true)).subscribe(
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
        this.LoadData(value);
    }
    BtnCancelAcedmicFeeCollection_Click() {
        this.onclose.emit();
    }
    frmPaymentInfo_submit() {
        // Master Data
        this.mlData.AcademicFeeReceiptMaster = new InterFace.mlAcademicFeeReceiptMaster();
        this.mlData.AcademicFeeReceiptMaster.AcademicYearSysID = this.AcademicYearSysID;
        this.mlData.AcademicFeeReceiptMaster.StudentSysID = this.StudentSysID;
        this.mlData.AcademicFeeReceiptMaster.ReceiptDate = this.Receiptdate;
        // TransactionData
        let msg = '';
        this.mlData.AcademicFeeReceiptTrans = [];
        this.AcademicApproveData.forEach(itm => {
            if ((itm.TotalAmount - itm.PaidAmount) >= itm.Receivable) {
                this.mlData.AcademicFeeReceiptTrans.push({
                    TranSysID: 0,
                    ReceiptSysID: 0,
                    AcaFeeStrucMapSysID: itm.AcaFeeStrucMapSysID,
                    Amount: itm.Receivable,
                    IsDeleted: false
                });
            } else {
                msg += itm.TermName + ' ' + itm.FeeCategoryName + ' Exceed\'s Balance Amount.';
            }
        });

        if (msg === '') {
            // Paymode Data
            this.mlData.TransactionPaymodeMaster = new InterFace.ITransactionPaymode();
            this.mlData.TransactionPaymodeMaster.PayModeSysID = this.PaymentData.PayModeSysID;
            this.mlData.TransactionPaymodeMaster.TransctionRefType = this.PaymentData.TransctionRefType;
            this.mlData.TransactionPaymodeMaster.TransctionRefTypeSysID = this.PaymentData.TransctionRefTypeSysID;
            this.mlData.TransactionPaymodeMaster.PaymodeTypeSysID = this.PaymentData.PaymodeTypeSysID;
            this.mlData.TransactionPaymodeMaster.TransactionNo = this.PaymentData.TransactionNo;
            this.mlData.TransactionPaymodeMaster.TransactionDate = this.PaymentData.TransactionDate;
            this.mlData.TransactionPaymodeMaster.TransactionBankSysID = this.PaymentData.TransactionBankSysID;
            this.mlData.TransactionPaymodeMaster.LedgerSysID = this.PaymentData.LedgerSysID;
            this.mlData.TransactionPaymodeMaster.Amount = this.PaymentData.Amount;
            this.mlData.TransactionPaymodeMaster.IsDeleted = false;
            this.lib.notification.confirm('Do you want to save Academic Fee Collection', () => {
                this.http.post(this.lib.getApiUrl('fees/academic-fees-collection/save'), this.mlData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        window.open(this.lib.getApiUrl('/Report/academic-fee-receipt/' + res.result.data + '/PDF'), 'ReceiptPrint', 'height=500,width=500');
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
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.TotalAmount;
            });
        }
        return Total;
    }
    calculatePaid() {
        let Total = 0;
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.PaidAmount;
            });
        }
        return Total;
    }
    calculateConsession() {
        let Total = 0;
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.ConcessionAmount;
            });
        }
        return Total;
    }
    calculateReceivable() {
        let Total = 0;
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.Receivable;
            });
        }
        this.PaymentData.Amount = Total;
        return Total;
    }
    calculateBalance() {
        let Total = 0;
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.TotalAmount - Data.PaidAmount - Data.Receivable;
            });
        }
        return Total;
    }
}
