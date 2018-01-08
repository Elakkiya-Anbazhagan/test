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

import * as InterFace from './../../../InterFace';
import { Idd } from './../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../InterFace/IVoucher';

@Component({
    selector: 'account-voucher',
    templateUrl: './account-voucher-old.component.html'
})
export class Account_Voucher_Old_Component implements OnInit {
    isAllowCancel: boolean;
    isAllowPrint: boolean;
    isAllowAdd: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public mlVoucher: mlVoucherInfo;
    public mlPaymodeMaster: InterFace.ITransactionPaymode;
    public dsVoucherList: mlVoucherInfo[];

    public VoucherData: mlVoucherData;
    public dsVoucherTypeData: Array<InterFace.Idd>;
    dsTransactionTypeData: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    dsAccountType: Array<InterFace.Idd>;
    dsAccountHeadData: Array<InterFace.Idd>;
    paymentDisabled = false;
    PanelEntry: Boolean = false;
    PanelList: Boolean = true;
    FromDate: Date;
    ToDate: Date;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Voucher');
        lib.setPageTitle('Voucher');
        this.mlVoucher = new mlVoucherInfo();
        this.mlPaymodeMaster = new InterFace.ITransactionPaymode();

        this.dsVoucherList = [];
        this.VoucherData = new mlVoucherData();
        this.FromDate = new Date('04-01-2017');
        this.ToDate = new Date('07-19-2017');

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowPrint = true;
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
    }
    ngOnInit() {
        this.LoadData();
        this.LoadBank();
        this.LoadVoucher();
        this.LoadAccountType();
        this.LoadTransactionType();
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));

        Observable.forkJoin([Obs_PaymentTypeData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;

            },
            (err) => {
                this.lib.notification.error(err.message);
            },

        );
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('account/master/voucher/readall')).subscribe(
            (res) => {
                this.dsVoucherList = [];
                this.dsVoucherList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    dsPaymentTypeDataChanged(event: any) {
        this.paymentDisabled = false;
        this.mlPaymodeMaster.TransactionNo = '';
        this.mlPaymodeMaster.TransactionDate = '';
        this.mlPaymodeMaster.TransactionBankSysID = '';
        if (this.lib.isValidSelectedValue(event.value)) {
            this.paymentDisabled = (event.data[0].text === 'Cash');
        }
    }
    LoadVoucher() {
        this.dsVoucherTypeData = [
            { id: 'REGULAR', text: 'REGULAR' },
            { id: 'SUSPENSE', text: 'SUSPENSE' }
        ];
        setTimeout(() => {
            this.mlVoucher.VoucherType = this.dsVoucherTypeData[0].id;;
        }, 100);
    }

    LoadAccountType() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.dsAccountType = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    dsAccountTypeDataChanged(event: any) {
        if (event.value !== '' && event.value !== 'undefind') {
            this.mlVoucher.AccountName = event.data[0].text;
            // this.http.get(this.lib.getApiUrl('account/master/voucher/getTransactionDate/' + event.value)).subscribe(
            //     (res) => {
            //         // this.mlVoucher.VoucherDate = moment(res.result.data).format('DD-MM-YYYY');
            //         this.mlVoucher.VoucherDate = res.result.data;
            //     }, (err) => {
            //         this.lib.notification.error(err.message);
            //     });
        }
    }
    LoadBank() {
        this.http.get(this.lib.getApiUrl('dropdown/GetBank')).subscribe(
            (res) => {
                this.dsBankName = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    LoadTransactionType() {
        this.dsTransactionTypeData = [
            { id: 'INCOME', text: 'INCOME' },
            { id: 'EXPENSE', text: 'EXPENSE' }
        ];
    }

    dsTransactionTypeDataChanged(event: any) {
        if (event.value !== '' && event.value !== 'undefind') {
            this.LoadAccount(event.value);
        }
    }
    LoadAccount(TransactionTypeSysID: string) {
        this.http.get(this.lib.getApiUrl('dropdown/GetAccountHeadbyTransaction/' + TransactionTypeSysID)).subscribe(
            (res) => {
                this.dsAccountHeadData = [];
                this.dsAccountHeadData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click() {
        if (!this.lib.isNullOrUndefined(this.mlVoucher) && !this.lib.isNullOrUndefined(this.mlPaymodeMaster)) {
            this.lib.notification.confirm('Do you want to create voucher', () => {
                this.mlVoucher.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
                this.VoucherData.PaymodeMaster = this.mlPaymodeMaster;
                this.VoucherData.Voucher = this.mlVoucher;
                this.http.post(this.lib.getApiUrl('account/master/voucher/save/old'), this.VoucherData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadData();
                        this.PanelList = true;
                        this.PanelEntry = false;
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }, () => {

            });
        }
    }
    btnAdd_Click() {
        this.PanelEntry = true;
        this.PanelList = false;
        this.mlVoucher = new mlVoucherInfo();
        this.mlPaymodeMaster = new InterFace.ITransactionPaymode();
        this.mlVoucher.VoucherType = this.dsVoucherTypeData[0].id;
    }
    btnPrint_Click(data: mlVoucherInfo) {
        if (!this.lib.isNullOrUndefined(data)) {
            console.log(data);
            const url = 'report/Voucher-report/' + data.VoucherSysID + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }

    }
    btnView_Click(data: mlVoucherData) {
        this.PanelList = false;
        this.PanelEntry = true;
        if (!this.lib.isNullOrUndefined(data) && !this.lib.isNullOrUndefined(data.PaymodeMaster)) {
            data.PaymodeMaster = this.mlPaymodeMaster;
            this.mlVoucher.Amount = data.Voucher.Amount;
            this.mlVoucher.VoucherNo = data.Voucher.VoucherNo;
        }
    }

    btnCancelVoucher_Click(Data: mlVoucherInfo) {
        this.mlVoucher = new mlVoucherInfo();
        this.mlVoucher.VoucherSysID = Data.VoucherSysID;
        this.mlVoucher.VoucherNo = Data.VoucherNo;

        this.mdCancel.open();
    }
    btnVoucherCancel_Click() {
        this.lib.notification.confirm('Do you want to cancel voucher ' + this.mlVoucher.VoucherNo, () => {
            this.http.post(this.lib.getApiUrl('account/master/voucher/voucher_cancel'), this.mlVoucher).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadData();
                    this.mdCancel.close();
                    this.PanelList = true;
                    this.PanelEntry = false;
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }, () => {

        });
    }
    btnCancel_Click() {
        this.PanelList = true;
        this.PanelEntry = false;
    }
}
class mlVoucherInfo {
    VoucherSysID = 0;
    VoucherNo = '';
    VoucherType = '';
    TransactionType = '';
    VoucherDate = '';
    LedgerSysID = 0;
    Amount = 0;
    Narration = '';
    isCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    CancelledReason = '';
    AccountSysID = 0;
    AccountID = '';
    AccountName = '';
    AcademicYearSysID = 0;
    AcademicYearID = '';
    BranchSysID = 0;
    Tax = 0;
}
class mlVoucherData {
    Voucher: mlVoucherInfo;
    PaymodeMaster: InterFace.ITransactionPaymode;
}