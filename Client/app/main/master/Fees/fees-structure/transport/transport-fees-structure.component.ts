
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
import * as InterFace from './../../../../InterFace';

@Component({
    selector: 'transport-fees-structure',
    templateUrl: './transport-fees-structure.component.html'
})

export class Transport_Fees_Structure_Component implements OnInit {
    mlTransportInfo: mlTransportInfo;
    dsTransportFeeAmountLsit: mlTransportFeeAmount[];
    dsAcademicYear: InterFace.Idd[];
    dsRoute: InterFace.Idd[];
    dsVehicle: InterFace.Idd[];
    dsTrip: InterFace.Idd[];
    isSearchMode = true;
    Selected_dsTransportFeeAmountLsit: mlTransportFeeAmount[];
    public isApproved: boolean;
    public isApproveMode = false;
    public AcademicYearSysID = '';

    constructor(private http: ApiService, private router: Router, private lib: UtilityService, private route: ActivatedRoute) {
        lib.setBrowserTitle('Transport Fees Structure Creation');
        lib.setPageTitle('Transport Fees Structure Creation');
        this.dsTransportFeeAmountLsit = [];
        this.Selected_dsTransportFeeAmountLsit = [];
        this.mlTransportInfo = new mlTransportInfo();
        this.dsAcademicYear = [];
        this.dsRoute = [];
        this.dsVehicle = [];
        this.dsTrip = [];
    }
    ngOnInit() {
        this.loadData();
    }
    loadData() {
        const obs_AcademicYearList = this.http.get(this.lib.getApiUrl('dropdown/mapped-transport-yearid'));
        const obs_RouteList = this.http.get(this.lib.getApiUrl('dropdown/route'));
        const obs_TripYearList = this.http.get(this.lib.getApiUrl('dropdown/mastertype/TravelTrip'));
        const obs_VehicleYearList = this.http.get(this.lib.getApiUrl('dropdown/vehicle'));
        Observable.forkJoin(obs_AcademicYearList, obs_RouteList, obs_TripYearList, obs_VehicleYearList).subscribe(
            (res) => {
                this.dsAcademicYear = res[0].result.data;
                this.dsRoute = res[1].result.data;
                this.dsTrip = res[2].result.data;
                this.dsVehicle = res[3].result.data;
                const params = this.lib.getParams();
                if (!this.lib.isNullOrUndefined(params)) {
                    if (!this.lib.isNullOrUndefined(params.mode) && !this.lib.isNullOrUndefined(params.academicyearsysid)) {
                        if (params.mode === 'approval') {
                            this.lib.setBrowserTitle('Transport Fees Structure Approval');
                            this.lib.setPageTitle('Transport Fees Structure Approval');
                            this.AcademicYearSysID = params.academicyearsysid;
                            this.isApproveMode = true;

                        } else {
                            this.lib.setBrowserTitle('Transport fees creation');
                            this.lib.setPageTitle('Transport fees creation');
                        }
                    }
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    frmFeeStruct_Submit() {
        if (!this.lib.isNullOrUndefined(this.mlTransportInfo)) {
            this.http.post(this.lib.getApiUrl('fees/transport-fees-structure/amount-list'), this.mlTransportInfo).subscribe(
                (res) => {
                    this.isSearchMode = false;
                    if (this.lib.isNullOrUndefined(res.result.data.isApproved)) {
                        this.isApproved = res.result.data.isApproved;
                    }
                    if (this.isApproved) {
                        this.lib.notification.warning('Transport-fee structure has been approved. you can\'t make any change..');
                    }
                    if (this.lib.isValidList(res.result.data.list)) {
                        this.dsTransportFeeAmountLsit = res.result.data.list;
                    }
                    this.Selected_dsTransportFeeAmountLsit = this.dsTransportFeeAmountLsit.filter(data => data.Amount > 0)
                    this.mlTransportInfo.Amount = 0.00;
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } else {
            this.lib.notification.warning('Please Fill Transport info');
        }
    }
    txtAmount_Change(amount: any) {
        if (this.lib.isValidList(this.Selected_dsTransportFeeAmountLsit)) {
            this.Selected_dsTransportFeeAmountLsit.forEach(data => {
                data.Amount = amount;
            });
        }
    }
    btnFeeStructSave_Click() {
        if (!this.lib.isValidList(this.Selected_dsTransportFeeAmountLsit) || this.lib.isNullOrUndefined(this.mlTransportInfo)) {
            this.lib.notification.warning('Please fill all fields');
        } else {
            this.Selected_dsTransportFeeAmountLsit.forEach(data => {
                data.AcademicYearSysID = this.mlTransportInfo.AcademicYearSysID;
                data.RouteSysID = this.mlTransportInfo.RouteSysID;
                data.VehicleSysID = this.mlTransportInfo.VehicleSysID;
                data.TripSysID = this.mlTransportInfo.TripSysID;
            });
            this.lib.notification.confirm('Do you want to Save ', () => {
                this.http.post(this.lib.getApiUrl('fees/transport-fees-structure/create'), this.Selected_dsTransportFeeAmountLsit).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        }
    }
    btnGoback_Click() {
        this.router.navigate(['app/fees/approval']);
    }
    btnFeeStructCancel_Click() {
        this.dsTransportFeeAmountLsit = [];
        this.mlTransportInfo.Amount = 0;
        this.isSearchMode = true;
    }
}

export class mlTransportInfo {
    AcademicYearSysID = 0;
    RouteSysID = 0;
    StopSysID = 0;
    VehicleSysID: 0;
    TripSysID: 0;
    Amount: 0;
}
export class mlTransportFeeAmount {
    TransportFeeAmountSysID = 0;
    FeeStructureSysID = 0;
    AcademicYearSysID = 0;
    RouteSysID = 0;
    StopSysID = 0;
    StopName = '';
    VehicleSysID: 0;
    TripSysID: 0;
    Amount: 0;
}