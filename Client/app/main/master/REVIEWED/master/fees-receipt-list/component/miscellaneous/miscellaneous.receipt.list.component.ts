import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';

@Component({
    selector: 'miscellaneous-receipt-list',
    templateUrl: './miscellaneous.receipt.list.component.html'
})

export class miscellaneous_receipt_list_Component implements OnInit {
    constructor(private lib: UtilityService, private http: ApiService) {
    }

    ngOnInit() {

    }
}