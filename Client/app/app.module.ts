import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';

import { routing } from './app.routes';
import { AppService } from './app.service';
import { AppComponent } from './app.component';

// Http - Services
import { CookieModule } from 'ngx-cookie';
import { ApiService, UtilityService, HttpService } from 'systemic/helper';
import { Service_Helper } from 'systemic/service';


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        routing,
        HttpModule,
        AuthModule,
        MainModule,
        CookieModule.forRoot()
    ],
    providers: [
        AppService,
        ApiService,
        UtilityService,
        HttpService,
        Service_Helper
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
