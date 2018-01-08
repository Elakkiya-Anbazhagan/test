import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UtilityService } from 'systemic/helper';

declare var jQuery: any;
declare var application: any;
declare var GUrl: any;
declare var layout: any;
class Breadcrumb {
    name: string;
    link: string;
}

@Component({
    selector: 'systemic-shared-layout',
    templateUrl: './shared.layout.component.html'
})
export class SharedLayoutComponent implements AfterViewInit {
    applicaiton: any;
    theme: Theme;
    color: Color;
    UrlList: Breadcrumb[];
    constructor(private lib: UtilityService) {
        this.UrlList = [];
        this.theme = new Theme();
        this.color = new Color();
        this.lib.router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });

    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
        }

        if (event instanceof NavigationEnd) {
            try {
                const crump = new Breadcrumb();
                crump.name = this.lib.PageTitle;
                crump.link = event.url;
                this.UrlList = this.UrlList.filter(item => item.link !== crump.link);
                this.UrlList.push(crump);
                if (this.UrlList.length === 4) {
                    this.UrlList.splice(0, 1);
                }

                application.helper.Scroller.Custom();
                application.helper.Window.BindEvents();
                application.helper.plugin.Init();

            } catch (error) {

            }

        }

        if (event instanceof NavigationCancel) {
        }
        if (event instanceof NavigationError) {
        }
    }
    ngAfterViewInit() {
        const body = document.getElementsByTagName('body')[0];
        body.className = '';
        body.classList.add('fixed-topbar');
        body.classList.add('fixed-sidebar');
        body.classList.add(this.color.Primary);
        body.classList.add(this.theme.sltd);
        jQuery(document).ready(() => {
            layout().Init();
            application.Template.Init();
            application.helper.plugin.Init();
        });
    }
}

class Theme {
    sdtl = 'theme-sdtl';
    sltd = 'theme-sltd';
    sdtd = 'theme-sdtd';
    sltl = 'theme-sltl';
}
class Color {
    Black = 'color-default';
    Primary = 'color-primary';
    Red = 'color-red';
    Green = 'color-green';
    Orange = 'color-orange';
    Purple = 'color-purple';
    Blue = 'color-blue';
}
