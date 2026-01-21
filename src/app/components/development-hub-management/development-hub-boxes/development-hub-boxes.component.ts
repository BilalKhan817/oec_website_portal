import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-development-hub-boxes',
  templateUrl: './development-hub-boxes.component.html',
  styleUrls: ['./development-hub-boxes.component.css']
})
export class DevelopmentHubBoxesComponent implements OnInit {
  boxesForm: FormGroup;
  boxes: any[] = [];
  isLoading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.boxesForm = this.fb.group({
      boxes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadBoxes();
  }

  get boxesArray(): FormArray {
    return this.boxesForm.get('boxes') as FormArray;
  }

  loadBoxes(): void {
    this.isLoading = true;
    this.apiService.getDevelopmentHubBoxes().subscribe({
      next: (response: any) => {
        this.boxes = response;
        this.populateForm(response);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading boxes:', error);
        this.isLoading = false;
        this.snackBar.open('Error loading data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  populateForm(data: any[]): void {
    this.boxesArray.clear();
    if (data && Array.isArray(data)) {
      data.forEach((box: any) => {
        this.boxesArray.push(this.fb.group({
          _id: [box._id],
          title: [box.title || '', Validators.required],
          description: [box.description || '', Validators.required],
          order: [box.order || 0]
        }));
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(this.boxes);
    }
  }

  onSubmit(): void {
    if (this.boxesForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;
    const updates = this.boxesArray.value;
    let completed = 0;
    let errors = 0;

    updates.forEach((box: any) => {
      this.apiService.updateDevelopmentHubBox(box._id, box).subscribe({
        next: () => {
          completed++;
          if (completed + errors === updates.length) {
            this.finishUpdate(errors);
          }
        },
        error: (error: any) => {
          console.error('Error updating box:', error);
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
      this.snackBar.open('All boxes updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.isEditing = false;
      this.loadBoxes();
    } else {
      this.snackBar.open(`Updated with ${errors} error(s)`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
