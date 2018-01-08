import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { UtilityService, ApiService } from 'systemic/helper';
import { SelectItem } from 'primeng/primeng';

import * as InterFace from './../../../InterFace';

@Component({
    selector: 'transport-student-allotment',
    templateUrl: './transport-student-allotment.html'
})

export class Transport_Student_Allotment_Component implements OnInit {
    @ViewChild('mdStudentList') mdStudentList: ModalComponent;
    @ViewChild('mdInActive') mdInActive: ModalComponent;
    @ViewChild('frmInActiveCancel') frmInActiveCancel: NgForm;
    public mlTransportInfo: mlTransportInfo;
    public dsAcademicYear: InterFace.Idd[];
    public dsRoute: InterFace.Idd[];
    public dsVehicle: InterFace.Idd[];
    public dsStoppage: InterFace.Idd[];
    public dsTrip: InterFace.Idd[];
    public dsAllotedStudentList: mlAllotedStudentList[];
    public dsAllotedStudentInactive: mlAllotedStudentList;
    public dsUnAllotedStudentList: mlAllotedStudentList[];
    public dsUnAllotedStudentListSelected: mlAllotedStudentList[];
    public url = 'fees/transport-student-allotment';
    public isSearchMode: boolean;
    public dsSectionFilter: SelectItem[];
    public dsClassFilter: SelectItem[];
    public AcademicYearSysID: number;
    public RouteSysID: number;
    public StopSysID: number;
    public VehicleSysID: number;
    public TripSysID: number;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService, private route: ActivatedRoute) {
        lib.setBrowserTitle('Transport Student Allotment');
        lib.setPageTitle('Transport Student Allotment');
        this.mlTransportInfo = new mlTransportInfo();
        this.dsAllotedStudentInactive = new mlAllotedStudentList();
        this.dsAcademicYear = [];
        this.dsRoute = [];
        this.dsVehicle = [];
        this.dsStoppage = [];
        this.dsTrip = [];
        this.isSearchMode = true;
        this.dsAllotedStudentList = [];
    }
    ngOnInit() {
        this.loadAcademicYear();
    }
    loadAcademicYear() {
        this.http.get(this.lib.getApiUrl(this.url + '/academicyear-list')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            }, () => {
                this.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
                // this.loadRouteList(this.AcademicYearSysID);
            }
        );
    }
    loadRouteList(ddlAcademicYear: any) {
        this.dsRoute = [];
        this.dsStoppage = [];
        this.dsVehicle = [];
        this.dsTrip = [];
        this.dsAllotedStudentList = [];
        if (this.lib.isValidSelectedValue(ddlAcademicYear.value)) {
            this.http.get(this.lib.getApiUrl(this.url + '/route-list/' + ddlAcademicYear.value)).subscribe(
                (res) => {
                    this.dsRoute = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }
    loadStoppageList(ddlRoute: any, ddlAcademicYear: NgModel, ) {
        this.dsStoppage = [];
        this.dsVehicle = [];
        this.dsTrip = [];
        this.dsAllotedStudentList = [];
        if (this.lib.isValidSelectedValue(ddlAcademicYear.value) &&
            this.lib.isValidSelectedValue(ddlRoute.value)) {
            this.http.get(this.lib.getApiUrl(this.url + '/stoppage-list/' + ddlAcademicYear.value + '/' + ddlRoute.value)).subscribe(
                (res) => {
                    this.dsStoppage = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }
    loadVehicleList(ddlStop: any, ddlAcademicYear: NgModel, ddlRoute: NgModel) {
        this.dsVehicle = [];
        this.dsTrip = [];
        this.dsAllotedStudentList = [];
        if (this.lib.isValidSelectedValue(ddlAcademicYear.value) &&
            this.lib.isValidSelectedValue(ddlRoute.value) &&
            this.lib.isValidSelectedValue(ddlStop.value)) {
            this.http.get(this.lib.getApiUrl(this.url + '/vehicle-list/' + ddlAcademicYear.value + '/' + ddlRoute.value + '/' + ddlStop.value)).subscribe(
                (res) => {
                    this.dsVehicle = res.result.data;
                    setTimeout(() => {
                        if (this.dsVehicle.length === 1) {
                            this.mlTransportInfo.VehicleSysID = this.dsVehicle[0].id;
                            this.loadTripList(this.mlTransportInfo.VehicleSysID, ddlStop, ddlAcademicYear, ddlRoute)
                        }
                    }, 100);

                }, (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }

    }
    loadTripList(ddlVehicle: any, ddlStop: any, ddlAcademicYear: any, ddlRoute: any) {
        this.dsTrip = [];
        this.dsAllotedStudentList = [];
        if (this.lib.isValidSelectedValue(ddlAcademicYear.value) &&
            this.lib.isValidSelectedValue(ddlRoute.value) &&
            this.lib.isValidSelectedValue(ddlStop.value) &&
            this.lib.isValidSelectedValue(ddlVehicle)) {
            this.http.get(this.lib.getApiUrl(this.url + '/trip-list/' + ddlAcademicYear.value + '/' + ddlRoute.value + '/' + ddlStop.value + '/' + ddlVehicle)).subscribe(
                (res) => {
                    this.dsTrip = res.result.data;
                    setTimeout(() => {
                        if (this.dsTrip.length === 1) {
                            this.mlTransportInfo.TripSysID = this.dsTrip[0].id;
                            this.btnGetAllotedStudentList_Click();
                        }
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                }, () => {

                }
            );
        }
    }
    btnGetAllotedStudentList_Click() {
        this.dsAllotedStudentList = [];
        if (!this.lib.isNullOrUndefined(this.mlTransportInfo)) {
            this.http.post(this.lib.getApiUrl(this.url + '/allotted-student-list/'), this.mlTransportInfo).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.dsAllotedStudentList = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                }, () => {

                }
            );
        }
    }
    LoadStudentList() {
        this.http.get(this.lib.getApiUrl('fees/transport-student-allotment/unallotted-student-list/' + this.mlTransportInfo.AcademicYearSysID)).subscribe(
            (res) => {
                this.mdStudentList.open('lg');
                this.dsUnAllotedStudentList = [];
                this.dsUnAllotedStudentListSelected = [];
                this.dsUnAllotedStudentList = res.result.data;
                this.dsClassFilter = this.lib.groupByAsSelectItem(this.dsUnAllotedStudentList, 'ClassName', true)
                this.dsSectionFilter = this.lib.groupByAsSelectItem(this.dsUnAllotedStudentList, 'SectionName', true)
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    btnMap_click() {
        if (this.dsUnAllotedStudentListSelected.length !== 0) {
            const TransportStudentMapping: mlTransportStudentMapping = new mlTransportStudentMapping();
            TransportStudentMapping.TrnInfo.AcademicYearSysID = this.mlTransportInfo.AcademicYearSysID;
            TransportStudentMapping.TrnInfo.RouteSysID = this.mlTransportInfo.RouteSysID;
            TransportStudentMapping.TrnInfo.StopSysID = this.mlTransportInfo.StopSysID;
            TransportStudentMapping.TrnInfo.VehicleSysID = this.mlTransportInfo.VehicleSysID;
            TransportStudentMapping.TrnInfo.TripSysID = this.mlTransportInfo.TripSysID;
            TransportStudentMapping.lstData = [];
            this.dsUnAllotedStudentListSelected.forEach(itm => {
                TransportStudentMapping.lstData.push({
                    TrasnsportStudentMappingSysID: itm.TrasnsportStudentMappingSysID,
                    AcademicYearSysID: itm.AcademicYearSysID,
                    StudentSysID: itm.StudentSysID,
                    StudentName: itm.StudentName,
                    AdmissionNo: itm.AdmissionNo,
                    ClassSysID: itm.ClassSysID,
                    ClassName: itm.ClassName,
                    SectionSysID: itm.SectionSysID,
                    SectionName: itm.SectionName,
                    TransportFeeTermSysID: itm.TransportFeeTermSysID,
                    TrasnportFeeAmountSysID: itm.TrasnportFeeAmountSysID,
                    isDeleted: false,
                    IsActive: true,
                    InActiveReason: ''
                })
            });
            this.lib.notification.confirm('Do you want to Map Student for Transport-Route', () => {
                try {
                    this.http.post(this.lib.getApiUrl('fees/transport-student-allotment/allot-student-list'), TransportStudentMapping).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.mdStudentList.close();
                            this.btnGetAllotedStudentList_Click();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.lib.notification.warning('Please select at least 1 Student...');
        }
    }
    btnInActive_click(Data: mlAllotedStudentList) {
        this.dsAllotedStudentInactive = new mlAllotedStudentList();
        this.dsAllotedStudentInactive.StudentSysID = Data.StudentSysID;
        this.dsAllotedStudentInactive.StudentName = Data.StudentName;
        this.dsAllotedStudentInactive.AcademicYearSysID = Data.AcademicYearSysID;
        this.dsAllotedStudentInactive.IsActive = false;
        this.mdInActive.open();
    }
    btnActive_click(Data: mlAllotedStudentList) {
        this.dsAllotedStudentInactive = new mlAllotedStudentList();
        this.dsAllotedStudentInactive.StudentSysID = Data.StudentSysID;
        this.dsAllotedStudentInactive.StudentName = Data.StudentName;
        this.dsAllotedStudentInactive.AcademicYearSysID = Data.AcademicYearSysID;
        this.dsAllotedStudentInactive.IsActive = true;
        this.btnInActive_save_click();
    }
    btnInActive_save_click() {
        if (this.lib.isValidModel(this.dsAllotedStudentInactive)) {
            this.lib.notification.confirm('Do you want to ' + (this.dsAllotedStudentInactive.IsActive ? 'Activate' : 'InActivate') +
                ' Transport-Route Fee for ' + this.dsAllotedStudentInactive.StudentName, () => {
                    try {
                        this.http.post(this.lib.getApiUrl('fees/transport-student-allotment/alloted-student-active-inactive'), this.dsAllotedStudentInactive).subscribe(
                            (res) => {
                                this.lib.notification.success(res.message);
                                this.btnGetAllotedStudentList_Click();
                                this.dsAllotedStudentInactive = new mlAllotedStudentList();
                                if (!this.dsAllotedStudentInactive.IsActive) { this.mdInActive.close(); }

                            },
                            (err) => {
                                this.lib.notification.error(err.message);
                            }
                        );
                    } catch (ex) {
                        this.lib.notification.error(ex.message);
                    }
                }, () => { });
        } else {
            this.lib.notification.warning('Selected Student data is not valid.');
        }
    }
}
class mlTransportInfo {
    AcademicYearSysID = 0;
    RouteSysID = 0;
    StopSysID = 0;
    VehicleSysID = 0;
    TripSysID = 0;
    Amount = 0;
}
class mlAllotedStudentList {
    TrasnsportStudentMappingSysID = 0;
    AcademicYearSysID = 0;
    StudentSysID = 0;
    StudentName = '';
    AdmissionNo = '';
    ClassSysID = 0;
    ClassName = '';
    SectionSysID = 0;
    SectionName = '';
    TransportFeeTermSysID = 0;
    TrasnportFeeAmountSysID = 0;
    isDeleted = false;
    IsActive = false;
    InActiveReason = '';
}
class mlTransportStudentMapping {
    TrnInfo: mlTransportInfo = new mlTransportInfo();
    lstData: mlAllotedStudentList[] = [];
}

