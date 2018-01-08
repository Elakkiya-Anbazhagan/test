import { Component, ViewChild, OnInit } from '@angular/core';
import { UtilityService, ApiService } from 'systemic/helper';
import { NgForm } from '@angular/forms/src/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as moment from 'moment';

@Component({
    selector: 'menu-card',
    templateUrl: 'menu-card.component.html'
})

export class Menu_Card_Component implements OnInit {
    isAllowAdd: boolean;
    isAllowEdit: boolean;
    @ViewChild('mdMenuCardEntry') mdMenuCardEntry: ModalComponent;
    public isEditMode: boolean;
    public MenuCardList: mlmenuentry[];
    public mlmenuentry: mlmenuentry;

    constructor(private lib: UtilityService, private http: ApiService) {
        this.lib.setBrowserTitle('MenuCard Entry');
        this.lib.setPageTitle('MenuCard Entry');
        this.lib.LoadPageAction(http, (res: any) => {
            this.isAllowAdd = this.lib.isActionAllowed('Add');
            this.isAllowEdit = this.lib.isActionAllowed('Edit');
        });
    }

    ngOnInit() {
        this.mlmenuentry = new mlmenuentry();
        this.LoadData();
        console.log(this.mlmenuentry.MenuCardDate = moment().format('DD/MM/YYYY'));

    }
    btnAdd_Click() {
        this.mlmenuentry = new mlmenuentry();
        this.isEditMode = false;
        this.mdMenuCardEntry.open();
        this.mlmenuentry.MenuCardDate = moment().format('DD/MM/YYYY');
    }
    LoadData() {
        this.http.get(this.lib.getApiUrl('MenuCard/readall')).subscribe(
            (res) => {
                this.MenuCardList = [];
                this.MenuCardList = res.result.data;
            }, (err) => {
                this.lib.notification.error(err.message);
            });
    }
    btnEdit_Click(menuEntry: mlmenuentry) {
        this.mlmenuentry.MenuCardSysID = menuEntry.MenuCardSysID;
        this.mlmenuentry.MenuCard = menuEntry.MenuCard;;
        this.mlmenuentry.MenuCardDate = menuEntry.MenuCardDate;
        this.isEditMode = true;
        this.mdMenuCardEntry.open();
    }

    btnSave_click(mlmenuentry: mlmenuentry, fromdata: NgForm) {
        this.lib.notification.confirm('Do you want to ' + (this.mlmenuentry.MenuCardSysID === 0 ? 'insert' : 'Update ') + ' Menu-Card' + '(' + this.mlmenuentry.MenuCard + ')', () => {
            try {
                this.http.post(this.lib.getApiUrl('MenuCard/save'), this.mlmenuentry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        fromdata.resetForm();
                        this.mdMenuCardEntry.close();
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });

    }
    btnDelete_Click(menuEntry: mlmenuentry) {
        this.lib.notification.confirm('Do you want to delete ' + (menuEntry.MenuCard), () => {
            try {
                this.http.post(this.lib.getApiUrl('MenuCard/delete/' + menuEntry.MenuCardSysID), this.mlmenuentry).subscribe(
                    (res) => {
                        this.lib.notification.success(res.message);
                        this.LoadData();
                    },
                    (err) => {
                        this.lib.notification.error(err.message);
                    }
                );
            } catch (ex) {
                this.lib.notification.error(ex.message);
            }
        }, () => { });
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