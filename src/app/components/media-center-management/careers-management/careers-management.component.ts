import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-careers-management',
  templateUrl: './careers-management.component.html',
  styleUrls: ['./careers-management.component.css']
})
export class CareersManagementComponent implements OnInit {

  // Job Postings
  jobs: any[] = [];
  jobColumns: string[] = ['title', 'grade', 'location', 'deadline', 'applyLink', 'actions'];
  newJobTitle = '';
  newJobGrade = '';
  newJobLocation = '';
  newJobDeadline: Date | null = null;
  newJobApplyLink = '';

  editingJobId: string | null = null;
  editTitle = '';
  editGrade = '';
  editLocation = '';
  editDeadline: Date | null = null;
  editApplyLink = '';

  // Career Forms
  forms: any[] = [];
  formColumns: string[] = ['title', 'description', 'file', 'actions'];
  newFormTitle = '';
  newFormDescription = '';
  newFormFile: File | null = null;
  newFormFileName = '';

  editingFormId: string | null = null;
  editFormTitle = '';
  editFormDescription = '';
  editFormFile: File | null = null;
  editFormFileName = '';

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadForms();
  }

  // ==================== JOB POSTINGS ====================

  loadJobs(): void {
    this.apiService.getJobPostings().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.jobs = response.data;
        }
      },
      error: () => this.snackBar.open('Error loading jobs', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  addJob(): void {
    if (!this.newJobTitle.trim()) {
      this.snackBar.open('Title is required', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    this.apiService.createJobPosting({
      title: this.newJobTitle.trim(),
      grade: this.newJobGrade.trim(),
      location: this.newJobLocation.trim(),
      deadline: this.newJobDeadline ? this.newJobDeadline.toISOString() : null,
      applyLink: this.newJobApplyLink.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadJobs();
          this.newJobTitle = '';
          this.newJobGrade = '';
          this.newJobLocation = '';
          this.newJobDeadline = null;
          this.newJobApplyLink = '';
          this.snackBar.open('Job added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding job', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  startEditJob(job: any): void {
    this.editingJobId = job._id;
    this.editTitle = job.title;
    this.editGrade = job.grade || '';
    this.editLocation = job.location || '';
    this.editDeadline = job.deadline ? new Date(job.deadline) : null;
    this.editApplyLink = job.applyLink || '';
  }

  cancelEditJob(): void {
    this.editingJobId = null;
  }

  saveEditJob(): void {
    if (!this.editTitle.trim()) return;
    this.apiService.updateJobPosting(this.editingJobId!, {
      title: this.editTitle.trim(),
      grade: this.editGrade.trim(),
      location: this.editLocation.trim(),
      deadline: this.editDeadline ? this.editDeadline.toISOString() : null,
      applyLink: this.editApplyLink.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.editingJobId = null;
          this.loadJobs();
          this.snackBar.open('Job updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error updating job', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteJob(job: any): void {
    if (confirm(`Delete "${job.title}"?`)) {
      this.apiService.deleteJobPosting(job._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadJobs();
            this.snackBar.open('Job deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting job', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  // ==================== CAREER FORMS ====================

  loadForms(): void {
    this.apiService.getCareerForms().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.forms = response.data;
        }
      },
      error: () => this.snackBar.open('Error loading forms', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  onFormFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newFormFile = file;
      this.newFormFileName = file.name;
    }
  }

  addForm(): void {
    if (!this.newFormTitle.trim()) {
      this.snackBar.open('Title is required', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }
    const formData = new FormData();
    formData.append('title', this.newFormTitle.trim());
    formData.append('description', this.newFormDescription.trim());
    if (this.newFormFile) {
      formData.append('file', this.newFormFile);
    }
    this.apiService.createCareerForm(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadForms();
          this.newFormTitle = '';
          this.newFormDescription = '';
          this.newFormFile = null;
          this.newFormFileName = '';
          this.snackBar.open('Form added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding form', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  startEditForm(form: any): void {
    this.editingFormId = form._id;
    this.editFormTitle = form.title;
    this.editFormDescription = form.description || '';
    this.editFormFile = null;
    this.editFormFileName = '';
  }

  cancelEditForm(): void {
    this.editingFormId = null;
  }

  onEditFormFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editFormFile = file;
      this.editFormFileName = file.name;
    }
  }

  saveEditForm(): void {
    if (!this.editFormTitle.trim()) return;
    const formData = new FormData();
    formData.append('title', this.editFormTitle.trim());
    formData.append('description', this.editFormDescription.trim());
    if (this.editFormFile) {
      formData.append('file', this.editFormFile);
    }
    this.apiService.updateCareerForm(this.editingFormId!, formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.editingFormId = null;
          this.loadForms();
          this.snackBar.open('Form updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error updating form', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteForm(form: any): void {
    if (confirm(`Delete "${form.title}"?`)) {
      this.apiService.deleteCareerForm(form._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadForms();
            this.snackBar.open('Form deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting form', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  getFileName(url: string): string {
    if (!url) return '';
    return url.split('/').pop() || url;
  }
}
