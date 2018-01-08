import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';


import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'fees-category',
    templateUrl: './fees-category.component.html'
})

export class Fees_Category_Component implements OnInit {
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    @ViewChild('mdCategoryEntry') mdCategoryEntry: ModalComponent;
    public CategoryList: InterFace.ICategory[];
    public category: InterFace.ICategory;
    FeesData: Array<InterFace.Idd>;
    public isEditMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Fees Category');
        lib.setPageTitle('Fees Category');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
        });
    }
    ngOnInit() {
        this.category = new InterFace.ICategory();
        this.LoadData();
        this.LoadCategoryData();
    }
    btnAdd_Click() {
        this.category = new InterFace.ICategory();
        this.isEditMode = false;
        this.mdCategoryEntry.open();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('fees/category/readall')).subscribe(
            (res) => {
                this.CategoryList = [];
                this.CategoryList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadCategoryData() {
        this.http.get(this.lib.getApiUrl('dropdown/fee')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.FeesData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click(categoryMangement: InterFace.ICategory, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.category.CategorySysID === 0 ? 'insert' : 'Update ') + ' Fee-Category' + '(' + this.category.CategoryName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('fees/category/Save'), this.category).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        fromdata.resetForm();
                        this.mdCategoryEntry.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });

    }
    btnEdit_Click(categoryMangement: InterFace.ICategory) {
        this.category.CategorySysID = categoryMangement.CategorySysID;
        this.category.CategoryName = categoryMangement.CategoryName;
        this.category.LedgerSysID = categoryMangement.LedgerSysID;
        this.category.FeeSysID = categoryMangement.FeeSysID;
        this.isEditMode = true;
        this.mdCategoryEntry.open();
    }
}
