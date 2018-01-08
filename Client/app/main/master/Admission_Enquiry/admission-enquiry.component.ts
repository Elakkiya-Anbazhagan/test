import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ViewChild, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
import 'rxjs/add/observable/of';
import { UtilityService, ApiService } from 'systemic/helper';
import * as ml from './../../InterFace';
import * as InterFace from './../../InterFace';

@Component({
    selector: 'Admission-Enquiry',
    templateUrl: 'admission-enquiry.component.html'
})

export class Admission_Enquiry_Component implements OnInit {
    isAllowEditEnquiry: boolean;
    isAllowNewEnquiry: boolean;
    isAllowAdmission: boolean;
    isAllowCancelApplication: boolean;
    isAllowIssueApplication: boolean;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    public mlEnquiry: mlenquiryInfo;
    public mlCancelEnquiry: mlenquiryInfo;
    public EnquiryList: mlenquiryInfo[];
    Country: Array<InterFace.Idd>
    State: Array<InterFace.Idd>
    City: Array<InterFace.Idd>
    dsMemberData: Array<InterFace.Idd>
    dsClass: Array<InterFace.Idd>;
    dsAcademic: Array<InterFace.Idd>;
    PanelList: Boolean = true;
    PanelEntry: Boolean = false;
    public isEditMode: boolean;
    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('Enquiry Entry');
        this.lib.setPageTitle('Enquiry Entry');
        this.mlEnquiry = new mlenquiryInfo();
        this.mlCancelEnquiry = new mlenquiryInfo();
        this.EnquiryList = [];

        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowIssueApplication = this.lib.isActionAllowed('Issue Application');
            this.isAllowCancelApplication = this.lib.isActionAllowed('Cancel Application');
            this.isAllowAdmission = this.lib.isActionAllowed('Convert Admission');
            this.isAllowNewEnquiry = this.lib.isActionAllowed('New Enquiry');
            this.isAllowEditEnquiry = this.lib.isActionAllowed('Edit Enquiry');
        });
    }

    ngOnInit() {
        this.mlEnquiry.ToDate = moment().format('DD/MM/YYYY');
        this.mlEnquiry.FromDate = moment().add(-1, 'M').format('DD/MM/YYYY');

        this.LoadData();
        this.LoadCountry();
        const Obs_classData = this.http.get(this.lib.getApiUrl('dropdown/get-class'));
        const Obs_AcademicData = this.http.get(this.lib.getApiUrl('dropdown/academicyear/false'));
        Observable.forkJoin([Obs_classData, Obs_AcademicData]).subscribe(
            (lstRes) => {
                this.dsClass = lstRes[0].result.data;
                this.dsAcademic = lstRes[1].result.data;

            },
        );
    }

    LoadData() {
        encodeURIComponent(this.mlEnquiry.FromDate)
        const url = 'Enquiry-Admission/enquiry/readall?FromDate=' + encodeURIComponent(this.mlEnquiry.FromDate) + '&ToDate=' + encodeURIComponent(this.mlEnquiry.ToDate)
        this.http.get(this.lib.getApiUrl(url)).subscribe(
            (res) => {
                this.EnquiryList = [];
                this.EnquiryList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    CountryChange(event: any) {
        this.State = [];
        this.City = [];
        if (event.value && event.value !== '') {
            this.LoadState(event.value);
        }
    }
    StateChange(event: any) {
        this.City = [];
        if (event.value && event.value !== '') {
            this.LoadCity(event.value);
        }
    }
    LoadCountry(CountrySysID?: string, StateSysID?: string, CitySysID?: string) {
        this.State = [];
        this.City = [];
        this.http.get(this.lib.getApiUrl('dropdown/country')).subscribe(
            (res) => {
                this.Country = res.result.data;

                if (CountrySysID !== undefined) {
                    if (this.lib.isValidSelectedValue(CountrySysID)) {
                        setTimeout(() => {
                            this.mlEnquiry.CountrySysID = CountrySysID;
                            this.LoadState(CountrySysID, StateSysID, CitySysID);
                        }, 100);
                    }
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadState(CountrySysID: string, StateSysID?: string, CitySysID?: string) {
        this.City = [];
        if (CountrySysID) {
            this.http.get(this.lib.getApiUrl('dropdown/state/' + CountrySysID)).subscribe(
                (res) => {
                    this.State = res.result.data;
                    if (StateSysID !== undefined) {
                        if (this.lib.isValidSelectedValue(StateSysID)) {
                            setTimeout(() => {
                                this.mlEnquiry.StateSysID = StateSysID;
                                this.LoadCity(StateSysID, CitySysID);
                            }, 100);
                        }
                    }
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }
    LoadCity(StateSySID: string, CitySysID?: string) {
        if (StateSySID) {
            this.http.get(this.lib.getApiUrl('dropdown/city/' + StateSySID)).subscribe(
                (res) => {
                    this.City = res.result.data;
                    if (CitySysID !== undefined) {
                        if (this.lib.isValidSelectedValue(CitySysID)) {
                            setTimeout(() => {
                                this.mlEnquiry.CitySysID = CitySysID;
                            }, 100);
                        }
                    }
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }
    btnAdd_Click() {
        this.State = [];
        this.City = [];
        this.PanelEntry = true;
        this.PanelList = false;
        this.mlEnquiry = new mlenquiryInfo();
        this.mlEnquiry.EnquiryDate = moment(new Date()).format('DD/MM/YYYY');
        this.isEditMode = false;
        this.mlEnquiry.AcademicYearSysID = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
    }
    btnSave_click(Enquiry: mlenquiryInfo, fromdata: NgForm) {
        if (this.mlEnquiry._IsApplicationIssued === '1') {
            this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + this.mlEnquiry.AcademicYearSysID)).subscribe(
                (res) => {
                    if (res.result.data.isMiscellaneousFeeApproved === true) {
                        this.Save(Enquiry, fromdata);
                    } else {
                        this.lib.notification.warning('Miscellaneous Fee Not Approved For Selected Academic YearID');
                    }
                }, (err) => {
                    this.lib.notification.error(err.message);
                });

        } else {
            this.Save(Enquiry, fromdata);
        }
    }
    Save(Enquiry: mlenquiryInfo, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.isEditMode ? 'Update ' : 'Save ') + 'Enquiry', () => {
            try {
                if (this.mlEnquiry._IsApplicationIssued === '1') {
                    this.mlEnquiry.IsApplicationIssued = true;

                } else {
                    this.mlEnquiry.IsApplicationIssued = false;
                }
                this.http.post(this.lib.getApiUrl('Enquiry-Admission/enquiry/save'), this.mlEnquiry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        fromdata.resetForm();
                        this.PanelList = true;
                        this.PanelEntry = false;
                        this.mlEnquiry.ToDate = moment().format('DD/MM/YYYY');
                        this.mlEnquiry.FromDate = moment().add(-1, 'M').format('DD/MM/YYYY');
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
        this.PanelList = true;
        this.PanelEntry = false;
    }
    btnEdit_Click(Enquiry: mlenquiryInfo) {
        this.mlEnquiry.EnquirySysID = Enquiry.EnquirySysID;
        this.mlEnquiry.EnquiryDate = Enquiry.EnquiryDate;
        this.mlEnquiry.StudentName = Enquiry.StudentName;
        this.mlEnquiry.ParentName = Enquiry.ParentName;
        this.mlEnquiry.ClassSysID = Enquiry.ClassSysID;
        this.mlEnquiry.AcademicYearSysID = Enquiry.AcademicYearSysID;
        this.mlEnquiry.Address1 = Enquiry.Address1;
        this.mlEnquiry.Address2 = Enquiry.Address2;

        this.mlEnquiry.Pincode = Enquiry.Pincode;
        this.mlEnquiry.Mobile = Enquiry.Mobile;
        this.mlEnquiry.AlternateMobileNo = Enquiry.AlternateMobileNo;
        this.mlEnquiry.Email = Enquiry.Email;
        this.mlEnquiry.Gender = Enquiry.Gender;
        this.mlEnquiry.Phone = Enquiry.Phone;
        this.mlEnquiry.SchoolName = Enquiry.SchoolName;
        this.mlEnquiry.DOB = Enquiry.DOB;

        this.LoadCountry(Enquiry.CountrySysID, Enquiry.StateSysID, Enquiry.CitySysID);

        this.isEditMode = true;
        this.PanelList = false;
        this.PanelEntry = true;
        setTimeout(() => {

        }, 100);
        if (Enquiry.IsApplicationIssued === true) {

            this.mlEnquiry._IsApplicationIssued = '1';
        } else {
            this.mlEnquiry._IsApplicationIssued = '0';

        }
    }
    BtnSearch() {
        this.LoadData();
    }
    btnCancelReceipt_Click(Enquiry: mlenquiryInfo) {
        this.mlCancelEnquiry = new mlenquiryInfo();
        this.mlCancelEnquiry = Enquiry;
        this.mdCancel.open();
    }
    BtnApplicationCanel() {
        this.lib.notification.confirm('Do you want to Cancel Enquiry', () => {
            try {
                this.http.post(this.lib.getApiUrl('Enquiry-Admission/enquiry/Enquiry-cancel'), this.mlCancelEnquiry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.PanelList = true;
                        this.PanelEntry = false;
                        this.mdCancel.close();
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
    BtnApplicationIssue(Enquiry: mlenquiryInfo) {
        this.http.get(this.lib.getApiUrl('fees/academic-fees-structure/academicYearFeeStructureStatus/' + Enquiry.AcademicYearSysID)).subscribe(
            (res) => {
                if (res.result.data.isMiscellaneousFeeApproved === true) {
                    this.ApplicationIssue(Enquiry);
                } else {
                    this.lib.notification.warning(Enquiry.AcademicYearID + ' Miscellaneous Fee Not Approved ');
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    ApplicationIssue(Enquiry: mlenquiryInfo) {
        this.lib.notification.confirm('Do you want to Issue Application ?', () => {
            try {
                Enquiry.IsApplicationIssued = true;
                this.http.post(this.lib.getApiUrl('Enquiry-Admission/enquiry/updateapplicationIssue'), Enquiry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        console.log(res.result)
                        const url = '/Report/miscellaneous-fee-receipt/' + res.result.ReceiptSysID + '/' + 'PDF';
                        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
                        this.PanelList = true;
                        this.PanelEntry = false;
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

    BtnAdmissionConvert(Enquiry: mlenquiryInfo) {
        this.lib.notification.confirm('Do you want to Convert Enquiry To Admission ?', () => {
            try {
                const Url = 'app/student/admission?EnquirySysID=' + Enquiry.EnquirySysID;
                this.lib.router.navigateByUrl(Url);
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
    }
}

class mlenquiryInfo {
    EnquirySysID = 0;
    EnquiryDate = '';
    StudentName = '';
    ParentName = '';
    Gender = '';
    DOB = '';
    Mobile = '';
    AlternateMobileNo = '';
    Address1 = '';
    Address2 = '';
    Country = '';
    Pincode = '';
    Phone = '';
    Email = '';
    SchoolName = '';
    AcademicYearSysID = 0;
    IsApplicationIssued: Boolean = false;
    IsAdmissionConfirmed: Boolean = false;
    _IsApplicationIssued = '0';

    IsCancelled: Boolean = false;
    CancelledBy = '';
    CancelledDate = '';
    CancelledReason = '';

    AcademicYearID = '';
    stateName = '';
    CountrySysID = '';
    StateSysID = '';
    CountryName = '';
    CityName = '';
    CitySysID = '';

    ClassName = '';
    ClassSysID = '';

    FromDate: string | any;
    ToDate = '';
    ReceiptSysID: number;
    ReceiptNo: string;
    ReceiptDate: string;
    MisFeeStrucMapSysID: number;
    Amount: number;
    TransactionRefType: string;
    TransactionRefTypeSysID: number;
    BranchSysID: number;

}