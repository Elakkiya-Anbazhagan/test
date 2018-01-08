import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild, CanLoad
} from '@angular/router';
import { AppGuardianService } from './app.guardian.service';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UtilityService, ApiService } from 'systemic/helper';

@Injectable()
export class AppGuardian implements CanActivate, CanActivateChild {

    constructor(private http: ApiService, private lib: UtilityService, private authService: AppGuardianService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (state.url === '/login') {
            return Observable.of(true);
        } else {
            return this.checkLogin(state.url);
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }
    result(res: any): boolean {
        return false;
    }
    checkLogin(url: string): Observable<boolean> {
        const EncodeUrl: string = encodeURIComponent(url);
        return this.http.get('app/validateuser?Url=' + EncodeUrl).map((res) => {
            if (!res.result.Status) {
                this.router.navigate(['/auth/login']);
            }
            return true;
        }).catch((error) => {
            let Url = this.lib.getErrorPage() + '?code=';
            let Errorcode = 500;
            if (!this.lib.isNullOrUndefined(error)) {
                if (!this.lib.isNullOrUndefined(error.code)) {
                    Errorcode = error.code;
                }
            }
            Url += '?code=' + Errorcode;
            this.lib.router.navigateByUrl(Url);
            return Observable.of(false);
        });
    }
}


class mlValidateuser {
    Url: string;
}