import { Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

import * as InterFace from './../../InterFace/Index';

@Component({
    selector: 'homework-Entry',
    templateUrl: './home_work_enrty.compoent.html'
})

export class HomeWork_Entry_Component implements OnInit {
    public mlSerachInfo: mlSerachInfo;
    public dsClass: Array<InterFace.Idd>;
    public dsSection: Array<InterFace.Idd>;
    PanelVisiable: boolean;
    IsEditMode: boolean;
    public Assignment: AssignmentInformation;
    public dsAssignmentApprovalList: mlApprovalList[];
    public SelectedAssignmentApprovalList: mlApprovalList[];
    public AcademicYearSysID: number;
    AssignmentDate: string;
    constructor(public lib: UtilityService, private http: ApiService) {
        this.Assignment = new AssignmentInformation();
        this.mlSerachInfo = new mlSerachInfo();
        this.PanelVisiable = true;
        this.dsAssignmentApprovalList = [];
        this.SelectedAssignmentApprovalList = [];
        this.lib.setBrowserTitle('Home Work Entry');
        this.lib.setPageTitle('Home Work Entry');
        this.Assignment.Date = moment().format('DD-MM-YYYY');
        this.AssignmentDate = moment().format('DD-MM-YYYY');
        this.LoadData();
        this.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId;
        const Obs_classData = this.http.get(this.lib.getApiUrl('dropdown/get-class'));
        Observable.forkJoin([Obs_classData]).subscribe(
            (lstRes) => {
                this.dsClass = lstRes[0].result.data;
            },
        );
    }

    ngOnInit() {
        this.Assignment = new AssignmentInformation();
    }

    LoadData() {
        this.dsAssignmentApprovalList = [];
        if (this.lib.isValidList(this.dsAssignmentApprovalList)) { }
        this.http.get(this.lib.getApiUrl('Homework/ApprovalList/' + this.AssignmentDate)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dsAssignmentApprovalList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    dsClassDataChanged(event: any, SectionSysID: number = 0) {
        if (this.lib.isValidSelectedValue && !this.lib.isNullOrUndefined(this.AcademicYearSysID)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.AcademicYearSysID + '/' + event.value + '/ true')).subscribe(
                (res) => {
                    this.dsSection = res.result.data;
                    setTimeout(() => {
                        if (this.lib.isValidSelectedValue(SectionSysID)) {
                            this.Assignment.SectionSysID = SectionSysID;
                            this.LoadAssignmentInfo();
                        } else {
                            this.Assignment.SectionSysID = -1;
                        }
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    btnAdd_click() {
        this.PanelVisiable = false;
        this.IsEditMode = false;
        this.Assignment = new AssignmentInformation();
        this.Assignment.Date = moment().format('DD-MM-YYYY');
    }

    btnView_click() {
        this.LoadAssignmentInfo();
    }

    LoadAssignmentInfo() {
        if (this.lib.isValidModel(this.Assignment) && (this.lib.isValidList(this.Assignment.WorkList))) { }
        this.http.post(this.lib.getApiUrl('Homework/GetInfo'), this.Assignment).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.Assignment.WorkList = res.result.data.WorkList;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnSave_Click(Assignment: AssignmentInformation) {
        this.lib.notification.confirm('Do you want to ' + (this.Assignment.AssignmentSysID === 0 ? 'Update' : 'Save') + ' Home-Work', () => {
            try {
                this.http.post(this.lib.getApiUrl('Homework/Save'), this.Assignment).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.Assignment = new AssignmentInformation();
                        this.PanelVisiable = true;
                        this.dsAssignmentApprovalList = [];
                        this.LoadData();
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

    btnApprove_click() {
        if (this.lib.isValidList(this.SelectedAssignmentApprovalList)) {
            this.lib.notification.confirm('Do you want to Approve Home-Work', () => {
                try {
                    this.http.post(this.lib.getApiUrl('Homework/approve'), this.SelectedAssignmentApprovalList).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.Assignment = new AssignmentInformation();
                            this.PanelVisiable = true;
                            this.dsAssignmentApprovalList = [];
                            this.SelectedAssignmentApprovalList = [];
                            this.LoadData();
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
            this.lib.notification.warning('Please select atleast 1 record...');

        }
    }

    btnEdit_Click(AssignmentList: mlApprovalList) {
        this.Assignment = new AssignmentInformation();
        this.Assignment.ClassSysID = AssignmentList.ClassSysID;
        this.Assignment.Date = AssignmentList.AssignmentDate;
        this.dsClassDataChanged({ value: AssignmentList.ClassSysID }, AssignmentList.SectionSysID);
        this.PanelVisiable = false;
        this.IsEditMode = true;
    }

    btnClose_Click() {
        this.PanelVisiable = true;
    }

    btnDelete_Click(AssignmentList: mlApprovalList) {
        if (this.lib.isValidModel(AssignmentList)) {
            this.lib.notification.confirm('Do you want to Delete Home-Work', () => {
                this.http.post(this.lib.getApiUrl('Homework/delete/' + AssignmentList.AssignmentSysID)).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.dsAssignmentApprovalList = [];
                        this.LoadData();
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }, () => { });
        }
    }
}

class mlSerachInfo {
    Date: string;
    ClassSysID: string;
    SectionSysID: string;

}
class mlApprovalList {
    ClassSysID: number;
    ClassName: string;
    SectionSysID: number;
    SectionName: string;
    AssignmentDate: string;
    Subject: string;
    Class: string;
    AssignmentSysID: number;

}

class AssignmentInformation {
    AssignmentSysID: number;
    ClassSysID: number;
    SectionSysID: number;
    StudentSysID: number;
    Date: string;
    ApprovedDate: string;
    BranchSysID: number;
    WorkList: WorkList[];
    AssignmentInformation() {
        this.WorkList = [];
    }

}
class WorkList {
    AssignmentDetailSysID: number;
    SubjectSysID: number;
    SubjectName: string;
    Work: string;
    ReferenceURL: string;
}

