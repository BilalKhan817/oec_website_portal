import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-governing-law-page',
  templateUrl: './governing-law-page.component.html',
  styleUrls: ['./governing-law-page.component.css']
})
export class GoverningLawPageComponent implements OnInit {
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
      navbar_description: [''],
      legal_points: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.isLoading = true;
    this.apiService.getGoverningLawPage().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.pageData = response.data;
          this.populateForm(response.data);
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
    this.pageForm.patchValue({
      navbar_description: data.navbar_description || ''
    });

    // Clear and populate legal_points array
    this.legalPoints.clear();
    if (data.legal_points && Array.isArray(data.legal_points)) {
      data.legal_points.forEach((point: string) => {
        this.legalPoints.push(this.fb.control(point));
      });
    }
  }

  get legalPoints(): FormArray {
    return this.pageForm.get('legal_points') as FormArray;
  }

  addLegalPoint(): void {
    this.legalPoints.push(this.fb.control(''));
  }

  removeLegalPoint(index: number): void {
    this.legalPoints.removeAt(index);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.pageData) {
      this.populateForm(this.pageData);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('navbar_description', this.pageForm.value.navbar_description || '');
    formData.append('legal_points', JSON.stringify(this.pageForm.value.legal_points || []));

    this.isLoading = true;
    this.apiService.createOrUpdateGoverningLawPage(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Description saved successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.isEditing = false;
          this.loadPage();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving page:', error);
        this.snackBar.open('Error saving description', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
}
