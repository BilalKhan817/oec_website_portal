// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

export interface Attachment {
  _id?: string;
  file_title: string;
  icon: string;
  attachment_type: string;
  file_path: string;
  file_url: string;
  original_name: string;
  file_size: number;
  mime_type: string;
}

export interface Announcement {
  _id?: string;
  title: string;
  deadline: string;
  announcement_category: string;
  orange_button_title: string;
  orange_button_link: string;
  blue_button_title?: string;
  blue_button_link?: string;
  flag?: string; // Picture in announcement title
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  _id?: string;
  background_image: string;
  banner_title: string;
  banner_title_color?: string;
  banner_title_highlight?: {
    text: string;
    color: string;
  };
  banner_subtitle?: any;
  banner_subtitle_type: 'text' | 'points' | 'none';
  support_message?: string;
  green_button: string;
  green_button_link: string;
  gray_button: string;
  gray_button_link: string;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AboutOec {
  _id?: string;
  title?: string;
  subtitle?: string;
  description_paragraph_1: string;
  description_paragraph_2: string;
  established_year?: string;
  workers_sent?: string;
  youtube_video_id: string;
  video_title?: string;
  button_text?: string;
  button_link?: string;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Executive {
  _id?: string;
  name: string;
  position: string;
  badge: string;
  image_url: string;
  profile_url: string;
  order?: number;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export interface Services {
  _id?: string;
  section_title?: string;
  section_subtitle?: string;
  services: Service[];
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BoardMember {
  _id?: string;
  name: string;
  designation: string;
  representing: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubItem {
  _id?: string;
  title: string;
  icon?: string;
  description?: string;
  link?: string;
  link_type?: 'internal' | 'external';
  image_url?: string;
  badge_text?: string;
  badge_color?: string;
  expandable?: boolean;
  expand_content?: string;
  order?: number;
}

export interface Tab {
  _id?: string;
  tab_title: string;
  tab_icon?: string;
  tab_id: string;
  items: SubItem[];
  order?: number;
}

export interface MenuItem {
  _id?: string;
  title: string;
  icon: string;
  link?: string;
  link_type?: 'internal' | 'external' | 'none';
  has_dropdown?: boolean;
  dropdown_type?: 'simple' | 'tabs' | 'mega';
  dropdown_width?: string;
  tabs?: Tab[];
  items?: SubItem[];
  is_active?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TopBarButton {
  _id?: string;
  title: string;
  icon?: string;
  link: string;
  link_type?: 'internal' | 'external';
  button_style?: 'default' | 'highlight';
  show_on_mobile?: boolean;
  is_active?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // public MainbaseUrl = 'https://oec.gov.pk'
  //  private baseUrl = 'https://oec.gov.pk/api'; 
  
  public MainbaseUrl = 'http://localhost:3000'
   public baseUrl = 'http://localhost:3000/api'; // Update this to your API URL

  constructor(private http: HttpClient) {}

  // Announcements
  createAnnouncementWithFiles(formData: FormData): Observable<ApiResponse<Announcement>> {
  return this.http.post<ApiResponse<Announcement>>(`${this.baseUrl}/announcements`, formData);
}

/**
 * Update announcement with file uploads
 */
updateAnnouncementWithFiles(id: string, formData: FormData): Observable<ApiResponse<Announcement>> {
  return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/announcements/${id}`, formData);
}

/**
 * Delete specific attachment from announcement
 */
deleteAttachment(announcementId: string, attachmentId: string): Observable<ApiResponse<Announcement>> {
  return this.http.delete<ApiResponse<Announcement>>(`${this.baseUrl}/announcements/${announcementId}/attachments/${attachmentId}`);
}

/**
 * Get download URL for attachment
 */
getAttachmentDownloadUrl(announcementId: string, attachmentId: string): string {
  return `${this.baseUrl}/announcements/${announcementId}/attachments/${attachmentId}/download`;
}

// Get all announcements for ADMIN (includes expired)
getAnnouncements(): Observable<ApiResponse<Announcement[]>> {
  return this.http.get<ApiResponse<Announcement[]>>(`${this.baseUrl}/announcements/admin/all`);
}

getAnnouncement(id: string): Observable<ApiResponse<Announcement>> {
  return this.http.get<ApiResponse<Announcement>>(`${this.baseUrl}/announcements/${id}`);
}

createAnnouncement(announcement: Announcement): Observable<ApiResponse<Announcement>> {
  return this.http.post<ApiResponse<Announcement>>(`${this.baseUrl}/announcements`, announcement);
}

updateAnnouncement(id: string, announcement: Partial<Announcement>): Observable<ApiResponse<Announcement>> {
  return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/announcements/${id}`, announcement);
}

deleteAnnouncement(id: string): Observable<ApiResponse<Announcement>> {
  return this.http.delete<ApiResponse<Announcement>>(`${this.baseUrl}/announcements/${id}`);
}

  // Banners
  getBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.baseUrl}/banners`);
  }

  getActiveBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.baseUrl}/banners/active`);
  }

  getBanner(id: string): Observable<ApiResponse<Banner>> {
    return this.http.get<ApiResponse<Banner>>(`${this.baseUrl}/banners/${id}`);
  }

  createBanner(formData: FormData): Observable<ApiResponse<Banner>> {
    return this.http.post<ApiResponse<Banner>>(`${this.baseUrl}/banners`, formData);
  }

  updateBanner(id: string, formData: FormData): Observable<ApiResponse<Banner>> {
    return this.http.put<ApiResponse<Banner>>(`${this.baseUrl}/banners/${id}`, formData);
  }

  deleteBanner(id: string): Observable<ApiResponse<Banner>> {
    return this.http.delete<ApiResponse<Banner>>(`${this.baseUrl}/banners/${id}`);
  }

  toggleBannerStatus(id: string): Observable<ApiResponse<Banner>> {
    return this.http.patch<ApiResponse<Banner>>(`${this.baseUrl}/banners/${id}/toggle`, {});
  }

  // About OEC
  getAboutOec(): Observable<ApiResponse<AboutOec>> {
    return this.http.get<ApiResponse<AboutOec>>(`${this.baseUrl}/about-oec`);
  }

  createAboutOec(aboutOec: AboutOec): Observable<ApiResponse<AboutOec>> {
    return this.http.post<ApiResponse<AboutOec>>(`${this.baseUrl}/about-oec`, aboutOec);
  }

  updateAboutOec(id: string, aboutOec: Partial<AboutOec>): Observable<ApiResponse<AboutOec>> {
    return this.http.put<ApiResponse<AboutOec>>(`${this.baseUrl}/about-oec/${id}`, aboutOec);
  }

  deleteAboutOec(id: string): Observable<ApiResponse<AboutOec>> {
    return this.http.delete<ApiResponse<AboutOec>>(`${this.baseUrl}/about-oec/${id}`);
  }

  // Executives
  getExecutives(): Observable<ApiResponse<Executive[]>> {
    return this.http.get<ApiResponse<Executive[]>>(`${this.baseUrl}/executives`);
  }

  getExecutive(id: string): Observable<ApiResponse<Executive>> {
    return this.http.get<ApiResponse<Executive>>(`${this.baseUrl}/executives/${id}`);
  }

  createExecutive(formData: FormData): Observable<ApiResponse<Executive>> {
    return this.http.post<ApiResponse<Executive>>(`${this.baseUrl}/executives`, formData);
  }

  updateExecutive(id: string, formData: FormData): Observable<ApiResponse<Executive>> {
    return this.http.put<ApiResponse<Executive>>(`${this.baseUrl}/executives/${id}`, formData);
  }

  deleteExecutive(id: string): Observable<ApiResponse<Executive>> {
    return this.http.delete<ApiResponse<Executive>>(`${this.baseUrl}/executives/${id}`);
  }

  // Services
  getServices(): Observable<ApiResponse<Services>> {
    return this.http.get<ApiResponse<Services>>(`${this.baseUrl}/services`);
  }

  createServices(services: Services): Observable<ApiResponse<Services>> {
    return this.http.post<ApiResponse<Services>>(`${this.baseUrl}/services`, services);
  }

  updateServices(id: string, services: Partial<Services>): Observable<ApiResponse<Services>> {
    return this.http.put<ApiResponse<Services>>(`${this.baseUrl}/services/${id}`, services);
  }

  deleteServices(id: string): Observable<ApiResponse<Services>> {
    return this.http.delete<ApiResponse<Services>>(`${this.baseUrl}/services/${id}`);
  }

  // Board Members
  getBoardMembers(): Observable<ApiResponse<BoardMember[]>> {
    return this.http.get<ApiResponse<BoardMember[]>>(`${this.baseUrl}/about-us/board-of-directors`);
  }

  createBoardMember(boardMember: BoardMember): Observable<ApiResponse<BoardMember>> {
    return this.http.post<ApiResponse<BoardMember>>(`${this.baseUrl}/about-us/board-of-directors`, boardMember);
  }

  updateBoardMember(id: string, boardMember: BoardMember): Observable<ApiResponse<BoardMember>> {
    return this.http.put<ApiResponse<BoardMember>>(`${this.baseUrl}/about-us/board-of-directors/${id}`, boardMember);
  }

  deleteBoardMember(id: string): Observable<ApiResponse<BoardMember>> {
    return this.http.delete<ApiResponse<BoardMember>>(`${this.baseUrl}/about-us/board-of-directors/${id}`);
  }

  // Menu Items
  getMenuItems(): Observable<ApiResponse<MenuItem[]>> {
    return this.http.get<ApiResponse<MenuItem[]>>(`${this.baseUrl}/menu-items/admin/all`);
  }

  getMenuItem(id: string): Observable<ApiResponse<MenuItem>> {
    return this.http.get<ApiResponse<MenuItem>>(`${this.baseUrl}/menu-items/${id}`);
  }

  createMenuItem(menuItem: MenuItem): Observable<ApiResponse<MenuItem>> {
    return this.http.post<ApiResponse<MenuItem>>(`${this.baseUrl}/menu-items`, menuItem);
  }

  updateMenuItem(id: string, menuItem: MenuItem): Observable<ApiResponse<MenuItem>> {
    return this.http.put<ApiResponse<MenuItem>>(`${this.baseUrl}/menu-items/${id}`, menuItem);
  }

  deleteMenuItem(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/menu-items/${id}`);
  }

  reorderMenuItems(items: {id: string, order: number}[]): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/menu-items/reorder/bulk`, { items });
  }

  // Top Bar Buttons
  getTopBarButtons(): Observable<ApiResponse<TopBarButton[]>> {
    return this.http.get<ApiResponse<TopBarButton[]>>(`${this.baseUrl}/top-bar-buttons/admin/all`);
  }

  getTopBarButton(id: string): Observable<ApiResponse<TopBarButton>> {
    return this.http.get<ApiResponse<TopBarButton>>(`${this.baseUrl}/top-bar-buttons/${id}`);
  }

  createTopBarButton(button: TopBarButton): Observable<ApiResponse<TopBarButton>> {
    return this.http.post<ApiResponse<TopBarButton>>(`${this.baseUrl}/top-bar-buttons`, button);
  }

  updateTopBarButton(id: string, button: TopBarButton): Observable<ApiResponse<TopBarButton>> {
    return this.http.put<ApiResponse<TopBarButton>>(`${this.baseUrl}/top-bar-buttons/${id}`, button);
  }

  deleteTopBarButton(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/top-bar-buttons/${id}`);
  }

  reorderTopBarButtons(items: {id: string, order: number}[]): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/top-bar-buttons/reorder/bulk`, { items });
  }

  // ==================== ABOUT US PAGES ====================

  // About OEC Page (already exists - keeping for reference)
  getAboutOecPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/about-oec-page`);
  }

  createOrUpdateAboutOecPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/about-oec-page`, formData);
  }

  // Governing Law Page
  getGoverningLawPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/governing-law-page`);
  }

  createOrUpdateGoverningLawPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/governing-law-page`, formData);
  }

  // OEC at a Glance Page
  getOecAtGlancePage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/oec-at-glance-page`);
  }

  createOrUpdateOecAtGlancePage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/oec-at-glance-page`, formData);
  }

  // Our Functions Page
  getOurFunctionsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/our-functions-page`);
  }

  createOrUpdateOurFunctionsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/our-functions-page`, formData);
  }

  // Our Executives Page
  getOurExecutivesPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/our-executives-page`);
  }

  createOrUpdateOurExecutivesPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/our-executives-page`, formData);
  }

  // MD Message Page
  getMdMessagePage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/md-message-page`);
  }

  createOrUpdateMdMessagePage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/md-message-page`, formData);
  }

  // Mission Vision Page
  getMissionVisionPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/mission-vision-page`);
  }

  createOrUpdateMissionVisionPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/mission-vision-page`, formData);
  }

  // Achievements Page
  getAchievementsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/achievements-page`);
  }

  createOrUpdateAchievementsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/achievements-page`, formData);
  }

  // Why Choose OEC Page
  getWhyChooseOecPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/about-us/why-choose-oec-page`);
  }

  createOrUpdateWhyChooseOecPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/about-us/why-choose-oec-page`, formData);
  }

  // ==================== EMIGRANTS PAGES ====================

  // EPS Korea Page
  getEpsKoreaPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/eps-korea-page`);
  }

  createOrUpdateEpsKoreaPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/eps-korea-page`, formData);
  }

  // Labour Contracts Page
  getLabourContractsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/labour-contracts-page`);
  }

  createOrUpdateLabourContractsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/labour-contracts-page`, formData);
  }

  // EPS Results Page
  getEpsResultsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/eps-results-page`);
  }

  createOrUpdateEpsResultsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/eps-results-page`, formData);
  }

  // Worker Protection Page
  getWorkerProtectionPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/worker-protection-page`);
  }

  createOrUpdateWorkerProtectionPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/worker-protection-page`, formData);
  }

  // Pre-Departure Training Page
  getPreDepartureTrainingPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/pre-departure-training-page`);
  }

  createOrUpdatePreDepartureTrainingPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/pre-departure-training-page`, formData);
  }

  // Service Agreements Page
  getServiceAgreementsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/service-agreements-page`);
  }

  createOrUpdateServiceAgreementsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/service-agreements-page`, formData);
  }

  // Industries Page
  getIndustriesPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries-page`);
  }

  createOrUpdateIndustriesPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries-page`, formData);
  }

  // Industries (Dynamic CRUD)
  getIndustries(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/emigrants/industries`);
  }

  getIndustry(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries/${id}`);
  }

  createIndustry(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries`, formData);
  }

  updateIndustry(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries/${id}`, formData);
  }

  deleteIndustry(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/emigrants/industries/${id}`);
  }

  // ==================== DEVELOPMENT HUB PAGES ====================

  // Development Hub Boxes
  getDevelopmentHubBoxes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/us-submenu/development-hub`);
  }

  updateDevelopmentHubBox(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/us-submenu/development-hub/${id}`, data);
  }

  // Success Stories (Dynamic CRUD)
  getSuccessStories(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/development-hub/success-stories`);
  }

  getSuccessStory(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/development-hub/success-stories/${id}`);
  }

  createSuccessStory(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/development-hub/success-stories`, formData);
  }

  updateSuccessStory(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/development-hub/success-stories/${id}`, formData);
  }

  deleteSuccessStory(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/development-hub/success-stories/${id}`);
  }

  // Projects (Dynamic CRUD)
  getProjects(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/development-hub/projects`);
  }

  getProject(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/development-hub/projects/${id}`);
  }

  createProject(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/development-hub/projects`, formData);
  }

  updateProject(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/development-hub/projects/${id}`, formData);
  }

  deleteProject(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/development-hub/projects/${id}`);
  }

  // Future Plans Page
  getFuturePlansPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/development-hub/future-plans-page`);
  }

  createOrUpdateFuturePlansPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/development-hub/future-plans-page`, formData);
  }

  // MOUs (Dynamic CRUD)
  getMous(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/development-hub/mous`);
  }

  getMou(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/development-hub/mous/${id}`);
  }

  createMou(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/development-hub/mous`, formData);
  }

  updateMou(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/development-hub/mous/${id}`, formData);
  }

  deleteMou(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/development-hub/mous/${id}`);
  }

  // ==================== MEDIA CENTER PAGES ====================

  // Latest Announcements (Dynamic CRUD)
  getLatestAnnouncements(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/latest-announcements`);
  }

  getLatestAnnouncement(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/latest-announcements/${id}`);
  }

  createLatestAnnouncement(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/latest-announcements`, formData);
  }

  updateLatestAnnouncement(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/latest-announcements/${id}`, data);
  }

  deleteLatestAnnouncement(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/latest-announcements/${id}`);
  }

  // Press Releases (Dynamic CRUD)
  getPressReleases(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/press-releases`);
  }

  getPressRelease(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/press-releases/${id}`);
  }

  createPressRelease(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/press-releases`, formData);
  }

  updatePressRelease(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/press-releases/${id}`, data);
  }

  deletePressRelease(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/press-releases/${id}`);
  }

  // News Highlights (Dynamic CRUD)
  getNewsHighlights(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/news-highlights`);
  }

  getNewsHighlight(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/news-highlights/${id}`);
  }

  createNewsHighlight(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/news-highlights`, formData);
  }

  updateNewsHighlight(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/news-highlights/${id}`, data);
  }

  deleteNewsHighlight(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/news-highlights/${id}`);
  }

  // Events (Dynamic CRUD)
  getEvents(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/events`);
  }

  getEvent(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/events/${id}`);
  }

  createEvent(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/events`, formData);
  }

  updateEvent(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/events/${id}`, data);
  }

  deleteEvent(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/events/${id}`);
  }

  // Media Resources (Dynamic CRUD)
  getMediaResources(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/media-resources`);
  }

  getMediaResource(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/media-resources/${id}`);
  }

  createMediaResource(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/media-resources`, formData);
  }

  updateMediaResource(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/media-resources/${id}`, formData);
  }

  deleteMediaResource(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/media-resources/${id}`);
  }

  // Media Galleries (Dynamic CRUD)
  getMediaGalleries(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/media-center/media-galleries`);
  }

  getMediaGallery(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/media-center/media-galleries/${id}`);
  }

  createMediaGallery(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/media-center/media-galleries`, formData);
  }

  updateMediaGallery(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/media-center/media-galleries/${id}`, formData);
  }

  deleteMediaGallery(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media-center/media-galleries/${id}`);
  }

  // ==================== REPORTS & ANALYTICS ====================

  getReportsAnalyticsPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/reports-analytics/page`);
  }

  createOrUpdateReportsAnalyticsPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/reports-analytics/page`, formData);
  }

  // ==================== CONTACT US PAGES ====================

  // Headquarters Page
  getHeadquartersPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/contact-us/headquarters`);
  }

  createOrUpdateHeadquartersPage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact-us/headquarters`, formData);
  }

  // Travel Office Page
  getTravelOfficePage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/contact-us/travel-office`);
  }

  createOrUpdateTravelOfficePage(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact-us/travel-office`, formData);
  }

  // Regional Offices (Dynamic CRUD)
  getRegionalOffices(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/contact-us/regional-offices`);
  }

  getRegionalOffice(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/contact-us/regional-offices/${id}`);
  }

  createRegionalOffice(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact-us/regional-offices`, formData);
  }

  updateRegionalOffice(id: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/contact-us/regional-offices/${id}`, formData);
  }

  deleteRegionalOffice(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/contact-us/regional-offices/${id}`);
  }

  // Contact Form Page
  getContactFormPage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/contact-us/contact-form`);
  }

  createOrUpdateContactFormPage(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact-us/contact-form`, data);
  }

  // ==================== NAVBAR MENU & SUBMENU MANAGEMENT ====================

  // Navbar Menus
  getNavbarMenus(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/navbar/menus`);
  }

  getNavbarMenu(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/navbar/menus/${id}`);
  }

  createNavbarMenu(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/navbar/menus`, data);
  }

  updateNavbarMenu(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/navbar/menus/${id}`, data);
  }

  deleteNavbarMenu(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/navbar/menus/${id}`);
  }

  // Navbar Submenus
  getNavbarSubmenus(menuId?: string): Observable<ApiResponse<any[]>> {
    const url = menuId
      ? `${this.baseUrl}/navbar/submenus?menuId=${menuId}`
      : `${this.baseUrl}/navbar/submenus`;
    return this.http.get<ApiResponse<any[]>>(url);
  }

  getNavbarSubmenu(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/navbar/submenus/${id}`);
  }

  createNavbarSubmenu(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/navbar/submenus`, data);
  }

  updateNavbarSubmenu(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/navbar/submenus/${id}`, data);
  }

  deleteNavbarSubmenu(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/navbar/submenus/${id}`);
  }

  reorderNavbarSubmenus(submenuOrders: any[]): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/navbar/submenus/reorder/bulk`, { submenuOrders });
  }
}