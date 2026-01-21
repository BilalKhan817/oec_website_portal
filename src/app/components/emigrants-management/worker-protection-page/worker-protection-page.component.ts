import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-worker-protection-page',
  templateUrl: './worker-protection-page.component.html',
  styleUrls: ['./worker-protection-page.component.css']
})
export class WorkerProtectionPageComponent implements OnInit {
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
      page_title: ['Worker Protection', Validators.required],
      introduction: ['', Validators.required],
      legal_framework: [''],
      protection_measures: this.fb.array([]),
      resources: this.fb.array([]),
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  get protection_measures(): FormArray {
    return this.pageForm.get('protection_measures') as FormArray;
  }

  get resources(): FormArray {
    return this.pageForm.get('resources') as FormArray;
  }

  addProtectionMeasure(): void {
    this.protection_measures.push(this.fb.group({
      title: ['', Validators.required],
      description: [''],
      icon: ['']
    }));
  }

  removeProtectionMeasure(index: number): void {
    this.protection_measures.removeAt(index);
  }

  addResource(): void {
    this.resources.push(this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link_url: ['']
    }));
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.apiService.getWorkerProtectionPage().subscribe({
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
      page_title: data.page_title || 'Worker Protection',
      introduction: data.introduction || '',
      legal_framework: data.legal_framework || '',
      is_active: data.is_active !== undefined ? data.is_active : true
    });

    this.protection_measures.clear();
    if (data.protection_measures && Array.isArray(data.protection_measures)) {
      data.protection_measures.forEach((measure: any) => {
        this.protection_measures.push(this.fb.group({
          title: [measure.title || '', Validators.required],
          description: [measure.description || ''],
          icon: [measure.icon || '']
        }));
      });
    }

    this.resources.clear();
    if (data.resources && Array.isArray(data.resources)) {
      data.resources.forEach((resource: any) => {
        this.resources.push(this.fb.group({
          title: [resource.title || '', Validators.required],
          description: [resource.description || ''],
          link_url: [resource.link_url || '']
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
    this.apiService.createOrUpdateWorkerProtectionPage(formData).subscribe({
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
