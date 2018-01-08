import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
    { path: 'app/signout', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => require('./auth/auth.module')['AuthModule'] },
    { path: 'app', loadChildren: () => require('./main/main.module')['MainModule'] }
];

export const routing = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
