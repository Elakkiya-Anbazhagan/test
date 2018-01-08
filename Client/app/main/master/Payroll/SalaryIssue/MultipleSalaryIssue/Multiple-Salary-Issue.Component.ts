import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as InterFace from './../../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Multiple-Salary-Issue',
    templateUrl: './Multiple-Salary-Issue.Component.html'
})

export class Multiple_Salary_Issue_Component implements OnInit {
    dsPaymentType: Array<InterFace.Idd>;
    dsAccountType: Array<InterFace.Idd>;
    dsCompanyBankName: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;
    SalaryIssueViewData: SalaryIssueViewData;
    StaffSalaryIssueData: StaffSalaryIssueData[];
    SelectedSalaryIssueViewData: StaffSalaryIssueData[];
    PayMode: InterFace.ITransactionPaymode;

    @ViewChild('mdPaymode') mdPaymode: ModalComponent;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Multiple Staff Salary Issue');
        lib.setPageTitle('Multiple Staff Salary Issue');
        this.SalaryIssueViewData = new SalaryIssueViewData();
        this.PayMode = new InterFace.ITransactionPaymode();
    }
    ngOnInit() {
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_AccountTypeData = this.http.get(this.lib.getApiUrl('dropdown/accounttype'));
        const Obs_BankData = this.http.get(this.lib.getApiUrl('dropdown/GetBank'));
        Observable.forkJoin([Obs_PaymentTypeData, Obs_AccountTypeData, Obs_BankData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.dsPaymentType = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.dsAccountType = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.dsBankName = lstRes[2].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    ddlAccountSysID_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.SalaryIssueViewData.PaymodeSysID = '';
            this.StaffSalaryIssueData = [];
            this.SelectedSalaryIssueViewData = [];
            this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + event.value)).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsCompanyBankName = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    ddlpayModeSysID_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.StaffSalaryIssueData = [];
            this.SelectedSalaryIssueViewData = [];
        }
    }
    btnView_Click() {
        this.StaffSalaryIssueData = [];
        this.SelectedSalaryIssueViewData = [];
        this.http.get(this.lib.getApiUrl('payroll/salary/multiple-staff-salary-issue-list/' + this.SalaryIssueViewData.PaymodeSysID + '/' + this.SalaryIssueViewData.AccountSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.StaffSalaryIssueData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });

    }
    btnPaymodeModel_click() {
        if (this.lib.isValidList(this.SelectedSalaryIssueViewData)) {
            let Amount = 0;
            this.SelectedSalaryIssueViewData.filter(data => Amount += data.NetSalary);
            this.PayMode = new InterFace.ITransactionPaymode();
            this.PayMode.TransactionNo = '';
            this.PayMode.TransactionDate = '';
            this.PayMode.TransactionBankSysID = '';
            this.PayMode.LedgerSysID = this.dsCompanyBankName[0].id;
            this.PayMode.PaymodeTypeSysID = this.SalaryIssueViewData.PaymodeSysID;
            this.PayMode.Amount = Amount;
            this.mdPaymode.open();
        } else {
            this.lib.notification.warning('Please select atleast one record.');
        }
    }
    frmPayMode_submit() {
        if (this.lib.isValidList(this.SelectedSalaryIssueViewData)) {
            this.SelectedSalaryIssueViewData.forEach((data) => {
                data.PaymodeTypeSysID = this.PayMode.PaymodeTypeSysID;
                data.TransactionNo = this.PayMode.TransactionNo;
                data.TransactionDate = this.PayMode.TransactionDate;
                data.TransactionBankSysID = this.PayMode.TransactionBankSysID;
                data.LedgerSysID = this.PayMode.LedgerSysID;
                data.Amount = this.PayMode.Amount;
            });

            this.lib.notification.confirm('Do you want to issue staff salary', () => {
                this.http.post(this.lib.getApiUrl('payroll/salary/multiple-staff-salary-bank-issue'), this.SelectedSalaryIssueViewData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdPaymode.close();
                        this.btnView_Click();
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning('Staff salary data in invalid.');
        }
    }
    calculateActualSalary() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.ActualSalary;
            });
        }
        return Total;
    }
    calculateBasicPay() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.BasicPay;
            });
        }
        return Total;
    }
    calculateGradePay() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.GradePay;
            });
        }
        return Total;
    }
    calculateDA() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.DA;
            });
        }
        return Total;
    }
    calculateCA() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.CA;
            });
        }
        return Total;
    }
    calculateHRA() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.HRA;
            });
        }
        return Total;
    }
    calculateMA() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.MA;
            });
        }
        return Total;
    }
    calculatePF() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.PF;
            });
        }
        return Total;
    }
    calculateESI() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.ESI;
            });
        }
        return Total;
    }
    calculateTDS() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.TDS;
            });
        }
        return Total;
    }
    calculatePermissionDeduct() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.PermissionDeduct;
            });
        }
        return Total;
    }
    calculateGrossSalary() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.GrossSalary;
            });
        }
        return Total;
    }
    calculateNetSalary() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.NetSalary;
            });
        }
        return Total;
    }
    calculateLoanAmount() {
        let Total = 0;
        if (this.StaffSalaryIssueData) {
            this.StaffSalaryIssueData.forEach(Data => {
                Total += Data.LoanAmount;
            });
        }
        return Total;
    }
}
class SalaryIssueViewData {
    PaymodeSysID: string;
    AccountSysID: string;
}
class StaffSalaryIssueData {
    SalarySysID: number;
    SalaryDate: string;
    SalaryTransSysID: number;
    StaffName: string;
    StaffSysID: number;
    StaffID: number;
    AccountSysID: number;
    PayModeSysID: number;
    LoanCollectionSysID: number;
    LoanAmount: number;
    ActualSalary: number;
    LeaveDeduct: number;
    PermissionDeduct: number;
    BasicPay: number;
    GradePay: number;
    DA: number;
    CA: number;
    HRA: number;
    MA: number;
    PF: number;
    ESI: number;
    TDS: number;
    GrossSalary: number;
    NetSalary: number;
    IsIssued: boolean;
    AccountName: string;
    PaymodeID: string;
    PaymodeName: string;
    PaymodeTypeSysID = '';
    TransactionNo = '';
    TransactionDate = '';
    TransactionBankSysID = '';
    LedgerSysID = '';
    Amount = 0;
}