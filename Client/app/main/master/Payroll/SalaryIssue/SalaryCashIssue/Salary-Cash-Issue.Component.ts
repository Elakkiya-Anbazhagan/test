import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, OnInit, AfterContentChecked, Input, EventEmitter, Output } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as InterFace from './../../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Salary-Cash-Issue',
    templateUrl: './Salary-Cash-Issue.Component.html'
})

export class Salary_Cash_Issue_Component implements OnInit, AfterContentChecked {
    StaffSalaryIssueData: StaffSalaryIssueData[];
    dsCompanyBankName: Array<InterFace.Idd>;

    @Output() onclose = new EventEmitter();
    @Input() PaymodeSysID = 0;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Salary Cash Issue');
        lib.setPageTitle('Staff Salary Cash Issue');
    }
    ngAfterContentChecked() {
    }
    ngOnInit() {
        this.LoadSalaryData();
    }
    LoadSalaryData() {
        this.StaffSalaryIssueData = [];
        this.http.get(this.lib.getApiUrl('payroll/salary/staff-salary-issue-list/' + this.PaymodeSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.StaffSalaryIssueData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSalaryIssue_Click(IssueData: StaffSalaryIssueData) {
        if (this.lib.isValidModel(IssueData)) {
            this.lib.notification.confirm(`'Do you want to issue salary for ${IssueData.StaffName}(${IssueData.StaffID})?'`, () => {
                this.http.post(this.lib.getApiUrl('payroll/salary/staff-salary-cash-issue'), IssueData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        IssueData.IsIssued = true;
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning('Staff salary data in invalid.');
        }
    }
    btnCancel_click() {
        this.onclose.emit();
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