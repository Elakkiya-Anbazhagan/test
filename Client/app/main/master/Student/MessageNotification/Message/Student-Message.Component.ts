import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Idd } from './../../../../InterFace/ICommon';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { ViewChild, Component, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms';
import * as InterFace from './../../../../InterFace';
import * as moment from 'moment';

@Component({
    selector: 'Student-Message',
    templateUrl: './Student-Message.Component.html'
})

export class Student_Message_Component implements OnInit {
    ClassData: Array<InterFace.Idd>;
    SectionData: Array<InterFace.Idd>;
    StudentData: Array<InterFace.Idd>
    CategoryData: Array<InterFace.Idd>;

    @ViewChild('mdEntry') mdEntry: ModalComponent;

    IMessage: IMessage;
    MessageEntry: IMessage[];
    MessageApprovalList: IMessage[];
    SelectedMessage: IMessage[];

    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        lib.setBrowserTitle('Message Notification');
        lib.setPageTitle('Message Notification');
        this.IMessage = new IMessage();
    }

    ngOnInit() {
        this.LoadApproveData();
        this.LoadClassData();
        this.LoadCategoryData();
    }

    LoadApproveData() {
        try {
            this.MessageApprovalList = [];
            this.SelectedMessage = [];
            this.http.get(this.lib.getApiUrl('Message/ApprovalList')).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.MessageApprovalList)) {
                        this.MessageApprovalList = res.result.MessageApprovalList;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }
    }

    LoadClassData() {
        this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId + '/true')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.ClassData = res.result.data;
                    // setTimeout(() => {
                    //     this.IMessage.ClassSysID = '-1';
                    //     this.LoadSectionData(this.IMessage.ClassSysID);
                    // }, 100);
                }

            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    LoadSectionData(ClassSysID: string) {
        this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId + '/' +
            ClassSysID + '/true')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.SectionData = res.result.data;
                }

            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }

    ddlClass_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadSectionData(value);
        }
    }

    ddlSection_Change(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.LoadStudent(value);
        }
    }

    LoadStudent(SectionSysID: string) {
        try {
            this.http.get(this.lib.getApiUrl('dropdown/yearwise-student-list/' + this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId
                + '/' + this.IMessage.ClassSysID + '/' + SectionSysID + '/true')).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.StudentData = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } catch (ex) {
            this.lib.notification.error(ex);
        }
    }

    LoadCategoryData() {
        try {
            this.http.get(this.lib.getApiUrl('dropdown/GetCategory')).subscribe(
                (res) => {
                    if (this.lib.isValidList(res.result.data)) {
                        this.CategoryData = res.result.data;
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        } catch (ex) {
            this.lib.notification.error(ex);
        }
    }

    btnAdd_click() {
        this.IMessage = new IMessage();
        this.mdEntry.open();
    }

    btnMessageEdit_Click(MessageEntry: IMessage) {
        this.IMessage = MessageEntry;
        this.IMessage.CategoryName = MessageEntry.CategoryName;
        this.IMessage.CategorySysID = MessageEntry.CategorySysID;
        this.IMessage.Class = MessageEntry.Class;
        this.IMessage.ClassSysID = (MessageEntry.ClassSysID === '0' ? '-1' : MessageEntry.ClassSysID);
        this.IMessage.date = MessageEntry.date;
        this.IMessage.Message = MessageEntry.Message;
        this.IMessage.MessageSysID = MessageEntry.MessageSysID;
        this.IMessage.Section = MessageEntry.Section;
        this.IMessage.SectionSysID = (MessageEntry.SectionSysID === '0' ? '-1' : MessageEntry.SectionSysID);
        this.IMessage.Student = MessageEntry.Student;
        this.IMessage.StudentSysID = (MessageEntry.StudentSysID === '0' ? '-1' : MessageEntry.StudentSysID);
        this.IMessage.Title = MessageEntry.Title;
        setTimeout(() => {
            this.LoadSectionData((MessageEntry.ClassSysID === '0' ? '-1' : MessageEntry.ClassSysID));
            this.LoadStudent((MessageEntry.SectionSysID === '0' ? '-1' : MessageEntry.SectionSysID));
            this.mdEntry.open();
        }, 100);
    }

    btnSave_click() {
        if (this.lib.isValidModel(this.IMessage)) {
            try {
                this.lib.notification.confirm('Do you want to ' + (this.IMessage.MessageSysID === '0' ? 'insert' : 'update') + ' Message', () => {
                    this.http.post(this.lib.getApiUrl('Message/Save'), this.IMessage).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.IMessage = new IMessage();
                            this.mdEntry.close();
                            this.LoadApproveData();
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                }, () => { });
            } catch (ex) {
                this.lib.notification.error(ex);
            }
        }
    }

    btnMessageDelete_Click(MessageEntry: IMessage) {
        this.lib.notification.confirm('Do you want to Delete Message', () => {
            try {
                this.http.post(this.lib.getApiUrl('Message/Delete/' + MessageEntry.MessageSysID), '').subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadApproveData();
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            } catch (ex) {
                this.lib.notification.error(ex);
            }
        });
    }

    btnMessageApprove_Click() {
        if (this.lib.isValidList(this.SelectedMessage)) {
            try {
                this.lib.notification.confirm('Do you want to Approve Message', () => {
                    this.http.post(this.lib.getApiUrl('Message/Approve'), this.SelectedMessage).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.LoadApproveData();
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                }, () => { });
            } catch (ex) {
                this.lib.notification.error(ex);
            }
        } else {
            this.lib.notification.warning('Please select atleast one record.');
        }
    }
}

class IMessage {
    MessageSysID = '0';
    date: string;
    MessageType: string;
    Title: string;
    Message: string;
    ClassSysID: string;
    SectionSysID: string;
    StudentSysID: string;
    CategorySysID: string;
    CategoryName: string;
    Class: string;
    Section: string;
    Student: string;
}