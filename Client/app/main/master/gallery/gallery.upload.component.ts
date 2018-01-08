import { Component, ViewChild, AfterViewInit, AfterContentInit, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import { SelectGuruComponent, ApiService, UtilityService, HttpService, IApiResponse, IApiSuccess, IApiFailure } from 'systemic/helper';
declare var applicationService: any;
declare var application: any;
@Component({
    selector: 'upload',
    template: require('./gallery.upload.component.html')
})
export class GalleryUpload_Component implements OnInit {
    @ViewChild('mdUpload') mdUpload: ModalComponent;
    public hasFile: boolean;
    lstVideoDetail: IGalleryDetail[] = [];
    lstImageDetail: IGalleryDetail[] = [];
    public GalleryData: IGalleryMaster;
    GalleryName: string;
    Description: string;
    frmImport: FormGroup;
    ImageBaseUrl: string;
    IsEditMode: boolean;
    IsAllowApprove: boolean;

    public ImageFile: File[];
    public lstGalley: IGalleryMaster[];

    constructor(private http: ApiService, private http2: Http, public helper: UtilityService, private router: Router, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.ClearControl();
        this.ImageBaseUrl = this.helper.GetGalleryUrl('small');
        this.IsAllowApprove = false;
        this.IsEditMode = false;
        this.LoadData();
    }

    LoadData() {
        try {
            this.http.get(this.helper.getApiUrl('/gallery/ReadAll')).subscribe(
                (data) => {
                    this.lstGalley = data.result.GalleryList;
                }, (error) => {
                    this.helper.notification.error(error.message);
                });
        } catch (ex) {
            this.helper.notification.error(ex.message);
        }
    }

    btnGalleryEdit_Click(datas: IGalleryMaster) {
        try {
            this.http.get(this.helper.getApiUrl('/gallery/Read/' + datas.GallerySysID)).subscribe(
                (data) => {
                    this.GalleryData = data.result.GalleryData;
                    this.IsEditMode = true;
                    this.IsAllowApprove = true;
                    application.helper.plugin.CheckImage();
                }, (error) => {
                    this.helper.notification.error(error.message);
                });
        } catch (ex) {
            this.helper.notification.error(ex.message);
        }
    }

    btnGalleryAdd_Click() {
        this.IsEditMode = true;
        this.IsAllowApprove = false;
        this.ClearControl();
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

    btnVideoDelete(lstImage: IGalleryDetail) {
        lstImage.IsDeleted = true;
    }
    btnImageDelete_Click(lstImage: IGalleryDetail) {
        lstImage.IsDeleted = true;
    }

    btnApproveGallery_Click() {
        this.helper.notification.confirm('Do you want Approve Gallery', () => {
            try {
                this.http.post(this.helper.getApiUrl('gallery/Approve/' + this.GalleryData.GallerySysID), this.GalleryData).subscribe(
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
        this.GalleryData.lstVideoDetail = this.GalleryData.lstVideoDetail.slice();
    }

    btnUpload_Click() {
        const formData: FormData = new FormData();
        if (this.hasFile) {
            // tslint:disable-next-line:forin
            for (const i in this.ImageFile) {
                formData.append(this.ImageFile[i].name, this.ImageFile[i]);
            }
            this.helper.notification.confirm('Do you want Upload image file', () => {
                try {
                    const headers = new Headers();
                    const authToken = this.helper.authData().access_token;
                    headers.set('Accept', 'application/json');
                    headers.set('Authorization', 'Bearer ' + authToken);
                    this.http2.post(this.helper.getApiUrl('gallery/UploadImage'), formData, { headers }).subscribe(
                        (data) => {
                            const response: IApiSuccess = this.GetResult(data);
                            this.helper.notification.success(response.message);
                            this.lstImageDetail = response.result.ImageList;
                            // tslint:disable-next-line:forin
                            for (const i in this.lstImageDetail) {
                                this.GalleryData.lstImageDetail.push(this.lstImageDetail[i]);
                            }
                            this.mdUpload.close();
                        }, (error) => {
                            this.helper.notification.error(this.GetError(error).message);
                        })
                } catch (ex) {
                    this.helper.notification.error(ex.message);
                }
            }, () => { });
        } else {
            this.helper.notification.error('Please Select image File');
        }
    }

    public GetError(res: any): IApiFailure {
        try {
            let failure: IApiFailure = (<IApiResponse>res.json()).failure;
            failure = {
                code: 501,
                message: 'Internal Server Error',
                description: '',
                trace: ''
            }
            return failure;
        } catch (e) {
            const failure: IApiFailure = {
                code: 500,
                message: 'Internal Server Error',
                description: '',
                trace: ''
            }
            return failure;
        }

    }
    public GetResult(res: any): IApiSuccess {
        const response: IApiResponse = <IApiResponse>res.json();
        if (response.response !== 'success') {
            this.helper.notification.error(response.failure.message);
            throw new Error(response.failure.message);
        } else {
            return response.success;
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