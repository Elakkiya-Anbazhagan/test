import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import { Idd } from './../../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../../InterFace/IVoucher';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'outward_cheque',
    templateUrl: './OutwardCheque.Component.html'
})
export class Outward_Cheque_Component implements OnInit {
    isAllowBounce: boolean;
    isAllowRealise: boolean;
    isAllowIssue: boolean;
    public ViewData: InterFace.IOutwardView;
    public ChequeData: InterFace.IOutward[];
    public SelectedData: InterFace.IOutward[];
    public BounceData: InterFace.IOutward;
    public IssueData: InterFace.IOutward;
    public AccountData: Array<InterFace.Idd>;
    public StatusData: Array<InterFace.Idd>;
    public Present: boolean;
    public Clear: boolean;
    public ShowPresentDate: boolean;
    public BouncedReason: boolean;
    public SearchDate = false;
    public VoucherNo: string;
    @ViewChild('mdBounce') mdBounce: ModalComponent;
    @ViewChild('mdRealized') mdRealized: ModalComponent;
    @ViewChild('mdIssue') mdIssue: ModalComponent;
    @ViewChild('frmInwardView') frmInwardView: NgForm;
    @ViewChild('frmBounce') frmBounce: NgForm;
    @ViewChild('frmRealized') frmRealized: NgForm;
    @ViewChild('frmIssue') frmIssue: NgForm;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Outward');
        lib.setPageTitle('Outward');

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowBounce = this.lib.isActionAllowed('BOUNCE');
            this.isAllowRealise = this.lib.isActionAllowed('REALISE');
            this.isAllowIssue = this.lib.isActionAllowed('ISSUE');
        });
    }
    ngOnInit() {
        this.ClearControl();
    }
    ClearControl() {
        this.ViewData = new InterFace.IOutwardView();
        this.BounceData = new InterFace.IOutward();
        this.IssueData = new InterFace.IOutward();
        this.ViewData.PresentedDate = moment().format('DD-MM-YYYY');
        this.StatusData = []
        this.ChequeData = [];
        this.SelectedData = [];
        this.Present = false;
        this.Clear = false;
        this.ShowPresentDate = false;
        this.BouncedReason = false;
        this.SearchDate = false;
        this.LoadStauts();
    }
    LoadStauts() {
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/BRS_Cheque_Status_Type')).subscribe(
            (res) => {
                this.StatusData = res.result.data; setTimeout(() => {
                    this.StatusData.forEach((data) => {
                        if (data.text === this.lib.MasterData.ChequeStatus.UnPresent) {
                            this.ViewData.StatusSysID = data.id;
                            setTimeout(() => {
                                this.btnView_click();
                                this.Present = true;
                                this.Clear = false;
                                this.ShowPresentDate = false;
                                this.BouncedReason = false;
                            }, 100);
                        }
                    });
                }, 100);
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    StautsChanged(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.ChequeData = [];
            this.SelectedData = [];
            this.ViewData.ToDate = '';
            this.ViewData.PresentedDate = '';
            if (event.data[0].textid === this.lib.MasterData.ChequeStatus.UnPresent) {
                this.Present = true;
                this.Clear = false;
                this.ShowPresentDate = false;
                this.BouncedReason = false;
                this.SearchDate = false;
            } else if (event.data[0].text === this.lib.MasterData.ChequeStatus.Present) {
                this.ViewData.RealizedDate = moment().format('DD-MM-YYYY');
                this.Present = false;
                this.Clear = true;
                this.ShowPresentDate = false;
                this.BouncedReason = false;
                this.SearchDate = false;
            } else if (event.data[0].text === this.lib.MasterData.ChequeStatus.Bounced) {
                this.ViewData.FromDate = moment().add(-1, 'M').format('DD-MM-YYYY').toString();
                this.ViewData.ToDate = moment().format('DD-MM-YYYY');
                this.Present = false;
                this.Clear = false;
                this.ShowPresentDate = false;
                this.BouncedReason = true;
                this.SearchDate = true;
            } else {
                this.ViewData.FromDate = moment().add(-1, 'M').format('DD-MM-YYYY').toString();
                this.ViewData.ToDate = moment().format('DD-MM-YYYY');
                this.Present = false;
                this.Clear = false;
                this.ShowPresentDate = true;
                this.BouncedReason = false;
                this.SearchDate = true;
            }
        }
    }
    btnView_click() {
        this.http.post(this.lib.getApiUrl('account/brs/outward/list'), this.ViewData).subscribe(
            (res) => {
                this.ChequeData = [];
                this.SelectedData = [];
                this.ChequeData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
                this.ChequeData = [];
                this.SelectedData = [];
            });
    }
    btnBounceView_click(BounceData: InterFace.IOutward) {
        this.BounceData = new InterFace.IOutward();
        this.BounceData.PayModeSysID = BounceData.PayModeSysID;
        this.BounceData.AccountSysID = BounceData.AccountSysID;
        this.BounceData.TransctionRefType = BounceData.TransctionRefType;
        this.BounceData.TransctionRefTypeSysID = BounceData.TransctionRefTypeSysID;
        this.BounceData.PaymodeTypeSysID = BounceData.PaymodeTypeSysID;
        this.BounceData.TransactionNo = BounceData.TransactionNo;
        this.BounceData.TransactionDate = BounceData.TransactionDate;
        this.BounceData.TransactionBankSysID = BounceData.TransactionBankSysID;
        this.BounceData.Amount = BounceData.Amount;
        this.BounceData.StatusName = this.lib.MasterData.ChequeStatus.Bounced;
        this.BounceData.StatusSysID = BounceData.StatusSysID;
        this.BounceData.IsIssued = BounceData.IsIssued;
        this.BounceData.IssuedTo = BounceData.IssuedTo;
        this.BounceData.ClearedDate = BounceData.ClearedDate;
        this.BounceData.LedgerSysID = BounceData.LedgerSysID;
        this.BounceData.CancelledReason = BounceData.CancelledReason;
        this.BounceData.Narration = BounceData.Narration;
        this.BounceData.VoucherDate = BounceData.VoucherDate;
        this.BounceData.PresentedDate = BounceData.PresentedDate;
        this.BounceData.BouncedDate = moment().format('DD-MM-YYYY');
        this.mdBounce.open();
    }
    btnIssueView_click(IssueData: InterFace.IOutward) {
        this.IssueData = new InterFace.IOutward();
        this.IssueData.PayModeSysID = IssueData.PayModeSysID;
        this.IssueData.AccountSysID = IssueData.AccountSysID;
        this.IssueData.TransctionRefType = IssueData.TransctionRefType;
        this.IssueData.TransctionRefTypeSysID = IssueData.TransctionRefTypeSysID;
        this.IssueData.PaymodeTypeSysID = IssueData.PaymodeTypeSysID;
        this.IssueData.TransactionNo = IssueData.TransactionNo;
        this.IssueData.TransactionDate = IssueData.TransactionDate;
        this.IssueData.TransactionBankSysID = IssueData.TransactionBankSysID;
        this.IssueData.Amount = IssueData.Amount;
        this.IssueData.StatusName = this.lib.MasterData.ChequeStatus.Present;
        this.IssueData.StatusSysID = IssueData.StatusSysID;
        this.IssueData.IsIssued = true;
        this.IssueData.IssuedTo = IssueData.IssuedTo;
        this.IssueData.ClearedDate = IssueData.ClearedDate;
        this.IssueData.LedgerSysID = IssueData.LedgerSysID;
        this.IssueData.CancelledReason = IssueData.CancelledReason;
        this.IssueData.Narration = IssueData.Narration;
        this.IssueData.VoucherDate = IssueData.VoucherDate;
        this.IssueData.PresentedDate = moment().format('DD-MM-YYYY');
        this.mdIssue.open();
    }
    btnIssue_Close_click() {
        this.frmIssue.resetForm();
        this.mdIssue.close();
    }
    btnBounce_Close_click() {
        this.frmBounce.resetForm();
        this.mdBounce.close();
    }
    btnBounce_Click() {
        if (this.lib.isValidSelectedValue(this.BounceData.VoucherDate) && this.lib.isValidSelectedValue(this.BounceData.BouncedDate)) {
            const Voucherdate = this.lib.datafunc.YMD_TO_DATE(this.BounceData.VoucherDate);
            const BouncedDate = this.lib.datafunc.DMY_TO_DATE(this.BounceData.BouncedDate);
            if (Voucherdate < BouncedDate) {
                this.SelectedData = [];
                this.SelectedData.push(this.BounceData);
                this.lib.notification.confirm('Do you want to mark Payment as Bounced ?', () => {
                    this.http.post(this.lib.getApiUrl('account/brs/inward/inward_save'), this.SelectedData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.mdBounce.close();
                            this.BounceData = new InterFace.IOutward();
                            this.ChequeData = [];
                            this.SelectedData = [];
                            this.btnView_click();
                            this.frmBounce.resetForm();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        })
                }, () => { });
            } else {
                this.lib.notification.warning('Voucher Date is Greater then Bounced Date.');
            }
        } else {
            this.lib.notification.warning('Voucher Date or Bounced Date are not valid');
        }
    }
    btnIssue_Click() {
        if (this.lib.isValidSelectedValue(this.IssueData.VoucherDate) && this.lib.isValidSelectedValue(this.IssueData.PresentedDate)) {
            const Voucherdate = this.lib.datafunc.YMD_TO_DATE(this.IssueData.VoucherDate);
            const Presentdate = this.lib.datafunc.DMY_TO_DATE(this.IssueData.PresentedDate);
            if (Voucherdate < Presentdate) {
                this.SelectedData = [];
                this.SelectedData.push(this.IssueData);
                this.lib.notification.confirm('Do you want to Issue Payment ?', () => {
                    this.http.post(this.lib.getApiUrl('account/brs/inward/inward_save'), this.SelectedData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.mdIssue.close();
                            this.IssueData = new InterFace.IOutward();
                            this.btnView_click();
                            this.frmIssue.resetForm();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        })
                }, () => { });
            } else {
                this.lib.notification.warning('Voucher Date is Greater then Present Date.');
            }
        } else {
            this.lib.notification.warning('Voucher Date or Present Date are not valid');
        }
    }
    btnClear_Click() {
        if (this.SelectedData.length !== 0) {
            this.mdRealized.open();
            this.ViewData.RealizedDate = moment().format('DD-MM-YYYY');
        } else {
            this.lib.notification.warning('Please select at least 1 record...');
        }
    }
    btnClear_Close_Click() {
        this.frmRealized.resetForm();
        this.mdRealized.close();
    }
    btnRealized_Model_Click() {
        if (this.lib.isValidSelectedValue(this.ViewData.RealizedDate)) {
            this.VoucherNo = '';
            if (this.SelectedData.length !== 0) {
                this.SelectedData.forEach((data) => {
                    const Voucherdate = this.lib.datafunc.YMD_TO_DATE(data.VoucherDate);
                    const RealizedDate = this.lib.datafunc.DMY_TO_DATE(this.ViewData.RealizedDate);
                    data.StatusName = this.lib.MasterData.ChequeStatus.Cleared;
                    data.ClearedDate = this.ViewData.RealizedDate;
                    if (Voucherdate > RealizedDate) {
                        this.VoucherNo = this.VoucherNo + ' (' + data.VoucherNo + ') ';
                    }
                });
                if (this.VoucherNo === '') {
                    this.lib.notification.confirm('Do you want to Clear Payment ?', () => {
                        this.http.post(this.lib.getApiUrl('account/brs/inward/inward_save'), this.SelectedData).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.ChequeData = [];
                                this.SelectedData = [];
                                this.btnView_click();
                                this.mdRealized.close();
                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            })
                    }, () => { });
                } else {
                    this.lib.notification.warning('VoucherNo ' + this.VoucherNo + ' Voucher Date is Greater then Realized Date.');
                }
            } else {
                this.lib.notification.warning('Please select at least 1 Payment...');
            }
        } else {
            this.lib.notification.warning('Realized Date are not valid');
        }
    }
    btnCancel_Click() {
        this.ClearControl();
        this.frmInwardView.resetForm();
    }
}
