import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-press-releases-management',
  templateUrl: './press-releases-management.component.html',
  styleUrls: ['./press-releases-management.component.css']
})
export class PressReleasesManagementComponent implements OnInit {
  pressReleases: any[] = [];
  isLoading = false;

  // Add form
  newHeadline = '';
  newSummary = '';
  newDate = '';
  newCategory = '';
  newPdfLink = '';
  newReadLink = '';
  newIsUrgent = false;

  // Edit state
  editingId: string | null = null;
  editHeadline = '';
  editSummary = '';
  editDate = '';
  editCategory = '';
  editPdfLink = '';
  editReadLink = '';
  editIsUrgent = false;

  categories = ['Agreement', 'Advisory', 'Innovation', 'Policy', 'Partnership', 'General'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPressReleases();
  }

  loadPressReleases(): void {
    this.isLoading = true;
    this.apiService.getPressReleases().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.pressReleases = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading press releases', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  addPressRelease(): void {
    if (!this.newHeadline.trim()) {
      this.snackBar.open('Headline is required', 'Close', { duration: 3000 });
      return;
    }
    const data = {
      headline: this.newHeadline,
      summary: this.newSummary,
      date: this.newDate,
      category: this.newCategory,
      pdf_link: this.newPdfLink,
      read_link: this.newReadLink,
      is_urgent: this.newIsUrgent,
      order: this.pressReleases.length
    };
    this.apiService.createPressRelease(data).subscribe({
      next: () => {
        this.snackBar.open('Press release created', 'Close', { duration: 3000 });
        this.resetAddForm();
        this.loadPressReleases();
      },
      error: () => {
        this.snackBar.open('Error creating press release', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(item: any): void {
    this.editingId = item._id;
    this.editHeadline = item.headline || '';
    this.editSummary = item.summary || '';
    this.editDate = item.date || '';
    this.editCategory = item.category || '';
    this.editPdfLink = item.pdf_link || '';
    this.editReadLink = item.read_link || '';
    this.editIsUrgent = item.is_urgent || false;
  }

  saveEdit(item: any): void {
    const data = {
      headline: this.editHeadline,
      summary: this.editSummary,
      date: this.editDate,
      category: this.editCategory,
      pdf_link: this.editPdfLink,
      read_link: this.editReadLink,
      is_urgent: this.editIsUrgent
    };
    this.apiService.updatePressRelease(item._id, data).subscribe({
      next: () => {
        this.snackBar.open('Press release updated', 'Close', { duration: 3000 });
        this.editingId = null;
        this.loadPressReleases();
      },
      error: () => {
        this.snackBar.open('Error updating press release', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deletePressRelease(item: any): void {
    if (!confirm('Are you sure you want to delete this press release?')) return;
    this.apiService.deletePressRelease(item._id).subscribe({
      next: () => {
        this.snackBar.open('Press release deleted', 'Close', { duration: 3000 });
        this.loadPressReleases();
      },
      error: () => {
        this.snackBar.open('Error deleting press release', 'Close', { duration: 3000 });
      }
    });
  }

  resetAddForm(): void {
    this.newHeadline = '';
    this.newSummary = '';
    this.newDate = '';
    this.newCategory = '';
    this.newPdfLink = '';
    this.newReadLink = '';
    this.newIsUrgent = false;
  }
}
