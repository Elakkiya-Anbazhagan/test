import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Salary-master',
    templateUrl: './Staff-Salary.Component.html'
})

export class Staff_Salary_Issue_Component implements OnInit {
    public lstStu_Paymode: Array<InterFace.Ims>;
    public lstStu_Account: Array<InterFace.Ims>;
    StaffAttendanceDetailsList: StaffAttendanceDetails[];
    dtLoanList: StaffLoanDetails[];
    public SalaryDate: string;
    mlFoo: foo;
    isAttendanceMode: boolean;
    isSalaryCalMode: boolean;
    SalaryCount: number;
    SalaryApprovalCount: number;
    @ViewChild('mdLoanList') mdLoanList: ModalComponent;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Salary');
        lib.setPageTitle('Staff Salary');
        this.mlFoo = new foo();
        this.mlFoo.SalaryDate = moment().format('DD-MM-YYYY');
        this.isAttendanceMode = true;
        this.isSalaryCalMode = false;
        this.SalaryCount = 0;
        this.SalaryApprovalCount = 0;
        this.lstStu_Paymode = new Array<InterFace.Ims>();
        this.lstStu_Account = new Array<InterFace.Ims>();
    }
    ngOnInit() {
        this.LoadSalaryData();
        this.load_dropdown_data();
    }
    load_dropdown_data() {
        const Obs_AccountData = this.http.get(this.lib.getApiUrl('payroll/salary/accounttype-list'));
        const Obs_PaymodeData = this.http.get(this.lib.getApiUrl('payroll/salary/mastertype-list/Payment_Mode'));
        Observable.forkJoin([Obs_AccountData, Obs_PaymodeData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.lstStu_Account = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.lstStu_Paymode = lstRes[1].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    btnView_click() {
        this.LoadSalaryData();
        this.isAttendanceMode = true;
        this.isSalaryCalMode = false;
    }
    btnCancel_click() {
        this.LoadSalaryData();
        this.isAttendanceMode = true;
        this.isSalaryCalMode = false;
    }
    btnStaffSalaryCalculation_click() {
        this.lib.notification.confirm('Do you want to calculate staff salary?', () => {
            this.isAttendanceMode = false;
            this.isSalaryCalMode = true;
            // this.http.post(this.lib.getApiUrl('payroll/salary/staffsalarycalculation/' + this.mlFoo.SalaryDate), this.StaffAttendanceDetailsList).subscribe(
            //     (res) => {
            //         if (this.lib.isValidList(res.result.data)) {
            //             this.StaffAttendanceDetailsList = res.result.data;
            //         }
            //     }, (err) => {
            //         this.lib.notification.error(err.message);
            //     });
        }, () => { });
    }
    btnStaffSalaryGeneration_click() {
        if (this.lib.isValidList(this.StaffAttendanceDetailsList) && this.lib.isValidSelectedValue(this.mlFoo.SalaryDate)) {
            this.lib.notification.confirm('Do you want to generate staff salary?', () => {
                this.http.post(this.lib.getApiUrl('payroll/salary/StaffSalaryGeneration/' + this.mlFoo.SalaryDate), this.StaffAttendanceDetailsList).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadSalaryData();
                        this.isAttendanceMode = true;
                        this.isSalaryCalMode = false;
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning('Staff salary data in invalid.');
        }
    }
    LoadSalaryData() {
        this.SalaryCount = 0;
        this.SalaryApprovalCount = 0;
        this.StaffAttendanceDetailsList = [];
        this.http.get(this.lib.getApiUrl('payroll/salary/readall/' + this.mlFoo.SalaryDate)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.StaffAttendanceDetailsList = res.result.data.StaffAttendanceDetails;
                    this.SalaryCount = res.result.data.SalaryCount;
                    this.SalaryApprovalCount = res.result.data.SalaryApprovalCount;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnStaffSalaryApproval_click() {
        if (this.lib.isValidSelectedValue(this.mlFoo.SalaryDate)) {
            this.lib.notification.confirm('Do you want to approve staff salary?', () => {
                this.http.post(this.lib.getApiUrl('payroll/salary/staff-salary-approval/' + this.mlFoo.SalaryDate)).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadSalaryData();
                        this.isAttendanceMode = true;
                        this.isSalaryCalMode = false;
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        } else {
            this.lib.notification.warning('Staff salary data in invalid.');
        }
    }
    btnLoanList(data: StaffLoanDetails[]) {
        this.dtLoanList = [];
        if (this.lib.isValidList(data)) {
            this.dtLoanList = data;
            this.mdLoanList.open('md');
        }
    }
    CalculateLoanAmount(Lst: StaffLoanDetails[]): number {
        let Total = 0;
        if (this.lib.isValidList(Lst)) {
            Lst.forEach((Data) => {
                if (Data.isSelected) {
                    Total += Data.Amount;
                }
            });
        }
        return Total;
    }
    btnLoanModelClose_Click() {
        this.mdLoanList.close('md');
    }
    calculateActualSalary() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.ActualSalary;
            });
        }
        return Total;
    }
    calculateBasicPay() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.BasicPay;
            });
        }
        return Total;
    }
    calculateGradePay() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.GradePay;
            });
        }
        return Total;
    }
    calculateDA() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.DA;
            });
        }
        return Total;
    }
    calculateCA() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.CA;
            });
        }
        return Total;
    }
    calculateHRA() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.HRA;
            });
        }
        return Total;
    }
    calculateMA() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.MA;
            });
        }
        return Total;
    }
    calculatePF() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.PF;
            });
        }
        return Total;
    }
    calculateESI() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.ESI;
            });
        }
        return Total;
    }
    calculateTDS() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.TDS;
            });
        }
        return Total;
    }
    calculateLeaveDeduct() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.LeaveDeduct;
            });
        }
        return Total;
    }
    calculatePermissionDeduct() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.PermissionDeduct;
            });
        }
        return Total;
    }
    calculateExtraSalary() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.ExtraSalary;
            });
        }
        return Total;
    }
    calculateGrossSalary() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                Total += Data.GrossSalary;
            });
        }
        return Total;
    }
    calculateNetSalary() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                let LoanTotal = 0;
                if (this.lib.isValidList(Data.LoanDetails)) {
                    Data.LoanDetails.forEach((LoanData) => {
                        if (LoanData.isSelected) {
                            LoanTotal += LoanData.Amount;
                        }
                    });
                }
                Data.NetSalary = Data.ActualSalary - Data.LeaveDeduct - Data.PermissionDeduct - Data.PF - Data.ESI - Data.TDS - LoanTotal;
                Total += Data.ActualSalary - Data.LeaveDeduct - Data.PermissionDeduct - Data.PF - Data.ESI - Data.TDS - LoanTotal;
            });
        }
        return Total;
    }
    calculateLoanAmount() {
        let Total = 0;
        if (this.StaffAttendanceDetailsList) {
            this.StaffAttendanceDetailsList.forEach(Data => {
                let LoanTotal = 0;
                if (this.lib.isValidList(Data.LoanDetails)) {
                    Data.LoanDetails.forEach((LoanData) => {
                        if (LoanData.isSelected) {
                            LoanTotal += LoanData.Amount;
                        }
                    });
                }
                Total += LoanTotal;
            });
        }
        return Total;
    }

}
class foo {
    SalaryDate: string;
}
class StaffAttendanceDetails {
    StaffName: string;
    StaffSysID: number;
    StaffID: number;
    PWD: number;
    UPWD: number;
    SPWD:number;
    PR: number;
    SUPWD: number;
    AB: number;
    SUPWDD: number;
    PP: number;
    UPP: number;
    NA: number;
    ActualSalary: number;
    NetSalary: number;
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
    LoanAmount: number;
    GrossSalary: number;
    ExtraSalary: number;
    AccountSysID: number;
    PayModeSysID: number;
    LoanDetails: StaffLoanDetails[];
}

class StaffLoanDetails {
    LoanSysID: number;
    LoanDate: string;
    StaffSysID: number;
    InterestRate: number;
    AccountSysID: number;
    LoanTransSysID: number;
    Installment: number;
    InstallmentDate: string;
    Amount: number;
    StatusSysID: number;
    TypeID: string;
    isSelected: boolean;
}