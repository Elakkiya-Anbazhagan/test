import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UtilityService, ApiService } from 'systemic/helper';

import * as InterFace from './../../../InterFace';
import { Idd } from './../../../InterFace/ICommon';
import { ILedger } from './../../../InterFace/ILedger';
@Component({
    selector: 'admin-menu',
    templateUrl: './admin.menu.component.html'
})

export class AdminMenuComponent implements OnInit {
    public MenuList: TreeNode[];
    public MenuDetail: InterFace.IMenu;
    public MenuData: Array<InterFace.Idd>;
    @ViewChild('frmMenuEntry') formData: NgForm;
    @ViewChild('mdEntry') mdEntry: ModalComponent;
    constructor(private lib: UtilityService, private http: ApiService) {
        lib.setBrowserTitle('Menu');
        lib.setPageTitle('Menu');
    }
    ngOnInit() {
        this.ClearControl();
    }
    ClearControl() {
        this.MenuDetail = new InterFace.IMenu();
        this.formData.resetForm();
        this.LoadMenuList();
    }
    LoadMenuList() {
        this.http.get(this.lib.getApiUrl('profile/get-menu-tree')).subscribe(
            (res) => {
                this.MenuList = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    btnSave_click() {
        this.lib.notification.confirm('Do you want to ' + (this.MenuDetail.MenuSysID === 0 ? 'insert' : 'Update') + ' Menu' + '(' + this.MenuDetail.Name + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('profile/create'), this.MenuDetail).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.ClearControl();
                        this.mdEntry.close();
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
    btnCancel_click() {
        this.ClearControl();
    }
    btnAddEdit_click(MenuEntryDetail: InterFace.IMenu) {
        this.MenuDetail = MenuEntryDetail;
        this.mdEntry.open('lg');
    }
    btnAdd_click(MenuEntryDetail: InterFace.IMenu) {
        this.MenuDetail.ParentMenuName = MenuEntryDetail.Name;
        this.MenuDetail.ParentSysID = MenuEntryDetail.MenuSysID;
        this.mdEntry.open('lg');
    }
    btnNewAdd_click() {
        this.MenuDetail = new InterFace.IMenu();
        this.MenuDetail.ParentMenuName = 'New Menu';
        this.MenuDetail.ParentSysID = 0;
        this.mdEntry.open('lg');
    }
    btnDelete_click(MenuNode: TreeNode) {
        console.log(MenuNode);
        this.lib.notification.confirm('Do you want to delete this menu', () => {
            try {
                this.http.post(this.lib.getApiUrl('profile/delete-menu'), MenuNode).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.ClearControl();
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
}