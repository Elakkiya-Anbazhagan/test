import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import swal from 'sweetalert2';

import * as moment from 'moment';
import { NgModel } from '@angular/forms';
import { Calendar } from 'primeng/primeng';

import { IAppConfig, IApplication, IProvider, ICompany, IUserAuthData, ISchoolConfig } from '../interface/ICookies';
import { ApiService } from '../../api';
import { Calendar_Guru_Component } from '../../../component';
import { LocationStrategy } from '@angular/common';

@Injectable()
export class UtilityService {
    public PageAccess = [];
    public router: Router;
    public titleService: Title;
    public notification: Notification;
    public datafunc: DateFunc;
    public cookie: CookieService;
    public PageTitle: string;
    public MasterData: {
        ChequeStatus: {
            UnPresent: 'UnPresent',
            Present: 'Present',
            Cleared: 'Cleared',
            Bounced: 'Bounced'
        },
        FeeName: {
            ACADEMICFEE: 'ACADEMIC FEE',
            TRANSPORTFEE: 'TRANSPORT FEE',
            MISCELLANEOUSFEE: 'MISCELLANEOUS FEE',
            OTHERFEE: 'OTHER FEE'
        },
        Certificate: {
            TC_ISSUE: 'TC ISSUE',
            TC_ISSUED: 'TC ISSUED',
            ACTIVE: 'ACTIVE',
            INACTIVE: 'INACTIVE'
        },
        CollectionType: {
            PREPAID: 'PrePaid',
            POSTPAID: 'PostPaid'
        },
        PermissionType: {
            PP: 'PP',
            UP: 'UP',
            AP: 'AP'
        },
        LeaveType: {
            EL: 'EL',
            CL: 'CL'
        },
        MeridianType: {
            ALL: 'ALL',
            FN: 'FN',
            AN: 'AN'
        },
        PaymodeType: {
            CASH: 'Cash',
            DD: 'DD',
            CHEQUE: 'Cheque',
            ONLINETRANSFER: 'Online Transfer',
            CASHDEPOSIT: 'Cash Deposit'
        }
    }
    private unAuthorizeModule: string[] = ['/auth/login', '/auth/lock'];

    constructor(_router: Router, _cookie: CookieService, _titleService: Title, private url: LocationStrategy, private _arouter: ActivatedRoute) {
        this.titleService = _titleService;
        this.router = _router;
        this.notification = new Notification();
        this.datafunc = new DateFunc();
        this.cookie = _cookie;
        this.PageTitle = '';
        this.MasterData = {
            ChequeStatus: {
                UnPresent: 'UnPresent',
                Present: 'Present',
                Cleared: 'Cleared',
                Bounced: 'Bounced'
            },
            FeeName: {
                ACADEMICFEE: 'ACADEMIC FEE',
                TRANSPORTFEE: 'TRANSPORT FEE',
                MISCELLANEOUSFEE: 'MISCELLANEOUS FEE',
                OTHERFEE: 'OTHER FEE'
            },
            Certificate: {
                TC_ISSUE: 'TC ISSUE',
                TC_ISSUED: 'TC ISSUED',
                ACTIVE: 'ACTIVE',
                INACTIVE: 'INACTIVE'
            },
            CollectionType: {
                PREPAID: 'PrePaid',
                POSTPAID: 'PostPaid'
            },
            PermissionType: {
                PP: 'PP',
                UP: 'UP',
                AP: 'AP'
            },
            LeaveType: {
                EL: 'EL',
                CL: 'CL'
            },
            MeridianType: {
                ALL: 'ALL',
                FN: 'FN',
                AN: 'AN'
            },
            PaymodeType: {
                CASH: 'Cash',
                DD: 'DD',
                CHEQUE: 'Cheque',
                ONLINETRANSFER: 'Online Transfer',
                CASHDEPOSIT: 'Cash Deposit'
            }
        }
    }
    DateRange(FromDate: NgModel, ToDate: NgModel) {
        const FDate: Calendar_Guru_Component | null = <Calendar_Guru_Component>FromDate.valueAccessor;
        const TDate: Calendar_Guru_Component | null = <Calendar_Guru_Component>ToDate.valueAccessor;
        if (FDate !== null && TDate !== null) {
            if (FDate.value !== null && TDate.value !== null) {
                FDate.maxDate = TDate.value;
                TDate.minDate = FDate.value;
                if (FDate.value > TDate.value) {
                    FDate.writeValue(TDate.value);
                    FDate.updateModel();
                }
            }
        };
    }

    GetListSummary(items: any[], calculationProperty: string) {
        if (typeof items !== 'undefined') {
            return {
                total: items.reduce((total, item) => {
                    return total + item[calculationProperty];
                }, 0),
                count: items.length
            }
        }
        return {
            total: 0,
            count: 0
        };
    }
    /**
     * Check the Select-Guru Selected value is valid
     * Note: if Slected value is 0 & empty it also consider as invalid value
     * @param {(number | string)} val
     * @returns {boolean}
     *
     * @memberOf UtilityService
     */
    public isValidSelectedValue(val: number | string): boolean {
        return (typeof val !== 'undefined' && val !== NaN && val !== null && val !== '' && val !== '0' && val !== 0);
    }
    /**
     * Check a variable is null or Undefined
     * @param {(number | string)} val
     * @returns {boolean}
     *
     * @memberof UtilityService
     */
    public isValidModel(val: any): boolean {
        console.log(typeof val);
        return (typeof val !== 'undefined' && val !== NaN && val !== null && typeof val === 'object');
    }
    /**
     * Check a variable is null or Undefined
     * @param {(number | string)} val
     * @returns {boolean}
     *
     * @memberof UtilityService
     */
    public isNullOrUndefined(val: any): boolean {
        return (typeof val === 'undefined' && val !== NaN || val === null);
    }

    /**
     * Check ArrayList is NULL or Undefined or length is 0
     *
     *  @param {any[]} val
     * @returns {boolean}
     *
     * @memberOf UtilityService
     */
    public isValidList(val: any[]): boolean {
        if (typeof val === 'undefined' || val === null) {
            return false;
        } else if (val.length === 0) {
            return false;
        } else {
            return true;
        }
    }
    public isActionAllowed(Action: string): boolean {
        console.log(this.PageAccess.find((x: any) => x.Name === Action));
        if (this.PageAccess !== undefined) {
            return (this.PageAccess.filter((x: any) => x.Name === Action).length > 0);
        } else {
            return false;
        }
    }

    public LoadPageAction(http: ApiService, func?: Function) {
        const pathroots = this._arouter.pathFromRoot;
        let pathurl = '';
        pathroots.forEach(path => {

            path.url.subscribe(url => {
                url.forEach(e => {
                    pathurl += e + '/';
                });
            });


        });
        console.log(pathurl, '*******************');
        console.log(this.url.path());
        console.log(this.getCurrentUrl());
        const ApiUrl = 'profile/get-role-based-menu-action?Url=' + this.getCurrentUrl();
        http.get(this.getApiUrl(ApiUrl)).subscribe(
            (res) => {
                if (this.isValidList(res.result.data)) {
                    this.PageAccess = res.result.data;
                    if (func !== undefined) {
                        func(this.PageAccess);
                    }
                }
            }, (err) => {
                this.notification.error(err.message);
            });
    }
    public GetGalleryUrl(type: string): string {
        return this.getApiUrl(`App_UpLoad/Images/Gallery/${type}`).replace('api/', '');
    }
    public GetStudentUrl(type: string): string {
        return this.getApiUrl(`App_UpLoad/Images/Student/${type}`).replace('api/', '');
    }
    public GetGalleryExcelUrl(type: string): string {
        return this.getApiUrl(`App_UpLoad/Sample_Excel/${type}`);
    }

    public appConfig(): IAppConfig {
        const appConfig = new IAppConfig();
        appConfig.Application = (<IApplication>this.cookie.getObject('Config.Api'));
        appConfig.Company = (<ICompany>this.cookie.getObject('Config.Company'));
        appConfig.Provider = (<IProvider>this.cookie.getObject('Config.Provider'));
        return appConfig;
    };
    public schoolConfig(): ISchoolConfig {
        const schoolConfig = new ISchoolConfig();
        schoolConfig.AccountYear = this.authData().School.AccountYear;
        schoolConfig.ActiveAcademicYear = this.authData().School.ActiveAcademicYear;
        schoolConfig.CurrentAcademicYear = this.authData().School.CurrentAcademicYear;
        return schoolConfig;
    }
    public authData(): IUserAuthData {
        let authData = new IUserAuthData();
        authData = (<IUserAuthData>this.cookie.getObject('Config.User'));
        return authData;
    };
    groupBy(value: Array<any>, field: string): Array<any> {
        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
    }
    groupByAsSelectItem(value: Array<any>, field: string, isAddDefaultValue: boolean = false): Array<any> {
        const selectItm: any = []
        if (isAddDefaultValue) {
            selectItm.push({ label: 'ALL', value: null });
        }
        this.groupBy(value, field).forEach((itm) => {
            selectItm.push({ label: itm.key, value: itm.key })
        })
        return selectItm;
    }
    public setBrowserTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }
    public setPageTitle(newTitle: string) {
        this.PageTitle = newTitle;
    }
    public convertDateTime(date: DateFunc) {
        const _formattedDate = new DateFunc().DMY_TO_DATE(date.toString());
        return _formattedDate.toString();
    }
    public navigate(path: string) {
        this.router.navigateByUrl(path);
    }
    public navigateToSignIn() {
        this.navigate('/auth/login');
    }
    public readableColumnName(columnName: string): string {
        // Convert underscores to spaces
        if (typeof (columnName) === 'undefined' || columnName === undefined || columnName === null) { return columnName; }

        if (typeof (columnName) !== 'string') {
            columnName = String(columnName);
        }
        return columnName.replace(/_+/g, ' ')
            // Replace a completely all-capsed word with a first-letter-capitalized version
            .replace(/^[A-Z]+$/, (match) => {
                return ((match.charAt(0)).toUpperCase() + match.slice(1)).toLowerCase();
            })
            // Capitalize the first letter of words
            .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
                return (match.charAt(0)).toUpperCase() + match.slice(1);
            })
            // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
            // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
            // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
            .replace(/(\w+?(?=[A-Z]))/g, '$1 ');
    }
    public loadStyle(link: string): Observable<any> {
        if (this.isLoadedStyle(link)) {
            return Observable.of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const styleNode = document.createElement('link');
            styleNode.rel = 'stylesheet';
            styleNode.type = 'text/css';
            styleNode.href = link;
            styleNode.media = 'all';
            head.appendChild(styleNode);
            return Observable.fromEvent(styleNode, 'load');
        }
    }
    public loadScript(script: string): Observable<any> {
        if (this.isLoadedScript(script)) {
            return Observable.of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const scriptNode = document.createElement('script');
            scriptNode.src = script;
            scriptNode.async = false;
            // scriptNode.type = 'text/javascript';
            // scriptNode.charset = 'utf-8';
            head.insertBefore(scriptNode, head.firstChild);
            return Observable.fromEvent(scriptNode, 'load');
        }
    }
    private isLoadedScript(lib: string) {
        return document.querySelectorAll('[src="' + lib + '"]').length > 0;
    }
    private isLoadedStyle(lib: string) {
        return document.querySelectorAll('[href="' + lib + '"]').length > 0;
    }
    public isAuthorizeModule(): boolean {
        if (this.router.url === '/auth/login' || this.router.url === '/auth/lock') {
            return false;
        } else {
            return true;
        }
    }
    public getCurrentUrl(): string {
        return this.router.url;
    }
    public getApiUrl(Url: string): string {
        return this.appConfig().Application.BaseUrl + '/' + Url;
    }
    public getParams() {
        const searchParams = window.location.search.split('?')[1];
        if (searchParams) {
            const paramsObj: any = {};
            searchParams.split('&').forEach(i => {
                paramsObj[i.split('=')[0]] = i.split('=')[1];
            });
            return paramsObj;
        }
        return undefined;
    }
    public getErrorPage(): string {
        return this.isAuthorizeModule() ? '/app-error' : '/auth/error';
    }
}
declare var Noty: any;
export enum notyType {
    alert,
    success,
    error,
    warning,
    info,
    primary
}
export enum notyTheme {
    mint,
    sunset,
    relax,
    metroui
}

class DateFunc {
    public DMY_TO_DATE(date: string) {
        if (date !== undefined && date !== null && date !== 'undefined') {
            if (date.length <= 0) {
                return '';
            } else {
                date.toString().replace('/', '-');
                return moment(date, 'DD-MM-YYYY').toDate();
            }
        }

        return '';
    }
    public YMD_TO_DATE(date: string) {
        if (date !== undefined && date !== null && date !== 'undefined') {
            if (date.length <= 0) {
                return '';
            } else {
                date.toString().replace('/', '-');
                return moment(date, 'YYYY-MM-DD').toDate();
            }
        }

        return '';
    }
    public DMY_TO_YMD(date: string) {
        if (date !== undefined && date !== null && date !== 'undefined') {
            if (date.length <= 0) {
                return '';
            } else {
                date.toString().replace('/', '-');
                return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
        }

        return '';
    }
    public YMD_TO_DMY(date: string) {
        if (date !== undefined && date !== null && date !== 'undefined') {
            if (date.length <= 0) {
                return '';
            } else {
                date.toString().replace('/', '-');
                return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
            }
        }

        return '';

    }
    public YMDHMS_TO_DMYHMS(date: string) {
        if (date !== undefined && date !== null && date !== 'undefined') {
            if (date.length <= 0) {
                return '';
            } else {
                date.toString().replace('/', '-');
                return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm:ss A');
            }
        }

        return '';

    }
}

class Notification {
    show(message: string, typ?: notyType, ui?: notyTheme) {
        let type = '';
        let theme = '';
        if (ui === notyTheme.mint) {
            theme = 'mint';
        } else if (ui === notyTheme.sunset) {
            theme = 'sunset';
        } else if (ui === notyTheme.relax) {
            theme = 'relax';
        } else if (ui === notyTheme.metroui) {
            theme = 'metroui';
        } else {
            theme = 'mint';
        }
        if (typ === notyType.alert) {
            type = 'alert';
        } else if (typ === notyType.success) {
            type = 'success';
        } else if (typ === notyType.error) {
            type = 'error';
        } else if (typ === notyType.warning) {
            type = 'warning';
        } else if (typ === notyType.info) {
            type = 'info';
        } else {
            type = 'primary';
        }
        new Noty({
            type: type,
            theme: theme,
            text: message,
            animation: {
                open: 'animated fadeInRight',
                close: 'animated fadeOutRight'
            }
        }).show();
    }
    alert(message: string) {
        this.show(message, notyType.alert);
    }
    success(message: string) {
        this.show(message, notyType.success);
    }
    error(message: string) {
        this.show(message, notyType.error);
    }
    warning(message: string) {
        this.show(message, notyType.warning);
    }
    info(message: string) {
        this.show(message, notyType.info);
    }
    confirm(str: string, Yes: Function, No?: Function) {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            html: str
        }).then(function () {
            Yes();
        }, function (dismiss) {
            if (No) {
                No();
            }
        });
    }
}

