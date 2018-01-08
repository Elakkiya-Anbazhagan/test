import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../../InterFace';
import { Idd } from './../../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../../InterFace/IVoucher';

@Component({
    selector: 'inward_cheque',
    templateUrl: './InwardCheque.Component.html'
})
export class Inward_Cheque_Component implements OnInit {
    isAllowPresent: boolean;
    isAllowRealise: boolean;
    isAllowBounce: boolean;
    isAllowCancel: boolean;
    isAllowPrint: boolean;
    isAllowAdd: boolean;
    public ViewData: InterFace.IInwardView;
    public ChequeData: InterFace.IInward[];
    public SelectedData: InterFace.IInward[];
    public BounceData: InterFace.IInward;
    public AccountData: Array<InterFace.Idd>;
    public StatusData: Array<InterFace.Idd>;
    public BankData: Array<InterFace.Idd>;
    public Present: boolean;
    public Clear: boolean;
    public ShowPresentDate: boolean;
    public BouncedReason: boolean;
    public SearchDate = false;
    Mindate: Date;
    public ReceiptNo: string;
    @ViewChild('mdBounce') mdBounce: ModalComponent;
    @ViewChild('mdPresent') mdPresent: ModalComponent;
    @ViewChild('mdRealized') mdRealized: ModalComponent;
    @ViewChild('frmInwardView') frmInwardView: NgForm;
    @ViewChild('frmPresent') frmPresent: NgForm;
    @ViewChild('frmRealized') frmRealized: NgForm;
    @ViewChild('frmBounce') frmBounce: NgForm;
    constructor(public lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Inward');
        lib.setPageTitle('Inward');
        this.Mindate = new Date('06-25-2017');

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowBounce = this.lib.isActionAllowed('BOUNCE');
            this.isAllowRealise = this.lib.isActionAllowed('REALISE');
            this.isAllowPresent = this.lib.isActionAllowed('PRESENT');
        });
    }
    ngOnInit() {
        this.ClearControl();
        this.LoadAccountType();
    }
    ClearControl() {
        this.ViewData = new InterFace.IInwardView();
        this.BounceData = new InterFace.IInward();
        this.ChequeData = [];
        this.SelectedData = [];
        this.Present = true;
        this.Clear = false;
        this.SearchDate = false;
        this.ShowPresentDate = false;
        this.BouncedReason = false;
    }
    LoadAccountType() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.AccountData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    AccountTypeChanged(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.BankData = [];
            this.StatusData = []
            this.ChequeData = [];
            this.SelectedData = [];
            this.LoadStauts();
        }
    }
    LoadBank(AccountSysID: string) {
        this.http.get(this.lib.getApiUrl('dropdown/BankName/' + AccountSysID)).subscribe(
            (res) => {
                this.BankData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadStauts() {
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/BRS_Cheque_Status_Type')).subscribe(
            (res) => {
                this.StatusData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    StautsChanged(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.BankData = [];
            this.ChequeData = [];
            this.SelectedData = [];
            this.ViewData.FromDate = '';
            this.ViewData.ToDate = '';
            this.ViewData.PresentedDate = '';
            this.ViewData.RealizedDate = '';
            if (event.data[0].textid === this.lib.MasterData.ChequeStatus.UnPresent) {
                this.Present = true;
                this.Clear = false;
                this.ShowPresentDate = false;
                this.BouncedReason = false;
                this.SearchDate = false;
            } else if (event.data[0].text === this.lib.MasterData.ChequeStatus.Present) {
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
    BankChanged(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.ChequeData = [];
            this.SelectedData = [];
        }
    }
    btnView_click() {
        this.http.post(this.lib.getApiUrl('account/brs/inward/list'), this.ViewData).subscribe(
            (res) => {
                this.ReceiptNo = '';
                this.ChequeData = [];
                this.SelectedData = [];
                this.ChequeData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
                this.ReceiptNo = '';
                this.ChequeData = [];
                this.SelectedData = [];
            });
    }
    btnBounceView_click(BounceData: InterFace.IInward) {
        this.BounceData = new InterFace.IInward();
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
        this.BounceData.ClearedDate = BounceData.ClearedDate;
        this.BounceData.LedgerSysID = BounceData.LedgerSysID;
        this.BounceData.CancelledReason = BounceData.CancelledReason;
        this.BounceData.Narration = BounceData.Narration;
        this.BounceData.VoucherDate = BounceData.VoucherDate;
        this.BounceData.PresentedDate = BounceData.PresentedDate;
        this.BounceData.BouncedDate = moment().format('DD-MM-YYYY');
        this.mdBounce.open();
    }

    btnBounce_Close_Click() {
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
                this.lib.notification.confirm('Do you want  to mark Payment as Bounced ?', () => {
                    this.http.post(this.lib.getApiUrl('account/brs/inward/inward_save'), this.SelectedData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.mdBounce.close();
                            this.BounceData = new InterFace.IInward();
                            this.btnView_click();
                            this.frmBounce.resetForm();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        })
                }, () => { });
            } else {
                this.lib.notification.warning('Receipt Date is Greater then Bounced Date.');
            }
        } else {
            this.lib.notification.warning('Receipt Date or Bounced Date are not valid');
        }
    }
    btnPresent_Click() {
        if (this.SelectedData.length !== 0) {
            this.mdPresent.open();
            this.ViewData.PresentedDate = moment().format('DD-MM-YYYY');
            this.LoadBank(this.ViewData.AccountSysID);
        } else {
            this.lib.notification.warning('Please select at least 1 record...');
        }
    }
    btnPresent_Close_Click() {
        this.frmPresent.resetForm();
        this.mdPresent.close();
    }
    btnPresent_Model_Click() {
        if (this.lib.isValidSelectedValue(this.ViewData.PresentedDate)) {
            this.ReceiptNo = '';
            if (this.SelectedData.length !== 0) {
                this.SelectedData.forEach((data) => {
                    data.LedgerSysID = this.ViewData.BankSysID;
                    data.PresentedDate = this.ViewData.PresentedDate;
                    data.StatusName = this.lib.MasterData.ChequeStatus.Present;
                    const Voucherdate = this.lib.datafunc.YMD_TO_DATE(data.VoucherDate);
                    const PresentedDate = this.lib.datafunc.DMY_TO_DATE(this.ViewData.PresentedDate);
                    if (Voucherdate > PresentedDate) {
                        this.ReceiptNo = this.ReceiptNo + '(' + data.VoucherNo + ')';
                    }
                });
                if (this.ReceiptNo === '') {
                    this.lib.notification.confirm('Do you want to Present Payment ?', () => {
                        this.http.post(this.lib.getApiUrl('account/brs/inward/inward_save'), this.SelectedData).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.mdBounce.close();
                                this.ChequeData = [];
                                this.SelectedData = [];
                                this.btnView_click();
                                this.mdPresent.close();
                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            })
                    }, () => { });
                } else {
                    this.lib.notification.warning('ReceiptNo ' + this.ReceiptNo + ' Receipt Date is Greater then Presented Date.');
                }
            } else {
                this.lib.notification.warning('Please select at least 1 Payment ...');
            }
        } else {
            this.lib.notification.warning('Presented Date are not valid');
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
            this.ReceiptNo = '';
            if (this.SelectedData.length !== 0) {
                this.SelectedData.forEach((data) => {
                    data.StatusName = this.lib.MasterData.ChequeStatus.Cleared;
                    data.ClearedDate = this.ViewData.RealizedDate;
                    const Voucherdate = this.lib.datafunc.YMD_TO_DATE(data.VoucherDate);
                    const RealizedDate = this.lib.datafunc.DMY_TO_DATE(this.ViewData.RealizedDate);
                    if (Voucherdate > RealizedDate) {
                        this.ReceiptNo = this.ReceiptNo + '(' + data.VoucherNo + ')';
                    }
                });
                if (this.ReceiptNo === '') {
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
                    this.lib.notification.warning('ReceiptNo ' + this.ReceiptNo + ' Receipt Date is Greater then Realized Date.');
                }
            } else {
                this.lib.notification.warning('Please select at least 1 record...');
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
