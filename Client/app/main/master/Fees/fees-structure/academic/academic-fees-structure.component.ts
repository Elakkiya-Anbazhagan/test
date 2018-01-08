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
    selector: 'academic-fees-structure',
    templateUrl: './academic-fees-structure.component.html'
})

export class Academic_Fees_Structure_Component implements OnInit {
    public AcademicYearData: Array<InterFace.Idd>;
    public TermData: Array<InterFace.Idd>;
    public ClassData: Array<InterFace.Idd>;
    public SectionData: Array<InterFace.Idd>;
    public CategoryData: InterFace.IStopList[];
    public ViewData: InterFace.IFeeData;
    public isViewMode: boolean;
    public isApproved: boolean;
    public isApproveMode = false;
    public AcademicYearSysID = '';
    @ViewChild('frmFeesStructureEntry') fromData: NgForm;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService, private route: ActivatedRoute) {
        this.lib.setBrowserTitle('Academic fees');
        this.lib.setPageTitle('Academic fees');
        this.ViewData = new InterFace.IFeeData();
        this.AcademicYearSysID = '';
        this.AcademicYearData = [];
        this.ClearControl();
        this.LoadAcademicYear();
    }
    ngOnInit() {
        this.LoadTerm();
        this.LoadClass();
        this.LoadSection();
    }
    ClearControl() {
        this.isViewMode = true;
        this.isApproved = false;
        this.CategoryData = [];
    }
    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/mappedacademicyearid')).subscribe(
            (res) => {
                this.AcademicYearData = res.result.data;
                const ActiveAcademicYear = this.lib.schoolConfig().ActiveAcademicYear;
                if (!this.lib.isNullOrUndefined(this.AcademicYearData)) {


                    const val = this.AcademicYearData.filter((data) => data.id === ActiveAcademicYear.AcademicYearSysId)
                    if (val.length === 0) {
                        this.lib.notification.warning('Please add fee account mapping for (' + ActiveAcademicYear.AcademicYearID + ') academic year.');
                    }
                } else {
                    this.lib.notification.warning('Please add fee account mapping for (' + ActiveAcademicYear.AcademicYearID + ') academic year.');
                }
                const params = this.lib.getParams();
                if (!this.lib.isNullOrUndefined(params)) {
                    if (!this.lib.isNullOrUndefined(params.mode) && !this.lib.isNullOrUndefined(params.academicyearsysid)) {
                        if (params.mode === 'approval') {
                            this.lib.setBrowserTitle('Academic fees approval');
                            this.lib.setPageTitle('Academic fees approval');
                            this.AcademicYearSysID = params.academicyearsysid;
                            this.isApproveMode = true;

                        } else {
                            this.lib.setBrowserTitle('Academic fees creation');
                            this.lib.setPageTitle('Academic fees creation');
                        }
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadTerm() {
        this.http.get(this.lib.getApiUrl('dropdown/term')).subscribe(
            (res) => {
                this.TermData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadClass() {
        this.http.get(this.lib.getApiUrl('dropdown/get-class')).subscribe(
            (res) => {
                this.ClassData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    ClassChange(event: any) {
    }
    LoadSection() {
        this.http.get(this.lib.getApiUrl('dropdown/get-section/true')).subscribe(
            (res) => {
                this.SectionData = [];
                this.SectionData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            }
        );

    }
    btnView_Click() {

        this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/amount-list/' + this.ViewData.AcademicYearSysId
            + '/' + this.ViewData.TermSysID + '/' + this.ViewData.ClassSysID + '/' + this.ViewData.SectionSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data.list)) {
                    this.CategoryData = res.result.data.list;
                }
                this.isApproved = res.result.data.isApproved;
                if (res.result.data.isApproved) {
                    this.lib.notification.warning('Academic-fee structure has been approved. you can\'t make any change..');
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
                    this.http.post(this.lib.getApiUrl('fees/academic-fees-structure/create'), this.CategoryData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.ClearControl();
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
    btnGoback_Click() {
        this.router.navigate(['app/fees/approval']);
    }
    btnCancel_Click() {
        this.ClearControl();
    }
}
