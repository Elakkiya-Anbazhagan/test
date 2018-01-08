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
    selector: 'other-fee-collection',
    templateUrl: './other-fee-collection.component.html'
})

export class Other_Fee_Collection_Component {
    mlData: OtherFeeData;
    mlTrans: mlOtherFeeReceiptTrans;
    public OtherFeeData: mlOtherFeeCollectionList[];
    PaymentData: InterFace.ITransactionPaymode;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    dsCompanyBankName: Array<InterFace.Idd>;
    paymentDisabled: Boolean = false;
    CompanyBankDisabled: Boolean = false;
    minDate: Date;
    Receiptdate: string;
    @Output() onclose = new EventEmitter();

    @Input() StudentSysID = 0;
    @Input() FeeSysID = 0;
    @Input() AcademicYearSysID = 0;
    @Input() AccountSysID = 0;
    @Input() AccountName = '';
    @Input() AcademicYear = '';
    @Input() FeeName = '';
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterContentChecked() {
        this.calculateReceivable();
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.PaymentData = new InterFace.ITransactionPaymode();
        this.OtherFeeData = [];
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_BankData = this.http.get(this.lib.getApiUrl('dropdown/GetBank'));
        const Obs_CompanyBankData = this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + this.AccountSysID));
        Observable.forkJoin([Obs_PaymentTypeData, Obs_BankData, Obs_CompanyBankData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;
                this.dsBankName = lstRes[1].result.data;
                this.dsCompanyBankName = lstRes[2].result.data;
                this.getTransactionDate();
                this.LoadData();
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
    LoadData() {
        this.http.get(this.lib.getApiUrl('fees/other-fees-collection/collection-list/' + this.StudentSysID + '/' + this.AcademicYearSysID
            + '/' + this.AccountSysID + '/' + this.FeeSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.OtherFeeData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    BtnCancelOtherFeeCollection_Click() {
        this.onclose.emit();
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
    frmPaymentInfo_submit() {
        // Master Data
        this.mlData = new OtherFeeData();
        this.mlData.OtherFeeReceiptMaster = new mlOtherFeeReceiptMaster();
        this.mlData.OtherFeeReceiptMaster.AcademicYearSysID = this.AcademicYearSysID;
        this.mlData.OtherFeeReceiptMaster.StudentSysID = this.StudentSysID;
        this.mlData.OtherFeeReceiptMaster.ReceiptDate = this.Receiptdate;
        // TransactionData
        let msg = '';
        this.mlData.OtherFeeReceiptTrans = [];
        this.OtherFeeData.forEach(itm => {
            if ((itm.TotalAmount - itm.PaidAmount) >= itm.Receivable) {
                this.mlTrans = new mlOtherFeeReceiptTrans();
                this.mlTrans.Amount = itm.Receivable;
                this.mlTrans.CategoryTransSysID = itm.CategoryTransSysID;
                this.mlData.OtherFeeReceiptTrans.push(this.mlTrans);
            } else {
                msg += itm.CategoryName + ' ' + itm.CategoryName + ' Exceed\'s Balance Amount.';
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
            this.lib.notification.confirm('Do you want to save Other Fee Collection', () => {
                this.http.post(this.lib.getApiUrl('fees/other-fees-collection/save'), this.mlData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message)
                        window.open(this.lib.getApiUrl('/Report/other-fee-receipt/' + res.result.data + '/PDF'), 'ReceiptPrint', 'height=500,width=500');
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
        if (this.OtherFeeData) {
            this.OtherFeeData.forEach(Data => {
                Total += Data.TotalAmount;
            });
        }
        return Total;
    }
    calculatePaid() {
        let Total = 0;
        if (this.OtherFeeData) {
            this.OtherFeeData.forEach(Data => {
                Total += Data.PaidAmount;
            });
        }
        return Total;
    }
    calculateReceivable() {
        let Total = 0;
        if (this.OtherFeeData) {
            this.OtherFeeData.forEach(Data => {
                Total += Data.Receivable;
            });
        }
        this.PaymentData.Amount = Total;
        return Total;
    }
    calculateBalance() {
        let Total = 0;
        if (this.OtherFeeData) {
            this.OtherFeeData.forEach(Data => {
                Total += Data.TotalAmount - Data.PaidAmount - Data.Receivable;
            });
        }
        return Total;
    }
}

class mlOtherFeeCollectionList {
    AcademicYearSysID: number;
    AcademicYearID: string;
    AccountSysID: number;
    AccountName: string;
    TotalAmount: number;
    PaidAmount: number;
    BalAmount: number;
    Receivable: number;
    AdmissionNo: string;
    StudentSysID: number;
    StudentName: string;
    FeeCategorySysID: number;
    FeeCategoryName: string;
    FeeSysID: number;
    FeeName: string;
    CategorySysID: number;
    CategoryName: string;
    TypeSysID: number;
    TypeName: string;
    CategoryTransSysID: number;
}

class mlOtherFeeReceiptTrans {
    TranSysID = 0;
    ReceiptSysID = 0;
    CategoryTransSysID = 0;
    Amount = 0;
    IsDeleted = false;
}
class mlOtherFeeReceiptMaster {
    ReceiptSysID = 0;
    ReceiptNo = '';
    ReceiptDate = '';
    StudentSysID = 0;
    AcademicYearSysID = 0;
    BranchSysID = 0;
    IsCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    IsDeleted = false;
    CancelledReason = '';
}
class OtherFeeData {
    OtherFeeReceiptMaster = new mlOtherFeeReceiptMaster();
    OtherFeeReceiptTrans: mlOtherFeeReceiptTrans[] = [];
    TransactionPaymodeMaster = new InterFace.ITransactionPaymode();
}