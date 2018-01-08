import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Directive, Input, EventEmitter, Output } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'academic-fees-concession',
    templateUrl: './academic-fees-concession.component.html'
})

export class Academic_Fees_Concession_Component implements OnInit {
    public mlData: InterFace.AcademicConcessionData;
    public AcademicApproveData: InterFace.mlAcademicConcessionData[];
    dsTermData: Array<InterFace.Idd>;
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
        this.mlData = new InterFace.AcademicConcessionData();
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterContentChecked() {
        this.calculateReceivable();
    }
    ngOnInit() {
        this.AcademicApproveData = [];
        this.LoadTerm();
    }
    LoadData(TermSysID: string) {
        if (TermSysID !== '' && TermSysID !== 'undefined') {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-Concession/term-wise-amount-list/' + TermSysID
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
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadData(value);
        }
    }
    BtnCancelAcedmicFeeConcession_Click() {
        this.onclose.emit();
    }
    frmAcademicFeeConcession_save() {
        // Master Data
        this.mlData.AcademicFeeConcessionMaster = new InterFace.mlFeeConcessionMaster();
        this.mlData.AcademicFeeConcessionMaster.AcademicYearSysID = this.AcademicYearSysID;
        this.mlData.AcademicFeeConcessionMaster.StudentSysID = this.StudentSysID;
        // TransactionData
        this.mlData.AcademicFeeConcessionTrans = [];
        let msg = '';
        this.AcademicApproveData.forEach(itm => {
            if ((itm.TotalAmount - itm.PaidAmount) >= itm.ConcessionAmount) {
                this.mlData.AcademicFeeConcessionTrans.push({
                    ConcessionTransSysID: 0,
                    ConcessionSysID: 0,
                    AcaFeeStrucMapSysID: itm.AcaFeeStrucMapSysID,
                    Amount: itm.ConcessionAmount
                });
            } else {
                msg += itm.TermName + ' ' + itm.FeeCategoryName + ' Exceed\'s Receivable Amount.';
            }
        });
        if (msg === '') {
            this.lib.notification.confirm('Do you want to Save Academic Fee Concession', () => {
                this.http.post(this.lib.getApiUrl('fees/academic-fees-Concession/save'), this.mlData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
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
    calculatePrevConsession() {
        let Total = 0;
        if (this.AcademicApproveData) {
            this.AcademicApproveData.forEach(Data => {
                Total += Data.PrevConcession;
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
        return Total;
    }
}
