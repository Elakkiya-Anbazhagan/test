import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';


import { UtilityService, ApiService } from 'systemic/helper';

@Injectable()
export class AppGuardianService {
    constructor(private http: ApiService, private router: Router) {
    }
    isLoggedIn(url: string): Observable<any> {
        const data: mlValidateuser = new mlValidateuser();
        data.Url = url;
        return this.http.post('api/auth/validateuser', data);
    }
}

class mlValidateuser {
    Url: string;
}