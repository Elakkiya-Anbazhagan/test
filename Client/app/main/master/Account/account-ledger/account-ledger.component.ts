import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Idd } from './../../../InterFace/ICommon';
import * as InterFace from './../../../InterFace';
import { ILedger } from './../../../InterFace/ILedger';
@Component({
    selector: 'account-ledger',
    templateUrl: './account-ledger.component.html'
})
export class Account_Ledger_Component implements OnInit {
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    public LedgerList: TreeNode[];
    public LedgerDetail: InterFace.ILedger;
    public AccountData: Array<InterFace.Idd>;
    public TaxData: Array<InterFace.Idd>;
    @ViewChild('frmLedgerEntry') formData: NgForm;
    @ViewChild('mdEntry') mdEntry: ModalComponent;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Ledger');
        lib.setPageTitle('Ledger');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
        });
    }
    ngOnInit() {
        this.ClearControl();
        this.LoadAccount();
        this.LoadTax();
    }
    ClearControl() {
        this.LedgerDetail = new InterFace.ILedger();
        this.formData.resetForm();
        this.LoadLedgerList();
    }
    LoadLedgerList() {
        this.http.get(this.lib.getApiUrl('account/master/ledger/list')).subscribe(
            (res) => {
                this.LedgerList = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadAccount() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.AccountData = [];
                this.AccountData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadTax() {
        this.http.get(this.lib.getApiUrl('dropdown/taxtype')).subscribe(
            (res) => {
                this.TaxData = [];
                this.TaxData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click() {
        this.LedgerDetail.ReferenceSysID = 0;
        this.LedgerDetail.ReferenceType = 'Manual';
        this.lib.notification.confirm('Do you want to ' + (this.LedgerDetail.LedgerSysID === 0 ? 'insert' : 'Update') + ' Account-Ledger' + '(' + this.LedgerDetail.LedgerName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('account/master/ledger/save'), this.LedgerDetail).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.ClearControl();
                        this.mdEntry.close();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    btnCancel_click() {
        this.ClearControl();
    }
    btnAddEdit_click(LedgerEntryDetail: InterFace.ILedger) {
        this.LedgerDetail = LedgerEntryDetail;
        this.mdEntry.open('lg');
    }
    btnAdd_click(LedgerEntryDetail: InterFace.ILedger) {
        this.LedgerDetail.ParentLedgerSysID = LedgerEntryDetail.LedgerSysID;
        this.LedgerDetail.ParentLedgerName = LedgerEntryDetail.LedgerName;
        this.mdEntry.open('lg');
    }
}
