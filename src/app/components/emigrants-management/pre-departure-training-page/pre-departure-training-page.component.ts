import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-pre-departure-training-page',
  templateUrl: './pre-departure-training-page.component.html',
  styleUrls: ['./pre-departure-training-page.component.css']
})
export class PreDepartureTrainingPageComponent implements OnInit {
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
      page_title: ['Pre-Departure Training', Validators.required],
      introduction: ['', Validators.required],
      training_duration: [''],
      training_modules: this.fb.array([]),
      facilities: this.fb.array([]),
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  get training_modules(): FormArray {
    return this.pageForm.get('training_modules') as FormArray;
  }

  get facilities(): FormArray {
    return this.pageForm.get('facilities') as FormArray;
  }

  addTrainingModule(): void {
    this.training_modules.push(this.fb.group({
      title: ['', Validators.required],
      description: [''],
      duration: ['']
    }));
  }

  removeTrainingModule(index: number): void {
    this.training_modules.removeAt(index);
  }

  addFacility(): void {
    this.facilities.push(this.fb.group({
      name: ['', Validators.required],
      location: [''],
      capacity: ['']
    }));
  }

  removeFacility(index: number): void {
    this.facilities.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.apiService.getPreDepartureTrainingPage().subscribe({
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
      page_title: data.page_title || 'Pre-Departure Training',
      introduction: data.introduction || '',
      training_duration: data.training_duration || '',
      is_active: data.is_active !== undefined ? data.is_active : true
    });

    this.training_modules.clear();
    if (data.training_modules && Array.isArray(data.training_modules)) {
      data.training_modules.forEach((module: any) => {
        this.training_modules.push(this.fb.group({
          title: [module.title || '', Validators.required],
          description: [module.description || ''],
          duration: [module.duration || '']
        }));
      });
    }

    this.facilities.clear();
    if (data.facilities && Array.isArray(data.facilities)) {
      data.facilities.forEach((facility: any) => {
        this.facilities.push(this.fb.group({
          name: [facility.name || '', Validators.required],
          location: [facility.location || ''],
          capacity: [facility.capacity || '']
        }));
      });
    }
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
    this.apiService.createOrUpdatePreDepartureTrainingPage(formData).subscribe({
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
