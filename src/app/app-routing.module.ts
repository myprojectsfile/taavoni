import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { QueueAdminComponent } from './queue/queue-admin.component';
import { RequestAdminComponent } from './request-admin/request-admin.component';
import { MoamelatComponent } from './moamelat/moamelat.component';

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
  { path: 'requests', component: RequestAdminComponent, canActivate: [AuthGuard] },
  { path: 'queueAdmin', component: QueueAdminComponent, canActivate: [AuthGuard] },
  { path: 'trades', component: MoamelatComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }