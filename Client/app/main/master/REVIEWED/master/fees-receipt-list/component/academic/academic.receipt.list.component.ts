import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';

@Component({
    selector: 'academic-receipt-list-component',
    templateUrl: './academic.receipt.list.component.html'
})

export class academic_receipt_list_Component implements OnInit {
    constructor(private lib: UtilityService, private http: ApiService) {
    }

    ngOnInit() {

    }
}