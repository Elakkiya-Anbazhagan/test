// System Import
import { Routes, RouterModule } from '@angular/router';
// Custom Import
import { SharedLayoutComponent } from '../../../../shared';
import { AppGuardian } from '../../../../../guardian';
import {
    academic_receipt_list_Component,
    transport_receipt_list_Component,
    miscellaneous_receipt_list_Component
} from './component'
const routes: Routes = [
    // {
    // path: 'app/fees-receipt-list',
    // component: SharedLayoutComponent,
    // canActivateChild: [AppGuardian],
    // children: [
    //     { path: 'academic', component: academic_receipt_list_Component },
    //     { path: 'transport', component: transport_receipt_list_Component },
    //     { path: 'miscellaneous', component: miscellaneous_receipt_list_Component }
    // ]
    // }
    { path: 'academic', component: academic_receipt_list_Component },
    { path: 'transport', component: transport_receipt_list_Component },
    { path: 'miscellaneous', component: miscellaneous_receipt_list_Component }
]
export const fees_receipt_list_routing = RouterModule.forChild(routes);