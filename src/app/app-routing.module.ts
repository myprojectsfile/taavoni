import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { RequestAdminComponent } from './request-admin/request-admin.component';
import { MoamelatComponent } from './moamelat/moamelat.component';
import { PortfoComponent } from './user/portfo/portfo.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { SettingsComponent } from './settings/settings.component';
import { ListNoeFileComponent } from './settings/list-noe-file/list-noe-file.component';
import { ChartMoamelatComponent } from './chart-moamelat/chart-moamelat.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: 'queue', component: QueueComponent, canActivate: [AuthGuard] },
  {
    path: 'requests',
    component: RequestAdminComponent,
    canActivate: [AuthGuard]
  },
  { path: 'trades', component: MoamelatComponent, canActivate: [AuthGuard] },
  { path: 'portfo', component: PortfoComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'useradmin',
    component: UserAdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ListNoeFileComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'charts',
    component: ChartMoamelatComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
