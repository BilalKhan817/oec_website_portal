// components/announcements/announcement-dialog/announcement-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, Announcement } from '../../../services/api.service';

@Component({
  selector: 'app-announcement-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{isEditMode ? 'edit' : 'add'}}</mat-icon>
        {{isEditMode ? 'Edit' : 'Create'}} Announcement
      </h2>

      <div mat-dialog-content class="dialog-content">
        <form [formGroup]="announcementForm" class="announcement-form">
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Announcement Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter announcement title">
              <mat-icon matSuffix>title</mat-icon>
              <mat-error *ngIf="announcementForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="announcement_category">
                  <mat-option value="general">General</mat-option>
                  <mat-option value="urgent">Urgent</mat-option>
                  <mat-option value="news">News</mat-option>
                  <mat-option value="event">Event</mat-option>
                  <mat-option value="update">Update</mat-option>
                </mat-select>
                <mat-icon matSuffix>category</mat-icon>
                <mat-error *ngIf="announcementForm.get('announcement_category')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Deadline</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="deadline">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="announcementForm.get('deadline')?.hasError('required')">
                  Deadline is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <div class="section-divider">
            <mat-icon>link</mat-icon>
            <span>Action Buttons</span>
          </div>

          <div class="buttons-section">
            <div class="button-group orange-group">
              <h4 class="button-group-title">
                <div class="color-indicator orange"></div>
                Orange Button
              </h4>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Text</mat-label>
                  <input matInput formControlName="orange_button_title" placeholder="e.g., Apply Now">
                  <mat-icon matSuffix>text_fields</mat-icon>
                  <mat-error *ngIf="announcementForm.get('orange_button_title')?.hasError('required')">
                    Orange button text is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Link</mat-label>
                  <input matInput formControlName="orange_button_link" placeholder="https://example.com or /relative-path">
                  <mat-icon matSuffix>link</mat-icon>
                  <mat-error *ngIf="announcementForm.get('orange_button_link')?.hasError('required')">
                    Orange button link is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="button-group blue-group">
              <h4 class="button-group-title">
                <div class="color-indicator blue"></div>
                Blue Button
              </h4>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Text</mat-label>
                  <input matInput formControlName="blue_button_title" placeholder="e.g., Learn More">
                  <mat-icon matSuffix>text_fields</mat-icon>
                  <mat-error *ngIf="announcementForm.get('blue_button_title')?.hasError('required')">
                    Blue button text is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Link</mat-label>
                  <input matInput formControlName="blue_button_link" placeholder="https://example.com or /relative-path">
                  <mat-icon matSuffix>link</mat-icon>
                  <mat-error *ngIf="announcementForm.get('blue_button_link')?.hasError('required')">
                    Blue button link is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </div>

        </form>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSave()"
          [disabled]="announcementForm.invalid || isSubmitting"
          class="save-button">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <mat-icon *ngIf="!isSubmitting">{{isEditMode ? 'save' : 'add'}}</mat-icon>
          {{isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }

    .dialog-title {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      margin: 0;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .dialog-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .dialog-content {
      padding: 32px !important;
      max-height: 70vh;
      overflow-y: auto;
    }

    .announcement-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-group {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .section-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 0;
      padding: 16px 0;
      border-top: 2px solid rgba(0, 0, 0, 0.1);
      color: #333;
      font-weight: 600;
    }

    .buttons-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .button-group {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid;
    }

    .orange-group {
      border-color: rgba(255, 107, 53, 0.2);
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(247, 147, 30, 0.05) 100%);
    }

    .blue-group {
      border-color: rgba(79, 172, 254, 0.2);
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%);
    }

    .button-group-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
    }

    .color-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .color-indicator.orange {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    }

    .color-indicator.blue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .dialog-actions {
      padding: 16px 32px 32px 32px;
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    .cancel-button {
      color: #666;
    }

    .save-button {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      min-width: 120px;
    }

    .save-button:disabled {
      background: #ccc !important;
      color: rgba(0, 0, 0, 0.38) !important;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }

      .buttons-section {
        grid-template-columns: 1fr;
      }

      .dialog-actions {
        flex-direction: column-reverse;
      }

      .save-button, .cancel-button {
        width: 100%;
      }
    }
  `]
})
export class AnnouncementDialogComponent implements OnInit {
  announcementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement | null
  ) {
    this.isEditMode = !!data;
    this.announcementForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      deadline: [data?.deadline ? new Date(data.deadline) : '', [Validators.required]],
      announcement_category: [data?.announcement_category || '', [Validators.required]],
      orange_button_title: [data?.orange_button_title || '', [Validators.required]],
      orange_button_link: [data?.orange_button_link || '', [Validators.required]],
      blue_button_title: [data?.blue_button_title || '', [Validators.required]],
      blue_button_link: [data?.blue_button_link || '', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  onSave(): void {
    if (this.announcementForm.valid) {
      this.isSubmitting = true;
      const formValue = this.announcementForm.value;

      const request = this.isEditMode
        ? this.apiService.updateAnnouncement(this.data!._id!, formValue)
        : this.apiService.createAnnouncement(formValue);

      request.subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error saving announcement:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}