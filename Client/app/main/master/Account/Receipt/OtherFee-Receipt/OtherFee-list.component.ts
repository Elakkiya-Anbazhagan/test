import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Service_Helper } from 'systemic/service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import * as InterFace from './../../../../InterFace';
import { Idd } from './../../../../InterFace/ICommon';

@Component({
    selector: 'OtherFee-List',
    templateUrl: 'OtherFee-list.component.html'
})

export class OtherFeet_List_Component implements OnInit, AfterViewInit {
    isAllowCancel: boolean;
    isAllowPrint: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public mlReceiptList: mlReceiptList;
    public dsReceiptList: mlReceiptList[];
    public dsAcademicYearFilter: SelectItem[];
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    public dsAccountFilter: SelectItem[];
    public dsAcademicYear: Array<InterFace.Idd>
    public mlSearchInfo: mlReceiptSearchInfo;
    public minDate = new Date();
    sales: any[];
    constructor(public lib: UtilityService, private http: ApiService, private srvHelper: Service_Helper) {
        lib.setBrowserTitle('OtherFee Receipt List');
        lib.setPageTitle('OtherFee Receipt List');
        this.mlReceiptList = new mlReceiptList();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowPrint = this.lib.isActionAllowed('Print');
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
    }

    ngOnInit() {
        this.mlSearchInfo = new mlReceiptSearchInfo();
        this.dsReceiptList = [];
        this.mlSearchInfo.ToDate = moment().format('DD/MM/YYYY');
        this.mlSearchInfo.FromDate = moment().format('DD/MM/YYYY');
        this.LoadAcademicYear();
    }
    ngAfterViewInit() {
    }
    LoadAcademicYear() {
        this.srvHelper.get_academic_year_list().subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsAcademicYear = res.result.data;
                    setTimeout(() => {
                        this.LoadReceiptList();
                    }, 100);
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnView_click() {
        this.LoadReceiptList();
    }
    LoadReceiptList() {
        this.dsReceiptList = [];
        const url = 'fees/other-fees-list/readall-OtherFee-Receipt?FromDate=' + encodeURIComponent(this.mlSearchInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlSearchInfo.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsReceiptList = res.result.data;
                    this.dsReceiptList[0].AccountID;
                    this.dsClassFilter = this.lib.groupByAsSelectItem(this.dsReceiptList, 'ClassName', true);
                    this.dsSectionFilter = this.lib.groupByAsSelectItem(this.dsReceiptList, 'SectionName', true);
                    this.dsAccountFilter = this.lib.groupByAsSelectItem(this.dsReceiptList, 'AccountID', true);
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });


    }
    btnCancelReceipt_Click(ReceiptMaster: mlReceiptList) {
        this.mlReceiptList = new mlReceiptList();
        this.mlReceiptList.ReceiptSysID = ReceiptMaster.ReceiptSysID;
        this.mlReceiptList.ReceiptNo = ReceiptMaster.ReceiptNo;
        this.mlReceiptList.StudentSysID = ReceiptMaster.StudentSysID;
        this.mlReceiptList.AdmissionNo = ReceiptMaster.AdmissionNo;
        this.mdCancel.open();
    }
    btnCancel_Click() {
        this.lib.notification.confirm('Do you want to cancel Receipt ' + this.mlReceiptList.ReceiptNo, () => {
            if (this.lib.isValidModel(this.mlReceiptList)) {
                this.mlReceiptList.AcademicYearSysId = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId.toString();
                this.http.post(this.lib.getApiUrl('fees/other-fees-list/other-receipt-cancel'), this.mlReceiptList).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadReceiptList();
                        this.mdCancel.close();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }
        }, () => {
        });
    }
    BtnPrint_Click(data: mlReceiptList) {
        const url = '/Report/other-fee-receipt/' + data.ReceiptSysID + '/' + '/PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }


}
class mlReceiptSearchInfo {
    AcademicYearSysID: number;
    FromDate: string;
    ToDate: string;
}
class mlReceiptList {
    AccountSysID: string;
    AccountID: string;
    ReceiptSysID: string;
    ReceiptNo: string;
    ReceiptDate: string;
    StudentSysID: string;
    AdmissionNo: string;
    StudentName: string;
    ClassSysID: string;
    ClassName: string;
    SectionSysID: string;
    SectionName: string;
    AcademicYearSysId: string;
    AcademicYearID: string;
    IsCancelled: string
    CancelledReason: string;
    Amount: number;
    AmountInWords: string;
    TypeName: string;
    TransactionNo: string;
    TransactionDate: string;

}
class mlOtherFeeReceiptMaster {
    ReceiptSysID = 0;
    ReceiptNo = '';
    ReceiptDate = '';
    StudentSysID = 0;
    AcademicYearSysID = 0;
    BranchSysID = 0;
    IsCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    IsDeleted = false;
    CancelledReason = '';
}