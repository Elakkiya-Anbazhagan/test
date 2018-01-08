import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(public titleService: Title) {
        this.setTitle('School Expert');
    }

    public ngOnInit() {

    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }
}
