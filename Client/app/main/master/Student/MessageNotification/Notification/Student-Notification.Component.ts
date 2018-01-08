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
    selector: 'Student-Notification',
    templateUrl: './Student-Notification.Component.html'
})

export class Student_Notification_Component implements OnInit {
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    @ViewChild('mdCategoryEntry') mdCategoryEntry: ModalComponent;
    public CategoryList: category[];
    public category: category;
    FeesData: Array<InterFace.Idd>;
    public isEditMode: boolean;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Notification Category');
        lib.setPageTitle('Notification Category');
        this.isEditMode = false;
        // this.lib.LoadPageAction(http, (res: any) => {
        //     this.isAllowAdd = this.lib.isActionAllowed('Add');
        //     this.isAllowEdit = this.lib.isActionAllowed('Edit');
        // });
    }
    ngOnInit() {
        this.category = new category();
        this.LoadData();
    }
    btnAdd_Click() {
        this.category = new category();
        this.isEditMode = false;
        this.mdCategoryEntry.open();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('Student/NotificationCategory/ReadAll')).subscribe(
            (res) => {
                this.CategoryList = [];
                this.CategoryList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click(categoryMangement: category, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.category.CategorySysID === 0 ? 'Save' : 'Update ') + ' Category' + '(' + this.category.CategoryName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('Student/NotificationCategory/Save'), this.category).subscribe(
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
    btnEdit_Click(categoryMangement: category) {
        this.category.CategorySysID = categoryMangement.CategorySysID;
        this.category.CategoryName = categoryMangement.CategoryName;
        this.isEditMode = true;
        this.mdCategoryEntry.open();
    }
}

class category {
    CategorySysID = 0;
    CategoryName = '';
}