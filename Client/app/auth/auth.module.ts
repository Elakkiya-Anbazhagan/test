import { AuthErrorComponent } from './error/auth.error.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MasterComponent } from './master.component';
import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';

import { AuthRouting } from './auth.routes';

@NgModule({
    imports: [
        AuthRouting,
        CommonModule,
        // @angular/forms-Module
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [MasterComponent, LoginComponent, LockComponent, AuthErrorComponent],
    exports: [MasterComponent]
})
export class AuthModule {

}
