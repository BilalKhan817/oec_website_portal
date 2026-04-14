import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-reports-analytics-page',
  templateUrl: './reports-analytics-page.component.html',
  styleUrls: ['./reports-analytics-page.component.css']
})
export class ReportsAnalyticsPageComponent implements OnInit {
  displayedColumns: string[] = ['section', 'title', 'pdf', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;

  // Upload form state
  selectedPdf: File | null = null;
  selectedPdfName = '';
  isUploading = false;

  // Edit state
  editingDoc: any = null;
  editSection = '';
  editTitle = '';
  editPdf: File | null = null;
  editPdfName = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.apiService.getReportDocuments().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading documents:', error);
        this.snackBar.open('Error loading documents', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  onPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPdf = file;
      this.selectedPdfName = file.name;
    }
  }

  uploadDocument(sectionInput: HTMLInputElement, titleInput: HTMLInputElement,
                 pdfInput: HTMLInputElement): void {
    const section = sectionInput.value?.trim();
    const title = titleInput.value?.trim();

    if (!section) {
      this.snackBar.open('Please enter a section title', 'Close', {
        duration: 3000, panelClass: ['error-snackbar']
      });
      return;
    }
    if (!title) {
      this.snackBar.open('Please enter a document title', 'Close', {
        duration: 3000, panelClass: ['error-snackbar']
      });
      return;
    }
    if (!this.selectedPdf) {
      this.snackBar.open('Please select a PDF file', 'Close', {
        duration: 3000, panelClass: ['error-snackbar']
      });
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('section', section);
    formData.append('title', title);
    formData.append('pdf', this.selectedPdf);

    this.apiService.uploadReportDocument(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Document uploaded successfully', 'Close', {
            duration: 3000, panelClass: ['success-snackbar']
          });
          sectionInput.value = '';
          titleInput.value = '';
          this.selectedPdf = null;
          this.selectedPdfName = '';
          pdfInput.value = '';
          this.loadDocuments();
        }
        this.isUploading = false;
      },
      error: (error: any) => {
        console.error('Error uploading document:', error);
        this.snackBar.open('Error uploading document', 'Close', {
          duration: 3000, panelClass: ['error-snackbar']
        });
        this.isUploading = false;
      }
    });
  }

  startEdit(doc: any): void {
    this.editingDoc = doc;
    this.editSection = doc.section;
    this.editTitle = doc.title;
    this.editPdf = null;
    this.editPdfName = '';
  }

  cancelEdit(): void {
    this.editingDoc = null;
    this.editSection = '';
    this.editTitle = '';
    this.editPdf = null;
    this.editPdfName = '';
  }

  onEditPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editPdf = file;
      this.editPdfName = file.name;
    }
  }

  saveEdit(): void {
    if (!this.editSection.trim()) {
      this.snackBar.open('Section title cannot be empty', 'Close', {
        duration: 3000, panelClass: ['error-snackbar']
      });
      return;
    }
    if (!this.editTitle.trim()) {
      this.snackBar.open('Document title cannot be empty', 'Close', {
        duration: 3000, panelClass: ['error-snackbar']
      });
      return;
    }

    const formData = new FormData();
    formData.append('section', this.editSection.trim());
    formData.append('title', this.editTitle.trim());
    if (this.editPdf) {
      formData.append('pdf', this.editPdf);
    }

    this.apiService.updateReportDocument(this.editingDoc._id, formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Document updated successfully', 'Close', {
            duration: 3000, panelClass: ['success-snackbar']
          });
          this.cancelEdit();
          this.loadDocuments();
        }
      },
      error: (error: any) => {
        console.error('Error updating document:', error);
        this.snackBar.open('Error updating document', 'Close', {
          duration: 3000, panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteDocument(doc: any): void {
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      this.apiService.deleteReportDocument(doc._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.snackBar.open('Document deleted successfully', 'Close', {
              duration: 3000, panelClass: ['success-snackbar']
            });
            this.loadDocuments();
          }
        },
        error: (error: any) => {
          console.error('Error deleting document:', error);
          this.snackBar.open('Error deleting document', 'Close', {
            duration: 3000, panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getFileUrl(filePath: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return this.apiService.MainbaseUrl + filePath;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
