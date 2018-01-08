import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { routerTransition, hostStyle } from '../../../../../router.animations';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'fees-account-map',
    templateUrl: './fees-account-map.component.html'
})

export class Fees_AccountMap_Component implements OnInit {
    public AcademicYearData: Array<InterFace.Idd>;
    public AccountTypeData: Array<InterFace.Idd>;
    public FeesData: Array<InterFace.Idd>;
    public SelectedData: InterFace.ICategoryMap[];
    public MapData: InterFace.ICategoryMap[];
    public ViewData: InterFace.ICategoryData;
    public isViewMode: boolean;
    public isApproved: boolean;

    @ViewChild('frmCategoryEntry') fromData: NgForm;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Account Category Mapping');
        lib.setPageTitle('Account Category  Mapping');
    }
    ngOnInit() {
        this.ClearControl();
        this.LoadAcademicYear();
        this.LoadAccountType();
        this.LoadFeeType();
    }
    ClearControl() {
        this.isViewMode = true;
        this.isApproved = false;
        this.ViewData = new InterFace.ICategoryData;
        this.SelectedData = [];
        this.MapData = [];
        this.fromData.resetForm();
    }
    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.AcademicYearData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadAccountType() {
        this.http.get(this.lib.getApiUrl('dropdown/accounttype')).subscribe(
            (res) => {
                this.AccountTypeData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadFeeType() {
        this.http.get(this.lib.getApiUrl('dropdown/fee')).subscribe(
            (res) => {
                this.FeesData = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnView_Click() {
        this.http.get(this.lib.getApiUrl('fees/category/accountmapping/list/' + this.ViewData.AcademicYearSysId
            + '/' + this.ViewData.AccountSysID + '/' + this.ViewData.FeeSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.MapData = res.result.data.list;
                }
                this.isApproved = res.result.data.isApproved;
                if (res.result.data.isApproved) {
                    this.lib.notification.warning('fee structure has been approved. you can\'t make any change..');
                }
                this.SelectedData = this.MapData.filter(item => item.isMapped === true);
                this.isViewMode = false;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click() {
        try {
            this.MapData.forEach((data) => {
                data.isMapped = (this.SelectedData.filter(sdata => sdata.CategorySysID === data.CategorySysID).length !== 0);
            });
            if (this.MapData.filter(mdata => mdata.isMapped === true).length !== 0) {
                this.lib.notification.confirm('Do you want to map ', () => {
                    this.http.post(this.lib.getApiUrl('fees/category/accountmapping/save'), this.MapData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                    this.ClearControl();
                }, () => { });
            } else {
                this.lib.notification.warning('Please select at least 1 fee category for mapping');
            }
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }

    }
    btnCancel_Click() {
        this.ClearControl();
    }
}
