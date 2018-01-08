import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment'

import * as InterFace from '../../../../InterFace';
import { Idd } from '../../../../InterFace/ICommon';

@Component({
    selector: 'Miscellaneous-receipt-list',
    templateUrl: 'Miscellaneous-list.component.html'
})

export class Miscellaneous_Receipt_Component implements OnInit {
    isAllowCancel: boolean;
    isAllowPrint: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public dsmiscReceiptList: mlmiscellaneousReceiptList[];
    public mlReceiptMaster: InterFace.mlTransportFeeReceiptMaster;
    public dsAcademicYearFilter: SelectItem[];
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    public dsAccountFilter: SelectItem[];
    public mlSearchInfo: mlReceiptSearchInfo;
    public dsAcademicYear: Array<InterFace.Idd>
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Miscellaneous Receipt List');
        lib.setPageTitle('Miscellaneous Receipt List');
        this.mlReceiptMaster = new InterFace.mlTransportFeeReceiptMaster();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowPrint = this.lib.isActionAllowed('Print');
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
    }

    ngOnInit() {
        this.mlSearchInfo = new mlReceiptSearchInfo();
        this.dsmiscReceiptList = [];
        this.mlSearchInfo.ToDate = moment().format('DD/MM/YYYY');
        this.mlSearchInfo.FromDate = moment().add(-1, 'M').format('DD/MM/YYYY');
        this.mlSearchInfo.AcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
        this.btnView_click();
    }


    btnView_click() {
        this.LoadReceiptList();
    }
    LoadReceiptList() {
        encodeURIComponent(this.mlSearchInfo.FromDate)
        // tslint:disable-next-line:max-line-length
        const url = 'fees/academic-fees-collection/miscellaneous-receipt-list?AcademicYearSysID=' + this.mlSearchInfo.AcademicYearSysID + '&FromDate=' + encodeURIComponent(this.mlSearchInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlSearchInfo.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsmiscReceiptList = [];
                    this.dsmiscReceiptList = res.result.data;

                    if (this.lib.isValidList(this.dsmiscReceiptList)) {
                        this.dsmiscReceiptList[0].AccountName;

                        this.dsClassFilter = this.lib.groupByAsSelectItem(this.dsmiscReceiptList, 'ClassName', true)
                        this.dsSectionFilter = this.lib.groupByAsSelectItem(this.dsmiscReceiptList, 'SectionName', true)
                        this.dsAccountFilter = this.lib.groupByAsSelectItem(this.dsmiscReceiptList, 'AccountName', true)
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });


    }
    BtnPrint_Click(data: mlmiscellaneousReceiptList) {
        const url = '/Report/miscellaneous-fee-receipt/' + data.ReceiptSysID + '/' + 'PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }


}
class mlReceiptSearchInfo {
    AcademicYearSysID: number;
    FromDate: string;
    ToDate: string;
}
class mlmiscellaneousReceiptList {
    AccountSysID: string;
    AccountID: string;
    AccountName: string;
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