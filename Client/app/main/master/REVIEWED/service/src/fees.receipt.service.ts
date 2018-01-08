import { Injectable } from '@angular/core';
import { ApiService, UtilityService, IApiSuccess } from 'systemic/helper';

@Injectable()
export class Service_Helper {
    constructor(private http: ApiService, private lib: UtilityService) {

    }
    get_academic_year_list(isNeedDefaultText: boolean = false) {
        const Url = this.lib.getApiUrl('dropdown/academicyear/' + isNeedDefaultText.toString());
        return this.http.get(Url);
    }
    get_role_list(isNeedDefaultText: boolean = false) {
        const Url = this.lib.getApiUrl('dropdown/getusers/' + isNeedDefaultText.toString());
        return this.http.get(Url);
    }
}