import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-achievements-page',
  templateUrl: './achievements-page.component.html',
  styleUrls: ['./achievements-page.component.css']
})
export class AchievementsPageComponent implements OnInit {
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
      key_achievements: this.fb.array([]),
      service_timelines: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }


  loadPage(): void {
    this.isLoading = true;
    this.apiService.getAchievementsPage().subscribe({
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

    // Populate key_achievements array
    if (data.key_achievements && Array.isArray(data.key_achievements)) {
      this.keyAchievements.clear();
      data.key_achievements.forEach((achievement: string) => {
        this.keyAchievements.push(this.fb.control(achievement));
      });
    }

    // Populate service_timelines array
    if (data.service_timelines && Array.isArray(data.service_timelines)) {
      this.serviceTimelines.clear();
      data.service_timelines.forEach((timeline: string) => {
        this.serviceTimelines.push(this.fb.control(timeline));
      });
    }
  }

  get keyAchievements(): FormArray {
    return this.pageForm.get('key_achievements') as FormArray;
  }

  addKeyAchievement(): void {
    this.keyAchievements.push(this.fb.control(''));
  }

  removeKeyAchievement(index: number): void {
    this.keyAchievements.removeAt(index);
  }

  get serviceTimelines(): FormArray {
    return this.pageForm.get('service_timelines') as FormArray;
  }

  addServiceTimeline(): void {
    this.serviceTimelines.push(this.fb.control(''));
  }

  removeServiceTimeline(index: number): void {
    this.serviceTimelines.removeAt(index);
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
    this.apiService.createOrUpdateAchievementsPage(formData).subscribe({
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
