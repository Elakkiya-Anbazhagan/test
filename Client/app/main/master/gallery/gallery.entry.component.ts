import { Component, ViewChild, AfterViewInit, AfterContentInit, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
// import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { SelectGuruComponent, ApiService, UtilityService } from 'systemic/helper';
import { } from '@angular/forms';

@Component({
    selector: 'entry',
    template: require('./gallery.entry.component.html')
})
export class GalleryEntry_Component implements OnInit {
    @ViewChild('mdEntry') mdEntry: ModalComponent;
    frmGallery: FormGroup;

    buttonname: string;
    public lstGallery: IGalleryMaster[];
    constructor(private http: ApiService, private helper: UtilityService, private router: Router, private fb: FormBuilder) {
    }
    ngOnInit() {
        this.LoadData();
        this.ClearControl();
    }


    LoadData() {
        try {
            this.http.get(this.helper.getApiUrl('/gallery/ReadAll')).subscribe(
                (data) => {
                    this.lstGallery = data.result.GalleryList;
                }, (error) => {
                    this.helper.notification.error(error.message);
                });
        } catch (ex) {
            this.helper.notification.error(ex.message);
        }
    }

    ClearControl() {
        this.frmGallery = this.fb.group({
            GallerySysID: [0],
            GalleryName: ['', Validators.required],
            Description: ['', Validators.required],
            BranchSysID: [0],
        });
        this.frmGallery.clearValidators();
    }

    btnSaveGallery_Click(Gallery: IGalleryMaster) {
        this.helper.notification.confirm('Do you want to ' + (Gallery.GallerySysID === 0 ? 'insert ' : 'update ') + 'Gallery-' + Gallery.GalleryName, () => {
            try {
                console.log(Gallery);
                this.http.post(this.helper.getApiUrl('gallery/Save'), Gallery).subscribe(
                    (data) => {
                        this.helper.notification.success(data.message);
                        this.mdEntry.close();
                        this.ClearControl();
                        this.LoadData();
                    }, (error) => {
                        this.helper.notification.error(error.message);
                    })
            } catch (ex) {
                this.helper.notification.error(ex.message);
            }
        }, () => { });
    }


    btnClassGallery_Click(Gallery: IGalleryMaster) {
        this.frmGallery.controls['GalleryName'].setValue(Gallery.GalleryName);
        this.frmGallery.controls['GallerySysID'].setValue(Gallery.GallerySysID);
        this.frmGallery.controls['Description'].setValue(Gallery.Description);
        this.frmGallery.controls['BranchSysID'].setValue(Gallery.BranchSysID);
        this.mdEntry.open();
    }

    btnGalleryAdd_Click() {
        this.ClearControl();
        this.mdEntry.open();
    }
}


interface IGallery {
    GallerySysID: number;
    GalleryName: string;
    Description: string;
    BranchSysID: number;
    Approved: IApproved;
}
interface IGalleryDetail extends IApproved {
    GalleryImageSysID: number;
    FileName: string;
    FileType: string;
    GallerySysID: number;
    IsDeleted: boolean;
}

interface IGalleryMaster extends IApproved {
    GallerySysID: number;
    GalleryName: string;
    Description: string;
    BranchSysID: number;
    lstImageDetail: IGalleryDetail[];
    lstVideoDetail: IGalleryDetail[];
}

interface IApproved {
    IsApproved: boolean;
    ApprovedBy: string;
    ApprovedDate: string;
}

interface IDD {
    id: string,
    text: string
}