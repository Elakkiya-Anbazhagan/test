import { Component, ViewChildren, OnInit } from '@angular/core';
import { routerTransition, hostStyle } from '../../../router.animations'; // NOT NEED
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, UtilityService } from 'systemic/helper';
import { Router } from '@angular/router';


@Component({
    selector: 'academic-arrear-widget',
    templateUrl: './academic-arrear-widget.html',
    animations: [routerTransition()]
})
export class Academic_Arrear_Widget_Component implements OnInit {
    public ArrearList: mlDashboardAcademicArrear;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Dashboard');
        lib.setPageTitle('Dashboard');
        this.ArrearList = new mlDashboardAcademicArrear();
    }
    ngOnInit() {
        this.LoadData();
    }
    LoadData() {
        // this.http.get(this.lib.getApiUrl('dashboard/arrear-widget-info')).subscribe(
        //     (res) => {
        //         this.ArrearList = res.result.data;
        //     }, (err) => {
        //         this.lib.notification.error(err.message);
        //     });
    }

}

class mlDashboardAcademicArrear {
    Class = 0;
    Term1Amount = 0;
}
