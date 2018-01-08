import { Observable } from 'rxjs/Observable';
import { Idd } from './../../InterFace/ICommon';
import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms/src/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as moment from 'moment';
import * as InterFace from './../../InterFace';

@Component({
  selector: 'app-SmsNotification',
  templateUrl: 'SmsNotification.Component.html'
})
export class SmsNotification_Component implements OnInit {
  MessageModel: MessageModel;
  ViewData: ViewData;
  dsType: Array<InterFace.Idd>;
  dsClass: Array<InterFace.Ims>;
  dsSection: Array<InterFace.Ims>;
  dsTerm: Array<InterFace.Ims>;
  MobileNoCount:number;
  MessageLength:number;
  MessageCount:number;

  @ViewChild('mdSmsNotification') mdSmsNotification: ModalComponent;

  constructor(private lib: UtilityService, private http: ApiService) {
    lib.setBrowserTitle('SMS Notification');
    lib.setPageTitle('SMS Notification');
    this.MessageModel = new MessageModel();
    this.ViewData = new ViewData();
    this.MobileNoCount = 0;
    this.MessageCount = 0;
    this.MessageLength = 0;

    const Obs_ClassData = this.http.get(
      this.lib.getApiUrl(
        'dropdown/msget-yearwise-class/' +
          this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId
      )
    );
    const Obs_TermData = this.http.get(
      this.lib.getApiUrl(
        'dropdown/msFeeterm/' +
          this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId +
          '/' +
          false
      )
    );
    Observable.forkJoin([Obs_ClassData, Obs_TermData]).subscribe(
      lstRes => {
        if (this.lib.isValidList(lstRes[0].result.data)) {
          this.dsClass = lstRes[0].result.data;
        }
        if (this.lib.isValidList(lstRes[1].result.data)) {
          this.dsTerm = lstRes[1].result.data;
        }
      },
      err => {
        this.lib.notification.error(err.message);
      }
    );
  }

  ngOnInit() {}

  btnImport_Click() {
    this.dsType = [
      { id: '1', text: 'STUDENT' }
    ];
    this.ViewData = new ViewData();
    this.mdSmsNotification.open();
  }

  btnSave_Click() {
    if (this.lib.isValidModel(this.MessageModel)) {
        this.lib.notification.confirm('Do you want to send Sms-Notification ?', () => {
            try {
                this.http.post(this.lib.getApiUrl('sms-notification/save'), this.MessageModel).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.MessageModel = new MessageModel();
                        this.MobileNoCount = 0;
                        this.MessageCount = 0;
                        this.MessageLength = 0;
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
        this.lib.notification.warning('Sms_Notification Is Not valid.');
    }
  }

  btnModel_Cancel_Click() {
    this.mdSmsNotification.close();
  }
  Class_Change(event: any) {
    this.dsSection = [];
    if (this.lib.isValidSelectedValue(event.value)) {
      const selcls = event.value.join();
      if (selcls.length > 0) { this.http
        .get(
          this.lib.getApiUrl(
            'sms-notification/msget-yearwise-section/' +
              this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId +
              '/' +
              selcls
          )
        )
        .subscribe(
          res => {
            this.dsSection = res.result.data;
          },
          err => {
            this.lib.notification.error(err.message);
          }
        );
      }
    }
  }
  btnImport_Save_click() {
    if (this.lib.isValidModel(this.ViewData)) {
      const selcls = this.ViewData.selectedClass.join();
      const selSec = this.ViewData.selectedSection.join();
      this.http
        .get(
          this.lib.getApiUrl(
            'sms-notification/getMobileNo/' +
              this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId +
              '/' +
              selcls +
              '/' +
              selSec
          )
        )
        .subscribe(
          res => {
            if (this.lib.isValidList(res.result.data)) {
              this.MessageModel.MobileNo = '';
              res.result.data.forEach((mdata: any) => {
                if (this.lib.isValidSelectedValue(mdata.OfficePhone)) {
                  this.MessageModel.MobileNo += mdata.OfficePhone+' \n ';
                }
              });
              this.btnGetMobilenoCount();
            }
            this.mdSmsNotification.close();
          },
          err => {
            this.lib.notification.error(err.message);
          }
        );
    }
  }
  btnGetMobilenoCount() {
    if (this.lib.isValidSelectedValue(this.MessageModel.MobileNo)) {
      const text = this.MessageModel.MobileNo.replace(/(^[ \t]*\n)/gm, '');
      const lines = text.split(/\r|\r\n|\n/);
      this.MobileNoCount = lines.length;
    } else {
      this.MobileNoCount = 0;
    }
  }
  btnMessage() {
    if (this.lib.isValidSelectedValue(this.MessageModel.Message)) {
      this.MessageLength = this.MessageModel.Message.length;
      this.MessageCount=   Math.ceil( this.MessageModel.Message.length / 70);
    } else {
      this.MessageLength=0;
      this.MessageCount=0;
    }
  }
  btnMessage_Clear() {
    if (this.lib.isValidSelectedValue(this.MessageModel.Message)) {
      this.MessageModel.Message = '';
      this.MessageLength = 0;
      this.MessageCount=   0;
    }
  }
}

class MessageModel {
  MobileNo: string;
  Message: string;
}

class ViewData {
  Type: string;
  RouteSysID: number;
  BusSysID: number;
  ArrearType: string;
  TermSysID: number;
  ClassSysID: number;
  SectionSysID: number;
  selectedClass: string[] = [];
  selectedSection: string[] = [];
  selectedTerm: string[] = [];
}
