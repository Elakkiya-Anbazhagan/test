import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FormsModule } from '@angular/forms';
import { DataTableModule, SharedModule, DropdownModule } from 'primeng/primeng';
import { SelectGuruModule, CalendarGuruModule } from 'systemic/helper';
import { fees_receipt_list_routing } from './fees.receipt.list.routes';
import {
    academic_receipt_list_Component,
    transport_receipt_list_Component,
    miscellaneous_receipt_list_Component,
    fees_receipt_list_Component,
    fees_receipt_options_Component
} from './component'

@NgModule({
    imports: [fees_receipt_list_routing, CommonModule, Ng2Bs3ModalModule, FormsModule, SelectGuruModule, CalendarGuruModule, DataTableModule, SharedModule, DropdownModule],
    providers: [],
    declarations: [academic_receipt_list_Component, transport_receipt_list_Component, miscellaneous_receipt_list_Component, fees_receipt_options_Component, fees_receipt_list_Component]
})
export class fees_receipt_list_module {

}
