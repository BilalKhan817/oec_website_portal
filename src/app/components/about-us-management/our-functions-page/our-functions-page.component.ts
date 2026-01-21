import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-our-functions-page',
  templateUrl: './our-functions-page.component.html',
  styleUrls: ['./our-functions-page.component.css']
})
export class OurFunctionsPageComponent implements OnInit {
  pageForm: FormGroup;
  pageData: any = null;
  isLoading = false;
  isEditing = false;
  selectedFiles: { [key: string]: File } = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.pageForm = this.fb.group({
      navbar_description: [''],
      function_points: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }


  loadPage(): void {
    this.isLoading = true;
    this.apiService.getOurFunctionsPage().subscribe({
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

    // Clear and populate function_points array
    this.functionPoints.clear();
    if (data.function_points && Array.isArray(data.function_points)) {
      data.function_points.forEach((point: string) => {
        this.functionPoints.push(this.fb.control(point));
      });
    }
  }

  get functionPoints(): FormArray {
    return this.pageForm.get('function_points') as FormArray;
  }

  addFunctionPoint(): void {
    this.functionPoints.push(this.fb.control(''));
  }

  removeFunctionPoint(index: number): void {
    this.functionPoints.removeAt(index);
  }

  onFileSelected(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fieldName] = file;
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

    const formData = new FormData();

    Object.keys(this.pageForm.value).forEach(key => {
      const value = this.pageForm.value[key];
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    Object.keys(this.selectedFiles).forEach(key => {
      formData.append(key, this.selectedFiles[key]);
    });

    this.isLoading = true;
    this.apiService.createOrUpdateOurFunctionsPage(formData).subscribe({
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
