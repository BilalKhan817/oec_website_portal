// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { BannersComponent } from './components/banners/banners.component';
import { AboutOecComponent } from './components/about-oec/about-oec.component';
import { ExecutivesComponent } from './components/executives/executives.component';
import { BoardDirectorsComponent } from './components/board-directors/board-directors.component';
import { ServicesComponent } from './components/services/services.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ApiComponent } from './components/services/api/api.component';

// Dialogs
import { AnnouncementDialogComponent } from './components/announcements/announcement-dialog/announcement-dialog.component';
import { BannerDialogComponent } from './components/banners/banner-dialog/banner-dialog.component';
import { AboutOecDialogComponent } from './components/about-oec/about-oec-dialog/about-oec-dialog.component';
import { ExecutiveDialogComponent } from './components/executives/executive-dialog/executive-dialog.component';
import { ServiceDialogComponent } from './components/services/service-dialog/service-dialog.component';

// Services
import { ApiService } from './services/api.service';

const routes:any = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'banners', component: BannersComponent },
  { path: 'about-oec', component: AboutOecComponent },
  { path: 'executives', component: ExecutivesComponent },
  { path: 'board-directors', component: BoardDirectorsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'api', component: ApiComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnnouncementsComponent,
    BannersComponent,
    AboutOecComponent,
    ExecutivesComponent,
    BoardDirectorsComponent,
    ServicesComponent,
    SidebarComponent,
    ApiComponent,
    AnnouncementDialogComponent,
    BannerDialogComponent,
    AboutOecDialogComponent,
    ExecutiveDialogComponent,
    ServiceDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    
    // Angular Material Modules
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }