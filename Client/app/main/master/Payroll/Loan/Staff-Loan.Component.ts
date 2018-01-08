import { HttpService } from './../../REVIEWED/helper/service/api/src/http.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Staff-Loan',
    templateUrl: './Staff-Loan.Component.html'
})

export class Staff_Loan_Component implements OnInit {
    LoanList: mlLoanData[];
    LoanData: mlLoanData;
    StaffData: Array<InterFace.Idd>;
    dsAccount: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    dsCompanyBankName: Array<InterFace.Idd>;
    isListMode: boolean;
    Installment: mlInstallment;
    StaffBasicDetails: StaffBasicDetails;
    LoanAmount: number;
    paymentDisabled: Boolean = false;
    CompanyBankDisabled: Boolean = false;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    @ViewChild('frmLoanCancel') frmLoanCancel: NgForm;
    @ViewChild('mdPayment') mdPayment: ModalComponent;
    @ViewChild('frmPaymentInfo') frmPaymentInfo: NgForm;
    @ViewChild('frmStaffLoan') frmStaffLoan: NgForm;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Loan');
        lib.setPageTitle('Staff Loan');
        this.LoanData = new mlLoanData();
        this.StaffBasicDetails = new StaffBasicDetails();
        this.isListMode = true;
        this.LoanAmount = 0;
        const Obs_StaffData = this.http.get(this.lib.getApiUrl('payroll/staff/getstaff'));
        const Obs_AccountData = this.http.get(this.lib.getApiUrl('dropdown/accounttype'));
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_BankData = this.http.get(this.lib.getApiUrl('dropdown/GetBank'));
        Observable.forkJoin([Obs_StaffData, Obs_AccountData, Obs_PaymentTypeData, Obs_BankData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.StaffData = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.dsAccount = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.dsPaymentType = lstRes[2].result.data;
                }
                if (this.lib.isValidList(lstRes[3].result.data)) {
                    this.dsBankName = lstRes[3].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }

    ngOnInit() {
        this.LoadLoanList();
    }

    LoadLoanList() {
        this.LoanList = [];
        this.http.get(this.lib.getApiUrl('payroll/loan/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.LoanList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnAdd_Click() {
        this.LoanData = new mlLoanData();
        this.isListMode = false;
    }

    btnEdit_Click(EditData: mlLoanData) {
        this.LoanData = new mlLoanData();
        this.LoanData.LoanSysID = EditData.LoanSysID;
        this.LoanData.StaffSysID = EditData.StaffSysID;
        this.LoanData.StaffName = EditData.StaffName;
        this.LoanData.StaffID = EditData.StaffID;
        this.LoanData.LoanDate = EditData.LoanDate;
        this.LoanData.Salary = EditData.Salary;
        this.LoanData.Amount = EditData.Amount;
        this.LoanData.Installment = EditData.Installment;
        this.LoanData.IsApproved = EditData.IsApproved;
        this.LoanData.AccountSysID = EditData.AccountSysID;
        this.LoadInstallmentList();
        this.isListMode = false;
    }

    btnLoan_Cancel_Click(CancelData: mlLoanData) {
        this.LoanData = new mlLoanData();
        this.LoanData.LoanSysID = CancelData.LoanSysID;
        this.LoanData.StaffSysID = CancelData.StaffSysID;
        this.LoanData.StaffName = CancelData.StaffName;
        this.LoanData.StaffID = CancelData.StaffID;
        this.LoanData.LoanDate = CancelData.LoanDate;
        this.LoanData.Salary = CancelData.Salary;
        this.LoanData.Amount = CancelData.Amount;
        this.LoanData.Installment = CancelData.Installment;
        this.LoanData.IsApproved = CancelData.IsApproved;
        this.LoanData.AccountSysID = CancelData.AccountSysID;
        this.mdCancel.open();
    }

    btnLoan_Issue_Click(IssueData: mlLoanData) {
        this.LoanData = new mlLoanData();
        this.LoanData.LoanSysID = IssueData.LoanSysID;
        this.LoanData.StaffSysID = IssueData.StaffSysID;
        this.LoanData.StaffName = IssueData.StaffName;
        this.LoanData.StaffID = IssueData.StaffID;
        this.LoanData.LoanDate = IssueData.LoanDate;
        this.LoanData.Salary = IssueData.Salary;
        this.LoanData.Amount = IssueData.Amount;
        this.LoanData.Installment = IssueData.Installment;
        this.LoanData.IsApproved = IssueData.IsApproved;
        this.LoanData.AccountSysID = IssueData.AccountSysID;
        this.LoanData.PaymodeMaster.Amount = IssueData.Amount;
        this.paymentDisabled = false;
        this.CompanyBankDisabled = false;
        this.Account_Change(IssueData.AccountSysID);
        this.mdPayment.open();
    }

    Staff_Change(event: any) {
        this.StaffBasicDetails = new StaffBasicDetails();
        if (this.lib.isValidSelectedValue(event.value)) {
            this.http.get(this.lib.getApiUrl('payroll/staff/getstaff-basic-details/' + event.value)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.StaffBasicDetails = res.result.data;
                        this.LoanData.Salary = this.StaffBasicDetails.Salary;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
            this.LoanData.StaffName = event.data[0].text;
        }
    }

    Account_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + value)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsCompanyBankName = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    dsPaymentTypeDataChanged(event: any) {
        this.paymentDisabled = false;
        this.CompanyBankDisabled = false;
        this.LoanData.PaymodeMaster.TransactionNo = '';
        this.LoanData.PaymodeMaster.TransactionDate = '';
        this.LoanData.PaymodeMaster.TransactionBankSysID = '';
        this.LoanData.PaymodeMaster.LedgerSysID = '';

        if (this.lib.isValidSelectedValue(event.value)) {
            this.paymentDisabled = (event.data[0].text === 'Cash');
            if (event.data[0].text !== 'Cash') {
                this.LoanData.PaymodeMaster.LedgerSysID = this.dsCompanyBankName[0].id;
            }
        }
    }

    btnSave_Click() {
        let Msg = '';
        if (this.lib.isValidModel(this.LoanData) && this.lib.isValidList(this.LoanData.Trans)) {
            this.LoanData.Trans.forEach(data => ((data.Amount <= 0 || data.Amount > this.LoanData.Salary) ? Msg += `${data.Installment},` : ''));
            if (parseInt(this.LoanAmount.toString(), 0) === parseInt(this.LoanData.Amount.toString(), 0)) {
                if (Msg === '') {
                    this.lib.notification.confirm('Do you want to ' + (this.LoanData.LoanSysID === 0 ? 'Save' : 'Update') + ' Staff Loan' +
                        '(' + this.LoanData.StaffName + ')', () => {
                            try {
                                this.http.post(this.lib.getApiUrl('payroll/loan/save'), this.LoanData).subscribe(
                                    (res) => {
                                        this.lib.notification.success(res.message);
                                        this.LoanData = new mlLoanData();
                                        this.frmStaffLoan.resetForm();
                                        this.isListMode = true;
                                        this.LoadLoanList();
                                    },
                                    (err) => {
                                        this.lib.notification.error(err.message);
                                    }
                                );
                            } catch (ex) {
                                this.lib.notification.error(ex.message);
                            }
                        }, () => { });
                } else {
                    this.lib.notification.warning('Invalid Amount for Installment ' + Msg);
                }
            } else {
                this.lib.notification.warning('Loan Amount and Installment Amount not equal ');
            }

        } else {
            this.lib.notification.warning('Invalid loan data');
        }
    }

    btnCancel_Click() {
        if (this.lib.isValidModel(this.LoanData)) {
            this.lib.notification.confirm('Do you want to Cancel Staff Loan' +
                '(' + this.LoanData.StaffName + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/loan/cancel'), this.LoanData).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.LoanData = new mlLoanData();
                                this.frmLoanCancel.resetForm();
                                this.isListMode = true;
                                this.LoadLoanList();
                                this.mdCancel.close();
                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            }
                        );
                    } catch (ex) {
                        this.lib.notification.error(ex.message);
                    }
                }, () => { });

        } else {
            this.lib.notification.warning('Loan Record Is Not valid.');
        }
    }
    btnIssue_Click() {
        if (this.lib.isValidModel(this.LoanData)) {
            this.lib.notification.confirm('Do you want to Issue Staff Loan' +
                '(' + this.LoanData.StaffName + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/loan/issue'), this.LoanData).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.LoanData = new mlLoanData();
                                this.frmPaymentInfo.resetForm();
                                this.isListMode = true;
                                this.LoadLoanList();
                                this.mdPayment.close();
                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            }
                        );
                    } catch (ex) {
                        this.lib.notification.error(ex.message);
                    }
                }, () => { });

        } else {
            this.lib.notification.warning('Loan Record Is Not valid.');
        }

    }
    btnEntryCancel_Click() {
        this.LoanData = new mlLoanData();
        this.frmStaffLoan.resetForm();
        this.isListMode = true;
    }

    calculateTotal() {
        let Total = 0;
        this.LoanAmount = 0;
        if (this.LoanData.Trans) {
            this.LoanData.Trans.forEach(Data => {
                Total += Data.Amount;
            });
        }
        this.LoanAmount = Total;
        return Total;
    }

    LoadInstallmentList() {
        this.LoanData.Trans = [];
        const Installment = parseInt(this.LoanData.Installment, 0);
        const ActAmount = this.LoanData.Amount;
        const InstallmentAmount = ActAmount / Installment;
        let num = 1;
        if (this.LoanData.Trans) {
            for (num = 1; num <= Installment; num++) {
                {
                    this.Installment = new mlInstallment();
                    this.Installment.InstallmentDate = moment().add(num - 1, 'M').format('DD-MM-YYYY').toString();
                    this.Installment.Installment = num;
                    this.Installment.Amount = InstallmentAmount;
                    this.LoanData.Trans.push(this.Installment);
                }
            }
        }
    }

    btnApprove_Click(LoanData: mlLoanData) {
        if (this.lib.isValidModel(LoanData)) {
            this.lib.notification.confirm('Do you want to Approve Staff Loan' +
                '(' + LoanData.StaffName + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/loan/approve'), LoanData).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.LoanData = new mlLoanData();
                                this.isListMode = true;
                                this.LoadLoanList();
                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            }
                        );
                    } catch (ex) {
                        this.lib.notification.error(ex.message);
                    }
                }, () => { });

        } else {
            this.lib.notification.warning('Loan Record Is Not valid.');
        }
    }
}

class mlLoanData {
    LoanSysID = 0;
    StaffSysID = '';
    StaffName = '';
    StaffID = '';
    LoanDate = '';
    Salary: number;
    Amount = 0;
    Installment = '';
    AccountSysID = '';
    IsApproved = false;
    IsCancelled = false;
    IsIssued = false;
    CancelledReason = '';
    Trans: mlInstallment[];
    PaymodeMaster: InterFace.ITransactionPaymode;
    constructor() {
        this.PaymodeMaster = new InterFace.ITransactionPaymode();
    }
}

class mlInstallment {
    LoanTransSysID: number;
    LoanSysID: number;
    Installment: number;
    InstallmentDate: string;
    Amount: number;
    StatusSysID: number;
}

class StaffBasicDetails {
    StaffSysID: number;
    BioID: number;
    StaffID: number;
    StaffName: string;
    Salary: number;
}
