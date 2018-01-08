import { AuthErrorComponent } from './error/auth.error.page';
import { Routes, RouterModule } from '@angular/router';

import { MasterComponent } from './master.component';
import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';

const routes: Routes = [
    {
        path: 'auth', component: MasterComponent, children: [
            { path: '', component: LoginComponent },
            { path: 'error', component: AuthErrorComponent },
            { path: 'login', component: LoginComponent },
            { path: 'lock', component: LockComponent }
        ]
    }
];

export const AuthRouting = RouterModule.forChild(routes);
