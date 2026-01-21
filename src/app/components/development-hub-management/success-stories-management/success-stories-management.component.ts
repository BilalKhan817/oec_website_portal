import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-success-stories-management',
  templateUrl: './success-stories-management.component.html',
  styleUrls: ['./success-stories-management.component.css']
})
export class SuccessStoriesManagementComponent implements OnInit {
  successStories: any[] = [];
  isLoading = false;
  showForm = false;
  isEditMode = false;
  currentStoryId: string | null = null;

  storyForm: FormGroup;
  selectedFile: File | null = null;

  displayedColumns: string[] = ['title', 'person_name', 'country', 'year', 'actions'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      person_name: ['', Validators.required],
      country: ['', Validators.required],
      story: ['', Validators.required],
      image_url: [''],
      year: ['']
    });
  }

  ngOnInit(): void {
    this.loadSuccessStories();
  }

  loadSuccessStories(): void {
    this.isLoading = true;
    this.apiService.getSuccessStories().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successStories = response.data || [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading success stories:', error);
        this.snackBar.open('Error loading success stories', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  showCreateForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.currentStoryId = null;
    this.storyForm.reset();
    this.selectedFile = null;
  }

  showEditForm(story: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentStoryId = story._id;
    this.storyForm.patchValue({
      title: story.title,
      person_name: story.person_name,
      country: story.country,
      story: story.story,
      image_url: story.image_url,
      year: story.year
    });
    this.selectedFile = null;
  }

  cancelForm(): void {
    this.showForm = false;
    this.storyForm.reset();
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.storyForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    Object.keys(this.storyForm.value).forEach(key => {
      const value = this.storyForm.value[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isLoading = true;

    const request = this.isEditMode && this.currentStoryId
      ? this.apiService.updateSuccessStory(this.currentStoryId, formData)
      : this.apiService.createSuccessStory(formData);

    request.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open(
            `Success story ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.showForm = false;
          this.storyForm.reset();
          this.loadSuccessStories();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving success story:', error);
        this.snackBar.open('Error saving success story', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteStory(id: string): void {
    if (confirm('Are you sure you want to delete this success story?')) {
      this.isLoading = true;
      this.apiService.deleteSuccessStory(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.snackBar.open('Success story deleted successfully', 'Close', { duration: 3000 });
            this.loadSuccessStories();
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error deleting success story:', error);
          this.snackBar.open('Error deleting success story', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
