import { Component, ViewChild, AfterViewInit, AfterContentInit, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
// import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { SelectGuruComponent, ApiService, UtilityService } from 'systemic/helper';
declare var application: any;
@Component({
    selector: 'approval',
    template: require('./gallery.approval.component.html')
})
export class GalleryApproval_Component implements OnInit {
    @ViewChild('mdUpload') mdUpload: ModalComponent;

    @ViewChild('ddlGallery') ddlGallery: SelectGuruComponent;
    public hasFile: boolean;
    GalleryListData: Array<IDD>;
    lstVideoDetail: IGalleryDetail[] = [];
    lstImageDetail: IGalleryDetail[] = [];
    GalleryData: IGalleryMaster;
    GalleryName: string;
    Description: string;
    frmImport: FormGroup;
    ImageBaseUrl: string;
    IsEditMode: boolean;
    IsAllowApprove: boolean;

    public ImageFile: File[];
    public lstGalley: IGalleryMaster[];

    constructor(private http: ApiService, public helper: UtilityService, private router: Router, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.ClearControl();
        this.ImageBaseUrl = this.helper.GetGalleryUrl('small');
        this.IsEditMode = false;
        this.LoadData();

        this.IsAllowApprove = false;
    }

    LoadData() {
        try {
            this.http.get(this.helper.getApiUrl('gallery/gallerylist')).subscribe(
                (data) => {
                    this.GalleryListData = data.result.GalleryList;
                }, (error) => {
                    this.helper.notification.error(error.message);
                });
        } catch (ex) {
            this.helper.notification.error(ex.message);
        }
    }


    OnGalleryChange(event: any) {
        try {
            if (this.helper.isValidSelectedValue(event.value)) {
                this.http.get(this.helper.getApiUrl('/gallery/Read/' + event.value)).subscribe(
                    (data) => {
                        if (this.helper.isValidModel(data.result.GalleryData)) {
                            this.GalleryData = data.result.GalleryData;
                            application.helper.plugin.CheckImage();
                        }
                    }, (error) => {
                        this.helper.notification.error(error.message);
                    });
            }
        } catch (ex) {
            this.helper.notification.error(ex.message);
        }
    }

    ClearControl() {
        this.frmImport = this.fb.group({
            fuImage: ['', Validators.required]
        });
        this.GalleryData = {
            GallerySysID: 0,
            GalleryName: '',
            Description: '',
            BranchSysID: 0,
            IsApproved: false,
            ApprovedBy: '',
            ApprovedDate: '',
            lstImageDetail: [],
            lstVideoDetail: []
        };
        this.hasFile = false;
        this.lstGalley = [];
    }

    btnSaveGallery_Click() {
        if (this.GalleryData.GalleryName === '' || this.GalleryData.Description === '') {
            this.helper.notification.warning('Please Enter Gallery Name And Description.');
        } else {
            this.helper.notification.confirm('Do you want Save Gallery' + this.GalleryData.GalleryName, () => {
                try {
                    this.http.post(this.helper.getApiUrl('gallery/Save'), this.GalleryData).subscribe(
                        (data) => {
                            this.helper.notification.success(data.message);
                            this.ClearControl();
                            this.IsEditMode = false;
                            this.LoadData();
                        }, (error) => {
                            this.helper.notification.error(error.message);
                        })
                } catch (ex) {
                    this.helper.notification.error(ex.message);
                }
            }, () => { });
        }
    }


    btnApproveGallery_Click() {
        if (this.helper.isValidList(this.GalleryData.lstImageDetail) || this.helper.isValidList(this.GalleryData.lstVideoDetail)) {
            this.helper.notification.confirm('Do you want Approve Gallery', () => {
                try {
                    this.http.post(this.helper.getApiUrl('gallery/ApproveMedia/' + this.GalleryData.GallerySysID), this.GalleryData).subscribe(
                        (data) => {
                            this.helper.notification.success(data.message);
                            this.ClearControl();
                            if (this.helper.isValidSelectedValue(this.ddlGallery.selectedvalue)) {
                                this.OnGalleryChange(this.ddlGallery.selectedvalue);
                            }
                        }, (error) => {
                            this.helper.notification.error(error.message);
                        })
                } catch (ex) {
                    this.helper.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.helper.notification.warning('Image & Video list is empty.');
        }
    }

    btnImageApprove_Click(lstImage: IGalleryDetail) {
        lstImage.IsApproved = true;
    }

    btnImageApproveReset_Click(lstImage: IGalleryDetail) {
        lstImage.IsApproved = false;
    }

    btnVideoApprove(lstImage: IGalleryDetail) {
        lstImage.IsApproved = true;
    }
    btnVideoApproveReset(lstImage: IGalleryDetail) {
        lstImage.IsApproved = false;
    }
    NewVideoUrl() {
        this.GalleryData.lstVideoDetail.push({
            GalleryImageSysID: 0,
            FileName: '',
            FileType: 'Video',
            GallerySysID: 0,
            IsApproved: false,
            ApprovedBy: '',
            ApprovedDate: '',
            IsDeleted: false
        });
    }

    btnUpload_Click() {
        if (this.hasFile) {
            const formData: FormData = new FormData();
            // tslint:disable-next-line:forin
            for (const i in this.ImageFile) {
                formData.append(this.ImageFile[i].name, this.ImageFile[i]);
            }
            this.helper.notification.confirm('Do you want Upload image file', () => {
                try {
                    const headers = new Headers()
                    headers.set('Accept', 'application/json');
                    this.http.post(this.helper.getApiUrl('gallery/UploadImage'), formData, { headers }).subscribe(
                        (data) => {
                            this.helper.notification.success(data.message);
                            this.lstImageDetail = data.result.ImageList;
                            // tslint:disable-next-line:forin
                            for (const i in this.lstImageDetail) {
                                this.GalleryData.lstImageDetail.push(this.lstImageDetail[i]);
                            }
                            this.mdUpload.close();
                        }, (error) => {
                            this.helper.notification.error(error.message);
                        })
                } catch (ex) {
                    this.helper.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.helper.notification.error('Please Select image File');
        }
    }


    fileChange(event: any) {
        this.ImageFile = event.target.files;
        this.hasFile = (this.ImageFile !== undefined);
        this.lstVideoDetail = [];
        this.lstGalley = [];

    }

    btnFileImport_Click() {
        this.hasFile = false;
        this.mdUpload.open();
    }

    btnCloseGallery_Click() {
        this.ClearControl();
        this.lstImageDetail = [];
        this.lstVideoDetail = [];
        this.ImageFile = [];
        this.IsEditMode = false;
        this.LoadData();
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