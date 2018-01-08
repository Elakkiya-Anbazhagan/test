import { Router, ActivatedRoute } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from '../../../../InterFace';

@Component({
    selector: 'other-fee-structure',
    templateUrl: 'other-fees-structure.component.html'
})

export class Other_Fee_Structure_Component implements OnInit {
    dtOtherFeeList: mlOtherFeeList[];
    CancelOtherFeeData: mlOtherFeeList;
    dtStudentList: StudentList[];
    dtClassSectionList: ClassSectionList[];
    dtSelectedClassSectionList: ClassSectionList[];
    MasterData: MasterData;
    OtherFeeViewdata: OtherFeeViewdata;
    AcademicYearData: Array<InterFace.Idd>
    OtherFeeData: Array<InterFace.Idd>
    TypeData: Array<InterFace.Idd>
    ClassData: Array<InterFace.Idd>
    SectionData: Array<InterFace.Idd>
    isEntryMode: boolean;
    isViewMode: boolean;
    isPaid: boolean;
    cot: number;
    Msg: string;
    @ViewChild('mdStudentList') mdStudentList: ModalComponent;
    @ViewChild('frmFeesStructureEntry') fromData: NgForm;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    @ViewChild('frmCancel') frmCancel: NgForm;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService, private route: ActivatedRoute) {
        this.lib.setBrowserTitle('Other fees');
        this.lib.setPageTitle('Other fees');
        this.OtherFeeViewdata = new OtherFeeViewdata();
        this.cot = 0;
        this.CancelOtherFeeData = new mlOtherFeeList();
    }
    ngOnInit() {
        this.isEntryMode = true;
        this.isViewMode = false;
        this.isPaid = false;
        this.LoadData();
        this.LoadAcademicYear();
        this.LoadType();
    }
    ClearControl() {
        this.ResetData();
        this.isViewMode = true;
        this.isEntryMode = true;
        this.OtherFeeViewdata = new OtherFeeViewdata();
        this.fromData.resetForm();
        this.LoadData();
    }
    ResetData() {
        this.isPaid = false;
        this.dtStudentList = [];
        this.dtClassSectionList = [];
        this.dtSelectedClassSectionList = [];
    }
    LoadData() {
        this.dtOtherFeeList = [];
        this.http.get(this.lib.getApiUrl('fees/other-fees-structure/list/' + this.lib.authData().School.CurrentAcademicYear.AcademicYearSysId)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dtOtherFeeList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnAdd_click() {
        this.ResetData();
        this.isViewMode = true;
        this.isEntryMode = false;
        this.OtherFeeViewdata = new OtherFeeViewdata();
        this.OtherFeeViewdata.AcademicYearSysID = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearSysId.toString();
        this.onAcademicYear_Changed(this.OtherFeeViewdata.AcademicYearSysID);
    }
    btnEdit_click(Data: mlOtherFeeList) {
        this.ResetData();
        this.onAcademicYear_Changed(this.OtherFeeViewdata.AcademicYearSysID);
        this.OtherFeeViewdata = new OtherFeeViewdata();
        this.OtherFeeViewdata.AcademicYearSysID = Data.AcademicYearSysID.toString();
        this.OtherFeeViewdata.TypeSysID = Data.TypeSysID.toString();
        this.OtherFeeViewdata.TypeName = Data.TypeName;
        this.OtherFeeViewdata.FeeCategorySysID = Data.FeeCategorySysID.toString();
        this.OtherFeeViewdata.CategoryName = Data.CategoryName.toString();
        this.OtherFeeViewdata.CategorySysID = Data.CategorySysID;
        this.OtherFeeViewdata.ClassSysID = '-1';
        this.OtherFeeViewdata.SectionSysID = '-1';
        this.isViewMode = false;
        this.isEntryMode = false;
        setTimeout(() => {
            const Obs_ClassSectionData = this.http.post(this.lib.getApiUrl('fees/other-fees-structure/student-list'), this.OtherFeeViewdata);
            Observable.forkJoin([Obs_ClassSectionData]).subscribe(
                (lstRes) => {
                    this.dtClassSectionList = lstRes[0].result.data;
                    setTimeout(() => {
                        this.dtSelectedClassSectionList = this.dtClassSectionList.filter(data => data.Amount > 0)
                    }, 100);
                },
            );
        }, 100);
    }
    btnCancel_click() {
        this.ClearControl();
    }
    btnOtherFeeCancel_click(Data: mlOtherFeeList) {
        this.mdCancel.open();
        this.CancelOtherFeeData = new mlOtherFeeList();
        this.CancelOtherFeeData.CategorySysID = Data.CategorySysID;
    }
    btnOtherFeeCancel_Save_click() {
        this.lib.notification.confirm('Do you want to cancel OtherFees', () => {
            this.http.post(this.lib.getApiUrl('fees/other-fees-structure/cancel'), this.CancelOtherFeeData).subscribe((res) => {
                this.lib.notification.success(res.message);
                this.frmCancel.resetForm();
                this.mdCancel.close();
                this.LoadData();
            }, (err) => {
                this.lib.notification.error(err.message);
            });
        }, () => { });
    }
    btnModelCancel_click() {
        this.frmCancel.resetForm();
        this.mdCancel.close();
    }
    LoadAcademicYear() {
        this.AcademicYearData = [];
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.AcademicYearData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadOtherFees() {
        this.OtherFeeData = [];
        this.http.get(this.lib.getApiUrl('dropdown/otherfees/' + this.OtherFeeViewdata.AcademicYearSysID)).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.OtherFeeData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    LoadType() {
        this.TypeData = [];
        this.http.get(this.lib.getApiUrl('dropdown/mastertype/Collection_Type/false')).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.TypeData = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    onAcademicYear_Changed(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-class/' + value + '/' + true)).subscribe(
                (res) => {
                    this.ClassData = res.result.data;
                    setTimeout(() => {
                        this.OtherFeeViewdata.ClassSysID = '-1';
                        this.ClassChange(this.OtherFeeViewdata.ClassSysID);
                        this.LoadOtherFees();
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    Type_Changed(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.OtherFeeViewdata.TypeName = event.data[0].text;
            if (event.data[0].text === this.lib.MasterData.CollectionType.POSTPAID) {
                this.isPaid = true;
            } else {
                this.isPaid = false;
            }
        }
    }
    ClassChange(value: any) {
        if (this.lib.isValidSelectedValue(value)) {
            this.ResetData();
            this.http.get(this.lib.getApiUrl('dropdown/get-yearwise-section/' + this.OtherFeeViewdata.AcademicYearSysID + '/' + value + '/' + true)).subscribe(
                (res) => {
                    this.SectionData = res.result.data;
                    setTimeout(() => {
                        this.OtherFeeViewdata.SectionSysID = '-1';
                    }, 100);
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }
    txtAmount_Change(amount: any) {
        if (this.lib.isValidList(this.dtClassSectionList)) {
            this.dtClassSectionList.forEach(data => {
                data.Amount = amount;
            });
        }
    }
    btnView_Click() {
        this.isViewMode = false;
        this.LoadStudentList();
    }
    LoadStudentList() {
        this.dtClassSectionList = [];
        this.http.post(this.lib.getApiUrl('fees/other-fees-structure/student-list'), this.OtherFeeViewdata).subscribe(
            (res) => {
                if (this.lib.isValidList(res.result.data)) {
                    this.dtClassSectionList = res.result.data;
                }
            }, (err) => {
                this.lib.notification.error(err.message);
                this.ResetData();
            });
    }
    btnSave_click() {
        this.MasterData = new MasterData();
        try {
            this.Msg = '';
            this.dtSelectedClassSectionList.forEach(itm => {
                if (itm.Amount <= 0) {
                    this.Msg += `Class ${itm.ClassName} Section ${itm.SectionName} Amount Is Not Valid. </br>`
                }
            })
            if (this.Msg === '') {
                if (this.lib.isValidList(this.dtSelectedClassSectionList) && this.lib.isValidModel(this.OtherFeeViewdata)) {
                    this.lib.notification.confirm('Do you want to ' + (this.OtherFeeViewdata.CategorySysID !== 0 ? 'Update ' : 'Save ') + 'OtherFees', () => {
                        this.MasterData.Master = this.OtherFeeViewdata;
                        this.MasterData.Trans = this.dtSelectedClassSectionList;
                        this.http.post(this.lib.getApiUrl('fees/other-fees-structure/save'), this.MasterData).subscribe((res) => {
                            this.lib.notification.success(res.message);
                            this.ClearControl();
                            this.Msg = '';
                        }, (err) => {
                            this.lib.notification.error(err.message);
                        });
                    }, () => { });
                } else {
                    this.lib.notification.warning('Please select atleast 1 record.');
                }
            } else {
                this.lib.notification.warning(this.Msg);
            }
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }
    }
    CalculateCount(Lst: StudentList[]): number {
        let cnt = 0;
        if (this.lib.isValidList(Lst)) {
            cnt = Lst.filter((data: StudentList) => data.IsSelected === true).length;
        }
        return cnt;
    }
    btnstudentList(data: StudentList[]) {
        this.dtStudentList = [];
        if (this.lib.isValidList(data)) {
            this.dtStudentList = data;
            this.mdStudentList.open('md');
        }
    }
    btnStuModelClose_Click() {
        this.mdStudentList.close();
    }
}
class mlOtherFeeList {
    CategorySysID: number;
    CategoryName: string;
    AcademicYearSysID: number;
    AcademicYearID: string;
    TypeSysID: number;
    TypeName: string;
    FeeCategorySysID: number;
    FeeCategoryName: string;
    IsApproved: boolean;
    IsCancelled: boolean;
    CancelledReason: string;
}
class OtherFeeViewdata {
    AcademicYearSysID: string;
    FeeCategorySysID: string;
    TypeSysID: string;
    TypeName: string;
    CategoryName: string;
    ClassSysID: string;
    SectionSysID: string;
    Amount: number;
    CategorySysID = 0;
}
class ClassSectionList {
    ClassName: string;
    ClassSysID: number;
    SectionName: string;
    SectionSysID: number;
    AcademicYearSysID: number;
    Amount: number;
    StudentList: StudentList[];
    constructor() {
        this.StudentList = [];
    }
}
class StudentList {
    StudentSysID: number;
    AdmissionNo: string;
    StudentName: string;
    IsSelected: boolean;
    Amount: number;
}
class MasterData {
    Master: OtherFeeViewdata;
    Trans: ClassSectionList[];
    constructor() {
        this.Master = new OtherFeeViewdata();
        this.Trans = [];
    }
}