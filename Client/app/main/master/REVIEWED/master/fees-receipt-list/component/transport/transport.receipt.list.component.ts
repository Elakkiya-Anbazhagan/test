import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';

@Component({
    selector: 'transport-receipt-list',
    templateUrl: './transport.receipt.list.component.html'
})

export class transport_receipt_list_Component implements OnInit {
    constructor(private lib: UtilityService, private http: ApiService) {
    }

    ngOnInit() {

    }
}