
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';


@Component({
    selector: 'Staff-Registration',
    templateUrl: './Staff_Registration.Component.html'
})
export class Staff_Registration_Component implements OnInit {
    isAllowUnLock: boolean;
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    isAllowLock: boolean;
    EmployeeCode: number;
    dsShift: Array<InterFace.Idd>;
    dsStaffType: Array<InterFace.Idd>;
    dsDepartment: Array<InterFace.Idd>;
    dsDesignation: Array<InterFace.Idd>;
    dsPayMode: Array<InterFace.Idd>;
    dsAccount: Array<InterFace.Idd>;
    @ViewChild('mdLock') mdLock: ModalComponent;
    @ViewChild('mdStafflist') mdStafflist: ModalComponent;
    @ViewChild('frmStaffEntry') frmStaffEntry: NgForm;
    public StaffList: IStaff[];
    public UnMappedStaffList: UnMappedStaffList[];
    public StaffEntry: IStaff;
    public LockData: IStaff;
    public isListMode: boolean;
    public IDesignationData: IDesignationData;
    public mlStaffSyncDetails: StaffSyncDetails;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Staff Registration');
        lib.setPageTitle('Staff Registration');
        this.isListMode = true;
        this.EmployeeCode = 0;
    }
    ngOnInit() {
        this.StaffList = [];
        this.StaffEntry = new IStaff();
        this.LockData = new IStaff;
        this.LoadData();
        this.dsShift = [];
        this.dsStaffType = [];
        this.dsDepartment = [];
        this.dsDesignation = [];
        this.dsPayMode = [];
        this.dsAccount = [];
        const Obs_ShiftData = this.http.get(this.lib.getApiUrl('payroll/Designation/shift'));
        const Obs_StaffTypeData = this.http.get(this.lib.getApiUrl('payroll/staff/staff-type'));
        const Obs_DepartmentData = this.http.get(this.lib.getApiUrl('payroll/staff/staff-department'));
        const Obs_DesignationData = this.http.get(this.lib.getApiUrl('payroll/staff/staff-designation'));
        const Obs_PaymentTypeData = this.http.get(this.lib.getApiUrl('dropdown/mastertype/Payment_Mode'));
        const Obs_AccountData = this.http.get(this.lib.getApiUrl('dropdown/accounttype'));
        Observable.forkJoin([Obs_ShiftData, Obs_StaffTypeData, Obs_DepartmentData, Obs_DesignationData, Obs_PaymentTypeData, Obs_AccountData]).subscribe(
            (lstRes) => {
                if (this.lib.isValidList(lstRes[0].result.data)) {
                    this.dsShift = lstRes[0].result.data;
                }
                if (this.lib.isValidList(lstRes[1].result.data)) {
                    this.dsStaffType = lstRes[1].result.data;
                }
                if (this.lib.isValidList(lstRes[2].result.data)) {
                    this.dsDepartment = lstRes[2].result.data;
                }
                if (this.lib.isValidList(lstRes[3].result.data)) {
                    this.dsDesignation = lstRes[3].result.data;
                }
                if (this.lib.isValidList(lstRes[4].result.data)) {
                    this.dsPayMode = lstRes[4].result.data;
                }
                if (this.lib.isValidList(lstRes[5].result.data)) {
                    this.dsAccount = lstRes[5].result.data;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
        );
    }
    btnAdd_Click() {
        this.isListMode = false;
        this.StaffEntry = new IStaff();
        this.EmployeeCode = 0;
    }
    btnAddDeviceStaff_Click() {
        this.LoadUnRegisteredStaffList();
        this.EmployeeCode = 0;
        this.mdStafflist.open();
    }
    btnStaffAdd_Click(StaffList: UnMappedStaffList) {
        this.isListMode = false;
        this.StaffEntry = new IStaff();
        this.StaffEntry.BioID = parseInt(StaffList.EmployeeId, 0);
        this.StaffEntry.StaffName = StaffList.EmployeeName;
        this.EmployeeCode = parseInt(StaffList.EmployeeCode, 0);;
        this.mdStafflist.close();
    }
    LoadData() {
        this.StaffList = [];
        this.http.get(this.lib.getApiUrl('payroll/staff/readall')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.StaffList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnStaff_Device_Sync_Click(SyncData: IStaff) {
        this.mlStaffSyncDetails = new StaffSyncDetails();
        if (this.lib.isValidModel(SyncData)) {
            this.mlStaffSyncDetails.BioID = SyncData.BioID;
            this.mlStaffSyncDetails.StaffID = SyncData.StaffID;
            this.mlStaffSyncDetails.StaffSysID = SyncData.StaffSysID;
            this.mlStaffSyncDetails.StaffName = SyncData.StaffName;
            this.lib.notification.confirm('Do you want to sync ' + this.mlStaffSyncDetails.StaffName + ' to ESSL device.', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/staff/staff-device-sync'), this.mlStaffSyncDetails).subscribe(
                        (res) => {
                                this.lib.notification.success(res.message);
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.lib.notification.warning('Staff data is invalid');
        }

    }
    LoadUnRegisteredStaffList() {
        this.UnMappedStaffList = [];
        this.http.get(this.lib.getApiUrl('payroll/staff/unregistered')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.UnMappedStaffList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnSave_click() {
        this.lib.notification.confirm('Do you want to ' + (this.StaffEntry.StaffSysID === 0 ? 'Save' : 'Update') + ' Payroll-Staff' +
            '(' + this.StaffEntry.StaffName + ')', () => {
                try {
                    this.http.post(this.lib.getApiUrl('payroll/staff/save'), this.StaffEntry).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.StaffEntry = new IStaff();
                            this.isListMode = true;
                            this.LoadData();
                            this.EmployeeCode = 0;
                            this.frmStaffEntry.resetForm();
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
        this.StaffEntry = new IStaff();
        this.isListMode = true;
    }

    btnEdit_Click(StaffList: IStaff) {
        this.StaffEntry.StaffSysID = StaffList.StaffSysID;
        this.StaffEntry.BioID = StaffList.BioID;
        this.StaffEntry.StaffID = StaffList.StaffID;
        this.StaffEntry.StaffName = StaffList.StaffName;
        this.StaffEntry.ShiftSysID = StaffList.ShiftSysID;
        this.StaffEntry.IsAllowLeaveReduction = StaffList.IsAllowLeaveReduction;
        this.StaffEntry.IsAllowPermissionReduction = StaffList.IsAllowPermissionReduction;
        this.StaffEntry.NoOfLeaveCL = StaffList.NoOfLeaveCL;
        this.StaffEntry.NoOfLeaveEL = StaffList.NoOfLeaveEL;
        this.StaffEntry.NoOfPermission = StaffList.NoOfPermission;
        this.StaffEntry.BasicPay = StaffList.BasicPay;
        this.StaffEntry.GradePay = StaffList.GradePay;
        this.StaffEntry.DA = StaffList.DA;
        this.StaffEntry.CA = StaffList.CA;
        this.StaffEntry.HRA = StaffList.HRA;
        this.StaffEntry.MA = StaffList.MA;
        this.StaffEntry.IsAllowPFReduction = StaffList.IsAllowPFReduction;
        this.StaffEntry.IsAllowEsiReduction = StaffList.IsAllowEsiReduction;
        this.StaffEntry.IsAllowTDSReduction = StaffList.IsAllowTDSReduction;
        this.StaffEntry.GraceHours = StaffList.GraceHours;
        this.StaffEntry.DepartmentSysID = StaffList.DepartmentSysID;
        this.StaffEntry.DesignationSysID = StaffList.DesignationSysID;
        this.StaffEntry.StaffTypeSysID = StaffList.StaffTypeSysID;
        this.StaffEntry.AccountSysID = StaffList.AccountSysID;
        this.StaffEntry.PayModeSysID = StaffList.PayModeSysID;
        this.StaffEntry.MobileNo = StaffList.MobileNo;
        this.StaffEntry.JoinDate = StaffList.JoinDate;
        this.isListMode = false;
    }
    Designation_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.IDesignationData = new IDesignationData();
            this.http.get(this.lib.getApiUrl('payroll/staff/designation/' + value)).subscribe(
                (res) => {
                    if (this.lib.isValidModel(res.result.data)) {
                        this.IDesignationData = res.result.data;
                        this.StaffEntry.ShiftSysID = this.IDesignationData.ShiftSysID;
                        this.StaffEntry.IsAllowLeaveReduction = this.IDesignationData.IsAllowLeaveReduction;
                        this.StaffEntry.IsAllowPermissionReduction = this.IDesignationData.IsAllowPermissionReduction;
                        this.StaffEntry.NoOfLeaveCL = this.IDesignationData.NoOfLeaveCL;
                        this.StaffEntry.NoOfLeaveEL = this.IDesignationData.NoOfLeaveEL;
                        this.StaffEntry.NoOfPermission = this.IDesignationData.NoOfPermission;
                        this.StaffEntry.BasicPay = this.IDesignationData.BasicPay;
                        this.StaffEntry.GradePay = this.IDesignationData.GradePay;
                        this.StaffEntry.DA = this.IDesignationData.DA;
                        this.StaffEntry.CA = this.IDesignationData.CA;
                        this.StaffEntry.HRA = this.IDesignationData.HRA;
                        this.StaffEntry.MA = this.IDesignationData.MA;
                        this.StaffEntry.IsAllowPFReduction = this.IDesignationData.IsAllowPFReduction;
                        this.StaffEntry.IsAllowEsiReduction = this.IDesignationData.IsAllowEsiReduction;
                        this.StaffEntry.IsAllowTDSReduction = this.IDesignationData.IsAllowTDSReduction;
                        this.StaffEntry.GraceHours = this.IDesignationData.GraceHours;
                        this.StaffEntry.DesignationSysID = this.IDesignationData.DesignationSysID.toString();
                        this.StaffEntry.AccountSysID = this.IDesignationData.AccountSysID;
                        this.StaffEntry.PayModeSysID = this.IDesignationData.PayModeSysID;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }

    }
    btnLock_Click(StaffList: IStaff, frmStaffLock: NgForm) {
        this.LockData = new IStaff();
        this.LockData = StaffList;
        frmStaffLock.resetForm();
        if (!StaffList.Locked.IsLocked) {
            this.mdLock.open();
        } else {
            this.LockStaff()
            this.LoadData();
        }
    }

    LockStaff() {
        this.LockData.Locked.IsLocked = !this.LockData.Locked.IsLocked;
        if (this.lib.isValidModel(this.LockData)) {
            this.lib.notification.confirm('Do you want to ' + (this.LockData.Locked.IsLocked ? 'Lock' : 'Unlock') +
                ' Payroll-Staff' + '(' + this.LockData.StaffName + ')', () => {
                    try {
                        this.http.post(this.lib.getApiUrl('payroll/staff/Lock'), this.LockData).subscribe(
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
        } else {
            this.lib.notification.error('Lock Data is invalid');
        }
    }

    Chk_Leave_Change() {
        this.StaffEntry.NoOfLeaveCL = 0;
        this.StaffEntry.NoOfLeaveEL = 0;
    }

    Chk_Permission_Change() {
        this.StaffEntry.NoOfPermission = 0;
    }
}

class UnMappedStaffList {
    StaffSysID: string;
    EmployeeId: string;
    EmployeeName: string;
    EmployeeCode: string;
}
class IStaff {
    StaffSysID: number;
    BioID: number;
    StaffID: number;
    StaffName: string;
    MobileNo: string;
    JoinDate: string;
    Locked: InterFace.ILock;
    StaffTransSysID: number;
    Designation: string;
    DesignationSysID: string;
    Department: string;
    DepartmentSysID: string;
    StaffType: string;
    StaffTypeSysID: string;
    ShiftName: string;
    ShiftSysID: string;
    IsAllowLeaveReduction: boolean;
    IsAllowPermissionReduction: boolean;
    NoOfLeaveCL: number;
    NoOfLeaveEL: number;
    NoOfPermission: number;
    BasicPay: number;
    GradePay: number;
    DA: number;
    CA: number;
    HRA: number;
    MA: number;
    Salary: number;
    AccountSysID: string;
    Paymode: string;
    PayModeSysID: string;
    GraceHours: number;
    IsAllowPFReduction: boolean;
    IsAllowEsiReduction: boolean;
    IsAllowTDSReduction: boolean;
    BranchSysID: number;
    FromDate: string;
    ToDate: string;
    IsActive: boolean;
    constructor() {
        this.Locked = new InterFace.ILock();
        this.StaffSysID = 0;
    }
}

class IDesignationData {
    DesignationSysID: number;
    Designation: string;
    ShiftSysID: string;
    IsAllowLeaveReduction: boolean;
    IsAllowPermissionReduction: boolean;
    NoOfLeaveCL: number;
    NoOfLeaveEL: number;
    NoOfPermission: number;
    BasicPay: number;
    GradePay: number;
    DA: number;
    CA: number;
    HRA: number;
    MA: number;
    IsAllowPFReduction: boolean;
    IsAllowEsiReduction: boolean;
    IsAllowTDSReduction: boolean;
    GraceHours: number;
    AccountSysID: string;
    PayModeSysID: string;
}
class StaffSyncDetails {
    StaffSysID: number;
    BioID: number;
    StaffID: number;
    StaffName: string;
}