import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth/auth.guard';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { Angular2ImageGalleryModule } from 'angular2-image-gallery';
import { ProjectsShowComponent } from './projects-show/projects-show.component';
import { RequestAdminComponent } from './request-admin/request-admin.component';
import { DarkhastComponent } from './darkhast/darkhast.component';
import { MoamelatComponent } from './moamelat/moamelat.component';
import { ProfileComponent } from './user/profile/profile.component';
import { PortfoComponent } from './user/portfo/portfo.component';
import { ApiService } from './shared/services/api.service';
import {
  JalaliDatePipe,
  JalaliDatetimePipe
} from './shared/pipes/jalali-date.pipe';
import { EqualValidator } from './shared/validators/equal-validator.directive';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { FileManagerComponent } from './shared/components/file-manager/file-manager.component';
import { FileManagerService } from './shared/components/file-manager/file-manager.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './shared/components/confirm/confirm.component';
import { SettingsComponent } from './settings/settings.component';
import { ListNoeFileComponent } from './settings/list-noe-file/list-noe-file.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SendMessageComponent } from './send-message/send-message.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ChartsModule } from 'ng2-charts';
import { ChartMoamelatComponent } from './chart-moamelat/chart-moamelat.component';
import { ChartDarkhastVazeiatComponent } from './chart-darkhast-vazeiat/chart-darkhast-vazeiat.component';
import { ChartSafeDarkhastComponent } from './chart-safe-darkhast/chart-safe-darkhast.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    PhotoGalleryComponent,
    ProjectsShowComponent,
    RequestAdminComponent,
    DarkhastComponent,
    MoamelatComponent,
    ProfileComponent,
    PortfoComponent,
    JalaliDatePipe,
    JalaliDatetimePipe,
    EqualValidator,
    UserAdminComponent,
    FileManagerComponent,
    ConfirmComponent,
    SettingsComponent,
    ListNoeFileComponent,
    SendMessageComponent,
    ChartMoamelatComponent,
    ChartDarkhastVazeiatComponent,
    ChartSafeDarkhastComponent
  ],
  entryComponents: [ConfirmComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    AppRoutingModule,
    DxDataGridModule,
    HttpClientModule,
    FormsModule,
    Angular2ImageGalleryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200']
      }
    }),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgxPageScrollModule,
    ChartsModule
  ],
  providers: [
    ApiService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    AuthGuard,
    FileManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
