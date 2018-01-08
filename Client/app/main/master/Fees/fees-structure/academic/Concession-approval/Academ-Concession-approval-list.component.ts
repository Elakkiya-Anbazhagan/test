
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';
import * as moment from 'moment';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from '../../../../../InterFace';

@Component({
    selector: 'Academic-Concession-approval',
    templateUrl: 'Academ-Concession-approval-list.component.html'
})

export class Academic_Concession_approval_list_Component implements OnInit {
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public mlConcessionInfo: mlacademicConcessionInfo;
    public dsAcademicYear: Array<InterFace.Idd>;
    public ConcessionList: mlConcessionapprovalList[];
    public PanelList: Boolean = true;


    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        this.lib.setBrowserTitle('Academic Concession Approval List');
        this.lib.setPageTitle('Academic Concession Approval List');

    }


    ngOnInit() {
        this.mlConcessionInfo = new mlacademicConcessionInfo();
        this.ConcessionList = [];
        // this.LoadAcademicYear();
        this.mlConcessionInfo.ToDate = moment().format('DD/MM/YYYY');
        // this.mlConcessionInfo.FromDate = moment().add(-1, 'M').format('DD/MM/YYYY');
        this.mlConcessionInfo.FromDate = moment().format('DD/MM/YYYY');

    }
    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
                setTimeout(() => {
                    this.mlConcessionInfo.AcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
                    setTimeout(() => {
                        this.LoadData();

                    }, 100);
                }, 100);
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadData() {
        encodeURIComponent(this.mlConcessionInfo.FromDate)
        // tslint:disable-next-line:max-line-length
        const url = 'fees/academic-fees-Concession/readall-Academic-Concession?FromDate=' + encodeURIComponent(this.mlConcessionInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlConcessionInfo.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                this.ConcessionList = [];
                if (this.lib.isValidList(res.result.data)) {
                    this.ConcessionList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });

    }
    btnView_click() {
        this.LoadData();
    }

    BtnApprove(data: mlacademicConcessionInfo) {
        this.mlConcessionInfo.ConcessionSysID = data.ConcessionSysID;
        this.mlConcessionInfo.ConcessionNo = data.ConcessionNo;
        this.mlConcessionInfo.StudentSysID = data.StudentSysID;
        this.lib.notification.confirm('Do you want to approve concession ' + this.mlConcessionInfo.ConcessionNo, () => {
            this.http.post(this.lib.getApiUrl('fees/academic-fees-Concession/Academic-ConcessionApproved'), this.mlConcessionInfo).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadData();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }, () => {

        });

    }
    BtnCancel(data: mlacademicConcessionInfo) {
        this.mlConcessionInfo.ConcessionSysID = data.ConcessionSysID;
        this.mlConcessionInfo.ConcessionNo = data.ConcessionNo;
        this.mdCancel.open();
    }
    btnConcessionCancel_Click() {
        this.lib.notification.confirm('Do you want to cancel concession ' + this.mlConcessionInfo.ConcessionNo, () => {
            this.http.post(this.lib.getApiUrl('fees/academic-fees-Concession/Academic-ConcessionCancel'), this.mlConcessionInfo).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadData();
                    this.mdCancel.close();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }, () => {

        });
    }
}
export class mlacademicConcessionInfo {
    AcademicYearSysID: number;
    FromDate: string;
    ToDate: string;
    ConcessionSysID: number;
    ConcessionNo: string;
    ConcessionDate: string;
    StudentSysID: string;
    IsApproved: boolean;
    ApproveDate: string;
    ApproveBy: string;
    IsCancelled: boolean;
    CancelledDate: string;
    CancelledBy: string;
    CancelledReason: string;
}
export class mlConcessionapprovalList {
    ConcessionSysID: number;
    ConcessionNo: string;
    ConcessionDate: string;
    StudentSysID: string;
    StudentName: string;
    ClassSysID: string;
    ClassName: string;
    ClassOrder: number;
    SectionSysID: string;
    SectionName: string;
    AcademicYearSysId: string;
    AcademicYearID: string;
    CategorySysID: string;
    CategoryName: string;
    FeeSysID: string;
    FeeName: string;
    AccountSysID: string;
    AccountName: string;
    IsCancelled: boolean;
    CancelledBy: string;
    CancelledDate: string;
    CancelledReason: string;
    ConcessionTransSysID: string;
    TrasnsportStudentMappingSysID: string;
    Amount: string;
    IsApproved: boolean;
}