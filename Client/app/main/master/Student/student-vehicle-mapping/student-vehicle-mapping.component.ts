import { Router } from '@angular/router';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Title } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ViewChild, OnInit, Component } from '@angular/core';

import { UtilityService, ApiService } from 'systemic/helper';
import * as InterFace from './../../../InterFace';

@Component({
    selector: 'student-vehicle-mapping',
    templateUrl: './student-vehicle-mapping.component.html'
})

export class Student_Vehicle_Mapping_Component implements OnInit {

    public mlViewTransport: mlViewTransport;
    dsMappedStudentList: mlViewTransport[];

    isSearchMode: Boolean = true;
    dsAcademicyearData: Array<InterFace.Idd>;
    dsRouteData: Array<InterFace.Idd>;
    dsStoppageData: Array<InterFace.Idd>;
    dsVehicleData: Array<InterFace.Idd>;
    dsTripData: Array<InterFace.Idd>;

    constructor(private http: ApiService, private router: Router, private lib: UtilityService) {
        lib.setBrowserTitle('Student vehicle Mapping');
        lib.setPageTitle('Student vehicle Mapping');
    }

    ngOnInit() {
        this.mlViewTransport = new mlViewTransport;
        this.dsMappedStudentList = [];
    }
    btnView_click() {
        this.isSearchMode = false;
    }
    frmStudentVehicleMap_Submit() { }
}

export class mlViewTransport {
    AcademicYearSysID = '';
    RouteSysID = '';
    StopSysID = '';
    VehicleSysID = '';
    TripSysID = '';
    Amount = '';

    ClassSysID = '';
    ClassName = '';
    SectionSysID = '';
    SectionName = '';
    AdmissionNo = '';
    StudentSysID = '';
    StudentName = '';
}
