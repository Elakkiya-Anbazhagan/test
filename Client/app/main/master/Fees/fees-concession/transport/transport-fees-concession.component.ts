import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';
@Component({
    selector: 'transport-fees-concession',
    templateUrl: './transport-fees-concession.component.html'
})

export class Transport_Fees_Concession_Component {
    public mlData: InterFace.TransportFeeConcession;
    public TransportApproveData: InterFace.mlTermWiseAmountList[];
    PaymentData: InterFace.ITransactionPaymode;
    dsTermData: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    paymentDisabled: Boolean = false;
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
        this.mlData = new InterFace.TransportFeeConcession();
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
        Observable.forkJoin([Obs_PaymentTypeData, Obs_BankData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;
                this.dsBankName = lstRes[1].result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
        this.LoadTerm();
    }
    dsPaymentTypeDataChanged(event: any) {
        this.paymentDisabled = false;
        this.PaymentData.TransactionNo = '';
        this.PaymentData.TransactionDate = '';
        this.PaymentData.TransactionBankSysID = '';
        if (this.lib.isValidSelectedValue(event.value)) {
            this.paymentDisabled = (event.data[0].text === 'Cash');
        }
    }
    LoadData(TermSysID: any) {
        this.http.get(this.lib.getApiUrl('fees/transport-fees-collection/term-wise-amount-list/' + this.StudentSysID + '/' + this.AcademicYearSysID + '/' + this.TermSysID)).subscribe(
            (res) => {
                this.TransportApproveData = res.result.data;
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
    BtnCancelTransPortFeeConcession_Click() {
        this.onclose.emit();
    }
    frmTransPortFeeConcession_save() {
        // Master Data
        this.mlData.master = new InterFace.mlTransportFeesConcessionMaster();
        this.mlData.master.AcademicYearSysID = this.AcademicYearSysID;
        this.mlData.master.StudentSysID = this.StudentSysID;
        // TransactionData
        let msg = '';
        this.mlData.trans = [];
        this.TransportApproveData.forEach(itm => {
            if ((itm.TotalAmount - itm.PaidAmount) >= itm.Concession) {
                this.mlData.trans.push(itm);
            } else {
                msg += itm.TermName + ' ' + itm.CategoryName + ' Exceed\'s Balance Amount.';
            }
        });
        if (msg === '') {
            this.lib.notification.confirm('Do you want to save Transport Fee Collection', () => {
                this.http.post(this.lib.getApiUrl('fees/academic-fees-Concession/transport_concesssion_save'), this.mlData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        // window.open(this.lib.getApiUrl('/Report/academic-fee-receipt/' + res.result.data + '/PDF'), 'ReceiptPrint', 'height=500,width=500');
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
    calculatePrevConcession() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.PrevConcession;
            });
        }
        return Total;
    }
    calculateConsession() {
        let Total = 0;
        if (this.TransportApproveData) {
            this.TransportApproveData.forEach(Data => {
                Total += Data.Concession;
            });
        }
        return Total;
    }
}