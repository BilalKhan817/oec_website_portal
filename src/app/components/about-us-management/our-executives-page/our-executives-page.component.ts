import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-our-executives-page',
  templateUrl: './our-executives-page.component.html',
  styleUrls: ['./our-executives-page.component.css']
})
export class OurExecutivesPageComponent implements OnInit {
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
      leadership_items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }


  loadPage(): void {
    this.isLoading = true;
    this.apiService.getOurExecutivesPage().subscribe({
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

  get leadershipItems(): FormArray {
    return this.pageForm.get('leadership_items') as FormArray;
  }

  addLeadershipItem(): void {
    this.leadershipItems.push(this.fb.group({
      title: [''],
      image: [''],
      order: [this.leadershipItems.length]
    }));
  }

  removeLeadershipItem(index: number): void {
    this.leadershipItems.removeAt(index);
  }

  onLeadershipImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[`leadership_image_${index}`] = file;
    }
  }

  populateForm(data: any): void {
    this.pageForm.patchValue({
      navbar_description: data.navbar_description || ''
    });

    // Clear existing items
    this.leadershipItems.clear();

    // Populate leadership items
    if (data.leadership_items && Array.isArray(data.leadership_items)) {
      data.leadership_items.forEach((item: any) => {
        this.leadershipItems.push(this.fb.group({
          title: [item.title || ''],
          image: [item.image || ''],
          order: [item.order || 0]
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

    // Add navbar description
    formData.append('navbar_description', this.pageForm.value.navbar_description || '');

    // Add leadership items (without images for now)
    const leadershipItems = this.pageForm.value.leadership_items.map((item: any) => ({
      title: item.title,
      order: item.order,
      image: item.image // Keep existing image path
    }));
    formData.append('leadership_items', JSON.stringify(leadershipItems));

    // Add image files
    Object.keys(this.selectedFiles).forEach(key => {
      formData.append(key, this.selectedFiles[key]);
    });

    this.isLoading = true;
    this.apiService.createOrUpdateOurExecutivesPage(formData).subscribe({
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
