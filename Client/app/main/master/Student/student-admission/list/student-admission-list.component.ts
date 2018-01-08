import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgForm } from '@angular/forms';

import { UtilityService, ApiService } from 'systemic/helper';
import * as ml from '../../../../InterFace';

@Component({
    selector: 'student-admission-list',
    templateUrl: './student-admission-list.component.html'
})

export class Student_Admission_List_Component implements OnInit {
    isAllowCancel: boolean;
    isAllowEdit: boolean;
    isAllowAdd: boolean;

    public AdmissionList: ml.AdmissionInfo[];
    public mlAdmission: ml.AdmissionInfo;
    AcademicYearID: ml.Idd[];
    IsAdmissionMode: boolean;
    ActiveAcademicYearSysID: number;
    StudentSysID = 0;
    EnquirySysID = 0;
    @ViewChild('mdCancelAdmission') mdCancelAdmission: ModalComponent;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        this.mlAdmission = new ml.AdmissionInfo();
        lib.setBrowserTitle('Admission List');
        lib.setPageTitle('Admission List');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
            this.isAllowCancel = this.lib.isActionAllowed('Cancel');
        });
    }

    ngOnInit() {

        const Params = this.lib.getParams();
        if (!this.lib.isNullOrUndefined(Params)) {
            const EnquirySysID = Params['EnquirySysID'];
            if (!this.lib.isNullOrUndefined(EnquirySysID)) {
                this.EnquirySysID = EnquirySysID;
                this.StudentSysID = 0;
                this.IsAdmissionMode = true;
            } else {
                this.EnquirySysID = 0;
                this.LoadInit();
            }
        } else {
            this.EnquirySysID = 0;
            this.LoadInit();
        }
    }

    LoadInit() {

        this.LoadAcademicYear();
    }

    LoadData(AcademicyearID: any) {
        this.http.get(this.lib.getApiUrl('student/admission/list/' + AcademicyearID)).subscribe(
            (res) => {
                this.AdmissionList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    LoadAcademicYear() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.AcademicYearID = res.result.data;
                setTimeout(() => {
                    this.ActiveAcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
                    this.AcademicYearChanged(this.ActiveAcademicYearSysID);
                }, 100);
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    AcademicYearChanged(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadData(value);
        }
    }
    dtRowCommand_Click(cmdName: string, data: ml.AdmissionInfo, frm: NgForm) {
        if (cmdName === 'Edit Admission') {
            this.StudentSysID = data.StudentSysID;
            this.IsAdmissionMode = true;
        } else if (cmdName === 'Cancel Admission') {
            frm.reset();
            this.mlAdmission = data;
            this.mdCancelAdmission.open();
        }
    }

    frmCancelAdmission_Submit(frm: NgForm) {
        const confirmMsg = 'Do you want to cancel admission of <br /> <b>' + this.mlAdmission.StudentName + '(' + this.mlAdmission.AdmissionNo + ') </b>';
        this.lib.notification.confirm(confirmMsg, () => {
            this.http.post(this.lib.getApiUrl('student/admission/cancel'), this.mlAdmission).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    frm.resetForm();
                    this.mdCancelAdmission.close();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }, () => { });
    }

    btnCloseCancelAdmission_Click(frm: NgForm) {
        frm.resetForm();
        this.mdCancelAdmission.close();
    }
    onAdmissionClose() {
        this.IsAdmissionMode = false;
        this.lib.setBrowserTitle('Admission List');
        this.lib.setPageTitle('Admission List');
    }
}
