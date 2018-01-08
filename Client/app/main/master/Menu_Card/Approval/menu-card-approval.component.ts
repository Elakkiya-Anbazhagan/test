import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms/src/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as moment from 'moment';

@Component({
    selector: 'menu-card-approval',
    templateUrl: 'menu-card-approval.component.html'
})

export class Menu_Card_Approval_Component implements OnInit {
    @ViewChild('mdCancel') mdCancel: ModalComponent;
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    @ViewChild('mdMenuCardEntry') mdMenuCardEntry: ModalComponent;
    public isEditMode: boolean;
    public MenuCardList: mlmenuentry[];
    public mlmenuentry: mlmenuentry;
    ToDate = '';
    FromDate = '';

    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('MenuCard Approval');
        this.lib.setPageTitle('MenuCard Approval');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
        });
    }

    ngOnInit() {
        this.mlmenuentry = new mlmenuentry();
        this.LoadData();
        this.ToDate = moment().format('DD/MM/YYYY');
        this.FromDate = moment().format('DD/MM/YYYY');
    }
    LoadData() {
        this.MenuCardList = [];
        if (!this.lib.isNullOrUndefined(this.FromDate) && !this.lib.isNullOrUndefined(this.ToDate)) {
            this.http.get(this.lib.getApiUrl('MenuCard/MenuCardApprovalList?FromDate=' + encodeURIComponent(this.FromDate) + '&ToDate=' + encodeURIComponent(this.ToDate))).subscribe(
                (res) => {
                    this.MenuCardList = res.result.data;
                }, (err) => {
                    this.lib.notification.error(err.message);
                });
        }
    }

    btnApproval_Click(menuentry: mlmenuentry) {
        this.lib.notification.confirm('Do you want to approve ', () => {
            this.http.post(this.lib.getApiUrl('MenuCard/MenuCard_approval'), menuentry).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadData();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                });
        }, () => { });
    }

    btnCancel_Click(menucancelentry: mlmenuentry) {
        this.mlmenuentry = new mlmenuentry();
        this.mlmenuentry.MenuCardSysID = menucancelentry.MenuCardSysID;
        this.mlmenuentry.MenuCard = menucancelentry.MenuCard;
        this.mdCancel.open();
    }
    btnMenuCancel_Click() {
        this.lib.notification.confirm('Do you want to cancel voucher ' + this.mlmenuentry.MenuCard, () => {
            this.http.post(this.lib.getApiUrl('MenuCard/Menu-cancel'), this.mlmenuentry).subscribe(
                (res) => {
                    this.lib.notification.success(res.message);
                    this.LoadData();
                    this.mdCancel.close();
                },
                (err) => {
                    this.lib.notification.error(err.message);
                }
            );
        }, () => {

        });
    }

}

class mlmenuentry {
    MenuCardSysID: number;
    MenuCardDate: string;
    MenuCard: string;
    IsApproved: Boolean = false;
    ApprovedBy: string;
    ApprovedDate: string;
    Iscancelled: Boolean = false;
    CancelledBy: string;
    CancelledDate: string;
    CancelledReason: string;
    IsDeleted: Boolean;
    constructor() {
        this.MenuCardSysID = 0;
    }

}