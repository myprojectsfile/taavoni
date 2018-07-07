import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { DxDataGridModule } from 'devextreme-angular';
import { QueueService } from './queue/queue.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JwtHelper } from 'angular2-jwt';
import { AuthGuard } from './auth/auth.guard';
import { QueueAdminComponent } from './queue/queue-admin.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { Angular2ImageGalleryModule } from 'angular2-image-gallery';
import { ProjectsShowComponent } from './projects-show/projects-show.component';
import { RequestAdminComponent } from './request-admin/request-admin.component';
import { RequestService } from './request-admin/request.service';
@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    QueueAdminComponent,
    PhotoGalleryComponent,
    ProjectsShowComponent,
    RequestAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    AppRoutingModule,
    DxDataGridModule,
    HttpClientModule,
    FormsModule,
    Angular2ImageGalleryModule
  ],
  providers: [QueueService, AuthService, RequestService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }, JwtHelper, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
