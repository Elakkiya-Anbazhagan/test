import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ViewChild, Input, Output, EventEmitter, HostBinding, NgZone } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';

import { UtilityService, ApiService, IApiResponse, IApiFailure } from 'systemic/helper';
import * as ml from './../../../../InterFace';
import { IStudentDetails, IEducationInfo, IDocumentInfo, IAddressInfo, IFamilyInfo } from './../../../../InterFace/IStudent';
import { routerTransition, hostStyle } from '../../../../../router.animations';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { IApiSuccess } from "Client/app/main/master/REVIEWED/helper/service";

@Component({
    selector: 'student-admission-entry',
    templateUrl: './student-admission-entry.Component.html',
    animations: [routerTransition()],
    host: hostStyle()
})

export class Student_Admission_Entry_Component implements OnInit {
    isAllowCancel: boolean;
    isAllowEdit: boolean;
    isAllowAdd: boolean;
    frmEducationEntry: FormGroup;
    StudentDetails: ml.IStudentDetails;
    public StudentPrimaryAddress: ml.IAddressInfo;
    public StudentPrimaryFamily: ml.IFamilyInfo;
    activeAcademicYear: number;
    isDisableActiveAcademicYear: boolean;
    DocumentData: ml.IDocumentInfo;
    CommunicationData: ml.IAddressInfo;
    FamilyData: ml.IFamilyInfo;
    EducationData: ml.IEducationInfo;
    IsAddressEditable = false;
    IsFamilyEditable = false;
    IsDocumentEditable = false;
    IsEducationEditable = false;
    ImageBaseUrl:string;
    public ImageFile: File[];
    public hasFile: boolean;

    dsBloodGroup: ml.Idd[] = [{
        id: 'A+',
        text: 'A+'
    }, {
        id: 'A-',
        text: 'A-'
    }, {
        id: 'B+',
        text: 'B+'
    }, {
        id: 'B-',
        text: 'B-'
    }, {
        id: 'AB+',
        text: 'AB+'
    }, {
        id: 'AB-',
        text: 'AB-'
    }, {
        id: 'O+',
        text: 'O+'
    }, {
        id: 'O-',
        text: 'O-'
    }];
    dsMotherTongue: ml.Idd[];
    dsComunity: ml.Idd[];
    dsNationality: ml.Idd[];
    dsReligion: ml.Idd[];
    dsCaste: ml.Idd[];
    dsAcademicYear: ml.Idd[];
    dsClassData: ml.Idd[];
    dsSectionData: ml.Idd[];

    Country: ml.Idd[];
    State: ml.Idd[];
    City: ml.Idd[];
    dsAddressData: ml.Idd[];
    Certificate: ml.Idd[];
    dsMemberData: ml.Idd[];

    PanelVisible: boolean;
    @Input() StudentSysID: number;
    @Input() EnquirySysID: number;
    @Output() onclose = new EventEmitter();

    @ViewChild('mdCommunicationEntry') mdCommunicationEntry: ModalComponent;
    @ViewChild('mdFamilyEntry') mdFamilyEntry: ModalComponent;
    @ViewChild('mdDocumentEntry') mdDocumentEntry: ModalComponent;
    @ViewChild('mdEducationEntry') mdEducationEntry: ModalComponent;
    @ViewChild('frmCommunicationEntry') formCommunicationData: NgForm;
    
    constructor(private lib: UtilityService,  private http2: Http, private http: ApiService, public zone: NgZone) {
    }

    ngOnInit() {
        this.ClearControl();
        this.LoadAddressType();
        this.LoadCertificateType();
        this.LoadMemberType();
        this.ImageBaseUrl = this.lib.GetStudentUrl('small');
        const Obs_academicYearData = this.http.get(this.lib.getApiUrl('dropdown/academicyear/false'));
        const Obs_mothertongueData = this.http.get(this.lib.getApiUrl('dropdown/mothertongue'));
        const Obs_communityData = this.http.get(this.lib.getApiUrl('dropdown/community'));
        const Obs_nationalityData = this.http.get(this.lib.getApiUrl('dropdown/nationality'));
        const Obs_religionData = this.http.get(this.lib.getApiUrl('dropdown/religion'));
        const Obs_classData = this.http.get(this.lib.getApiUrl('dropdown/get-class'));
        const Obs_sectionData = this.http.get(this.lib.getApiUrl('dropdown/get-section'));
        const Obs_casteData = this.http.get(this.lib.getApiUrl('dropdown/caste'));
        Observable.forkJoin([Obs_mothertongueData, Obs_communityData, Obs_nationalityData, Obs_religionData, Obs_classData, Obs_sectionData, Obs_casteData, Obs_academicYearData]).subscribe(
            (lstRes) => {
                this.dsMotherTongue = lstRes[0].result.data;
                this.dsComunity = lstRes[1].result.data;
                this.dsNationality = lstRes[2].result.data;
                this.dsReligion = lstRes[3].result.data;
                this.dsClassData = lstRes[4].result.data;
                this.dsSectionData = lstRes[5].result.data;
                this.dsCaste = lstRes[6].result.data;
                this.dsAcademicYear = lstRes[7].result.data;
                this.isDisableActiveAcademicYear = true;
                this.activeAcademicYear = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
            },
            (err) => {
                this.lib.notification.error(err.message);
            },
            () => {
                this.ClearControl();

                this.Country = [];
                this.LoadCountry();
                if (typeof this.StudentSysID === 'undefined' || this.StudentSysID === 0) {
                    if (this.lib.isValidSelectedValue(this.EnquirySysID)) {
                        this.LoadEnquiryData(this.EnquirySysID);
                    }
                    this.lib.setBrowserTitle('New Admission');
                    this.lib.setPageTitle('New Admission');
                } else {
                    this.loadStudentData(this.StudentSysID);
                }
            }
        );
        console.log(`${this.ImageBaseUrl}/${this.StudentDetails.Personal.ImageName}`);
    }
    LoadEnquiryData(EnquirySysID: number) {
        this.StudentDetails = new ml.IStudentDetails();
        this.http.get(this.lib.getApiUrl('Enquiry-Admission/enquiry/read/' + EnquirySysID)).subscribe(
            (res) => {
                this.StudentDetails.Personal = res.result.data;
                this.StudentDetails.Personal.ImageName='Default.JPG';
                this.CommunicationData = new ml.IAddressInfo();
                this.CommunicationData.Address1 = res.result.data.Address1;
                this.CommunicationData.Address2 = res.result.data.Address2;
                this.CommunicationData.AlternateMobileNo = res.result.data.AlternateMobileNo;
                this.CommunicationData.CitySysID = res.result.data.CitySysID;
                this.CommunicationData.ContactTypeSysID = res.result.data.ContactTypeSysID;
                this.CommunicationData.Email = res.result.data.Email;
                this.CommunicationData.Mobile = res.result.data.Mobile;
                this.CommunicationData.Pincode = res.result.data.Pincode;
                this.CommunicationData.StudentSysID = res.result.data.StudentSysID;
                this.CommunicationData.StateSysID = res.result.data.StateSysID
                this.CommunicationData.CountrySysID = res.result.data.CountrySysID
                this.StudentDetails.Address.push(this.CommunicationData);
                this.StudentDetails.Address = this.StudentDetails.Address.slice();
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    loadStudentData(StudentSysID: number) {
        this.http.get(this.lib.getApiUrl('student/admission/read/' + StudentSysID)).subscribe(
            (res) => {
                this.StudentDetails = res.result.data;
                if (!this.lib.isValidSelectedValue(this.StudentDetails.Personal.SectionSysID)) {
                    this.StudentDetails.Personal.SectionSysID = 0;
                }
                if (this.lib.isValidList(this.StudentDetails.Family)) {
                    const PrimaryFamilyMemberData = this.StudentDetails.Family.filter((data) => data.IsPrimary === true);
                    if (PrimaryFamilyMemberData.length > 0) {
                        this.StudentPrimaryFamily = PrimaryFamilyMemberData[0];
                    }
                }
                if (this.lib.isValidList(this.StudentDetails.Address)) {
                    const PrimaryAddressMemberData = this.StudentDetails.Address.filter((data) => data.IsPrimary === true);
                    if (PrimaryAddressMemberData.length > 0) {
                        this.StudentPrimaryAddress = PrimaryAddressMemberData[0];
                    }
                }
                this.lib.setBrowserTitle('Admission Info (' + this.StudentDetails.Personal.AdmissionNo + ')');
                this.lib.setPageTitle('Admission Info (' + this.StudentDetails.Personal.AdmissionNo + ')');
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    ClearControl() {
        this.StudentPrimaryAddress = new ml.IAddressInfo();
        this.StudentPrimaryFamily = new ml.IFamilyInfo();
        this.StudentDetails = new ml.IStudentDetails();
        this.CommunicationData = new ml.IAddressInfo();
        this.FamilyData = new ml.IFamilyInfo();
        this.EducationData = new ml.IEducationInfo();
        this.DocumentData = new ml.IDocumentInfo();
    };
    btnAdd_Click() {
        this.PanelVisible = true;
    }
    btnLock_Click(Student: ml.IPersonalInfo) {
    }
    btnStudentEdit_Click(Student: ml.IPersonalInfo) {
    }
    btnStudentDelete_Click(Student: ml.IPersonalInfo) {
    }
    btnSave_click(formData: NgForm) {
        let errmsg = '',
            isHavePrimaryFamilyInfo = false,
            isHavePrimaryAddressInfo = false;
        if (this.lib.isValidList(this.StudentDetails.Address)) {
            this.StudentDetails.Address.forEach((data: ml.IAddressInfo) => {
                data.IsPrimary = (this.StudentPrimaryAddress.ContactTypeSysID === data.ContactTypeSysID);
            });
            isHavePrimaryAddressInfo = (this.StudentDetails.Address.filter((addr) => addr.IsPrimary === true).length > 0);
            if (!isHavePrimaryAddressInfo) {
                errmsg = 'Please Add 1 Primary Contact Info <br />';
            }
        } else { errmsg = 'Please Add 1 Primary Contact Info <br />'; }
        if (this.lib.isValidList(this.StudentDetails.Family)) {
            this.StudentDetails.Family.forEach((data) => {
                data.IsPrimary = (this.StudentPrimaryFamily.FamilyTypeSysID === data.FamilyTypeSysID);
            });
            isHavePrimaryFamilyInfo = (this.StudentDetails.Family.filter((fam) => fam.IsPrimary === true).length > 0);
            if (!isHavePrimaryFamilyInfo) {
                errmsg += 'Please Add 1 Primary Family Info';
            }
        } else { errmsg += 'Please Add 1 Primary Family Info'; }


        if (!isHavePrimaryFamilyInfo || !isHavePrimaryAddressInfo) {
            this.lib.notification.warning(errmsg);
        } else {
            this.StudentDetails.Personal.AcademicYearSysID = this.activeAcademicYear;

            this.lib.notification.confirm('Do you want to ' + (this.StudentDetails.Personal.StudentSysID === 0) ? 'Save' : 'Update', () => {
                this.http.post(this.lib.getApiUrl('student/admission/create'), this.StudentDetails).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        formData.resetForm();
                        this.ClearControl();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }, () => { });
        }
    }
    btnCancel_click() {
        this.onclose.emit();
    }
    btnCommunicationAdd_click() {
        this.IsAddressEditable = false;
        this.Country = [];
        this.State = [];
        this.City = [];
        this.LoadCountry();
        this.CommunicationData = new IAddressInfo();
        this.formCommunicationData.resetForm();
        this.mdCommunicationEntry.open('lg');
    }
    btnCommunicationSave_click(formData: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.CommunicationData.ContactSysID === 0) ? 'Save' : 'Update', () => {
            if ((!this.lib.isValidList(this.StudentDetails.Address))) {
                this.StudentDetails.Address = [];
            }
            if (this.IsAddressEditable) {
                this.IsAddressEditable = false;
                this.StudentDetails.Address.splice(this.CommunicationData.RowIndex, 1, this.CommunicationData);
                if (this.CommunicationData.IsPrimary) {
                    this.StudentPrimaryAddress = this.CommunicationData;
                }
            } else {
                this.StudentDetails.Address.push(this.CommunicationData);
            }
            this.StudentDetails.Address = this.StudentDetails.Address.slice();
            this.CommunicationData = new ml.IAddressInfo();
            this.mdCommunicationEntry.close();
            this.formCommunicationData.resetForm();
        }, () => { });
    }
    btnCommunicationEdit_click(Data: ml.IAddressInfo, RowIndex: any) {
        this.IsAddressEditable = true;
        this.CommunicationData = new IAddressInfo();
        this.mdCommunicationEntry.open('lg');
        if (!this.lib.isNullOrUndefined(this.StudentPrimaryFamily)) {
            if (this.StudentPrimaryAddress === Data) {
                this.StudentPrimaryAddress.IsPrimary = true;
                Data.IsPrimary = true;
            }
        }
        this.CommunicationData.RowIndex = RowIndex;
        this.CommunicationData.ContactTypeSysID = Data.ContactTypeSysID;
        this.CommunicationData.Address1 = Data.Address1;
        this.CommunicationData.Address2 = Data.Address2;
        this.CommunicationData.AlternateMobileNo = Data.AlternateMobileNo;
        this.CommunicationData.ContactSysID = Data.ContactSysID;
        this.CommunicationData.Email = Data.Email;
        this.CommunicationData.IsDeleted = Data.IsDeleted;
        this.CommunicationData.IsPrimary = Data.IsPrimary;
        this.CommunicationData.Mobile = Data.Mobile;
        this.CommunicationData.Phone = Data.Phone;
        this.CommunicationData.Pincode = Data.Pincode;
        this.CommunicationData.StudentSysID = Data.StudentSysID;
        this.CommunicationData.CountrySysID = Data.CountrySysID;
        this.CountryChange(Data.CountrySysID, Data.StateSysID, Data.CitySysID);
    }
    CountryChange(CountrySysID: any, StateSysID?: any, CitySySID?: any) {
        this.State = [];
        this.City = [];
        if (this.lib.isValidSelectedValue(CountrySysID)) {
            setTimeout(() => {
                this.http.get(this.lib.getApiUrl('dropdown/state/' + CountrySysID)).subscribe(
                    (res) => {
                        this.State = res.result.data;
                        if (this.lib.isValidSelectedValue(StateSysID)) {
                            setTimeout(() => {
                                this.CommunicationData.StateSysID = StateSysID;
                                this.StateChange(StateSysID, CitySySID);
                            }, 100);
                        }
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }, 100);
        }
    }
    StateChange(StateSysID: any, CitySySID?: any) {
        this.City = [];
        if (this.lib.isValidSelectedValue(StateSysID)) {
            this.http.get(this.lib.getApiUrl('dropdown/city/' + StateSysID)).subscribe(
                (res) => {
                    this.City = res.result.data;

                    if (this.lib.isValidSelectedValue(CitySySID)) {
                        setTimeout(() => {
                            this.CommunicationData.CitySysID = CitySySID;
                        }, 100);
                    }
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }
    }
    btnCommunicationDelete_click(Data: ml.IAddressInfo) {
        this.lib.notification.confirm('Do you want to ' + (Data.IsDeleted ? ' Activate ' : ' Delete'), () => {
            const index = this.StudentDetails.Address.indexOf(Data, 0);
            if (index > -1) {
                Data.IsDeleted = !Data.IsDeleted;
                if (Data === this.StudentPrimaryAddress) {
                    this.StudentPrimaryAddress = new ml.IAddressInfo();
                }
                this.StudentDetails.Address.splice(index, 1, Data);
            }
        }, () => { });
    }
    btnFamilyDetailsAdd_click() {
        this.IsFamilyEditable = false;
        this.FamilyData = new ml.IFamilyInfo();
        this.mdFamilyEntry.open('lg');
    }
    btnFamilyEdit_click(Data: ml.IFamilyInfo, RowIndex: any) {
        this.IsFamilyEditable = true;
        this.FamilyData = new ml.IFamilyInfo();
        this.mdFamilyEntry.open('lg');
        if (!this.lib.isNullOrUndefined(this.StudentPrimaryFamily)) {
            if (this.StudentPrimaryFamily === Data) {

                this.StudentPrimaryFamily.IsPrimary = true;
                Data.IsPrimary = true;
            }
        }
        Data.RowIndex = RowIndex;
        this.FamilyData.AnnualIncome = Data.AnnualIncome;
        this.FamilyData.FamilySysID = Data.FamilySysID;
        this.FamilyData.FamilyType = Data.FamilyType;
        this.FamilyData.FamilyTypeSysID = Data.FamilyTypeSysID;
        this.FamilyData.IsDeleted = Data.IsDeleted;
        this.FamilyData.IsPrimary = Data.IsPrimary;
        this.FamilyData.Name = Data.Name;
        this.FamilyData.OfficeAddress = Data.OfficeAddress;
        this.FamilyData.OfficeEmail = Data.OfficeEmail;
        this.FamilyData.OfficePhone = Data.OfficePhone;
        this.FamilyData.Qualification = Data.Qualification;
        this.FamilyData.RowIndex = Data.RowIndex;
        this.FamilyData.StudentSysID = Data.StudentSysID;
    }
    btnFamilySave_click(formData: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.FamilyData.FamilySysID === 0) ? 'Save' : 'Update', () => {
            if ((!this.lib.isValidList(this.StudentDetails.Family))) {
                this.StudentDetails.Family = [];
            }
            if (this.IsFamilyEditable) {
                this.IsFamilyEditable = false;
                this.StudentDetails.Family.splice(this.FamilyData.RowIndex, 1, this.FamilyData);
                if (this.FamilyData.IsPrimary) {
                    this.StudentPrimaryFamily = this.FamilyData;
                }
            } else {
                this.StudentDetails.Family.push(this.FamilyData);
            }
            this.StudentDetails.Family = this.StudentDetails.Family.slice();
            this.FamilyData = new ml.IFamilyInfo();
            this.mdFamilyEntry.close();
            formData.resetForm();
        }, () => { });
    }
    btnFamilyDelete_click(Data: ml.IFamilyInfo) {
        this.lib.notification.confirm('Do you want to delete ' + (Data.IsDeleted ? ' Activate ' : ' Delete'), () => {
            const index = this.StudentDetails.Family.indexOf(Data, 0);
            if (index > -1) {
                Data.IsDeleted = !Data.IsDeleted;
                if (Data === this.StudentPrimaryFamily) {
                    this.StudentPrimaryFamily = new ml.IFamilyInfo();
                }
                this.StudentDetails.Family.splice(index, 1, Data);
            }
        }, () => { });
    }
    btnEducationDetailsAdd_click() {
        this.IsEducationEditable = false;
        this.EducationData = new IEducationInfo();
        this.mdEducationEntry.open('md');
    }
    btnEducationEdit_click(Data: ml.IEducationInfo, RowIndex: any) {
        this.IsEducationEditable = true;
        this.EducationData = new ml.IEducationInfo();
        this.mdEducationEntry.open('md');
        Data.RowIndex = RowIndex;
        this.EducationData.AcademicYearID = Data.AcademicYearID;
        this.EducationData.AcademicYearSysID = Data.AcademicYearSysID;
        this.EducationData.ClassName = Data.ClassName;
        this.EducationData.ClassSysID = Data.ClassSysID;
        this.EducationData.EducationSysID = Data.EducationSysID;
        this.EducationData.IsDeleted = Data.IsDeleted;
        this.EducationData.RowIndex = Data.RowIndex;
        this.EducationData.SchoolName = Data.SchoolName;
        this.EducationData.StudentSysID = Data.StudentSysID;
    }
    btnEducationSave_click(formData: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.EducationData.EducationSysID === 0) ? 'Save' : 'Update', () => {
            if ((!this.lib.isValidList(this.StudentDetails.Education))) {
                this.StudentDetails.Education = [];
            }
            if (this.IsEducationEditable) {
                this.IsEducationEditable = false;
                this.StudentDetails.Education.splice(this.EducationData.RowIndex, 1, this.EducationData);
            } else {
                this.StudentDetails.Education.push(this.EducationData);
            }
            this.StudentDetails.Education = this.StudentDetails.Education.slice();
            this.EducationData = new IEducationInfo();
            this.mdEducationEntry.close();
            formData.resetForm();
        }, () => { });
    }
    btnEducationDelete_click(Data: ml.IEducationInfo) {
        this.lib.notification.confirm('Do you want to delete ' + (Data.IsDeleted ? ' Activate ' : ' Delete'), () => {
            const index = this.StudentDetails.Education.indexOf(Data, 0);
            if (index > -1) {
                Data.IsDeleted = !Data.IsDeleted;
                this.StudentDetails.Education.splice(index, 1, Data);
            }
        }, () => { });
    }
    btnDocumentDetailsAdd_click() {
        this.IsDocumentEditable = false;
        this.DocumentData = new IDocumentInfo();
        this.mdDocumentEntry.open('md');
    }
    btnDocumentEdit_click(Data: ml.IDocumentInfo, RowIndex: any) {
        this.IsDocumentEditable = true;
        this.DocumentData = new ml.IDocumentInfo();
        this.mdDocumentEntry.open('md');
        Data.RowIndex = RowIndex;

        this.DocumentData.ApprovedBy = Data.ApprovedBy;
        this.DocumentData.ApprovedDate = Data.ApprovedDate;
        this.DocumentData.CertificateName = Data.CertificateName;
        this.DocumentData.CertificateSysID = Data.CertificateSysID;
        this.DocumentData.CertificateTypeSysID = Data.CertificateTypeSysID;
        this.DocumentData.IsApproved = Data.IsApproved;
        this.DocumentData.IsDeleted = Data.IsDeleted;
        this.DocumentData.ReceivedDate = Data.ReceivedDate;
        this.DocumentData.RowIndex = Data.RowIndex;
        this.DocumentData.StudentSysID = Data.StudentSysID;

    }
    btnDocumentSave_click(formData: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.DocumentData.CertificateSysID === 0) ? 'Save' : 'Update', () => {
            if (!this.lib.isValidList(this.StudentDetails.Document)) {
                this.StudentDetails.Document = [];
            }
            if (this.IsDocumentEditable) {
                this.IsDocumentEditable = false;
                this.StudentDetails.Document.splice(this.DocumentData.RowIndex, 1, this.DocumentData);
            } else {
                this.StudentDetails.Document.push(this.DocumentData);
            }
            this.StudentDetails.Document = this.StudentDetails.Document.slice();
            this.DocumentData = new IDocumentInfo();
            this.mdDocumentEntry.close();
            formData.resetForm();
        }, () => { });
    }
    btnDocumentDelete_click(Data: ml.IDocumentInfo) {
        this.lib.notification.confirm('Do you want to ' + (Data.IsDeleted ? ' Activate ' : ' Delete'), () => {
            const index = this.StudentDetails.Document.indexOf(Data, 0);
            if (index > -1) {
                Data.IsDeleted = !Data.IsDeleted;
                this.StudentDetails.Document.splice(index, 1, Data);
            }
        }, () => { });
    }
    LoadCountry() {
        this.State = [];
        this.City = [];
        this.http.get(this.lib.getApiUrl('dropdown/country')).subscribe(
            (res) => {
                this.Country = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadAddressType() {
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/Student_Address_Type')).subscribe(
            (res) => {
                this.dsAddressData = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadMemberType() {
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/Student_Family_Type')).subscribe(
            (res) => {
                this.dsMemberData = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadCertificateType() {
        this.http.get(this.lib.getApiUrl('dropdown/certificate')).subscribe(
            (res) => {
                this.Certificate = res.result.data;
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadAcademicYearID(AcademicYearSysId?: number) {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
                this.isDisableActiveAcademicYear = true;
                if (AcademicYearSysId) {
                    this.activeAcademicYear = AcademicYearSysId;
                } else {
                    this.activeAcademicYear = this.lib.schoolConfig().ActiveAcademicYear.AcademicYearSysId;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    LoadClass(ClassSysID?: string) {
        this.http.get(this.lib.getApiUrl('dropdown/class')).subscribe(
            (res) => {
                this.dsClassData = res.result.data;
                if (ClassSysID) {
                    this.StudentDetails.Personal.ClassSysID = ClassSysID;
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
    CertificateChange(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.DocumentData.CertificateName = event.data[0].text;
        }
    }
    FamilyChange(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.FamilyData.FamilyType = event.data[0].text;
        }
    }
    fileChange(event: any) {
        this.ImageFile = event.target.files;
        this.hasFile = (this.ImageFile !== undefined);
        this.btnUpload_Click();
    }

    btnUpload_Click() {
        const formData: FormData = new FormData();
        if (this.hasFile) {
            for (const i in this.ImageFile) {
                formData.append(this.ImageFile[i].name, this.ImageFile[i]);
            }
            this.lib.notification.confirm('Do you want Upload image file', () => {
                try {
                    const headers = new Headers();
                    const authToken = this.lib.authData().access_token;
                    headers.set('Accept', 'application/json');
                    headers.set('Authorization', 'Bearer ' + authToken);
                    this.http2.post(this.lib.getApiUrl('student/admission/UploadImage'), formData, { headers }).subscribe(
                        (data) => {
                            const response: IApiSuccess = this.GetResult(data);
                            this.lib.notification.success(response.message);
                            this.StudentDetails.Personal.ImageName= response.result.data;
                        }, (error) => {
                            this.lib.notification.error(this.GetError(error).message);
                        })
                } catch (ex) {
                    this.lib.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.lib.notification.error('Please Select image File');
        }
    }

    public GetResult(res: any): IApiSuccess {
        const response: IApiResponse = <IApiResponse>res.json();
        if (response.response !== 'success') {
            this.lib.notification.error(response.failure.message);
            throw new Error(response.failure.message);
        } else {
            return response.success;
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

}