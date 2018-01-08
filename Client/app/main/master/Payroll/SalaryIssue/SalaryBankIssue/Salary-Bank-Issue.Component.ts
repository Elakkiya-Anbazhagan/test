import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as InterFace from './../../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Salary-Bank-Issue',
    templateUrl: './Salary-Bank-Issue.Component.html'
})

export class Salary_Bank_Issue_Component implements OnInit,OnChanges {
    public StaffSalaryIssueData: StaffSalaryIssueData[];
    public mdStaffSalaryIssueData: StaffSalaryIssueData;
    public PayMode: InterFace.ITransactionPaymode;
    dsCompanyBankName: Array<InterFace.Idd>;
    dsPaymentType: Array<InterFace.Idd>;
    dsBankName: Array<InterFace.Idd>;

    @ViewChild('mdPaymode') mdPaymode: ModalComponent;

    @Output() onclose = new EventEmitter();
    @Input() PaymodeSysID = 0;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Salary Bank Issue');
        lib.setPageTitle('Staff Salary Bank Issue');
        this.mdStaffSalaryIssueData = new StaffSalaryIssueData();
        this.PayMode = new InterFace.ITransactionPaymode();
    }
    ngOnInit() {
        this.LoadData();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['PaymodeSysID'] && JSON.stringify(changes['PaymodeSysID'].previousValue) !== JSON.stringify(changes['PaymodeSysID'].currentValue)) {
            const newValue: number = changes['PaymodeSysID'].currentValue;
this.PaymodeSysID=newValue;
this.LoadData();
        }
    }
    LoadData() {
        this.StaffSalaryIssueData = [];
        this.dsBankName = [];
        const Obs_SalaryData = this.http.get(this.lib.getApiUrl('payroll/salary/staff-salary-issue-list/' + this.PaymodeSysID));
        const Obs_BankData = this.http.get(this.lib.getApiUrl('dropdown/GetBank'));
        Observable.forkJoin([Obs_SalaryData, Obs_BankData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.StaffSalaryIssueData = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.dsBankName = lstRes[1].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }

    frmPayMode_submit() {
        if (this.lib.isValidModel(this.mdStaffSalaryIssueData)) {
            this.mdStaffSalaryIssueData.PaymodeTypeSysID = this.PayMode.PaymodeTypeSysID;
            this.mdStaffSalaryIssueData.TransactionNo = this.PayMode.TransactionNo;
            this.mdStaffSalaryIssueData.TransactionDate = this.PayMode.TransactionDate;
            this.mdStaffSalaryIssueData.TransactionBankSysID = this.PayMode.TransactionBankSysID;
            this.mdStaffSalaryIssueData.LedgerSysID = this.PayMode.LedgerSysID;
            this.mdStaffSalaryIssueData.Amount = this.PayMode.Amount;
            this.lib.notification.confirm(`'Do you want to issue salary for ${this.mdStaffSalaryIssueData.StaffName}(${this.mdStaffSalaryIssueData.StaffID})?'`, () => {
                this.http.post(this.lib.getApiUrl('payroll/salary/staff-salary-bank-issue'), this.mdStaffSalaryIssueData).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdStaffSalaryIssueData.IsIssued = true;
                        this.mdPaymode.close();
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning('Staff salary data in invalid.');
        }
    }
    btnSalaryIssue_Click(IssueData: StaffSalaryIssueData) {
        this.mdStaffSalaryIssueData = new StaffSalaryIssueData();
        this.PayMode = new InterFace.ITransactionPaymode();
        this.mdStaffSalaryIssueData = IssueData;
        this.http.get(this.lib.getApiUrl('dropdown/GetCompanyBank/' + IssueData.AccountSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsCompanyBankName = res.result.data;
                    setTimeout(() => {
                        this.PayMode.TransactionNo = '';
                        this.PayMode.TransactionDate = '';
                        this.PayMode.TransactionBankSysID = '';
                        this.PayMode.LedgerSysID = this.dsCompanyBankName[0].id;
                        this.PayMode.PaymodeTypeSysID = IssueData.PayModeSysID.toString();
                        this.PayMode.Amount = IssueData.NetSalary;
                        this.mdPaymode.open();
                    }, 100);

                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
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
    SalarySysID = 0;
    SalaryDate = '';
    SalaryTransSysID = 0;
    StaffName = '';
    StaffSysID = 0;
    StaffID = 0;
    AccountSysID = 0;
    PayModeSysID = 0;
    LoanCollectionSysID = 0;
    LoanAmount = 0;
    ActualSalary = 0;
    LeaveDeduct = 0;
    PermissionDeduct = 0;
    BasicPay = 0;
    GradePay = 0;
    DA = 0;
    CA = 0;
    HRA = 0;
    MA = 0;
    PF = 0;
    ESI = 0;
    TDS = 0;
    GrossSalary = 0;
    NetSalary = 0;
    IsIssued = false;
    AccountName = '';
    PaymodeID = '';
    PaymodeName = '';
    PaymodeTypeSysID = '';
    TransactionNo = '';
    TransactionDate = '';
    TransactionBankSysID = '';
    LedgerSysID = '';
    Amount = 0;
}