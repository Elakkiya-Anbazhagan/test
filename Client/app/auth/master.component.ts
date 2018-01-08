import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

declare var jQuery: any;
declare var application: any;
@Component({
    selector: 'auth-master',
    templateUrl: './Master.component.html'
})
export class MasterComponent implements OnInit {

    constructor(public titleService: Title) {
    }

    public ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        body.className = "";
        body.classList.add("account");
        body.classList.add("separate-inputs");


        jQuery(document).ready(() => {
            application.Login.Init();
        });
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }
}
