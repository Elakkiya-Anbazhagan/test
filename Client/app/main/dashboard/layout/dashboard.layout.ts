import { Component, ViewChildren } from '@angular/core';
import { routerTransition, hostStyle } from '../../../router.animations'; // NOT NEED
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
interface ICat {
    CategoryName: string;
}

@Component({
    selector: 'dashboard-layout',
    templateUrl: './dashboard.layout.html',
})
export class DashboardComponent {
    constructor() {
    }
}
