import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'lock',
    templateUrl: './lock.component.html'
})
export class LockComponent implements OnInit {

    constructor(public titleService: Title) {
        this.titleService.setTitle('Locked');
    }

    public ngOnInit() {

    }
}
