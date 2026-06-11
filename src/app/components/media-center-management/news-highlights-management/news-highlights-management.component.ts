import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-news-highlights-management',
  templateUrl: './news-highlights-management.component.html',
  styleUrls: ['./news-highlights-management.component.css']
})
export class NewsHighlightsManagementComponent implements OnInit {
  newsItems: any[] = [];
  isLoading = false;

  // Add form
  newHeadline = '';
  newSummary = '';
  newDate = '';
  newProject = '';
  newMediaType = '';
  newReadLink = '';
  newVideoLink = '';

  // Edit state
  editingId: string | null = null;
  editHeadline = '';
  editSummary = '';
  editDate = '';
  editProject = '';
  editMediaType = '';
  editReadLink = '';
  editVideoLink = '';

  mediaTypes = ['Print', 'TV', 'Digital', 'International'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.apiService.getNewsHighlights().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.newsItems = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading news highlights', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  addNews(): void {
    if (!this.newHeadline.trim()) {
      this.snackBar.open('Headline is required', 'Close', { duration: 3000 });
      return;
    }
    const data = {
      headline: this.newHeadline,
      summary: this.newSummary,
      date: this.newDate,
      project: this.newProject,
      media_type: this.newMediaType,
      read_link: this.newReadLink,
      video_link: this.newVideoLink,
      order: this.newsItems.length
    };
    this.apiService.createNewsHighlight(data).subscribe({
      next: () => {
        this.snackBar.open('News highlight created', 'Close', { duration: 3000 });
        this.resetAddForm();
        this.loadNews();
      },
      error: () => {
        this.snackBar.open('Error creating news highlight', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(item: any): void {
    this.editingId = item._id;
    this.editHeadline = item.headline || '';
    this.editSummary = item.summary || '';
    this.editDate = item.date || '';
    this.editProject = item.project || '';
    this.editMediaType = item.media_type || '';
    this.editReadLink = item.read_link || '';
    this.editVideoLink = item.video_link || '';
  }

  saveEdit(item: any): void {
    const data = {
      headline: this.editHeadline,
      summary: this.editSummary,
      date: this.editDate,
      project: this.editProject,
      media_type: this.editMediaType,
      read_link: this.editReadLink,
      video_link: this.editVideoLink
    };
    this.apiService.updateNewsHighlight(item._id, data).subscribe({
      next: () => {
        this.snackBar.open('News highlight updated', 'Close', { duration: 3000 });
        this.editingId = null;
        this.loadNews();
      },
      error: () => {
        this.snackBar.open('Error updating news highlight', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteNews(item: any): void {
    if (!confirm('Are you sure you want to delete this news highlight?')) return;
    this.apiService.deleteNewsHighlight(item._id).subscribe({
      next: () => {
        this.snackBar.open('News highlight deleted', 'Close', { duration: 3000 });
        this.loadNews();
      },
      error: () => {
        this.snackBar.open('Error deleting news highlight', 'Close', { duration: 3000 });
      }
    });
  }

  resetAddForm(): void {
    this.newHeadline = '';
    this.newSummary = '';
    this.newDate = '';
    this.newProject = '';
    this.newMediaType = '';
    this.newReadLink = '';
    this.newVideoLink = '';
  }
}
