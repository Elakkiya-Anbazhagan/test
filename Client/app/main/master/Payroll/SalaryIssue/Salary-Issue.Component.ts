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
    selector: 'Salary-Issue',
    templateUrl: './Salary-Issue.Component.html'
})

export class Salary_Issue_Component implements OnInit {
    dsPaymentType: Array<InterFace.Idd>;
    SalaryIssueViewData: SalaryIssueViewData;
    isCashMode: boolean;
    isBankMode: boolean;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Salary Issue');
        lib.setPageTitle('Staff Salary Issue');
        this.SalaryIssueViewData = new SalaryIssueViewData();
        this.isCashMode = false;
        this.isBankMode = false;
    }
    ngOnInit() {
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        Observable.forkJoin([Obs_PaymentTypeData]).subscribe(
            (lstRes) => {
                this.dsPaymentType = lstRes[0].result.data;
                setTimeout(() => {
                    this.SalaryIssueViewData.PaymodeSysID = this.dsPaymentType[0].id;
                    if (this.dsPaymentType[0].text === this.lib.MasterData.PaymodeType.CASH) {
                        this.isCashMode = true;
                        this.isBankMode = false;
                    } else {
                        this.isCashMode = false;
                        this.isBankMode = true;
                    }
                }, 100);
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    ddlPaymodeSysID_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.isCashMode = false;
            this.isBankMode = false;
            if (event.data[0].text === this.lib.MasterData.PaymodeType.CASH) {
                this.isCashMode = true;
                this.isBankMode = false;
            } else {
                this.isCashMode = false;
                this.isBankMode = true;
            }
        }
    }
    onClose() {
        this.isCashMode = false;
        this.isBankMode = false;
        this.SalaryIssueViewData.PaymodeSysID = '';
        this.lib.setBrowserTitle('Staff Salary Issue');
        this.lib.setPageTitle('Staff Salary Issue');
    }
}
class SalaryIssueViewData {
    PaymodeSysID: string;
}