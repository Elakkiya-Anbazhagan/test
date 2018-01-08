import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/components/common/api';

import { UtilityService, ApiService } from 'systemic/helper';

declare var layout: any;
@Component({
    selector: 'systemic-sidebar-left',
    templateUrl: './sidebar.left.component.html'
})
export class SidebarLeftComponent implements OnInit {
    public list: TreeNode[];
    UserImage: string;
    Fullname: string;
    Role: string;
    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
    }
    ngOnInit() {
        this.UserImage = '/assets/images/avatars/user1.png';
        this.Fullname = this.lib.authData().Profile.FullName;
        this.Role = this.lib.authData().Profile.Role.Name;
        this.GetMenuList();
    }
    btnLogOut() {
        this.lib.notification.confirm('Do you want to  LogOut', () => {
            window.location.href = '/app/signout';
        }, () => { });
    }

    GetMenuList() {
        this.http.get(this.lib.getApiUrl('profile/get-rbag-menu-tree/' + this.lib.authData().Profile.Role.SysId)).subscribe(
            (res) => {
                this.list = [];
                this.list = res.result.data;
                this.list = this.list.slice();
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
}
