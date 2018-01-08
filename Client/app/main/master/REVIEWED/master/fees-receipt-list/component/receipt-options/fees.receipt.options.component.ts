// System Inport
import { OnInit, Input, ViewChild, EventEmitter, Output, Component, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// Custom Import
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UtilityService, ApiService } from 'systemic/helper';

@Component({
    selector: 'fees-receipt-options',
    templateUrl: './fees.receipt.options.component.html'
})
export class fees_receipt_options_Component implements OnInit, AfterContentChecked {
    public mlCancelReason: ICancelReason;
    @Input() ReceiptSysID: number;
    @Input() ReceiptNo: string;
    @Input() ReceiptType: string;
    @Input() AllowCancel: boolean;
    @Input() AllowPrint: boolean;
    @Input() IsCancelled: boolean;
    @Input() CancelLabelStyle: string;
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    @ViewChild('frmReceiptCancel') frmReceiptCancel: NgForm;
    @Output() OnCancel_Click = new EventEmitter();
    @Output() OnReceipt_Cancel = new EventEmitter();
    constructor(private http: ApiService, private router: Router, public lib: UtilityService) {
        this.mlCancelReason = new ICancelReason();
    }
    ngOnInit(): void {
        this.mlCancelReason = new ICancelReason();
    }
    ngAfterContentChecked() {
    }
    btnCancelReceipt_Click() {
        this.frmReceiptCancel.resetForm();
        this.OnCancel_Click.emit();
        this.mdCancel.open();
        this.mlCancelReason = new ICancelReason();
        this.mlCancelReason.ReceiptSysID = this.ReceiptSysID;
        this.mlCancelReason.ReceiptNo = this.ReceiptNo;
        console.log(this.mlCancelReason);
    }
    btnPrintReceipt_Click() {
        let url = '';
        if (this.ReceiptType === 'Academic_Receipt') {
            url = '/Report/academic-fee-receipt/' + this.ReceiptSysID + '/PDF';
        } else if (this.ReceiptType === 'Transport_Receipt') {
            url = '/Report/academic-fee-receipt/' + this.ReceiptSysID + '/PDF';
        } else if (this.ReceiptType === 'Miscellaneous_Receipt') {
            url = '/Report/academic-fee-receipt/' + this.ReceiptSysID + '/PDF';
        }
        window.open(this.lib.getApiUrl(url), 'ReceiptPrint', 'height=500,width=500');
    }
    frmCancelSubmit() {
        this.lib.notification.confirm('Do you want to cancel Receipt No: ' + this.mlCancelReason.ReceiptNo,
            () => {
                let Url = '';
                if (this.ReceiptType === 'Academic_Receipt') {
                    Url = this.lib.getApiUrl('fees/academic-receipt/cancel');
                } else if (this.ReceiptType === 'Transport_Receipt') {
                    Url = this.lib.getApiUrl('fees/transport-receipt/cancel');
                } else if (this.ReceiptType === 'Miscellaneous_Receipt') {
                    Url = this.lib.getApiUrl('fees/miscellaneous-receipt/cancel');
                }
                if (Url !== '') {
                    this.http.post(Url, this.mlCancelReason).subscribe(
                        (res) => {
                            this.lib.notification.success(res.message);
                            this.mdCancel.close();
                            this.OnReceipt_Cancel.emit();
                        },
                        (err) => {
                            this.lib.notification.error(err.message);
                        }
                    );
                }
            },
            () => {
            }
        );
    }
}
class ICancelReason {
    ReceiptSysID = 0;
    ReceiptNo = '';
    CancelledReason = '';
    IsCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    IsDeleted = false;
}