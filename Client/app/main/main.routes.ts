import { SmsNotification_Component } from './master/SmsNotification/SmsNotification.Component';
import { Student_Message_Component } from './master/Student/MessageNotification/message/Student-Message.Component';
import { Multiple_Salary_Issue_Component } from './master/Payroll/SalaryIssue/MultipleSalaryIssue/Multiple-Salary-Issue.Component';
import { Permission_Component } from './master/Payroll/Permission/Permission.Component';
import { Designation_Component } from './master/Payroll/Designation/Designation.Component';
import { Department_Component } from './master/Payroll/Department/Department.Component';
import { Concession_Report_Component } from './master/Report/Concession/Concession-Report.component';
import { OtherFeet_List_Component } from './master/Account/Receipt/OtherFee-Receipt/OtherFee-list.component';
import * as app from './master/index';
import { AppErrorComponent } from './error/main.error.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedLayoutComponent } from './shared';
import { DashboardComponent } from './dashboard';
import { AppGuardian } from '../guardian';

const routes: Routes = [
    { path: 'app', redirectTo: 'app/dashboard', pathMatch: 'full' },
    {
        path: 'app-error', component: SharedLayoutComponent, children: [
            { path: '', component: AppErrorComponent }
        ]
    },

    {
        path: 'app',
        component: SharedLayoutComponent,
        canActivateChild: [AppGuardian],
        children: [
            { path: 'error', component: AppErrorComponent },
            { path: 'menu', component: app.AdminMenuComponent },
            { path: 'role', component: app.Role_Component },
            { path: 'profile', component: app.ProfileComponent },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'enquiry', children: [
                    { path: 'admission-enquiry', component: app.Admission_Enquiry_Component },
                ]
            },
            {
                path: 'homework', children: [
                    { path: 'homework-entry', component: app.HomeWork_Entry_Component },
                ]
            },
            {
                path: 'fees', children: [
                    {
                        path: 'receipt-list', loadChildren: () => require('./master/REVIEWED/master/fees-receipt-list/fees.receipt.list.module')['fees_receipt_list_module']
                    },
                    {
                        path: 'master', children: [
                            { path: 'category', component: app.Fees_Category_Component },
                            { path: 'account-map', component: app.Fees_AccountMap_Component }
                        ]
                    },
                    {
                        path: 'academic-fees', children: [
                            { path: 'structure', component: app.Academic_Fees_Structure_Component },
                            { path: 'structure/:mode/:academicyearsysid', component: app.Academic_Fees_Structure_Component },
                            { path: 'academic-concession-approval-list', component: app.Academic_Concession_approval_list_Component }
                        ]
                    },
                    {
                        path: 'transport-fees', children: [
                            { path: 'structure', component: app.Transport_Fees_Structure_Component },
                            { path: 'structure/:mode/:academicyearsysid', component: app.Transport_Fees_Structure_Component },
                            { path: 'transport-concession-approval-list', component: app.transport_Concession_approval_list_Component }
                        ]
                    },
                    {
                        path: 'miscellaneous-fees', children: [
                            { path: 'structure', component: app.Miscellaneous_Fee_Structure_Component },
                            { path: 'structure/:mode/:academicyearsysid', component: app.Miscellaneous_Fee_Structure_Component }
                        ]
                    },
                    {
                        path: 'other-fees', children: [
                            { path: 'structure', component: app.Other_Fee_Structure_Component },
                        ]
                    },
                    // { path: 'concession', component: app.Fees_Concession_Component },
                    { path: 'approval', component: app.Fees_Structure_Approval_Component },
                    { path: 'collection', component: app.Fees_Collection_Component },
                    { path: 'concession', component: app.Fees_Concession_Component }
                ]
            },
            {
                path: 'transport', children: [
                    { path: 'route', component: app.Transport_Route_Component },
                    { path: 'stoppage', component: app.Transport_Stoppage_Component },
                    { path: 'vehicle', component: app.Transport_Vehicle_Component },
                    { path: 'term-map', component: app.Transport_Fees_Term_Mapping_Component },
                    { path: 'student-allotment', component: app.Transport_Student_Allotment_Component }
                ]
            },
            {
                path: 'account', children: [
                    { path: 'ledger', component: app.Account_Ledger_Component },
                    { path: 'voucher', component: app.Account_Voucher_Component },
                    { path: 'voucher-old', component: app.Account_Voucher_Old_Component },
                    {
                        path: 'brs', children: [
                            { path: 'inward', component: app.Inward_Cheque_Component },
                            { path: 'outward', component: app.Outward_Cheque_Component },
                            { path: 'daybook-close', component: app.DayBook_Close_Component }
                        ]
                    },
                    { path: 'receiptlist', component: app.Receipt_List_Component },
                    { path: 'transportreceiptlist', component: app.Transport_Receipt_Component },
                    { path: 'miscellaneousreceiptlist', component: app.Miscellaneous_Receipt_Component },
                    { path: 'otherfeereceiptlist', component: app.OtherFeet_List_Component }
                ]
            }, {
                path: 'report', children: [
                    { path: 'feecollection', component: app.Academic_Fee_Collection_report_Component },
                    { path: 'Ledgerwisereport', component: app.Ledger_ReportComponent },
                    { path: 'student-info-rpt', component: app.Student_Info_Report_Component },
                    { path: 'transport-circular-rpt', component: app.Transport_Circular_Component },
                    { path: 'transport-fee-collection-rpt', component: app.Transport_Fee_Collection_report_Component },
                    { path: 'bank-ledger-wise-rpt', component: app.Bank_Ledger_Component },
                    { path: 'day-book-rpt', component: app.Day_Book_Component },
                    { path: 'concession-rpt', component: app.Concession_Report_Component }
                ]
            },
            {
                path: 'certificate', children: [
                    {
                        path: 'tc-active-inActive', children: [
                            { path: 'tc', component: app.Tc_Active_InActive_Component },
                        ]
                    },
                    { path: 'tc-certificate', component: app.Certificate_Tc_Issue_Component },
                ]
            },
            {
                path: 'student', children: [
                    { path: 'admission', component: app.Student_Admission_List_Component },
                    { path: 'promotion', component: app.Student_Promotion_Component },
                    {
                        path: 'attendance', children: [
                            { path: 'list', component: app.Student_Attendance_List_Component },
                            { path: 'entry', component: app.Student_Attendance_Entry_Component }
                        ]
                    },
                    { path: 'message', component: app.Student_Message_Component },
                    { path: 'notification', component: app.Student_Notification_Component }
                ]
            },
            {
                path: 'Menu-Card', children: [
                    { path: 'MenuCardEntry', component: app.Menu_Card_Component },
                    { path: 'MenuCardApproval', component: app.Menu_Card_Approval_Component },
                ]
            },
            {
                path: 'exam', children: [
                    { path: 'mark-entry', component: app.Exam_Entry_Component },
                    { path: 'mark-upload', component: app.ExamMarkUploadComponent },
                    { path: 'mark-approval', component: app.Exam_Mark_Approvel }
                ]
            },
            {
                path: 'payroll', children: [
                    { path: 'department', component: app.Department_Component },
                    { path: 'designation', component: app.Designation_Component },
                    { path: 'staff-registration', component: app.Staff_Registration_Component },
                    { path: 'staff-permission', component: app.Permission_Component },
                    { path: 'staff-leave', component: app.Leave_Component },
                    { path: 'staff-attendance', component: app.Staff_Attendance_Approval_Component },
                    { path: 'staff-loan', component: app.Staff_Loan_Component },
                    { path: 'staff-salary', component: app.Staff_Salary_Issue_Component },
                    { path: 'holiday', component: app.Holiday_Component },
                    { path: 'specialday', component: app.SpecialDay_Component },
                    { path: 'staff-salary-issue', component: app.Salary_Issue_Component },
                    { path: 'multiple-staff-salary-issue', component: app.Multiple_Salary_Issue_Component }
                ]
            },
            {
                path: 'gallery',
                children: [
                    // { path: 'entry', component: components.GalleryEntryComponent },
                    { path: 'entry', component: app.GalleryUpload_Component },
                    { path: 'approval', component: app.GalleryApproval_Component }
                ]
            },
            { path: 'sms-notification', component: SmsNotification_Component }
        ]
    }
];

export const MainRouting = RouterModule.forChild(routes);
