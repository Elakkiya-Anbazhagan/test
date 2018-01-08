import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SelectItem } from 'primeng/primeng';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';


import { UtilityService, notyTheme, notyType, ApiService } from 'systemic/helper';
import * as InterFace from '../../../../InterFace';
import { Idd } from '../../../../InterFace/ICommon';
import { IVoucherEntry } from '../../../../InterFace/IVoucher';
import { routerTransition, hostStyle } from '../../../../../router.animations';

@Component({
    selector: 'transport-receipt-list',
    templateUrl: 'Transport-list.component.html'
})

export class Transport_Receipt_Component implements OnInit {
    isAllowPrint: boolean;
    isAllowCancel: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public dstransReceiptList: mltransportReceiptList[];
    public mlReceiptMaster: InterFace.mlTransportFeeReceiptMaster;
    public dsAcademicYearFilter: SelectItem[];
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    public dsAccountFilter: SelectItem[];
    public dsAcademicYear: Array<InterFace.Idd>;
    public mlSearchInfo: mlReceiptSearchInfo;

    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Transport Receipt List');
        lib.setPageTitle('Transport Receipt List');
        this.mlReceiptMaster = new InterFace.mlTransportFeeReceiptMaster();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowPrint = this.lib.isActionAllowed('Print');
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
    }

    ngOnInit() {
        this.mlSearchInfo = new mlReceiptSearchInfo();
        this.dstransReceiptList = [];
        this.mlSearchInfo.ToDate = moment().format('DD/MM/YYYY');
        this.mlSearchInfo.FromDate = moment().format('DD/MM/YYYY');
        this.mlSearchInfo.AcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
        this.btnView_click();
    }
    // LoadAcademicYear() {
    //     this.http.get(this.lib.getApiUrl('dropdown/academicyear/true')).subscribe(
    //         (res) => {
    //             this.dsAcademicYear = res.result.data;
    //         }, (err) => {
    //             this.lib.notification.error(err.message);
    //         });
    // }
    // ddlAcademicYear_Change(event: any) {
    //     if (this.lib.isValidSelectedValue(event.value)) {
    //         this.LoadReceiptList();
    //     }

    // }

    btnView_click() {
        this.LoadReceiptList();
    }
    LoadReceiptList() {
        this.dstransReceiptList = [];
        // tslint:disable-next-line:max-line-length
        const url = 'fees/academic-fees-collection/tranport-receipt-list?FromDate=' + encodeURIComponent(this.mlSearchInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlSearchInfo.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dstransReceiptList = res.result.data;
                    this.dstransReceiptList[0].AccountName;
                    this.dsAcademicYearFilter = this.lib.groupByAsSelectItem(this.dstransReceiptList, 'AcademicYearID', true)
                    this.dsClassFilter = this.lib.groupByAsSelectItem(this.dstransReceiptList, 'ClassName', true)
                    this.dsSectionFilter = this.lib.groupByAsSelectItem(this.dstransReceiptList, 'SectionName', true)
                    this.dsAccountFilter = this.lib.groupByAsSelectItem(this.dstransReceiptList, 'AccountName', true)
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnPrint_Click(data: mltransportReceiptList) {
        const url = '/Report/transport-fee-receipt/' + data.ReceiptSysID + '/' + 'PDF';
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }

    btnCancelReceipt_Click(ReceiptMaster: InterFace.mlAcademicFeeReceiptMaster) {
        this.mlReceiptMaster = new InterFace.mlTransportFeeReceiptMaster();
        this.mlReceiptMaster.ReceiptSysID = ReceiptMaster.ReceiptSysID;
        this.mlReceiptMaster.ReceiptNo = ReceiptMaster.ReceiptNo;
        this.mdCancel.open();
    }
    btnCancel_Click() {
        this.lib.notification.confirm('Do you want to cancel Receipt ' + this.mlReceiptMaster.ReceiptNo, () => {
            if (this.lib.isValidModel(this.mlReceiptMaster)) {
                this.mlReceiptMaster.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
                this.http.post(this.lib.getApiUrl('fees/transport-fees-collection/transport-receipt-cancel'), this.mlReceiptMaster).subscribe(
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
}

class mlReceiptSearchInfo {
    AcademicYearSysID: number;
    FromDate: string;
    ToDate: string;
}
class mltransportReceiptList {
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