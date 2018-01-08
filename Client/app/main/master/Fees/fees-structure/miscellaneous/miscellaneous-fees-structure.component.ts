import { Router, ActivatedRoute } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from '../../../../InterFace';

@Component({
    selector: 'miscellaneous-fee',
    templateUrl: 'miscellaneous-fees-structure.component.html'
})

export class Miscellaneous_Fee_Structure_Component implements OnInit {
    AcademicYearData: Array<InterFace.Idd>
    ClassData: Array<InterFace.Idd>;
    SectionData: Array<InterFace.Idd>
    public CategoryData: mlcategoryList[];
    public mlmisInfo: mlmiscellaneInfo;
    public isViewMode: Boolean = true;
    public isApproved: Boolean = false;
    public isApproveMode = false;
    public AcademicYearSysID = '';

    constructor(private http: ApiService, private router: Router, private lib: UtilityService, private route: ActivatedRoute) {
        this.lib.setBrowserTitle('Miscellaneous fees');
        this.lib.setPageTitle('Miscellaneous fees');
        this.AcademicYearSysID = '';
    }

    ngOnInit() {
        this.mlmisInfo = new mlmiscellaneInfo();
        this.CategoryData = [];

        const obs_AcademicYearList = this.http.get(this.lib.getApiUrl('dropdown/MappedMiscellaneousYearID')); Observable.forkJoin(obs_AcademicYearList).subscribe(
            (res) => {
                this.AcademicYearData = res[0].result.data;
                setTimeout(() => {
                    this.mlmisInfo.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
                    this.onAcademicYear_Changed(this.mlmisInfo.AcademicYearSysID);
                }, 100);
                const params = this.lib.getParams();
                if (!this.lib.isNullOrUndefined(params)) {
                    if (!this.lib.isNullOrUndefined(params.mode) && !this.lib.isNullOrUndefined(params.academicyearsysid)) {
                        if (params.mode === 'approval') {
                            this.lib.setBrowserTitle('Miscellaneous fees approval');
                            this.lib.setPageTitle('Miscellaneous fees approval');
                            this.AcademicYearSysID = params.academicyearsysid;
                            this.isApproveMode = true;
                        } else {
                            this.lib.setBrowserTitle('Miscellaneous fees creation');
                            this.lib.setPageTitle('Miscellaneous fees creation');
                        }
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    onAcademicYear_Changed(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + this.mlmisInfo.AcademicYearSysID + '/' + true)).subscribe(
                (res) => {
                    this.ClassData = res.result.data;
                    setTimeout(() => {
                        this.mlmisInfo.ClassSysID = '-1';
                        this.ClassChange(this.mlmisInfo.ClassSysID);
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }

    }
    ClassChange(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.mlmisInfo.AcademicYearSysID + '/' + value + '/' + true)).subscribe(
                (res) => {
                    this.SectionData = res.result.data;
                    setTimeout(() => {
                        this.mlmisInfo.SectionSysID = '-1';
                        this.btnView_Click();
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    btnView_Click() {
        this.http.get(this.lib.getApiUrl('fees/miscellaneous-fees-structure/amount-list/' + this.mlmisInfo.AcademicYearSysID
            + '/' + this.mlmisInfo.ClassSysID + '/' + this.mlmisInfo.SectionSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data.list)) {
                    this.CategoryData = res.result.data.list;
                }
                this.isApproved = res.result.data.isApproved;
                if (res.result.data.isApproved) {
                    this.lib.notification.warning('Miscellaneous-fee structure has been approved. you can\'t make any change..');
                }
                this.isViewMode = false;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click() {
        try {
            if (this.CategoryData) {
                this.lib.notification.confirm('Do you want to map ', () => {
                    this.http.post(this.lib.getApiUrl('fees/miscellaneous-fees-structure/create'), this.CategoryData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.CategoryData = [];
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                }, () => { });
            } else {
                this.lib.notification.warning('No Data Selected');
            }
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }
    }
    BtnCancel_Click() {
        this.isViewMode = true;
        this.isApproved = false;
        this.CategoryData = [];
    }
    btnGoback_Click() {
        this.router.navigate(['app/fees/approval']);
    }

}
export class mlmiscellaneInfo {
    AcademicYearSysID: number;
    AcademicYear: string;
    ClassSysID: string;
    ClassName: string;
    SectionSysID: string;
    SectionName: string;
}

export class mlcategoryList {
    MappingSysID: string;
    FeeStructureSysID: number;
    CategoryMappingSysID: number;
    CategoryName: string;
    AcademicYearSysID: string;
    SectionSysID: number;
    ClassSysID: number;
    Amount: number;
}



