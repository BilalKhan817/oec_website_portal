import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-press-releases-management',
  templateUrl: './press-releases-management.component.html',
  styleUrls: ['./press-releases-management.component.css']
})
export class PressReleasesManagementComponent implements OnInit {
  pageForm: FormGroup;
  pageData: any = null;
  isLoading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.pageForm = this.fb.group({
      points: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  get points(): FormArray {
    return this.pageForm.get('points') as FormArray;
  }

  addPoint(): void {
    this.points.push(this.fb.group({
      title: [''],
      date: ['']
    }));
  }

  removePoint(index: number): void {
    this.points.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.apiService.getPressReleases().subscribe({
      next: (response: any) => {
        if (response.success && response.data && response.data.length > 0) {
          this.pageData = response.data[0];
          this.populateForm(response.data[0]);
        } else {
          this.isEditing = true;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading page:', error);
        this.isLoading = false;
        this.isEditing = true;
      }
    });
  }

  populateForm(data: any): void {
    this.points.clear();
    if (data.points && Array.isArray(data.points)) {
      data.points.forEach((point: any) => {
        this.points.push(this.fb.group({
          title: [point.title || ''],
          date: [point.date || '']
        }));
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.pageData) {
      this.populateForm(this.pageData);
    }
  }

  onSubmit(): void {
    if (this.pageForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    const data = this.pageForm.value;

    this.apiService.updatePressRelease(this.pageData?._id, data).subscribe({
      next: (response: any) => {
        this.snackBar.open('Page saved successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isEditing = false;
        this.loadPage();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving page:', error);
        this.snackBar.open('Error saving page', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
}
