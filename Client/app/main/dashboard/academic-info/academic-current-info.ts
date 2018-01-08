import { Component, ViewChildren, OnInit } from '@angular/core';
import { routerTransition, hostStyle } from '../../../router.animations'; // NOT NEED
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, UtilityService } from 'systemic/helper';
import { Router } from '@angular/router';


@Component({
    selector: 'widget-academic-current-info',
    templateUrl: './academic-current-info.html',
    animations: [routerTransition()]
})
export class Academic_Current_Info_Component implements OnInit {
    public AcademicInfo: mlDashboardAcademicInfo;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Dashboard');
        lib.setPageTitle('Dashboard');
        this.AcademicInfo = new mlDashboardAcademicInfo();
    }
    ngOnInit() {
        this.LoadData();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('dashboard/academic-widget-info')).subscribe(
            (res) => {
                this.AcademicInfo = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
}

class mlDashboardAcademicInfo {
    StudentCount = 0;
    Income = 0;
    Expense = 0;
}
