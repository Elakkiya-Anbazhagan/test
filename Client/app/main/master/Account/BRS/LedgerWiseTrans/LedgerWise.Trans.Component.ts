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

import * as InterFace from './../../../../InterFace';
import { Idd } from './../../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../../InterFace/IVoucher';

@Component({
    selector: 'ledger_wise_trans',
    templateUrl: './LedgerWise.Trans.Component.html'
})
export class LedgerWise_Trans_Component implements OnInit {
    public ViewData: InterFace.IInwardView;
    public TransData: InterFace.IInward[];
    public LedgerData: Array<InterFace.Idd>;
    @ViewChild('frmLedgerView') frmLedgerView: NgForm;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('LedgerWise Transaction');
        lib.setPageTitle('LedgerWise Transaction');
    }
    ngOnInit() {
        this.ClearControl();
        this.LoadLedger();
    }
    ClearControl() {
        this.ViewData = new InterFace.IInwardView();
        this.TransData = [];
    }
    LoadLedger() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.LedgerData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnView_click() {
        this.http.post(this.lib.getApiUrl('account/brs/inward/list'), this.ViewData).subscribe(
            (res) => {
                this.TransData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnCancel_Click() {
        this.ClearControl();
        this.frmLedgerView.resetForm();
    }
}
