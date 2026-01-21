import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-why-choose-oec-page',
  templateUrl: './why-choose-oec-page.component.html',
  styleUrls: ['./why-choose-oec-page.component.css']
})
export class WhyChooseOecPageComponent implements OnInit {
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
      why_choose_text: [''],
      key_advantages: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }


  loadPage(): void {
    this.isLoading = true;
    this.apiService.getWhyChooseOecPage().subscribe({
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
      navbar_description: data.navbar_description || '',
      why_choose_text: data.why_choose_text || ''
    });

    // Populate key_advantages array
    if (data.key_advantages && Array.isArray(data.key_advantages)) {
      this.keyAdvantages.clear();
      data.key_advantages.forEach((advantage: string) => {
        this.keyAdvantages.push(this.fb.control(advantage));
      });
    }
  }

  get keyAdvantages(): FormArray {
    return this.pageForm.get('key_advantages') as FormArray;
  }

  addKeyAdvantage(): void {
    this.keyAdvantages.push(this.fb.control(''));
  }

  removeKeyAdvantage(index: number): void {
    this.keyAdvantages.removeAt(index);
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
    this.apiService.createOrUpdateWhyChooseOecPage(formData).subscribe({
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
