import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { SelectItem } from 'primeng/primeng';


@Component({
    selector: 'ExamMark',
    templateUrl: 'Exam_Entry.component.html'

})

export class Exam_Entry_Component implements OnInit {
    @ViewChild('mdExamEntry') mdExamEntry: ModalComponent;
    public isEditMode: boolean;
    public mlExam: IExam;
    public ExamMarkList: IExam[];
    PanelEntry: Boolean = false;
    PanelList: Boolean = true;

    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('Exam Entry');
        this.lib.setPageTitle('Exam Entry');
        this.mlExam = new IExam();
        this.ExamMarkList = [];
    }

    ngOnInit() {
        this.LoadData();
    }
    btnAdd_Click() {
        this.mlExam = new IExam();
        this.isEditMode = false;
        this.mdExamEntry.open();
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('Exam/ReadAll')).subscribe(
            (res) => {
                this.ExamMarkList = [];
                this.ExamMarkList = res.result.Exam;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    btnEdit_Click(List: IExam) {
        this.mlExam.ExamSysID = List.ExamSysID;
        if (this.lib.isNullOrUndefined(this.mlExam.ExamSysID)) {
            this.mlExam.ExamSysID = List.ExamSysID;
        }
        this.mlExam.ExamName = List.ExamName;
        this.isEditMode = true;
        this.mdExamEntry.open();
    }
    btnSave_click(Exam: IExam, fromdata: NgForm) {
        if (!this.lib.isNullOrUndefined(this.mlExam)) {
            this.lib.notification.confirm('Do you want to ' + (this.mlExam.ExamSysID === 0 ? 'insert' : 'Update ') + ' Exam' + '(' + this.mlExam.ExamName + ')', () => {
                try {
                    this.http.post(this.lib.getApiUrl('Exam/SaveExam'), this.mlExam).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            fromdata.resetForm();
                            this.mdExamEntry.close();
                            this.LoadData();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => {

            });
        }
    }
    btnDelete_Click(mlExam: IExam) {
        this.lib.notification.confirm('Do you want to delete ' + (mlExam.ExamName), () => {
            try {
                this.http.post(this.lib.getApiUrl('Exam/delete/' + mlExam.ExamSysID), this.mlExam).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
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



    BtnCancel_Click() {
        this.mlExam = new IExam();
        this.PanelEntry = false;
    }
}

class IExam {
    ExamSysID: number;
    ExamName: string;
    Locked: ILocked;
}

export interface ILocked {
    LockedBy: string;
    LockedDate: string;
    LockedReason: string;
    IsLocked: boolean;
}