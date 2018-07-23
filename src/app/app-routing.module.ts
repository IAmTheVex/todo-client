import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/log-in', pathMatch: 'full' },
    {
        path: 'log-in',
        component: LogInComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'to-do',
        component: HomeComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
