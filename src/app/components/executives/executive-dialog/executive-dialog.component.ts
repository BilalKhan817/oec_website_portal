// components/executives/executive-dialog/executive-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, Executive } from '../../../services/api.service';

@Component({
  selector: 'app-executive-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{isEditMode ? 'edit' : 'person_add'}}</mat-icon>
        {{isEditMode ? 'Edit' : 'Add'}} Executive
      </h2>

      <div mat-dialog-content class="dialog-content">
        <form [formGroup]="executiveForm" class="executive-form">
          
          <!-- Image Upload Section -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>portrait</mat-icon>
              Profile Photo
            </h3>
            
            <div class="image-upload-container">
              <div class="image-preview" *ngIf="imagePreview">
                <img [src]="imagePreview" alt="Preview" class="preview-image">
                <button mat-icon-button class="remove-image" (click)="removeImage()">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              
              <div class="upload-area" *ngIf="!imagePreview" (click)="fileInput.click()">
                <mat-icon class="upload-icon">person</mat-icon>
                <p class="upload-text">Click to upload profile photo</p>
                <p class="upload-hint">PNG, JPG up to 5MB • Recommended: 400x400px</p>
              </div>
              
              <input 
                #fileInput 
                type="file" 
                accept="image/*" 
                (change)="onImageSelected($event)"
                style="display: none;">
            </div>
          </div>

          <!-- Basic Information -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>badge</mat-icon>
              Basic Information
            </h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter executive's full name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="executiveForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Position/Title</mat-label>
                <input matInput formControlName="position" placeholder="e.g., Chief Executive Officer">
                <mat-icon matSuffix>work</mat-icon>
                <mat-error *ngIf="executiveForm.get('position')?.hasError('required')">
                  Position is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="badge-field">
                <mat-label>Badge/Department</mat-label>
                <mat-select formControlName="badge">
                  <mat-option value="CEO">CEO</mat-option>
                  <mat-option value="COO">COO</mat-option>
                  <mat-option value="CFO">CFO</mat-option>
                  <mat-option value="CTO">CTO</mat-option>
                  <mat-option value="VP">Vice President</mat-option>
                  <mat-option value="Director">Director</mat-option>
                  <mat-option value="Manager">Manager</mat-option>
                  <mat-option value="Lead">Team Lead</mat-option>
                  <mat-option value="Senior">Senior</mat-option>
                  <mat-option value="Executive">Executive</mat-option>
                </mat-select>
                <mat-icon matSuffix>local_offer</mat-icon>
                <mat-error *ngIf="executiveForm.get('badge')?.hasError('required')">
                  Badge is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="order-field">
                <mat-label>Display Order</mat-label>
                <input matInput type="number" formControlName="order" min="1">
                <mat-icon matSuffix>sort</mat-icon>
                <mat-hint>Lower numbers appear first</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Profile Link -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>link</mat-icon>
              Profile Link
            </h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Profile URL</mat-label>
              <input matInput formControlName="profile_url" placeholder="https://linkedin.com/in/executive-name">
              <mat-icon matSuffix>open_in_new</mat-icon>
              <mat-hint>External link to detailed profile (LinkedIn, company page, etc.)</mat-hint>
              <mat-error *ngIf="executiveForm.get('profile_url')?.hasError('required')">
                Profile URL is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Status -->
          <div class="section">
            <div class="status-section">
              <mat-slide-toggle formControlName="is_active" color="primary">
                <span class="toggle-label">
                  <mat-icon>{{executiveForm.get('is_active')?.value ? 'visibility' : 'visibility_off'}}</mat-icon>
                  {{executiveForm.get('is_active')?.value ? 'Profile is Active' : 'Profile is Inactive'}}
                </span>
              </mat-slide-toggle>
              <p class="status-hint">Inactive profiles won't be displayed on the website</p>
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
          [disabled]="executiveForm.invalid || isSubmitting || (!selectedFile && !isEditMode)"
          class="save-button">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <mat-icon *ngIf="!isSubmitting">{{isEditMode ? 'save' : 'person_add'}}</mat-icon>
          {{isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add Executive')}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }

    .dialog-title {
      background: linear-gradient(135deg, #047857 0%, #22c395 100%);
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

    .executive-form {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding-bottom: 24px;
    }

    .section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .image-upload-container {
      margin-top: 16px;
    }

    .image-preview {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .preview-image {
      width: 150px;
      height: 150px;
      object-fit: cover;
      display: block;
    }

    .remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      width: 32px;
      height: 32px;
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.02) 0%, rgba(0, 242, 254, 0.02) 100%);
      width: 100%;
      max-width: 300px;
    }

    .upload-area:hover {
      border-color: #4facfe;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%);
    }

    .upload-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #4facfe;
      margin-bottom: 16px;
    }

    .upload-text {
      margin: 0 0 8px 0;
      font-weight: 500;
      color: #333;
    }

    .upload-hint {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .badge-field {
      flex: 2;
    }

    .order-field {
      flex: 1;
      min-width: 120px;
    }

    .status-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .status-hint {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
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
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      min-width: 140px;
    }

    .save-button:disabled {
      background: #ccc !important;
      color: rgba(0, 0, 0, 0.38) !important;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }

      .dialog-actions {
        flex-direction: column-reverse;
      }

      .save-button, .cancel-button {
        width: 100%;
      }

      .upload-area {
        max-width: 100%;
      }
    }
  `]
})
export class ExecutiveDialogComponent implements OnInit {
  executiveForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ExecutiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Executive | null
  ) {
    this.isEditMode = !!data;
    this.executiveForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      position: [data?.position || '', [Validators.required]],
      badge: [data?.badge || '', [Validators.required]],
      profile_url: [data?.profile_url || '', [Validators.required]],
      order: [data?.order || 1, [Validators.min(1)]],
      is_active: [data?.is_active !== false]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.image_url) {
      this.imagePreview = `http://localhost:3000${this.data.image_url}`;
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSave(): void {
    if (this.executiveForm.valid && (this.selectedFile || this.isEditMode)) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const formValue = this.executiveForm.value;

      // Add image if selected
      if (this.selectedFile) {
        formData.append('executive_image', this.selectedFile);
      }

      // Add form fields
      formData.append('name', formValue.name);
      formData.append('position', formValue.position);
      formData.append('badge', formValue.badge);
      formData.append('profile_url', formValue.profile_url);
      formData.append('order', formValue.order.toString());
      formData.append('is_active', formValue.is_active.toString());

      const request = this.isEditMode
        ? this.apiService.updateExecutive(this.data!._id!, formData)
        : this.apiService.createExecutive(formData);

      request.subscribe({
        next: (response:any) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (error:any) => {
          console.error('Error saving executive:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}