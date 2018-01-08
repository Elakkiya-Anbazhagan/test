// import * as helper from '../../helper/index';
import { Component, ViewChild, AfterViewInit, AfterContentInit, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, RequestOptionsArgs, ResponseContentType } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
// import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { SelectGuruComponent, ApiService, UtilityService, HttpService, IApiResponse, IApiSuccess, IApiFailure } from 'systemic/helper';


@Component({
    selector: 'exam-mark-upload',
    templateUrl: 'Exam-Mark-Upload.Component.html'
})
export class ExamMarkUploadComponent implements OnInit {

    @ViewChild('ddlClass') myClassList: SelectGuruComponent;
    @ViewChild('ddlSection') mySectionList: SelectGuruComponent;
    @ViewChild('ddlExamination') myExaminationList: SelectGuruComponent;
    @ViewChild('mdDownload') mdDownload: ModalComponent;

    public ClassData: Array<IDD>;
    public SectionData: Array<IDD>;
    public ExamData: Array<IDD>;
    public ImportErrorDetail: ImportExcelError[];
    public lstStudentMark: IStudentExamInfo[];
    public lstSubjects: IMarkInfo[];
    public hasFile: boolean;
    public ExamUploadVisiable: boolean;
    public ExamSaveVisiable: boolean;
    public MarkExcel: File;
    frmMarkUpload: FormGroup;
    ExcelBaseUrl: string;

    constructor(private http: ApiService, private helper: UtilityService, private http2: Http, private router: Router, private fb: FormBuilder) {
        this.helper.setBrowserTitle('Exam Mark Upload');
        this.helper.setPageTitle('Exam Mark Upload');
        this.ExcelBaseUrl = this.helper.GetGalleryExcelUrl('Exam');
    }

    ngOnInit() {
        this.ImportErrorDetail = [];
        this.lstStudentMark = [];
        this.ClearControl();
        this.LoadExamData();
        this.hasFile = false;
        this.ExamUploadVisiable = false;
        this.ExamSaveVisiable = true;
    }

    ClearControl() {
        this.frmMarkUpload = this.fb.group({
            ClassName: ['', Validators.required],
            SectionName: ['', Validators.required],
            ExaminationName: ['', Validators.required],
            ClassSysID: [0],
            SectionSysID: [0],
            ExamSysID: [0],
            fuMark: ['']
        });
        this.frmMarkUpload.clearValidators();
    }

    LoadClassData(ExamSysID: string, id: string = '') {
        if (this.helper.isValidSelectedValue(ExamSysID)) {
            try {
                this.http.get(this.helper.getApiUrl('Exam/Import/Class/' + ExamSysID)).subscribe(
                    (data) => {
                        this.ClassData = data.result.Data;
                        this.myClassList.selectedvalue = id;

                    }, (error) => {
                        this.helper.notification.error(error.message);
                    });
            } catch (ex) {

                this.helper.notification.error(ex.message);
            }
        }
    }

    LoadSectionData(ClassSysID: string, id: string = '', ExamSysID: string) {
        if (this.helper.isValidSelectedValue(ClassSysID) && this.helper.isValidSelectedValue(ExamSysID)) {
            try {
                this.http.get(this.helper.getApiUrl('Exam/Import/Section/' + ClassSysID + '/' + ExamSysID)).subscribe(
                    (data) => {
                        this.SectionData = data.result.Data;
                        this.mySectionList.selectedvalue = id;
                    }, (error) => {
                        this.helper.notification.error(error.message);
                    });
            } catch (ex) {

                this.helper.notification.error(ex.message);
            }
        }
    }

    LoadExamData(id: string = '') {
        try {
            this.http.get(this.helper.getApiUrl('Dropdown/Exam/true')).subscribe(
                (data) => {
                    this.ExamData = data.result.Data;
                    this.myExaminationList.selectedvalue = id;
                }, (error) => {
                    this.helper.notification.error(error.message);
                });
        } catch (ex) {

            this.helper.notification.error(ex.message);
        }
    }

    OnClassChange(event: any, ddlSection: SelectGuruComponent) {
        try {
            if (ddlSection) {
                ddlSection.selectedvalue = '';
            }
            this.SectionData = [];
            this.frmMarkUpload.controls['ClassSysID'].setValue(event.value);
            this.frmMarkUpload.controls['SectionName'].setValue('');
            this.LoadSectionData(event.value, '', this.frmMarkUpload.controls['ExamSysID'].value);
        } catch (ex) {

            this.helper.notification.error(ex.message);
        }
    }

    OnSectionChange(event: any, ddlClass: SelectGuruComponent) {
        try {
            this.frmMarkUpload.controls['SectionSysID'].setValue(event.value);
        } catch (ex) {

            this.helper.notification.error(ex.message);
        }
    }

    OnExamChange(event: any) {
        try {
            try {
                if (this.myClassList) {
                    this.myClassList.selectedvalue = '';
                }
                if (this.mySectionList) {
                    this.mySectionList.selectedvalue = '';
                }
                this.frmMarkUpload.controls['ExamSysID'].setValue(event.value);
                this.LoadClassData(event.value);
            } catch (ex) {
                this.helper.notification.error(ex.message);
            }
        } catch (ex) {

            this.helper.notification.error(ex.message);
        }
    }

    fileChange(event: any) {
        this.MarkExcel = event.target.files[0];
        this.hasFile = (this.MarkExcel !== undefined);
    }

    public GetResult(res: any): IApiSuccess {
        const response: IApiResponse = <IApiResponse>res.json();
        if (response.response !== 'success') {
            this.helper.notification.error(response.failure.message);
            throw new Error(response.failure.message);
        } else {
            return response.success;
        }
    }

    btnUpload_Click() {
        const formData: FormData = new FormData();
        if (this.hasFile) {
            formData.append('uploadFile', this.MarkExcel, this.MarkExcel.name);
            this.helper.notification.confirm('Do you want import Exam Mark file', () => {
                try {
                    const headers = new Headers()
                    const authToken = this.helper.authData().access_token;
                    headers.set('Authorization', 'Bearer ' + authToken);
                    headers.set('Accept', 'application/json');
                    const url = 'Exam/MarkImport/' + this.frmMarkUpload.controls['ClassSysID'].value
                        + '/' + this.frmMarkUpload.controls['SectionSysID'].value + '/' + this.frmMarkUpload.controls['ExamSysID'].value;
                    this.http2.post(this.helper.getApiUrl(url), formData, { headers }).subscribe(
                        (data) => {
                            // tslint:disable-next-line:prefer-const
                            let response: IApiSuccess = this.GetResult(data);
                            this.ExamUploadVisiable = true;
                            this.ExamSaveVisiable = false;
                            if (response.code === 501) {
                                this.helper.notification.error(response.message);
                                this.ImportErrorDetail = [];
                                this.ImportErrorDetail = response.result.Error;
                            } else {
                                this.helper.notification.success(response.message);
                                this.lstStudentMark = [];
                                this.lstSubjects = [];
                                this.lstStudentMark = response.result.MarkList;
                                this.lstSubjects = this.lstStudentMark[0].Mark;
                            }
                        }, (error) => {
                            this.helper.notification.error(this.GetError(error).message);
                        })
                } catch (ex) {
                    this.helper.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.helper.notification.error('Please Select Excel File');
        }
    }

    public GetError(res: any): IApiFailure {
        try {
            let failure: IApiFailure = (<IApiResponse>res.json()).failure;
            failure = {
                code: 501,
                message: 'Internal Server Error',
                description: '',
                trace: ''
            }
            return failure;
        } catch (e) {
            const failure: IApiFailure = {
                code: 500,
                message: 'Internal Server Error',
                description: '',
                trace: ''
            }
            return failure;
        }

    }

    btnSaveStudent_Click(ExamMark: IStudentExamInfo[]) {
        this.helper.notification.confirm('Do you want to insert Student', () => {
            try {
                this.http.post(this.helper.getApiUrl('Exam/SaveExamMark'), ExamMark).subscribe(
                    (data) => {
                        this.helper.notification.success(data.message);
                        this.btnGoBack_Click();
                    }, (error) => {
                        this.helper.notification.error(error.message);
                    })
            } catch (ex) {
                this.helper.notification.error(ex.message);
            }
        }, () => { });
    }

    btnGoBack_Click() {
        this.ClearControl();
        this.ImportErrorDetail = [];
        this.lstSubjects = [];
        this.lstStudentMark = [];
        this.ExamUploadVisiable = false;
        this.ExamSaveVisiable = true;
        this.hasFile = false;
    }

    btnFileDownload_Click() {
        window.open(this.helper.getApiUrl(`exam/download/sample/${this.myClassList.selectedvalue}/${this.mySectionList.selectedvalue}`));
    }
}

interface IDD {
    id: string,
    text: string
}

interface IExam {
    ExamSysID: number;
    ExamName: string;
    Locked: ILocked;
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

interface ILocked {
    LockedBy: string;
    LockedDate: string;
    LockedReason: string;
    IsLocked: boolean;
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

interface ImportError {
    Slno: string,
    Error: string
}

interface ImportExcelError {
    Slno: string,
    Type: string,
    Error: string
}

interface ImportSchemaError {
    Error: string
}