import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TreeNode, TreeTable } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'role-component',
    templateUrl: './Role.Component.html'
})
export class Role_Component {
    public MenuList: TreeNode[];
    public SpecialValueNode: mlMenuTree;
    public mlSpecialValueNode: mlMenuTree;
    public SelectedMenuList: TreeNode[];
    @ViewChild('mdLock') mdLock: ModalComponent;
    @ViewChild('mdSpecial') mdSpecial: ModalComponent;
    @ViewChild('frmRoleEntry') frmRoleEntry: NgForm;
    @ViewChild('frmSpecial') frmSpecial: NgForm;
    public RoleList: mlMasterStaffRole[];
    public RoleEntry: mlMasterStaffRole;
    public formLock: mlMasterStaffRole;
    public isEditMode: boolean;
    public SpceialIndex: number;
    @ViewChild('treeMenu') treeMenu: TreeTable;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Role');
        lib.setPageTitle('Role');
        this.isEditMode = false;
        this.SpecialValueNode = new mlMenuTree();
        this.mlSpecialValueNode = new mlMenuTree();
        this.SpceialIndex = 0;
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.RoleList = [];
        this.RoleEntry = new mlMasterStaffRole();
        this.formLock = new mlMasterStaffRole;
        this.LoadData();
    }
    btnAdd_Click() {
        this.RoleEntry = new mlMasterStaffRole();
        this.isEditMode = true;
        this.MenuList = [];
        this.LoadMenuList();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('role/readall')).subscribe(
            (res) => {
                this.RoleList = [];
                this.RoleList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click(RoleEntry: mlMasterStaffRole, fromdata: NgForm) {
        this.RoleEntry.MapData = this.MenuList;
        this.lib.notification.confirm('Do you want to ' + (this.RoleEntry.RoleSysID === 0 ? 'Save' : 'Update') + ' Role' + '(' + this.RoleEntry.RoleName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('role/save'), this.RoleEntry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        // this.RoleEntry = new mlMasterStaffRole();
                        // this.isEditMode = false;
                        // this.frmRoleEntry.resetForm();
                        // this.MenuList = [];
                        // this.LoadData();
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

    simpleStringify(object: any) {
        const simpleObject: any = {};
        for (const prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) === 'object') {
                continue;
            }
            if (typeof (object[prop]) === 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        return JSON.stringify(simpleObject); // returns cleaned up JSON
    };

    btnEdit_Click(RoleList: mlMasterStaffRole) {
        this.RoleEntry.RoleSysID = RoleList.RoleSysID;
        this.RoleEntry.RoleName = RoleList.RoleName;
        this.RoleEntry.RoleID = RoleList.RoleID;
        this.isEditMode = true;
        this.LoadSelectedMenuList();
    }
    btnLock_Click(RoleList: mlMasterStaffRole, frmRoleLock: NgForm) {
        this.formLock = new mlMasterStaffRole();
        this.formLock = RoleList;
        frmRoleLock.resetForm();
        if (!RoleList.IsLocked) {
            // for lock
            this.mdLock.open();
        } else {
            // for un-lock
            this.LockRole()
            this.LoadData();
        }
    }
    LockRole() {
        this.formLock.IsLocked = !this.formLock.IsLocked;
        this.lib.notification.confirm('Do you want to ' + (this.RoleEntry.RoleSysID === 0 ? 'Lock' : 'Unlock') + ' Role' + '(' + this.formLock.RoleName + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('role/Lock'), this.formLock).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.mdLock.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    })
                this.LoadData();
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    btnSpecialValue_Click(SpecialValueNode: mlMenuTree, index: number) {
        this.SpecialValueNode = new mlMenuTree();
        this.mlSpecialValueNode = new mlMenuTree();
        this.SpecialValueNode = SpecialValueNode;
        this.SpceialIndex = index;

        this.mlSpecialValueNode.data.SpecialValue = SpecialValueNode.data.SpecialValue;
        this.mdSpecial.open();
    }
    btnSaveSpecialValue_Click() {
        this.SpecialValueNode.data.SpecialValue = this.mlSpecialValueNode.data.SpecialValue;
        this.frmSpecial.resetForm();
        this.mdSpecial.close();
    }
    btnCancel_Click() {
        this.RoleEntry = new mlMasterStaffRole();
        this.isEditMode = false;
        this.frmRoleEntry.resetForm();
        this.MenuList = [];
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
    LoadSelectedMenuList() {
        this.http.get(this.lib.getApiUrl('role/get-menu-tree/' + this.RoleEntry.RoleSysID)).subscribe(
            (res) => {
                this.MenuList = [];
                this.MenuList = res.result.data;
                this.MenuList = this.MenuList.slice();
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    OnMenu_Change(param: any, nodeData: mlMenuTree) {
        this.Update_Child_Node_Status(nodeData.children, param);
        this.Update_Parent_Node_Status(this.MenuList, nodeData.data.ParentSysID);
    }
    Update_Child_Node_Status(lstMenu: mlMenuTree[], IsMapped: boolean) {
        lstMenu.forEach(itm => {
            itm.data.IsMapped = IsMapped;
            this.Update_Child_Node_Status(itm.children, IsMapped);
        });
    }
    Update_Parent_Node_Status(lstMenu: any, ParentMenuSysID: number) {
        lstMenu.forEach((itm: any) => {
            if (itm.data.MenuSysID === ParentMenuSysID) {
                const Mapped_Child_Count = this.Get_Mapped_Child_Count(this.MenuList, itm.data.MenuSysID);
                itm.data.IsMapped = !(Mapped_Child_Count === 0);
                this.Update_Parent_Node_Status(this.MenuList, itm.data.ParentSysID);
            } else {
                this.Update_Parent_Node_Status(itm.children, ParentMenuSysID);

            }
        });
    }
    Get_Mapped_Child_Count(lstMenu: any, MenuSysID: number): number {
        let MappedChild = 0;
        lstMenu.forEach((itm: any) => {
            if (itm.data.ParentSysID === MenuSysID) {
                if (itm.data.IsMapped) {
                    MappedChild += 1;
                }
                MappedChild += this.Get_Mapped_Child_Count(itm.children, itm.data.MenuSysID);
            } else {
                MappedChild += this.Get_Mapped_Child_Count(itm.children, MenuSysID);
            }
        });
        return MappedChild;
    }
}

class mlMasterStaffRole {
    RoleSysID = 0;
    RoleName = '';
    RoleID = '';
    IsLocked = false;
    LockedBy = '';
    LockedDate = '';
    LockedReason = '';
    BranchSysID = 0;
    MapData: TreeNode[];
}

class mlMenu {
    MenuSysID: number;
    Name: string;
    Icon: string;
    ParentSysID: number;
    ParentMenuName: string;
    Url: string;
    SortOrder: string;
    IsAllowSubMenu: boolean;
    IsSuperAdminMenu: boolean;
    IsAction: boolean;
    IsMapped: boolean;
    SpecialValue = '';
}

class mlMenuTree {
    data: mlMenu;
    children: mlMenuTree[];
    constructor() {
        this.data = new mlMenu();
    }
}