import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-industries-management',
  templateUrl: './industries-management.component.html',
  styleUrls: ['./industries-management.component.css']
})
export class IndustriesManagementComponent implements OnInit {
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
      industries_we_serve: this.fb.array([]),
      fee_structure: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  get industriesWeServe(): FormArray {
    return this.pageForm.get('industries_we_serve') as FormArray;
  }

  get feeStructure(): FormArray {
    return this.pageForm.get('fee_structure') as FormArray;
  }

  addIndustry(): void {
    this.industriesWeServe.push(this.fb.control(''));
  }

  removeIndustry(index: number): void {
    this.industriesWeServe.removeAt(index);
  }

  addFeeItem(): void {
    this.feeStructure.push(this.fb.control(''));
  }

  removeFeeItem(index: number): void {
    this.feeStructure.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.apiService.getIndustriesPage().subscribe({
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
    this.industriesWeServe.clear();
    if (data.industries_we_serve && Array.isArray(data.industries_we_serve)) {
      data.industries_we_serve.forEach((item: string) => {
        this.industriesWeServe.push(this.fb.control(item));
      });
    }

    this.feeStructure.clear();
    if (data.fee_structure && Array.isArray(data.fee_structure)) {
      data.fee_structure.forEach((item: string) => {
        this.feeStructure.push(this.fb.control(item));
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
    const formData = new FormData();

    formData.append('industries_we_serve', JSON.stringify(this.pageForm.value.industries_we_serve));
    formData.append('fee_structure', JSON.stringify(this.pageForm.value.fee_structure));

    this.isLoading = true;
    this.apiService.createOrUpdateIndustriesPage(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Page saved successfully', 'Close', {
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
        this.snackBar.open('Error saving page', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
}
