import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import {
  ViewChild,
  Component,
  OnInit,
  AfterContentChecked,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms';
import * as InterFace from './../../../InterFace';
import * as moment from 'moment';

@Component({
  selector: 'permission-master',
  templateUrl: './Permission.Component.html'
})
export class Permission_Component implements OnInit, AfterContentChecked {
  PermissionList: mlPermissionData[];
  SelectedPermissionList: mlPermissionData[];
  PermissionData: mlPermissionData;
  PermissionDetails: mlPermissionDetails;
  mlSearchInfo: mlSearchInfo;
  StaffData: Array<InterFace.Idd>;
  TypeData: Array<InterFace.Idd>;
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

  @ViewChild('frmStaffPermission') frmStaffPermission: NgForm;

  constructor(
    private http: ApiService,
    private router: Router,
    public lib: UtilityService
  ) {
    lib.setBrowserTitle('Staff Permission');
    lib.setPageTitle('Staff Permission');
    this.PermissionData = new mlPermissionData();
    this.PermissionDetails = new mlPermissionDetails();
    this.lib.LoadPageAction(http, (res: any) => {
      this.isAllowApprove = this.lib.isActionAllowed('Approve');
      this.isAllowEdit = this.lib.isActionAllowed('Edit');
      this.isAllowDelete = this.lib.isActionAllowed('Delete');
      this.isAllowAdd = this.lib.isActionAllowed('Add');
    });
    const Obs_TypeData = this.http.get(
      this.lib.getApiUrl('dropdown/mastertype/Permission_Status_Type')
    );
    const Obs_StaffData = this.http.get(
      this.lib.getApiUrl('payroll/staff/getstaff')
    );
    Observable.forkJoin([Obs_TypeData, Obs_StaffData]).subscribe(
      lstRes => {
        if (this.lib.isValidList(lstRes[0].result.data)) {
          this.TypeData = lstRes[0].result.data;
        }
        if (this.lib.isValidList(lstRes[1].result.data)) {
          this.StaffData = lstRes[1].result.data;
        }
      },
      err => {
        this.lib.notification.error(err.message);
      }
    );
  }
  ngAfterContentChecked() {
    if (this.StaffSysID !== 0) {
      this.PermissionData.StaffSysID = this.StaffSysID.toString();
      this.PermissionData.PermissionDate = this.AttendanceDate;
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
    this.LoadPermissionList();
}
  LoadPermissionList() {
    this.PermissionList = [];
    this.SelectedPermissionList = [];
    const url = 'payroll/permission/readall?FromDate=' + encodeURIComponent(this.mlSearchInfo.FromDate) + '&ToDate=' + encodeURIComponent(this.mlSearchInfo.ToDate)
    this.http.get(this.lib.getApiUrl(url)).subscribe(
      res => {
        if (this.lib.isValidList(res.result.data)) {
          this.PermissionList = res.result.data;
        }
      },
      err => {
        this.lib.notification.error(err.message);
      }
    );
  }
  btnAdd_Click() {
    this.PermissionData = new mlPermissionData();
    this.PermissionData.PermissionDate = moment().format('DD-MM-YYYY');
    this.isListMode = false;
    this.isPaidMode = false;
  }
  btnEdit_Click(EditData: mlPermissionData) {
    this.PermissionData = new mlPermissionData();
    this.PermissionData.PermissionSysID = EditData.PermissionSysID;
    this.PermissionData.PermissionDate = EditData.PermissionDate;
    this.PermissionData.StaffSysID = EditData.StaffSysID;
    this.PermissionData.StaffName = EditData.StaffName;
    this.PermissionData.StaffID = EditData.StaffID;
    this.PermissionData.PermissionHour = EditData.PermissionHour;
    this.PermissionData.FromTime = EditData.FromTime;
    this.PermissionData.ToTime = EditData.ToTime;
    this.PermissionData.StatusName = EditData.StatusName;
    this.PermissionData.StatusSysID = EditData.StatusSysID;
    this.PermissionData.Reason = EditData.Reason;
    this.PermissionData.IsApproved = EditData.IsApproved;
    this.isListMode = false;
    if (
      EditData.StatusName === this.lib.MasterData.PermissionType.PP ||
      EditData.StatusName === 'PAIDPERMISSION'
    ) {
      this.isPaidMode = true;
      this.LoadPermissionDetail();
    } else {
      this.isPaidMode = false;
    }
  }
  Staff_Change(event: any) {
    if (this.lib.isValidSelectedValue(event.value)) {
      this.PermissionDetails = new mlPermissionDetails();
      this.isPaidMode = false;
      this.PermissionData.StaffName = event.data[0].text;
      this.PermissionData.StatusSysID = '';
    }
  }
  PermissionDate_Change(event:any){
      this.PermissionData.StatusName='';
      this.PermissionData.StatusSysID='';
      this.PermissionDetails = new mlPermissionDetails();
      this.isPaidMode = false;
  }
  Permission_Change(event: any) {
    if (this.lib.isValidSelectedValue(event.value)) {
      this.PermissionData.StatusName = event.data[0].textid;
      if (event.data[0].textid === this.lib.MasterData.PermissionType.PP) {
        this.isPaidMode = true;
        this.LoadPermissionDetail();
      } else {
        this.isPaidMode = false;
      }
    }
  }
  LoadPermissionDetail() {
    this.PermissionDetails = new mlPermissionDetails();
    const URL = this.lib.getApiUrl('payroll/permission/permission-detail/' + this.PermissionData.StaffSysID + '/' +
        this.PermissionData.PermissionDate + '/' + 
        (this.PermissionData.PermissionSysID !== 0 ? this.PermissionData.PermissionSysID.toString() : '0'));
    this.http.get(URL).subscribe(
      res => {
        if (this.lib.isValidModel(res.result.data)) {
          this.PermissionDetails = res.result.data;
          if(this.PermissionDetails.BalancePermission === null){
            this.PermissionDetails.BalancePermission ='00.00';
          }
        }
      },
      err => {
        this.lib.notification.error(err.message);
      }
    );
  }
  minutesOfDay(m: any) {
    return m.minutes() + m.hours() * 60;
  }
  btnSave_Click() {
    const now = moment(this.PermissionData.FromTime, 'hh:mm:ss a'); 
    const end = moment(this.PermissionData.ToTime, 'hh:mm:ss a'); 
    const DiffTime = this.minutesOfDay(end) - this.minutesOfDay(now);
    const BalTime = this.minutesOfDay(moment(this.PermissionDetails.BalancePermission, 'HH:mm'));

    if (this.PermissionData.StatusName === this.lib.MasterData.PermissionType.PP) {
      if (BalTime >= DiffTime && DiffTime >= 0) {
        this.PermissionData.PermissionHour = DiffTime;
      } else {
        this.PermissionData.PermissionHour = 0;
      }
    } else {
      this.PermissionData.PermissionHour = DiffTime;
    }

    if (this.lib.isValidSelectedValue(this.PermissionData.PermissionHour)) {
      this.lib.notification.confirm('Do you want to ' +(this.PermissionData.PermissionSysID === 0 ? 'Save' : 'Update') +' Staff Permission' +
          '(' + this.PermissionData.StaffName + ')',() => {
          try {
            this.http.post(this.lib.getApiUrl('payroll/permission/save'),this.PermissionData).subscribe(
                res => {
                  if (!this.showGoBack) {
                    this.lib.notification.success(res.message);
                    this.PermissionData = new mlPermissionData();
                    this.PermissionDetails = new mlPermissionDetails();
                    this.isListMode = true;
                    this.isPaidMode = false;
                    this.LoadPermissionList();
                    this.frmStaffPermission.resetForm();
                  } else {
                    this.onclose.emit();
                  }
                },
                err => {
                  this.lib.notification.error(err.message);
                }
              );
          } catch (ex) {
            this.lib.notification.error(ex.message);
          }
        },
        () => {}
      );
    } else {
      this.lib.notification.warning('InSufficient Permission');
    }
  }
  btnCancel_Click() {
    this.frmStaffPermission.resetForm();
    this.PermissionData = new mlPermissionData();
    this.PermissionDetails = new mlPermissionDetails();
    this.isListMode = true;
    this.isPaidMode = false;
  }
  btnApprove_Click(ApproveData:mlPermissionData) {
    if (this.lib.isValidModel(ApproveData)) {this.lib.notification.confirm('Do you want to Approve Staff Permission',() => {
          try {
            this.http.post(
                this.lib.getApiUrl('payroll/permission/approve'),ApproveData).subscribe(
                res => {
                  this.lib.notification.success(res.message);
                  this.PermissionList = [];
                  this.SelectedPermissionList = [];
                  this.LoadPermissionList();
                },
                err => {
                  this.lib.notification.error(err.message);
                }
              );
          } catch (ex) {
            this.lib.notification.error(ex.message);
          }
        },
        () => {}
      );
    } else {
      this.lib.notification.warning('Please select atleast 1 record');
    }
  }
  btnDelete_Click(DeleteData: mlPermissionData) {
    if (this.lib.isValidModel(DeleteData)) {
      this.lib.notification.confirm(
        'Do you want to Delete Staff Permission',
        () => {
          try {
            this.http
              .post(this.lib.getApiUrl('payroll/permission/delete'), DeleteData)
              .subscribe(
                res => {
                  this.lib.notification.success(res.message);
                  this.PermissionList = [];
                  this.SelectedPermissionList = [];
                  this.LoadPermissionList();
                },
                err => {
                  this.lib.notification.error(err.message);
                }
              );
          } catch (ex) {
            this.lib.notification.error(ex.message);
          }
        },
        () => {}
      );
    } else {
      this.lib.notification.warning('Invalid Staff Permission Data');
    }
  }
  btnGoBack_Click() {
    this.onclose.emit();
  }
}

class mlPermissionData {
  PermissionSysID: number;
  PermissionDate: string;
  StaffName: string;
  StaffID: string;
  StaffSysID: string;
  PermissionHour: number;
  FromTime: string;
  ToTime: string;
  StatusName: string;
  StatusSysID: string;
  Reason: string;
  IsApproved: boolean;
  constructor() {
    this.PermissionSysID = 0;
  }
}
class mlPermissionDetails {
  NoOfPermission: string;
  BalancePermission: string;
}

class mlSearchInfo {
  FromDate: string;
  ToDate: string;
}