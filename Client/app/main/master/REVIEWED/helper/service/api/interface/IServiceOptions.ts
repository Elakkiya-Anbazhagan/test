import { RequestMethod } from '@angular/http';
export class ServiceOptions {
    public method: RequestMethod;
    public url: string;
    public headers: any = {};
    public params = {};
    public data = {};
    public isAddAuthToken = true;
    public isAddApiBaseToken = true;
}