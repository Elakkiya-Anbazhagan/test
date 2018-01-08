import { Idd } from './../../../InterFace/ICommon';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, AfterContentChecked, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Leave-master',
    templateUrl: './Leave.Component.html'
})

export class Leave_Component implements OnInit, AfterContentChecked {
    LeaveList: mlLeaveData[];
    SelectedLeaveList: mlLeaveData[];
    LeaveData: mlLeaveData;
    LeaveDetails: mlLeaveDetails;
    mlSearchInfo: mlSearchInfo;
    StaffData: Array<InterFace.Idd>;
    TypeData: Array<InterFace.Idd>;
    MeridianData: Array<InterFace.Idd>;
    isListMode: boolean;
    isPaidMode: boolean;
    showGoBack: boolean;
    isAllowApprove: boolean;
    isAllowEdit: boolean;
    isAllowDelete: boolean;
    isAllowAdd: boolean;

    @Output() onclose = new EventEmitter();
    @Input() StaffSysID = 0;
    @Input() AttendanceDate = '';

    @ViewChild('frmStaffLeave') frmStaffLeave: NgForm;

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Staff Leave');
        lib.setPageTitle('Staff Leave');
        this.LeaveData = new mlLeaveData();
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowApprove = this.lib.isActionAllowed('Approve');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
            this.isAllowDelete = this.lib.isActionAllowed('Delete');
            this.isAllowAdd = this.lib.isActionAllowed('Add');
        });
        const Obs_TypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Leave_Status_Type'));
        const Obs_StaffData = this.http.get(this.lib.getApiUrl('payroll/staff/getstaff'));
        const Obs_MeridianData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Meridian_Type'));
        Observable.forkJoin([Obs_TypeData, Obs_StaffData, Obs_MeridianData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.TypeData = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.StaffData = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.MeridianData = lstRes[2].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    ngAfterContentChecked() {
        if (this.StaffSysID !== 0) {
            this.LeaveData.StaffSysID = this.StaffSysID.toString();
            this.LeaveData.FromDate = this.AttendanceDate;
            this.LeaveData.ToDate = this.AttendanceDate;
        }
    }
    ngOnInit() {
        if (this.StaffSysID !== 0) {
            this.showGoBack = true;
            this.btnAdd_Click();
        } else {
            this.isListMode = true;
            this.isPaidMode = false;
            this.showGoBack = false;
        }
        this.mlSearchInfo = new mlSearchInfo();
        this.mlSearchInfo.ToDate = moment().format('DD/MM/YYYY');
        this.mlSearchInfo.FromDate = moment().format('DD/MM/YYYY');
    }
    btnView_click() {
      this.LoadLeaveList();
  }
    LoadLeaveList() {
        this.LeaveList = [];
        this.SelectedLeaveList = [];
        const url = 'payroll/leave/readall?FromDate=' + encodeURIComponent(this.mlSearchInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlSearchInfo.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.LeaveList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnAdd_Click() {
        this.LeaveData = new mlLeaveData();
        this.LeaveData.FromDate = moment().format('DD-MM-YYYY');
        this.LeaveData.ToDate = moment().format('DD-MM-YYYY');
        this.LeaveData.MeridianSysID = this.MeridianData.filter(data => data.text === 'ALL')[0].id;
        this.LeaveData.Meridian = this.lib.MasterData.MeridianType.ALL;
        this.isListMode = false;
        this.isPaidMode = false;
    }
    btnEdit_Click(EditData: mlLeaveData) {
        this.LeaveData = new mlLeaveData();
        this.LeaveData.LeaveSysID = EditData.LeaveSysID;
        this.LeaveData.StaffSysID = EditData.StaffSysID;
        this.LeaveData.StaffName = EditData.StaffName;
        this.LeaveData.StaffID = EditData.StaffID;
        this.LeaveData.NoOfDays = EditData.NoOfDays;
        this.LeaveData.FromDate = EditData.FromDate;
        this.LeaveData.ToDate = EditData.ToDate;
        this.LeaveData.StatusName = EditData.StatusName;
        this.LeaveData.StatusSysID = EditData.StatusSysID;
        this.LeaveData.Meridian = EditData.Meridian;
        this.LeaveData.MeridianSysID = EditData.MeridianSysID;
        this.LeaveData.Reason = EditData.Reason;
        this.LeaveData.IsApproved = EditData.IsApproved;
        if (EditData.StatusName === this.lib.MasterData.LeaveType.CL || EditData.StatusName === this.lib.MasterData.LeaveType.EL) {
            this.isPaidMode = true;
            this.LoadLeaveDetail();
        } else {
            this.isPaidMode = false;
        }
        console.log(this.LeaveData);
        setTimeout(()=> {
            this.isListMode = false;
        }, 100);
    }
    LoadLeaveDetail() {
        this.LeaveDetails = new mlLeaveDetails();
        const URL = this.lib.getApiUrl('payroll/leave/Leave-detail/' + this.LeaveData.StaffSysID + '/' + this.LeaveData.FromDate + '/'
            + (this.LeaveData.LeaveSysID !== 0 ? this.LeaveData.LeaveSysID.toString() : '0')
        );
        this.http.get(URL).subscribe(
            (res) => {
                if (this.lib.isValidModel(res.result.data)) {
                    this.LeaveDetails = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    Staff_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.LeaveDetails = new mlLeaveDetails();
            this.isPaidMode = false;
            this.LeaveData.StaffName = event.data[0].text;
            this.LeaveData.StatusSysID = '';
        }
    }
    Leave_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.LeaveData.StatusName = event.data[0].textid;
            if (event.data[0].textid === this.lib.MasterData.LeaveType.EL || event.data[0].textid === this.lib.MasterData.LeaveType.CL) {
                this.isPaidMode = true;
                this.LoadLeaveDetail();
            } else {
                this.isPaidMode = false;
            }
        }
    }
    Meridian_Change(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.LeaveData.Meridian = event.data[0].text;
        }
    }
    btnSave_Click() {
        const startDate = moment(this.LeaveData.FromDate, 'DD.MM.YYYY');
        const endDate = moment(this.LeaveData.ToDate, 'DD.MM.YYYY');
        const diff = endDate.diff(startDate, 'days') + 1;
        const dif = (this.LeaveData.Meridian !== this.lib.MasterData.MeridianType.ALL ? diff / 2 : diff);
        if (this.LeaveData.StatusName === this.lib.MasterData.LeaveType.EL) {
            if (this.LeaveDetails.BalanceEL >= dif && dif >= 0) {
                this.LeaveData.NoOfDays = dif;
            } else {
                this.LeaveData.NoOfDays = 0;
            }
        } else if (this.LeaveData.StatusName === this.lib.MasterData.LeaveType.CL) {
            if (this.LeaveDetails.BalanceCL >= dif && dif >= 0) {
                this.LeaveData.NoOfDays = dif;
            } else {
                this.LeaveData.NoOfDays = 0;
            }
        } else {
            this.LeaveData.NoOfDays = (this.LeaveData.Meridian !== this.lib.MasterData.MeridianType.ALL ? dif / 2 : dif);
        }
        if (this.LeaveData.Meridian === this.lib.MasterData.MeridianType.ALL && this.LeaveData.NoOfDays < 1) {
            this.LeaveData.NoOfDays = 0;
        }
        if (this.lib.isValidSelectedValue(this.LeaveData.NoOfDays)) {
            this.lib.notification.confirm('Do you want to ' + (this.LeaveData.LeaveSysID === 0 ? 'Save' : 'Update') + ' Staff Leave' +
                '(' + this.LeaveData.StaffName + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/leave/save'), this.LeaveData).subscribe(
                            (res) => {
                                if (!this.showGoBack) {
                                    this.lib.notification.success(res.message);
                                    this.LeaveData = new mlLeaveData();
                                    this.LeaveDetails = new mlLeaveDetails();
                                    this.isListMode = true;
                                    this.isPaidMode = false;
                                    this.LoadLeaveList();
                                    this.frmStaffLeave.resetForm();
                                } else {
                                    this.onclose.emit();
                                }
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
            this.lib.notification.warning('InSufficient Leave');
        }
    }
    btnApprove_Click(ApproveData:mlLeaveData) {
        if (this.lib.isValidModel(ApproveData)) {
            this.lib.notification.confirm('Do you want to Approve Staff Leave', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/leave/approve'), ApproveData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.LeaveList = [];
                            this.SelectedLeaveList = [];
                            this.LoadLeaveList();
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
            this.lib.notification.warning('Please select atleast 1 record');
        }

    }
    btnDelete_Click(DeleteData: mlLeaveData) {
        if (this.lib.isValidModel(DeleteData)) {
            this.lib.notification.confirm('Do you want to Delete Staff Leave', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/leave/delete'), DeleteData).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.LeaveList = [];
                            this.SelectedLeaveList = [];
                            this.LoadLeaveList();
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
            this.lib.notification.warning('Invalid Staff Leave Data');
        }
    }
    btnCancel_Click() {
        this.frmStaffLeave.resetForm();
        this.LeaveData = new mlLeaveData();
        this.LeaveDetails = new mlLeaveDetails();
        this.isListMode = true;
        this.isPaidMode = false;
    }
    btnGoBack_Click() {
        this.onclose.emit();
    }
}
class mlLeaveData {
    LeaveSysID: number;
    StaffName: string;
    StaffID: string;
    StaffSysID: string;
    NoOfDays: number;
    FromDate: string;
    ToDate: string;
    StatusName: string;
    StatusSysID: string;
    MeridianSysID: string;
    Meridian: string;
    Reason: string;
    IsApproved: boolean;
    constructor() {
        this.LeaveSysID = 0;
    }
}
class mlLeaveDetails {
    NoOfLeaveEL: number;
    NoOfLeaveCL: number;
    BalanceEL: number;
    BalanceCL: number;
}
class mlSearchInfo {
  FromDate: string;
  ToDate: string;
}