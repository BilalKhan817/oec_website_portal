import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-media-galleries-management',
  templateUrl: './media-galleries-management.component.html',
  styleUrls: ['./media-galleries-management.component.css']
})
export class MediaGalleriesManagementComponent implements OnInit {

  galleries: any[] = [];

  // New gallery form
  newTitle = '';
  newType: string = 'photo';
  newDescription = '';

  // Expanded gallery for managing items
  expandedGalleryId: string | null = null;

  // Add photo form
  addingPhotoToId: string | null = null;
  photoFile: File | null = null;
  photoFileName = '';
  photoCaption = '';

  // Add video form
  addingVideoToId: string | null = null;
  videoUrl = '';
  videoCaption = '';
  videoDuration = '';

  // Edit gallery
  editingGalleryId: string | null = null;
  editTitle = '';
  editDescription = '';

  baseUrl = '';

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.baseUrl = (this.apiService as any).baseUrl?.replace('/api', '') || '';
  }

  ngOnInit(): void {
    this.loadGalleries();
  }

  loadGalleries(): void {
    this.apiService.getMediaGalleries().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.galleries = response.data;
        }
      },
      error: () => this.snackBar.open('Error loading galleries', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  addGallery(): void {
    if (!this.newTitle.trim()) {
      this.snackBar.open('Title is required', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    const formData = new FormData();
    formData.append('title', this.newTitle.trim());
    formData.append('gallery_type', this.newType);
    formData.append('description', this.newDescription.trim());
    this.apiService.createMediaGallery(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadGalleries();
          this.newTitle = '';
          this.newType = 'photo';
          this.newDescription = '';
          this.snackBar.open('Gallery created', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error creating gallery', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  startEditGallery(gallery: any): void {
    this.editingGalleryId = gallery._id;
    this.editTitle = gallery.title;
    this.editDescription = gallery.description || '';
  }

  cancelEditGallery(): void {
    this.editingGalleryId = null;
  }

  saveEditGallery(gallery: any): void {
    if (!this.editTitle.trim()) return;
    const formData = new FormData();
    formData.append('title', this.editTitle.trim());
    formData.append('description', this.editDescription.trim());
    this.apiService.updateMediaGallery(gallery._id, formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.editingGalleryId = null;
          this.loadGalleries();
          this.snackBar.open('Gallery updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error updating gallery', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteGallery(gallery: any): void {
    if (confirm(`Delete gallery "${gallery.title}" and all its content?`)) {
      this.apiService.deleteMediaGallery(gallery._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadGalleries();
            this.snackBar.open('Gallery deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting gallery', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  toggleExpand(galleryId: string): void {
    this.expandedGalleryId = this.expandedGalleryId === galleryId ? null : galleryId;
    this.addingPhotoToId = null;
    this.addingVideoToId = null;
  }

  // Photos
  showAddPhoto(galleryId: string): void {
    this.addingPhotoToId = galleryId;
    this.photoFile = null;
    this.photoFileName = '';
    this.photoCaption = '';
  }

  cancelAddPhoto(): void {
    this.addingPhotoToId = null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      this.photoFileName = file.name;
    }
  }

  addPhoto(galleryId: string): void {
    if (!this.photoFile) {
      this.snackBar.open('Please select an image', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    const formData = new FormData();
    formData.append('photo', this.photoFile);
    formData.append('caption', this.photoCaption.trim());
    this.apiService.addGalleryPhoto(galleryId, formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.addingPhotoToId = null;
          this.loadGalleries();
          this.snackBar.open('Photo added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding photo', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deletePhoto(galleryId: string, photoId: string): void {
    if (confirm('Delete this photo?')) {
      this.apiService.deleteGalleryPhoto(galleryId, photoId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadGalleries();
            this.snackBar.open('Photo deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting photo', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  // Videos
  showAddVideo(galleryId: string): void {
    this.addingVideoToId = galleryId;
    this.videoUrl = '';
    this.videoCaption = '';
    this.videoDuration = '';
  }

  cancelAddVideo(): void {
    this.addingVideoToId = null;
  }

  addVideo(galleryId: string): void {
    if (!this.videoUrl.trim()) {
      this.snackBar.open('Video URL is required', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    this.apiService.addGalleryVideo(galleryId, {
      video_url: this.videoUrl.trim(),
      caption: this.videoCaption.trim(),
      duration: this.videoDuration.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.addingVideoToId = null;
          this.loadGalleries();
          this.snackBar.open('Video added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding video', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteVideo(galleryId: string, videoId: string): void {
    if (confirm('Delete this video?')) {
      this.apiService.deleteGalleryVideo(galleryId, videoId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadGalleries();
            this.snackBar.open('Video deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting video', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return this.baseUrl + (path.startsWith('/') ? path : '/' + path);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'photo': return 'photo_library';
      case 'video': return 'video_library';
      case 'mixed': return 'collections';
      default: return 'photo_library';
    }
  }
}
