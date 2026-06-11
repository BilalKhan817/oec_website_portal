import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-latest-announcements-management',
  templateUrl: './latest-announcements-management.component.html',
  styleUrls: ['./latest-announcements-management.component.css']
})
export class LatestAnnouncementsManagementComponent implements OnInit {
  announcements: any[] = [];
  isLoading = false;

  // Add form
  newTitle = '';
  newDescription = '';
  newDate = '';
  newCategory = '';
  newCountry = '';
  newLink = '';
  newIsUrgent = false;

  // Edit state
  editingId: string | null = null;
  editTitle = '';
  editDescription = '';
  editDate = '';
  editCategory = '';
  editCountry = '';
  editLink = '';
  editIsUrgent = false;

  categories = ['EPS', 'Job Demand', 'Interviews', 'Fee Notice', 'Orientation', 'General'];
  countries = ['All', 'Korea', 'KSA', 'Italy', 'Japan', 'UAE', 'Germany', 'Malaysia', 'Other'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    this.apiService.getLatestAnnouncements().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.announcements = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading announcements', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  addAnnouncement(): void {
    if (!this.newTitle.trim()) {
      this.snackBar.open('Title is required', 'Close', { duration: 3000 });
      return;
    }
    const data = {
      title: this.newTitle,
      description: this.newDescription,
      date: this.newDate,
      category: this.newCategory,
      country: this.newCountry,
      link: this.newLink,
      is_urgent: this.newIsUrgent,
      order: this.announcements.length
    };
    this.apiService.createLatestAnnouncement(data).subscribe({
      next: () => {
        this.snackBar.open('Announcement created', 'Close', { duration: 3000 });
        this.resetAddForm();
        this.loadAnnouncements();
      },
      error: () => {
        this.snackBar.open('Error creating announcement', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(item: any): void {
    this.editingId = item._id;
    this.editTitle = item.title || '';
    this.editDescription = item.description || '';
    this.editDate = item.date || '';
    this.editCategory = item.category || '';
    this.editCountry = item.country || '';
    this.editLink = item.link || '';
    this.editIsUrgent = item.is_urgent || false;
  }

  saveEdit(item: any): void {
    const data = {
      title: this.editTitle,
      description: this.editDescription,
      date: this.editDate,
      category: this.editCategory,
      country: this.editCountry,
      link: this.editLink,
      is_urgent: this.editIsUrgent
    };
    this.apiService.updateLatestAnnouncement(item._id, data).subscribe({
      next: () => {
        this.snackBar.open('Announcement updated', 'Close', { duration: 3000 });
        this.editingId = null;
        this.loadAnnouncements();
      },
      error: () => {
        this.snackBar.open('Error updating announcement', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteAnnouncement(item: any): void {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    this.apiService.deleteLatestAnnouncement(item._id).subscribe({
      next: () => {
        this.snackBar.open('Announcement deleted', 'Close', { duration: 3000 });
        this.loadAnnouncements();
      },
      error: () => {
        this.snackBar.open('Error deleting announcement', 'Close', { duration: 3000 });
      }
    });
  }

  resetAddForm(): void {
    this.newTitle = '';
    this.newDescription = '';
    this.newDate = '';
    this.newCategory = '';
    this.newCountry = '';
    this.newLink = '';
    this.newIsUrgent = false;
  }
}
