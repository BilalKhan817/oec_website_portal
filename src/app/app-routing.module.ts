import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Old Dashboard Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { BannersComponent } from './components/banners/banners.component';
import { AboutOecComponent } from './components/about-oec/about-oec.component';
import { ExecutivesComponent } from './components/executives/executives.component';
import { BoardDirectorsComponent } from './components/board-directors/board-directors.component';
import { ServicesComponent } from './components/services/services.component';
import { ApiComponent } from './components/services/api/api.component';
import { AboutUsContentComponent } from './components/about-us-content/about-us-content.component';
import { OecAtGlanceComponent } from './components/oec-at-glance/oec-at-glance.component';
import { GoverningLawComponent } from './components/governing-law/governing-law.component';
import { OurFunctionsComponent } from './components/our-functions/our-functions.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

// About Us Management
import { AboutOecPageComponent } from './components/about-us-management/about-oec-page/about-oec-page.component';
import { GoverningLawPageComponent } from './components/about-us-management/governing-law-page/governing-law-page.component';
import { OecAtGlancePageComponent } from './components/about-us-management/oec-at-glance-page/oec-at-glance-page.component';
import { OurFunctionsPageComponent } from './components/about-us-management/our-functions-page/our-functions-page.component';
import { OurExecutivesPageComponent } from './components/about-us-management/our-executives-page/our-executives-page.component';
import { MdMessagePageComponent } from './components/about-us-management/md-message-page/md-message-page.component';
import { MissionVisionPageComponent } from './components/about-us-management/mission-vision-page/mission-vision-page.component';
import { AchievementsPageComponent } from './components/about-us-management/achievements-page/achievements-page.component';
import { WhyChooseOecPageComponent } from './components/about-us-management/why-choose-oec-page/why-choose-oec-page.component';

// Emigrants Management
import { EpsKoreaPageComponent } from './components/emigrants-management/eps-korea-page/eps-korea-page.component';
import { LabourContractsPageComponent } from './components/emigrants-management/labour-contracts-page/labour-contracts-page.component';
import { EpsResultsPageComponent } from './components/emigrants-management/eps-results-page/eps-results-page.component';
import { WorkerProtectionPageComponent } from './components/emigrants-management/worker-protection-page/worker-protection-page.component';
import { PreDepartureTrainingPageComponent } from './components/emigrants-management/pre-departure-training-page/pre-departure-training-page.component';
import { ServiceAgreementsPageComponent } from './components/emigrants-management/service-agreements-page/service-agreements-page.component';
import { IndustriesManagementComponent } from './components/emigrants-management/industries-management/industries-management.component';

// Development Hub Management
import { DevelopmentHubBoxesComponent } from './components/development-hub-management/development-hub-boxes/development-hub-boxes.component';
import { SuccessStoriesManagementComponent } from './components/development-hub-management/success-stories-management/success-stories-management.component';
import { ProjectsManagementComponent } from './components/development-hub-management/projects-management/projects-management.component';
import { FuturePlansPageComponent } from './components/development-hub-management/future-plans-page/future-plans-page.component';
import { MousManagementComponent } from './components/development-hub-management/mous-management/mous-management.component';

// Media Center Management
import { LatestAnnouncementsManagementComponent } from './components/media-center-management/latest-announcements-management/latest-announcements-management.component';
import { PressReleasesManagementComponent } from './components/media-center-management/press-releases-management/press-releases-management.component';
import { NewsHighlightsManagementComponent } from './components/media-center-management/news-highlights-management/news-highlights-management.component';
import { EventsManagementComponent } from './components/media-center-management/events-management/events-management.component';
import { MediaResourcesManagementComponent } from './components/media-center-management/media-resources-management/media-resources-management.component';
import { MediaGalleriesManagementComponent } from './components/media-center-management/media-galleries-management/media-galleries-management.component';

// Reports & Analytics Management
import { ReportsAnalyticsPageComponent } from './components/reports-analytics-management/reports-analytics-page/reports-analytics-page.component';

// Contact Us Management
import { HeadquartersPageComponent } from './components/contact-us-management/headquarters-page/headquarters-page.component';
import { TravelOfficePageComponent } from './components/contact-us-management/travel-office-page/travel-office-page.component';
import { RegionalOfficesManagementComponent } from './components/contact-us-management/regional-offices-management/regional-offices-management.component';
import { ContactFormPageComponent } from './components/contact-us-management/contact-form-page/contact-form-page.component';

// Navbar Management
import { NavbarManagementComponent } from './components/navbar-management/navbar-management.component';

const routes: Routes = [
  // Old Dashboard Routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'banners', component: BannersComponent },
  { path: 'about-oec', component: AboutOecComponent },
  { path: 'executives', component: ExecutivesComponent },
  { path: 'board-directors', component: BoardDirectorsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'api', component: ApiComponent },
  { path: 'about-us-content', component: AboutUsContentComponent },
  { path: 'oec-at-glance', component: OecAtGlanceComponent },
  { path: 'governing-law', component: GoverningLawComponent },
  { path: 'our-functions', component: OurFunctionsComponent },
  { path: 'contact-us', component: ContactUsComponent },

  // About Us Management Routes
  { path: 'about-us/about-oec', component: AboutOecPageComponent },
  { path: 'about-us/governing-law', component: GoverningLawPageComponent },
  { path: 'about-us/oec-at-glance', component: OecAtGlancePageComponent },
  { path: 'about-us/our-functions', component: OurFunctionsPageComponent },
  { path: 'about-us/our-executives', component: OurExecutivesPageComponent },
  { path: 'about-us/md-message', component: MdMessagePageComponent },
  { path: 'about-us/mission-vision', component: MissionVisionPageComponent },
  { path: 'about-us/achievements', component: AchievementsPageComponent },
  { path: 'about-us/why-choose-oec', component: WhyChooseOecPageComponent },

  // Emigrants Management Routes
  { path: 'emigrants/eps-korea', component: EpsKoreaPageComponent },
  { path: 'emigrants/labour-contracts', component: LabourContractsPageComponent },
  { path: 'emigrants/eps-results', component: EpsResultsPageComponent },
  { path: 'emigrants/worker-protection', component: WorkerProtectionPageComponent },
  { path: 'emigrants/pre-departure-training', component: PreDepartureTrainingPageComponent },
  { path: 'emigrants/service-agreements', component: ServiceAgreementsPageComponent },
  { path: 'emigrants/industries', component: IndustriesManagementComponent },

  // Development Hub Management Routes
  { path: 'development-hub/boxes', component: DevelopmentHubBoxesComponent },
  { path: 'development-hub/success-stories', component: SuccessStoriesManagementComponent },
  { path: 'development-hub/projects', component: ProjectsManagementComponent },
  { path: 'development-hub/future-plans', component: FuturePlansPageComponent },
  { path: 'development-hub/mous', component: MousManagementComponent },

  // Media Center Management Routes
  { path: 'media-center/latest-announcements', component: LatestAnnouncementsManagementComponent },
  { path: 'media-center/press-releases', component: PressReleasesManagementComponent },
  { path: 'media-center/news-highlights', component: NewsHighlightsManagementComponent },
  { path: 'media-center/events', component: EventsManagementComponent },
  { path: 'media-center/media-resources', component: MediaResourcesManagementComponent },
  { path: 'media-center/media-galleries', component: MediaGalleriesManagementComponent },

  // Reports & Analytics Management Route
  { path: 'reports-analytics', component: ReportsAnalyticsPageComponent },

  // Contact Us Management Routes
  { path: 'contact-us/headquarters', component: HeadquartersPageComponent },
  { path: 'contact-us/travel-office', component: TravelOfficePageComponent },
  { path: 'contact-us/regional-offices', component: RegionalOfficesManagementComponent },
  { path: 'contact-us/contact-form', component: ContactFormPageComponent },

  // Navbar Management Route
  { path: 'navbar-management', component: NavbarManagementComponent },

  // Default route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
