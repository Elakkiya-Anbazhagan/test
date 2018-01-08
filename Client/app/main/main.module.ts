import { Multiple_Salary_Issue_Component } from './master/Payroll/SalaryIssue/MultipleSalaryIssue/Multiple-Salary-Issue.Component';
// Reviewed
import * as reviewed from './master/REVIEWED/master'

import * as app from './master/index';
import { AppErrorComponent } from './error/main.error.page';
import {
    NgModule, Directive, ElementRef, Input, forwardRef, OnInit, ViewEncapsulation,
    ChangeDetectionStrategy, Component
    , Output, Renderer, EventEmitter, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel } from '@angular/forms';

// PrimeNg Plugins
import {
    DataTableModule, SharedModule, CalendarModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, ListboxModule, InputTextModule,
    InputMaskModule, MultiSelectModule, RadioButtonModule, DataGridModule, TabViewModule, SliderModule, TreeTableModule, TreeNode, TreeModule, PaginatorModule, AutoCompleteModule
} from 'primeng/primeng';

// route-table-Module
import { MainRouting } from './main.routes';

// Guardian - Services
import * as auth from '../guardian';

// Shared-Layout-Component
import {
    SharedLayoutComponent,
    TopbarComponent,
    SidebarLeftComponent,
    FooterComponent
} from './shared';

// Dashboard-Component
import * as dashboard from './dashboard';

// Utilites-Component
import * as helper from 'systemic/helper';

// Plugins
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TooltipModule } from 'ng2-tooltip';

declare var Inputmask: any;
const noop = () => {
};

@Directive({
    selector: '[app-restrict-input]',
    host: {
        '(input)': 'onInput()'
    }
})
export class RestrictInputDirective implements OnInit {
    private inputElement: HTMLInputElement;
    private innerValue: any = '';
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
    @Input('app-restrict-input')
    public set defineInputType(type: string) {
        Inputmask({
            alias: 'numeric',
            autoGroup: true,
            digits: 2,
            digitsOptional: false,
            placeholder: '0',
            min: $(this.el.nativeElement).attr('guru-value-min'),
            max: $(this.el.nativeElement).attr('guru-value-max'),
            oncomplete: (e: any) => {
                const pos = this.el.nativeElement.selectionStart;
                const val = this.el.nativeElement.value;
            }
        }).mask(this.el.nativeElement);
    }

    constructor(private el: ElementRef, private ngModel: NgModel) {
        this.inputElement = el.nativeElement;
    }

    ngOnInit() {
        setTimeout(() => this.onInput());
    }
    onInput() {
        const initialValue = this.inputElement.value;
    }
}
@NgModule({
    imports: [
        reviewed.fees_receipt_list_module,


        // ./main.routes route-table-Module
        MainRouting,
        // @angular/common-Modules
        CommonModule,
        // primeng/primeng-Modules
        DataTableModule, SharedModule, CalendarModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, ListboxModule,
        InputMaskModule, MultiSelectModule, RadioButtonModule, DataGridModule, TabViewModule, SliderModule, TreeTableModule, TreeModule, AutoCompleteModule,
        PaginatorModule,
        InputTextModule,
        helper.SelectGuruModule,
        helper.CalendarGuruModule,
        // Plugins
        Ng2Bs3ModalModule,
        // @angular/forms-Module
        ReactiveFormsModule,
        FormsModule,
        TooltipModule
    ],
    providers: [
        auth.AppGuardian,
        auth.AppGuardianService
    ],
    declarations: [
        RestrictInputDirective,
        // Master-Layout-Component
        SharedLayoutComponent,
        TopbarComponent,
        SidebarLeftComponent,
        FooterComponent,

        // Page-Component
        dashboard.DashboardComponent,

        // Widgets
        dashboard.Academic_Current_Info_Component,
        dashboard.Academic_Arrear_Widget_Component,

        app.Fees_Category_Component,
        app.Fees_AccountMap_Component,
        // app.Fees_Concession_Component,
        app.Academic_Fees_Concession_Component,
        app.Transport_Fees_Concession_Component,

        app.Account_Ledger_Component,
        app.Account_Voucher_Component,
        app.Account_Voucher_Old_Component,
        app.Inward_Cheque_Component,
        app.Outward_Cheque_Component,
        app.LedgerWise_Trans_Component,
        app.DayBook_Close_Component,

        app.Student_Admission_Entry_Component,
        app.Student_Admission_List_Component,
        // app_master.TempComponent,
        app.Student_Promotion_Component,
        app.Student_Attendance_List_Component,
        app.Student_Attendance_Entry_Component,
        app.Student_Message_Component,
        app.Student_Notification_Component,

        app.Fees_Collection_Component,
        app.Academic_Fees_Collection_Component,
        app.Transport_Fees_Collection_Component,
        app.Other_Fee_Collection_Component,

        app.Fees_Concession_Component,
        app.Academic_Fees_Concession_Component,
        app.Transport_Fees_Concession_Component,

        app.Academic_Fees_Structure_Component,
        app.Transport_Fees_Structure_Component,
        app.Miscellaneous_Fee_Structure_Component,
        app.Other_Fee_Structure_Component,

        app.Fees_Structure_Approval_Component,
        app.Transport_Route_Component,
        app.Transport_Stoppage_Component,
        app.Transport_Vehicle_Component,
        app.Transport_Fees_Term_Mapping_Component,
        app.Transport_Student_Allotment_Component,
        // report
        app.Academic_Fee_Collection_report_Component,
        app.Ledger_ReportComponent,
        app.Student_Info_Report_Component,
        app.Transport_Circular_Component,
        app.Transport_Fee_Collection_report_Component,
        app.Bank_Ledger_Component,
        app.Day_Book_Component,
        app.Concession_Report_Component,

        // concession approval list
        app.Academic_Concession_approval_list_Component,
        app.transport_Concession_approval_list_Component,

        // Receipt
        app.Receipt_List_Component,
        app.Miscellaneous_Receipt_Component,
        app.Transport_Receipt_Component,
        app.OtherFeet_List_Component,

        // Enquiry
        app.Admission_Enquiry_Component,
        // certificate
        app.Tc_Active_InActive_Component,
        app.Certificate_Tc_Issue_Component,

        // PayRoll
        app.Department_Component,
        app.Designation_Component,
        app.Staff_Registration_Component,
        app.Permission_Component,
        app.Leave_Component,
        app.Staff_Attendance_Approval_Component,
        app.Staff_Loan_Component,
        app.Staff_Salary_Issue_Component,
        app.Holiday_Component,
        app.SpecialDay_Component,
        app.Salary_Issue_Component,
        app.Salary_Cash_Issue_Component,
        app.Salary_Bank_Issue_Component,
        app.Multiple_Salary_Issue_Component,

        // home work
        app.HomeWork_Entry_Component,
        // Master
        app.AdminMenuComponent,
        app.Role_Component,
        app.ProfileComponent,
        // d
        app.Menu_Card_Component,
        app.Menu_Card_Approval_Component,
        // student Exam Mark
        app.Exam_Entry_Component,
        app.ExamMarkUploadComponent,
        app.Exam_Mark_Approvel,
        // Gallery
        app.GalleryApproval_Component,
        app.GalleryEntry_Component,
        app.GalleryUpload_Component,
        // SMS Notification
        app.SmsNotification_Component,

        AppErrorComponent
    ],
    exports: [SharedLayoutComponent]
})
export class MainModule {

}
