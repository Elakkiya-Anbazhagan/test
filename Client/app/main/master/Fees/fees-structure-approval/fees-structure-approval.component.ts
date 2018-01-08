import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit, Directive } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'fees-structure-approval',
    templateUrl: './fees-structure-approval.component.html'
})

export class Fees_Structure_Approval_Component implements OnInit {
    public isAllowMiscFeeApprove: boolean;
    public isAllowTransportFeeApprove: boolean;
    public isAllowAcademicFeeApprove: boolean;
    public FeeApproveList: InterFace.IFeesApprove[];
    public ViewData: InterFace.IApproveAcademicFeeData;
    public ClassData: Array<InterFace.Idd>;
    public SectionData: Array<InterFace.Idd>;
    public AcademicApproveData: InterFace.IStopList[];
    public isListMode: boolean;
    public isAcademicViewMode: boolean;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Fee Approval');
        lib.setPageTitle('Fee Approval');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAcademicFeeApprove = this.lib.isActionAllowed(this.lib.MasterData.FeeName.ACADEMICFEE);
            this.isAllowTransportFeeApprove = this.lib.isActionAllowed(this.lib.MasterData.FeeName.TRANSPORTFEE);
            this.isAllowMiscFeeApprove = this.lib.isActionAllowed(this.lib.MasterData.FeeName.MISCELLANEOUSFEE);
        });
    }
    ngOnInit() {
        this.ViewData = new InterFace.IApproveAcademicFeeData;
        this.LoadFeeApproveList();
        this.isListMode = true;
        this.isAcademicViewMode = false;
    }
    LoadFeeApproveList() {
        this.http.get(this.lib.getApiUrl('fees/structure/yearwise-status-list')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.FeeApproveList = res.result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    btnEdit_Click(EditData: InterFace.IFeesApprove, mode: string) {
        const param = '?mode=approval&academicyearsysid=' + EditData.AcademicYearSysId
        if (mode === 'Academic Fee') {
            this.router.navigateByUrl('/app/fees/academic-fees/structure' + param)
        } else if (mode === 'Transport Fee') {
            this.router.navigateByUrl('/app/fees/transport-fees/structure' + param)
        } else if (mode === 'Miscellaneous Fee') {
            this.router.navigateByUrl('/app/fees/miscellaneous-fees/structure' + param)
        }
    }
    btnApprove_Click(data: InterFace.IFeesApprove, mode: string) {
        let FeeSysID = 0;
        let ConfirmMsg = 'Do you want to approve ';
        if (mode === 'Academic Fee') {
            FeeSysID = data.AcademicFeeSysID;
            ConfirmMsg += 'Academic Fees Structure';
        } else if (mode === 'Transport Fee') {
            FeeSysID = data.TrasnportFeeSysID;
            ConfirmMsg += 'Transport Fees Structure';
        } else if (mode === 'Miscellaneous Fee') {
            FeeSysID = data.MiscellaneousFeeSysID;
            ConfirmMsg += 'Miscellaneous Fees Structure';
        }
        this.lib.notification.confirm(ConfirmMsg, () => {
            this.http.post(this.lib.getApiUrl('fees/structure/approve/' + data.AcademicYearSysId + '/' + FeeSysID)).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadFeeApproveList();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                });
        }, () => { });
    }
}
