import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../InterFace';
import { Idd } from './../../../InterFace/ICommon';
import { IVoucherEntry } from './../../../InterFace/IVoucher';

@Component({
    selector: 'account-voucher',
    templateUrl: './account-voucher.Component.html'
})
export class Account_Voucher_Component implements OnInit {
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    filterDate: any;
    isAllowCancel: boolean;
    isAllowPrint: boolean;
    isAllowAdd: boolean;
    public mlVoucher: mlVoucherInfo;
    public mlPaymodeMaster: InterFace.ITransactionPaymode;
    public dsVoucherList: mlVoucherInfo[];
    public VoucherData: mlVoucherData;
    public dsVoucherTypeData: Array<InterFace.Idd>;
    dsTransactionTypeData: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    dsCompanyBankName: Array<InterFace.Idd>;
    dsAccountType: Array<InterFace.Idd>;
    dsAccountHeadData: Array<InterFace.Idd>;
    dsRoleData: Array<InterFace.Idd>;
    paymentDisabled = false;
    PanelEntry: Boolean = false;
    PanelList: Boolean = true;
    CompanyBankDisabled: Boolean = false;
    RoleSysID = '';
    FromDate = '';
    ToDate = '';
    LabelName = '';
    lstFilteredContactName: string[];
    lstContactName: any[];
    ContactName: any;
    public dsPayModeFilter: SelectItem[];
    constructor(public lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Voucher');
        lib.setPageTitle('Voucher');
        this.mlVoucher = new mlVoucherInfo();
        this.mlPaymodeMaster = new InterFace.ITransactionPaymode();
        this.ContactName = '';
        this.RoleSysID = '';
        this.dsVoucherList = [];
        this.VoucherData = new mlVoucherData();
        this.LabelName = 'Credit Cash A/C';
        this.lstFilteredContactName = new Array<string>();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowPrint = true;
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
        this.lstContactName = [];
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_RoleData = this.http.get(this.lib.getApiUrl('dropdown/getusers/true'));
        Observable.forkJoin([Obs_PaymentTypeData, Obs_RoleData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;
                this.dsRoleData = lstRes[1].result.data;
                setTimeout(() => {
                    this.RoleSysID = this.lib.authData().Profile.Role.SysId.toString();
                    setTimeout(() => {
                        this.LoadData();
                    }, 100);
                }, 100);
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
        this.ToDate = moment().format('DD/MM/YYYY');
        this.FromDate = moment().format('DD/MM/YYYY');
    }
    ngOnInit() {
        this.LoadBank();
        this.LoadVoucher();
        this.LoadAccountType();
        this.LoadTransactionType();
        this.LoadReadAllContact();

    }
    dsRoleDataChanged(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadData();
        }
    }
    filterContactName(event: any) {
        this.lstFilteredContactName = this.filterData(event.query, this.lstContactName);
    }
    filterData(query: any, lstItem: any[]): any {
        const filtered: any[] = [];
        for (let i = 0; i < lstItem.length; i++) {
            const itm = lstItem[i];
            if (itm.ContactName.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                filtered.push(itm.ContactName);
            }
        }
        return filtered;
    }
    LoadData() {
        this.dsVoucherList = [];
        if (this.lib.isValidSelectedValue(this.RoleSysID) && !this.lib.isNullOrUndefined(this.FromDate) && !this.lib.isNullOrUndefined(this.ToDate)) {
            this.http.get(this.lib.getApiUrl('account/master/voucher/readall/' + this.RoleSysID + '?FromDate=' +
                encodeURIComponent(this.FromDate) + '&ToDate=' + encodeURIComponent(this.ToDate))).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsVoucherList = res.result.data;
                        this.dsPayModeFilter = this.lib.groupByAsSelectItem(this.dsVoucherList, 'Paymode', true)
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    LoadReadAllContact() {
        if (this.lib.isValidSelectedValue(this.RoleSysID)) {
            this.http.get(this.lib.getApiUrl('account/master/voucher/readallcontactname/' + this.RoleSysID)).subscribe(
                (res) => {
                    this.lstContactName = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    dsPaymentTypeDataChanged(event: any) {
        this.paymentDisabled = false;
        this.CompanyBankDisabled = false;
        this.mlPaymodeMaster.TransactionNo = '';
        this.mlPaymodeMaster.TransactionDate = '';
        this.mlPaymodeMaster.TransactionBankSysID = '';
        this.mlPaymodeMaster.LedgerSysID = '';
        if (this.lib.isValidSelectedValue(event.value)) {
            this.paymentDisabled = (event.data[0].text === 'Cash');
            this.CompanyBankDisabled = (
                (event.data[0].text === 'Cash') ||
                ((event.data[0].text === 'Cheque') &&
                    (this.mlVoucher.TransactionType === 'INCOME')));
            if (event.data[0].text !== 'Cash' && this.lib.isValidSelectedValue(this.mlVoucher.AccountSysID)) {
                if ((this.mlVoucher.TransactionType === 'INCOME') && (event.data[0].text !== 'Cheque')) {
                    this.mlPaymodeMaster.LedgerSysID = this.dsCompanyBankName[0].id;
                }
                if (this.mlVoucher.TransactionType !== 'INCOME') {
                    this.mlPaymodeMaster.LedgerSysID = this.dsCompanyBankName[0].id;
                }
            }
            if (event.data[0].text === 'Cash' && this.mlVoucher.TransactionType === 'INCOME') {
                this.LabelName = 'Credited Cash A/C';
            } else if (event.data[0].text === 'Cash' && this.mlVoucher.TransactionType === 'EXPENSE') {
                this.LabelName = 'Debited Cash A/C';
            } else if (event.data[0].text !== 'Cash' && this.mlVoucher.TransactionType === 'INCOME') {
                this.LabelName = 'Credited Bank A/C';
            } else {
                this.LabelName = 'Debited Bank A/C';
            }
        }
    }
    LoadVoucher() {
        this.dsVoucherTypeData = [
            { id: 'REGULAR', text: 'REGULAR' },
            { id: 'SUSPENSE', text: 'SUSPENSE' }
        ];
    }
    LoadTransactionType() {
        this.dsTransactionTypeData = [
            { id: 'EXPENSE', text: 'EXPENSE' },
            { id: 'INCOME', text: 'INCOME' },
            { id: 'CONTRA', text: 'CONTRA' }
        ];
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
            this.http.get(this.lib.getApiUrl('account/master/voucher/getTransactionDate/' + event.value)).subscribe(
                (res) => {
                    this.mlVoucher.VoucherDate = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
            this.LoadCompanyBank(event.value);
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
    LoadCompanyBank(AccountSysID: number) {
        this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + AccountSysID)).subscribe(
            (res) => {
                this.dsCompanyBankName = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    dsTransactionTypeDataChanged(event: any) {
        if (event.value !== '' && event.value !== 'undefind') {
            this.LoadAccount(event.value);
            this.mlPaymodeMaster.PaymodeTypeSysID = '';
            this.mlPaymodeMaster.TransactionNo = '';
            this.mlPaymodeMaster.TransactionDate = '';
            this.mlPaymodeMaster.TransactionBankSysID = '';
            this.mlPaymodeMaster.LedgerSysID = '';
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
            if (this.mlVoucher.Amount > 0) {
                this.lib.notification.confirm('Do you want to Save voucher', () => {
                    this.mlVoucher.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId.toString();
                    this.VoucherData.PaymodeMaster = this.mlPaymodeMaster;
                    this.VoucherData.voucher = this.mlVoucher;
                    this.http.post(this.lib.getApiUrl('account/master/voucher/save'), this.VoucherData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.LoadData();
                            this.LoadReadAllContact();
                            this.PanelList = true;
                            this.PanelEntry = false;
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                }, () => {

                });
            } else {
                this.lib.notification.warning('Please Enter Amount...');
            }
        }
    }
    btnAdd_Click() {
        this.PanelEntry = true;
        this.PanelList = false;
        this.mlVoucher = new mlVoucherInfo();
        this.mlPaymodeMaster = new InterFace.ITransactionPaymode();
        this.mlVoucher.VoucherType = this.dsVoucherTypeData[0].id;
        this.mlVoucher.TransactionType = this.dsTransactionTypeData[0].id;
        this.LoadAccount(this.dsTransactionTypeData[0].id);
        this.LoadReadAllContact()
    }
    btnPrint_Click(data: mlVoucherInfo) {
        if (!this.lib.isNullOrUndefined(data)) {
            const url = 'report/Voucher-report/' + data.VoucherSysID + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }
    btnChequeBookPrint_Click(data: mlVoucherInfo) {
        if (!this.lib.isNullOrUndefined(data)) {
            const url = 'report/ChequeBook-report/' + data.VoucherSysID + '/PDF';
            window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
        }
    }
    btnView_Click(data: mlVoucherData) {
        this.PanelList = false;
        this.PanelEntry = true;
        if (!this.lib.isNullOrUndefined(data) && !this.lib.isNullOrUndefined(data.PaymodeMaster)) {
            data.PaymodeMaster = this.mlPaymodeMaster;
            this.mlVoucher.Amount = data.voucher.Amount;
            this.mlVoucher.VoucherNo = data.voucher.VoucherNo;
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
    FromDate: string;
    ToDate: string;
    VoucherSysID = 0;
    VoucherNo = '';
    VoucherType = '';
    TransactionType = '';
    VoucherDate = '';
    LedgerSysID = '';
    Amount = 0;
    Narration = '';
    isCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    CancelledReason = '';
    AccountSysID = '';
    AccountID = '';
    AccountName = '';
    AcademicYearSysID = '';
    AcademicYearID = '';
    BranchSysID = 0;
    Tax = 0;
    Paymode = '';
}
class mlVoucherData {
    voucher: mlVoucherInfo;
    PaymodeMaster: InterFace.ITransactionPaymode;
}