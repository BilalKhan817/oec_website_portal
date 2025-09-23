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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public MainbaseUrl = 'https://oec.gov.pk'
   private baseUrl = 'https://oec.gov.pk/api'; 
  
  // public MainbaseUrl = 'http://localhost:3000'
  //  public baseUrl = 'http://localhost:3000/api'; // Update this to your API URL

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

// Your existing methods remain unchanged:
getAnnouncements(): Observable<ApiResponse<Announcement[]>> {
  return this.http.get<ApiResponse<Announcement[]>>(`${this.baseUrl}/announcements`);
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
}