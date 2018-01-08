import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ViewChild, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';


import { UtilityService, ApiService } from 'systemic/helper';
import * as ml from './../../InterFace';
import * as InterFace from './../../InterFace';

@Component({
    selector: 'certificate-sample',
    templateUrl: 'certificate-issue.component.html'
})

export class Certificate_Tc_Issue_Component implements OnInit {
    public mlTcInfo: mlTcEntryInfo;
    public dsClassData: Array<InterFace.Idd>
    public dsSectionData: Array<InterFace.Idd>;
    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('TC Entry');
        this.lib.setPageTitle('TC Entry');
    }

    ngOnInit() {
        this.mlTcInfo = new mlTcEntryInfo();
    }
}

export class mlTcEntryInfo {
    ClassSysID: string;
    ClassName: string;
    SectionSysID: string;
    SectionName: string;
    AdmissionNOSysID: string;
    AdmisionNo: string;
    StudentName: string;
    FatherName: string;
    DOB: string;
    AdmissionClassSysID: string;
    AdmissionYear: string;
    PresentClassSysID: string;
    PromotionClassSysID: string;
}