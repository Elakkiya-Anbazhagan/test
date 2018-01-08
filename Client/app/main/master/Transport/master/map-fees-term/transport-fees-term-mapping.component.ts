import { UtilityService, ApiService } from 'systemic/helper';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { OnInit } from '@angular/core';
import * as moment from 'moment';

import * as InterFace from './../../../../InterFace';


@Component({
    selector: 'transport-fees-term-mapping',
    templateUrl: './transport-fees-term-mapping.component.html'
})

export class Transport_Fees_Term_Mapping_Component implements OnInit {
    dsFeeTermList: mlTransport_Fee_Term_Mapping[]
    slFeeTermFeeList: mlTransport_Fee_Term_Mapping[];
    dsAcademicYear: InterFace.Idd[];
    public YearRange: string;
    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Transport Fee Term Mapping');
        lib.setPageTitle('Transport Fee Term Mapping');
        this.dsFeeTermList = [];
        this.slFeeTermFeeList = [];
        this.dsAcademicYear = [];
        this.YearRange = this.lib.schoolConfig().CurrentAcademicYear.AcademicYearID.replace('-', ':');
    }
    ngOnInit() {
        this.http.get(this.lib.getApiUrl('dropdown/academicyear/false')).subscribe(
            (res) => {
                this.dsAcademicYear = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    onAcademicYear_Changed(event: any) {
        if (this.lib.isValidSelectedValue(event.value)) {
            this.dsFeeTermList = [];
            this.slFeeTermFeeList = [];
            if (this.lib.isValidSelectedValue(event.value)) {
                this.http.get(this.lib.getApiUrl('/fees/transport-term-mapping/list/' + event.value)).subscribe(
                    (res) => {
                        this.YearRange = event.data[0].text.replace('-', ':');
                        this.dsFeeTermList = res.result.data;
                        this.slFeeTermFeeList = this.dsFeeTermList.filter(item => (item.IsMapped));
                    }, (err) => {
                        this.lib.notification.error(err.message);
                    });
            }

        }
    }

    frmTermMappingEntry_Submit(AcademicYearSysID: number) {
        try {
            // Check dsFeeTermList && slFeeTermFeeList is valid
            if (!this.lib.isValidList(this.dsFeeTermList) && this.lib.isValidList(this.slFeeTermFeeList)) {
                this.lib.notification.warning('Please select atleast 1 Term for mapping');
                return;
            }
            // map selected FeeTerm from slFeeTermFeeList to dsFeeTermList
            this.dsFeeTermList.forEach((data) => {
                data.AcademicYearSysId = AcademicYearSysID;
                data.IsMapped = this.lib.isValidList(this.slFeeTermFeeList.filter(sdata => data.TransportFeeTermSysID === data.TransportFeeTermSysID
                    && sdata.TermSysID === data.TermSysID));
            });
            // Check dsFeeTermList has atleast 1 term mapped
            if (!this.lib.isValidList(this.dsFeeTermList.filter(mdata => mdata.IsMapped === true))) {
                this.lib.notification.warning('Please select atleast 1 Term for mapping');
                return;
            }
            // Send Mapped List to api
            this.lib.notification.confirm('Do you want to save ', () => {
                this.http.post(this.lib.getApiUrl('fees/transport-term-mapping/Save'), this.dsFeeTermList).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            }, () => { });
        } catch (ex) {
            this.lib.notification.error(ex.message);
        }
    }
    test(a: any) {
    }
    Reset_From_To_Date(AcademicYearSysID: number) {
        this.http.get(this.lib.getApiUrl('academic-year/read/' + AcademicYearSysID), this.dsFeeTermList).subscribe(
            (res) => {
                const MonthList = res.result.data.MonthList
                if (this.lib.isValidList(this.dsFeeTermList)) {
                    let term = 0;
                    this.dsFeeTermList.forEach((data) => {
                        data.FromMonth = MonthList[term].startDate;
                        data.ToMonth = MonthList[term].endDate;
                        term++;
                    });
                }
            },
            (err) => {
                this.lib.notification.error(err.message);
            }
        );
    }
}
export class Academicyear {
    AcademicYearSysID: string;
}

export class mlTransport_Fee_Term_Mapping {
    TransportFeeTermSysID = 0;
    FeeStructureSysID = 0;
    AcademicYearSysId = 0;
    TermSysID = 0;
    TermName = '';
    FeeCategorySysID = 0;
    FromMonth = '';
    ToMonth = '';
    BranchSysID = 0;
    IsMapped = false;
}