import { AcademicData } from './../../../InterFace/IFeeCollection';
import { Component, OnInit } from '@angular/core';
import { Observable, } from 'rxjs/Observable';
import { UtilityService, ApiService } from 'systemic/helper';
import * as ml from './../../../InterFace';

@Component({
    selector: 'Exam-Mark-Approve',
    templateUrl: 'Exam_Mark_Approval.component.html'
})

export class Exam_Mark_Approvel implements OnInit {
    public lstStudentMark: IStudentExamInfo[];
    public lstSubjects: IMarkInfo[];
    public mlSearchinfo: mlSearchinfo;
    dsClassData: ml.Idd[];
    dsSectionData: ml.Idd[];
    dsExamData: ml.Idd[];

    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('Exam Mark Approval');
        this.lib.setPageTitle('Exam Mark Approval');
        this.lstStudentMark = [];
        this.mlSearchinfo = new mlSearchinfo();

    }

    ngOnInit() {
        const Obs_ExamData = this.http.get(this.lib.getApiUrl('dropdown/Exam/true'));
        Observable.forkJoin([Obs_ExamData]).subscribe(
            (lstRes) => {
                this.dsExamData = lstRes[0].result.Data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
            () => {
            }

        );
    }

    dsExamDataChanged(ddl: any) {
        this.dsClassData = [];
        if (this.lib.isValidSelectedValue(ddl.value)) {
            this.http.get(this.lib.getApiUrl('Exam/Approve/Class/' + ddl.value)).subscribe(
                (res) => {
                    this.dsClassData = res.result.Data;
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }

    dsClassDataChanged(event: any, ExamSysID: number = 0) {
        this.dsSectionData = [];
        if (this.lib.isValidSelectedValue(event.value) && this.lib.isValidSelectedValue(this.mlSearchinfo.ExamSysID)) {
            this.http.get(this.lib.getApiUrl('Exam/Approve/Section/' + event.value + '/' + this.mlSearchinfo.ExamSysID)).subscribe(
                (res) => {
                    this.dsSectionData = res.result.Data;
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }

    btnView_Click(mlSearchinfo: mlSearchinfo) {
        try {
            if (this.lib.isValidModel(this.mlSearchinfo)) {
                this.http.post(this.lib.getApiUrl('Exam/GetAprovalMarkList/' + this.mlSearchinfo.ClassSysID
                    + '/' + this.mlSearchinfo.SectionSysID
                    + '/' + this.mlSearchinfo.ExamSysID), '').subscribe(
                    (res) => {
                        this.lstStudentMark = res.result.ApprovalList;
                        this.lstSubjects = this.lstStudentMark[0].Mark;

                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }
        } catch (ex) {

            this.lib.notification.error(ex.message);
        }
    }

    btnMarkApprove_Click() {
        this.lib.notification.confirm('Do you want to Approve Mark', () => {
            try {
                this.http.post(this.lib.getApiUrl('Exam/ApproveExam'), this.lstStudentMark).subscribe(
                    (data) => {
                        this.lib.notification.success(data.message);
                        this.btnCancel_Click();
                    }, (error) => {
                        this.lib.notification.error(error.message);
                    })
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
    btnCancel_Click() { }

}


class mlSearchinfo {
    ExamSysID: number;
    ExamName: string;
    ClassSysID: number;
    ClassName: string;
    SectionSysID: number;
    SectionName: string;

}

interface IMarkEntry {
    StudentName: string;
    StudentSysId: number;
    ClassSysId: number;
    SectionSysId: number;
    Theory: number;
    Practical: number;
    Assessment: number;
    Total: number;
    Grade: string;
}

interface IStudentExamInfo {
    ExamSysID: number;
    StudentSysID: number;
    StudentName: string;
    AdmissionNo: string;
    ClassSysID: number;
    ClassName: string;
    SectionSysID: number;
    SectionName: string;
    Mark: IMarkInfo[];
}

interface IMarkInfo {
    StudentSysID: number;
    SubjectSysID: number;
    SubjectName: string;
    Theory: number;
    Practical: number;
    Assessment: number;
    Total: number;
    Grade: string;
}

interface IExamSubject {
    Name: string;
}