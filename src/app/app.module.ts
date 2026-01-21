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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

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
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { MenuDialogComponent } from './components/menu-management/menu-dialog/menu-dialog.component';

// Dialogs
import { AnnouncementDialogComponent } from './components/announcements/announcement-dialog/announcement-dialog.component';
import { BannerDialogComponent } from './components/banners/banner-dialog/banner-dialog.component';
import { AboutOecDialogComponent } from './components/about-oec/about-oec-dialog/about-oec-dialog.component';
import { ExecutiveDialogComponent } from './components/executives/executive-dialog/executive-dialog.component';
import { ServiceDialogComponent } from './components/services/service-dialog/service-dialog.component';

// Services
import { ApiService } from './services/api.service';
import { AboutOecPageComponent } from './components/about-us-management/about-oec-page/about-oec-page.component';
import { GoverningLawPageComponent } from './components/about-us-management/governing-law-page/governing-law-page.component';
import { OecAtGlancePageComponent } from './components/about-us-management/oec-at-glance-page/oec-at-glance-page.component';
import { OurFunctionsPageComponent } from './components/about-us-management/our-functions-page/our-functions-page.component';
import { OurExecutivesPageComponent } from './components/about-us-management/our-executives-page/our-executives-page.component';
import { MdMessagePageComponent } from './components/about-us-management/md-message-page/md-message-page.component';
import { MissionVisionPageComponent } from './components/about-us-management/mission-vision-page/mission-vision-page.component';
import { AchievementsPageComponent } from './components/about-us-management/achievements-page/achievements-page.component';
import { WhyChooseOecPageComponent } from './components/about-us-management/why-choose-oec-page/why-choose-oec-page.component';
import { EpsKoreaPageComponent } from './components/emigrants-management/eps-korea-page/eps-korea-page.component';
import { LabourContractsPageComponent } from './components/emigrants-management/labour-contracts-page/labour-contracts-page.component';
import { EpsResultsPageComponent } from './components/emigrants-management/eps-results-page/eps-results-page.component';
import { WorkerProtectionPageComponent } from './components/emigrants-management/worker-protection-page/worker-protection-page.component';
import { PreDepartureTrainingPageComponent } from './components/emigrants-management/pre-departure-training-page/pre-departure-training-page.component';
import { ServiceAgreementsPageComponent } from './components/emigrants-management/service-agreements-page/service-agreements-page.component';
import { IndustriesManagementComponent } from './components/emigrants-management/industries-management/industries-management.component';
import { DevelopmentHubBoxesComponent } from './components/development-hub-management/development-hub-boxes/development-hub-boxes.component';
import { SuccessStoriesManagementComponent } from './components/development-hub-management/success-stories-management/success-stories-management.component';
import { ProjectsManagementComponent } from './components/development-hub-management/projects-management/projects-management.component';
import { FuturePlansPageComponent } from './components/development-hub-management/future-plans-page/future-plans-page.component';
import { MousManagementComponent } from './components/development-hub-management/mous-management/mous-management.component';
import { LatestAnnouncementsManagementComponent } from './components/media-center-management/latest-announcements-management/latest-announcements-management.component';
import { PressReleasesManagementComponent } from './components/media-center-management/press-releases-management/press-releases-management.component';
import { NewsHighlightsManagementComponent } from './components/media-center-management/news-highlights-management/news-highlights-management.component';
import { EventsManagementComponent } from './components/media-center-management/events-management/events-management.component';
import { MediaResourcesManagementComponent } from './components/media-center-management/media-resources-management/media-resources-management.component';
import { MediaGalleriesManagementComponent } from './components/media-center-management/media-galleries-management/media-galleries-management.component';
import { ReportsAnalyticsPageComponent } from './components/reports-analytics-management/reports-analytics-page/reports-analytics-page.component';
import { HeadquartersPageComponent } from './components/contact-us-management/headquarters-page/headquarters-page.component';
import { TravelOfficePageComponent } from './components/contact-us-management/travel-office-page/travel-office-page.component';
import { RegionalOfficesManagementComponent } from './components/contact-us-management/regional-offices-management/regional-offices-management.component';
import { ContactFormPageComponent } from './components/contact-us-management/contact-form-page/contact-form-page.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarManagementComponent } from './components/navbar-management/navbar-management.component';

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
    MenuManagementComponent,
    MenuDialogComponent,
    AnnouncementDialogComponent,
    BannerDialogComponent,
    AboutOecDialogComponent,
    ExecutiveDialogComponent,
    ServiceDialogComponent,
    AboutOecPageComponent,
    GoverningLawPageComponent,
    OecAtGlancePageComponent,
    OurFunctionsPageComponent,
    OurExecutivesPageComponent,
    MdMessagePageComponent,
    MissionVisionPageComponent,
    AchievementsPageComponent,
    WhyChooseOecPageComponent,
    EpsKoreaPageComponent,
    LabourContractsPageComponent,
    EpsResultsPageComponent,
    WorkerProtectionPageComponent,
    PreDepartureTrainingPageComponent,
    ServiceAgreementsPageComponent,
    IndustriesManagementComponent,
    DevelopmentHubBoxesComponent,
    SuccessStoriesManagementComponent,
    ProjectsManagementComponent,
    FuturePlansPageComponent,
    MousManagementComponent,
    LatestAnnouncementsManagementComponent,
    PressReleasesManagementComponent,
    NewsHighlightsManagementComponent,
    EventsManagementComponent,
    MediaResourcesManagementComponent,
    MediaGalleriesManagementComponent,
    ReportsAnalyticsPageComponent,
    HeadquartersPageComponent,
    TravelOfficePageComponent,
    RegionalOfficesManagementComponent,
    ContactFormPageComponent,
    NavbarManagementComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    
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
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    DragDropModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }