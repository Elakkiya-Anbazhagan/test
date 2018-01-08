
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'ngx-cookie';

import { IApiResponse, IApiSuccess, IApiFailure } from '../interface/IApiResponse';
import { ServiceOptions } from '../interface/IServiceOptions';
import { UtilityService } from '../../utility';

declare var jQuery: any;
declare var application: any;

declare var DJS: any;

@Injectable()
export class ApiService {

    // Define the internal Subject we'll use to push the command count
    public pendingCommandsSubject = new Subject<number>();
    public pendingCommandCount = 0;

    // Provide the *public* Observable that clients can subscribe to
    public pendingCommands$: Observable<number>;

    constructor(public http: Http, public us: UtilityService) {
        this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
    }

    // I perform a GET request to the API, appending the given params
    // as URL search parameters. Returns a stream.
    public get(url: string, params?: any): Observable<IApiSuccess> {
        const options = new ServiceOptions();
        options.method = RequestMethod.Get;
        options.url = url;
        options.params = params;
        return this.request(options);
    }

    // I perform a POST request to the API. If both the params and data
    // are present, the params will be appended as URL search parameters
    // and the data will be serialized as a JSON payload. If only the
    // data is present, it will be serialized as a JSON payload. Returns
    // a stream.
    public post(url: string, data?: any, params?: any): Observable<IApiSuccess> {
        if (!data) {
            data = params;
            params = {};
        }
        const options = new ServiceOptions();
        options.method = RequestMethod.Post;
        options.url = url;
        options.params = params;
        options.data = data;
        return this.request(options);
    }

    public put(url: string, data?: any, params?: any): Observable<IApiSuccess> {
        if (!data) {
            data = params;
            params = {};
        }
        const options = new ServiceOptions();
        options.method = RequestMethod.Put;
        options.url = url;
        options.params = params;
        options.data = data;
        return this.request(options);
    }

    public delete(url: string): Observable<any> {
        const options = new ServiceOptions();
        options.method = RequestMethod.Delete;
        options.url = url;
        return this.request(options);
    }

    private request(options: ServiceOptions): Observable<IApiSuccess> {
        options.method = (options.method || RequestMethod.Get);
        options.url = (options.url || '');
        options.headers = (options.headers || {});
        options.params = (options.params || {});
        options.data = (options.data || {});
        this.addContentType(options);
        this.addAuthToken(options);

        const requestOptions = new RequestOptions();
        requestOptions.method = options.method;
        requestOptions.url = options.url;
        requestOptions.headers = options.headers;
        requestOptions.search = this.buildUrlSearchParams(options.params);
        const JSON = require('circular-json');
        const data = JSON.stringify(options.data);
        requestOptions.body = data;

        if (this.pendingCommandCount === 0) {
            application.Progress.Start();
        }
        this.pendingCommandsSubject.next(++this.pendingCommandCount);

        const stream = this.http.request(options.url, requestOptions)
            .catch((error: any) => {
                this.handleErrors(error);
                return Observable.throw(error);
            })
            .map(this.unwrapHttpValue)
            .catch((error: any) => {
                return Observable.throw(this.unwrapHttpError(error));
            })
            .finally(() => {
                this.pendingCommandsSubject.next(--this.pendingCommandCount);
                if (this.pendingCommandCount === 0) {
                    application.Progress.Stop();
                }
            });

        return stream;
    }

    private addContentType(options: ServiceOptions): ServiceOptions {
        // if (options.method !== RequestMethod.Get) {
        options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        // }
        return options;
    }

    private addAuthToken(options: ServiceOptions): ServiceOptions {
        const authToken = this.us.authData().access_token;
        if (authToken) {
            options.headers.Authorization = 'Bearer ' + authToken;
        }
        return options;
    }

    private extractValue(collection: any, key: string): any {
        const value = collection[key];
        delete (collection[key]);
        return value;
    }

    private addXsrfToken(options: ServiceOptions): ServiceOptions {
        const xsrfToken = this.getXsrfCookie();
        if (xsrfToken) {
            options.headers['X-XSRF-TOKEN'] = xsrfToken;
        }
        return options;
    }

    private getXsrfCookie(): string {
        const matches = document.cookie.match(/\bXSRF-TOKEN=([^\s;]+)/);
        try {
            return matches ? decodeURIComponent(matches[1]) : '';
        } catch (decodeError) {
            return '';
        }
    }

    // private addCors(options: ServiceOptions): ServiceOptions {
    //     options.headers['Access-Control-Allow-Origin'] = '*';
    //     return options;
    // }

    private buildUrlSearchParams(params: any): URLSearchParams {
        const searchParams = new URLSearchParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                searchParams.append(key, params[key]);
            }
        }
        return searchParams;
    }

    private interpolateUrl(options: ServiceOptions): ServiceOptions {
        options.url = options.url.replace(/:([a-zA-Z]+[\w-]*)/g, ($0, token) => {
            // Try to move matching token from the params collection.
            if (options.params.hasOwnProperty(token)) {
                return (this.extractValue(options.params, token));
            }
            // Try to move matching token from the data collection.
            if (options.data.hasOwnProperty(token)) {
                return (this.extractValue(options.data, token));
            }
            // If a matching value couldn't be found, just replace
            // the token with the empty string.
            return ('');
        });
        // Clean up any repeating slashes.
        options.url = options.url.replace(/\/{2,}/g, '/');
        // Clean up any trailing slashes.
        options.url = options.url.replace(/\/+$/g, '');

        return options;
    }

    private unwrapHttpError(res: any): IApiFailure {
        try {
            let Url = this.us.getErrorPage() + '?code=';
            if (!this.us.isNullOrUndefined(res.error)) {
                if (!this.us.isNullOrUndefined(res.error.code)) {
                    Url += res.error.code;
                    if (res.error.code === 401.1 || res.error.code === 401) { // Developer token Expired or Invalid
                        window.location.href = 'app/signout';
                    } else if (res.error.code === 401.2) { // Api token  Expired or Invalid
                        this.us.navigateToSignIn();
                    } else if (res.error.code === 401.3) { // Unauthorized page access
                        this.us.router.navigateByUrl(Url);
                    } else if (res.error.code === 403) { // Forbidden
                        this.us.router.navigateByUrl(Url);
                    } else if (res.error.code === 404) { // Forbidden
                        this.us.router.navigateByUrl(Url);
                    } else if (res.error.code === 500) {
                        this.us.router.navigateByUrl(Url);
                    }
                }
            } else {
                this.us.router.navigateByUrl(Url);
            }
            return res.error;
        } catch (jsonError) {
            console.log(jsonError);
            const err = new IApiFailure();
            err.code = 500;
            err.message = 'Can\'t Read Server Response';
            console.log(jsonError);
            return err;
        }
    }
    private unwrapHttpValue(value: Response): IApiSuccess {
        const apiResponse: IApiResponse = (<IApiResponse>value.json());
        if (apiResponse.response === 'success') {
            return (apiResponse.success);
        }
        throw Observable.throw(apiResponse.failure);
    }
    private handleErrors(error: any) {
        if (error.status === 401) {
            this.us.navigateToSignIn();
        } else if (error.status === 403) {
            this.us.navigateToSignIn();
        }
    }
}
