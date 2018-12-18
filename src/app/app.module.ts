import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component'
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, FirmaDialog } from './components/home/home.component'
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { InterceptService } from './services/intercept.service';
import { PdfComponent } from './components/pdf/pdf.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { LdoctorComponent } from './components/ldoctor/ldoctor.component';
import { EdoctorComponent } from './components/edoctor/edoctor.component';

const routes: Routes = [
  { path: "auth", component: AuthComponent, canActivate: [NoAuthGuard] },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "account", component: AccountComponent, canActivate: [AuthGuard] },
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "home" }
]


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ToolbarComponent,
    AccountComponent,
    FirmaDialog,
    PdfComponent,
    DoctorComponent,
    LdoctorComponent,
    EdoctorComponent
  ],
  entryComponents: [FirmaDialog,EdoctorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard, NoAuthGuard, AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
