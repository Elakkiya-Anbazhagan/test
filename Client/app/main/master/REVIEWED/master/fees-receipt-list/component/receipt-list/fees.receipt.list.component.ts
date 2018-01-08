import { Service_Helper } from '../../../../service/src/fees.receipt.service';
// System Inport
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';
// Custom Import
import * as InterFace from '../../../../../../InterFace';

import { UtilityService, ApiService } from 'systemic/helper';

@Component({
    selector: 'fees-receipt-list',
    templateUrl: './fees.receipt.list.component.html'
})

export class fees_receipt_list_Component implements OnInit, AfterViewInit {

    @Input() ReceiptType = '';

    public mlPermissionInfo: IPermission;
    public mlReceiptInfo: IReceiptInfo;

    public mlReceiptFilter: IReceiptFilter;
    public mlGridFilter: IGridFilter;

    public mlReceiptInfoList: Array<IReceiptInfo>;
    public mlRoleList: Array<InterFace.Idd>;

    constructor(public lib: UtilityService, private http: ApiService, private srvHelper: Service_Helper) {


    }

    ngOnInit(): void {
        if (!this.lib.isNullOrUndefined(this.ReceiptType)) {
            if (this.ReceiptType === 'Academic' || this.ReceiptType === 'Transport' || this.ReceiptType === 'Miscellaneous') {
                // Set page title
                this.lib.setBrowserTitle(this.ReceiptType.toString() + ' Receipt List');
                this.lib.setPageTitle(this.ReceiptType.toString() + ' Receipt List');
                // Initialize permission model
                this.mlPermissionInfo = new IPermission;
                // Load & Set value for permission
                this.lib.LoadPageAction(this.http, (res: any) => {
                    this.mlPermissionInfo.AllowPrint = this.lib.isActionAllowed('Print');
                    this.mlPermissionInfo.AllowCancel = this.lib.isActionAllowed('Cancel');
                    this.mlPermissionInfo.ShowGroupBased = this.lib.isActionAllowed('Show Group Based Receipt');
                });
                // Initialize role list model
                this.mlRoleList = new Array<InterFace.Idd>();
                // Initialize receipt filter model
                this.mlReceiptFilter = new IReceiptFilter();
                // Initialize Grid Filter
                this.mlGridFilter = new IGridFilter();
                // Load role list
                this.load_role_List()
            } else {

            }
        }
        console.log('OnInit', this.mlReceiptFilter);
    }

    ngAfterViewInit(): void {
        console.log('AfterViewInit', this.mlReceiptFilter);
    }
    frmSearchSubmit() {
        this.load_receipt_list();
    }
    load_role_List() {
        this.srvHelper.get_role_list(true).subscribe(
            res => {
                if (this.lib.isValidList(res.result.data)) {
                    this.mlRoleList = res.result.data;
                    setTimeout(() => {
                        this.mlReceiptFilter.RoleSysID = this.lib.authData().Profile.Role.SysId;
                        // Load receipt list
                        this.load_receipt_list();
                    }, 50);
                }
            }, err => {
                this.lib.notification.error(err.message);
            }
        )
    }
    load_receipt_list() {
        // Set api url based on receipt type
        let url = '';
        if (this.ReceiptType === 'Academic') {
            url = this.lib.getApiUrl('fees/academic-receipt/list');
        } else if (this.ReceiptType === 'Transport') {
            url = this.lib.getApiUrl('fees/transport-receipt/list');
        } else if (this.ReceiptType === 'Miscellaneous') {
            url = this.lib.getApiUrl('fees/miscellaneous-receipt/list');
        }
        // check model & api url is valid
        if (this.lib.isValidModel(this.mlReceiptFilter) && url !== '') {
            this.http.post(url, this.mlReceiptFilter).subscribe(
                (res) => {
                    this.mlReceiptInfoList = new Array<IReceiptInfo>();
                    if (this.lib.isValidList(res.result.data)) {
                        this.mlReceiptInfoList = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                    this.mlReceiptInfoList = new Array<IReceiptInfo>();
                });
        } else {
            this.lib.notification.warning('Please select From & To Date');
        }
    }

    load_Receipt_List_filter() {
        if (this.lib.isValidList(this.mlReceiptInfoList)) {
            this.mlReceiptInfoList[0].AccountID;
            this.mlGridFilter.dsClassFilter = this.lib.groupByAsSelectItem(this.mlReceiptInfoList, 'ClassName', true);
            this.mlGridFilter.dsSectionFilter = this.lib.groupByAsSelectItem(this.mlReceiptInfoList, 'SectionName', true);
            this.mlGridFilter.dsAccountFilter = this.lib.groupByAsSelectItem(this.mlReceiptInfoList, 'AccountID', true);
        }
    }
    filterReceiptList() {

    }
}

class IPermission {
    AllowPrint: boolean;
    AllowCancel: boolean;
    ShowGroupBased: boolean;
    constructor() {
        this.AllowPrint = false;
        this.AllowCancel = false;
        this.ShowGroupBased = false;
    }
}

class IReceiptFilter {
    RoleSysID: number;
    FromDate: string;
    ToDate: string;
    constructor() {
        this.RoleSysID = 0;
        // Set defult value for model
        this.ToDate = moment().format('DD-MM-YYYY');
        this.FromDate = moment().format('DD-MM-YYYY');
    }
}


class IGridFilter {
    public dsSectionFilter: Array<SelectItem>;
    public dsClassFilter: Array<SelectItem>;
    public dsAccountFilter: Array<SelectItem>;
    constructor() {
        this.dsSectionFilter = new Array<SelectItem>();
        this.dsClassFilter = new Array<SelectItem>();
        this.dsAccountFilter = new Array<SelectItem>();
    }
}

export interface IReceiptInfo {
    AccountSysID: number;
    AccountID: string;
    ReceiptSysID: number;
    ReceiptNo: string;
    ReceiptDate: string;
    StudentSysID: number;
    AdmissionNo: string;
    StudentName: string;
    ClassSysID: number;
    ClassName: string;
    SectionSysID: number;
    SectionName: string;
    AcademicYearSysId: number;
    AcademicYearID: string;
    IsCancelled: boolean;
    CancelledReason: string;
    CancelledUserSysID: number;
    CancelledBy: string;
    CancelledDate: string;
    CreatedUserSysID: number;
    CreatedBy: string;
    CreatedDate: string;
    UpdatedUserSysID: number;
    UpdatedBy: string;
    UpdatedDate: string;
    TypeName: string;
    TransactionNo: string;
    TransactionDate: string;
    TransactionBankSysID: number;
    TransactionBank: string;
    PresentedBankSysID: number;
    PresentedBank: string;
    PaymodeTypeSysID: number;
    Status: string;
    Amount: number;
    PresentedDate: string;
    PresentedBy: string;
    PresentedRole: string;
    PresentedUserSysID: number;
    PresentedRoleSysID: number;
    RealizedDate: string;
    RealizedBy: string;
    RealizedRole: string;
    RealizedUserSysID: number;
    RealizedRoleSysID: number;
    BouncedDate: string;
    BouncedBy: string;
    BouncedRole: string;
    BouncedUserSysID: number;
    BouncedRoleSysID: number;
    ReferenceSysID: number;
    ReferenceType: string;
}