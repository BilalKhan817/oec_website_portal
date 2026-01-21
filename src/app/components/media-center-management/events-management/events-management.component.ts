import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-events-management',
  templateUrl: './events-management.component.html',
  styleUrls: ['./events-management.component.css']
})
export class EventsManagementComponent implements OnInit {
  eventsForm: FormGroup;
  events: any[] = [];
  isLoading = false;
  isEditing = false;
  selectedFiles: { [key: number]: File } = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.eventsForm = this.fb.group({
      events: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  get eventsArray(): FormArray {
    return this.eventsForm.get('events') as FormArray;
  }

  loadEvents(): void {
    this.isLoading = true;
    this.apiService.getEvents().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.events = response.data;
          this.populateForm(response.data);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  populateForm(data: any[]): void {
    this.eventsArray.clear();
    if (data && Array.isArray(data)) {
      data.forEach((event: any) => {
        this.eventsArray.push(this.fb.group({
          _id: [event._id],
          title: [event.title || '', Validators.required],
          description: [event.description || '', Validators.required],
          image: [event.image || ''],
          order: [event.order || 0]
        }));
      });
    }
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(this.events);
    }
  }

  onSubmit(): void {
    if (this.eventsForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    const updates = this.eventsArray.value;
    let completed = 0;
    let errors = 0;

    updates.forEach((event: any, index: number) => {
      const formData = new FormData();
      formData.append('title', event.title);
      formData.append('description', event.description);
      formData.append('order', event.order);

      if (this.selectedFiles[index]) {
        formData.append('image', this.selectedFiles[index]);
      }

      this.apiService.updateEvent(event._id, event).subscribe({
        next: () => {
          completed++;
          if (completed + errors === updates.length) {
            this.finishUpdate(errors);
          }
        },
        error: (error: any) => {
          console.error('Error updating event:', error);
          errors++;
          if (completed + errors === updates.length) {
            this.finishUpdate(errors);
          }
        }
      });
    });
  }

  finishUpdate(errors: number): void {
    this.isLoading = false;
    if (errors === 0) {
      this.snackBar.open('All events updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.isEditing = false;
      this.selectedFiles = {};
      this.loadEvents();
    } else {
      this.snackBar.open(`Updated with ${errors} error(s)`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
