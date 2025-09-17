// components/banners/banner-dialog/banner-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, Banner } from '../../../services/api.service';

@Component({
  selector: 'app-banner-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{isEditMode ? 'edit' : 'add'}}</mat-icon>
        {{isEditMode ? 'Edit' : 'Create'}} Banner
      </h2>

      <div mat-dialog-content class="dialog-content">
        <form [formGroup]="bannerForm" class="banner-form">
          
          <!-- Image Upload Section -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>image</mat-icon>
              Background Image
            </h3>
            
            <div class="image-upload-container">
              <div class="image-preview" *ngIf="imagePreview">
                <img [src]="imagePreview" alt="Preview" class="preview-image">
                <button mat-icon-button class="remove-image" (click)="removeImage()">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              
              <div class="upload-area" *ngIf="!imagePreview" (click)="fileInput.click()">
                <mat-icon class="upload-icon">cloud_upload</mat-icon>
                <p class="upload-text">Click to upload background image</p>
                <p class="upload-hint">PNG, JPG up to 5MB</p>
              </div>
              
              <input 
                #fileInput 
                type="file" 
                accept="image/*" 
                (change)="onImageSelected($event)"
                style="display: none;">
            </div>
          </div>

          <!-- Title Section -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>title</mat-icon>
              Banner Title
            </h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="title-field">
                <mat-label>Main Title</mat-label>
                <input matInput formControlName="banner_title" placeholder="Enter banner title">
                <mat-error *ngIf="bannerForm.get('banner_title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="color-field">
                <mat-label>Title Color</mat-label>
                <input matInput formControlName="banner_title_color" type="color">
                <mat-icon matSuffix>palette</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="highlight-text-field">
                <mat-label>Highlight Text (Optional)</mat-label>
                <input matInput formControlName="banner_title_highlight_text" placeholder="Text to highlight">
                <mat-icon matSuffix>format_color_text</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="color-field">
                <mat-label>Highlight Color</mat-label>
                <input matInput formControlName="banner_title_highlight_color" type="color">
                <mat-icon matSuffix>palette</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <!-- Subtitle Section -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>subtitles</mat-icon>
              Subtitle Configuration
            </h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Subtitle Type</mat-label>
              <mat-select formControlName="banner_subtitle_type" (selectionChange)="onSubtitleTypeChange()">
                <mat-option value="none">No Subtitle</mat-option>
                <mat-option value="text">Text Subtitle</mat-option>
                <mat-option value="points">Bullet Points</mat-option>
              </mat-select>
              <mat-icon matSuffix>list</mat-icon>
            </mat-form-field>

            <div *ngIf="bannerForm.get('banner_subtitle_type')?.value === 'text'">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Subtitle Text</mat-label>
                <textarea matInput formControlName="banner_subtitle_text" rows="3" placeholder="Enter subtitle text"></textarea>
                <mat-icon matSuffix>text_fields</mat-icon>
              </mat-form-field>
            </div>

            <div *ngIf="bannerForm.get('banner_subtitle_type')?.value === 'points'">
              <div class="points-container">
                <div class="points-header">
                  <h4>Bullet Points</h4>
                  <button mat-icon-button type="button" (click)="addPoint()" color="primary">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                
                <div formArrayName="banner_subtitle_points" class="points-list">
                  <div *ngFor="let point of subtitlePoints.controls; let i = index" class="point-item">
                    <mat-form-field appearance="outline" class="point-field">
                      <mat-label>Point {{i + 1}}</mat-label>
                      <input matInput [formControlName]="i" placeholder="Enter bullet point">
                    </mat-form-field>
                    <button 
                      mat-icon-button 
                      type="button" 
                      (click)="removePoint(i)"
                      color="warn"
                      [disabled]="subtitlePoints.length <= 1">
                      <mat-icon>remove</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Support Message -->
          <div class="section">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Support Message (Optional)</mat-label>
              <textarea matInput formControlName="support_message" rows="2" placeholder="Additional support text"></textarea>
              <mat-icon matSuffix>support</mat-icon>
            </mat-form-field>
          </div>

          <!-- Action Buttons -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>smart_button</mat-icon>
              Action Buttons
            </h3>
            
            <div class="buttons-section">
              <div class="button-group green-group">
                <h4 class="button-group-title">
                  <div class="color-indicator green"></div>
                  Green Button (Primary)
                </h4>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Text</mat-label>
                  <input matInput formControlName="green_button" placeholder="e.g., Get Started">
                  <mat-icon matSuffix>text_fields</mat-icon>
                  <mat-error *ngIf="bannerForm.get('green_button')?.hasError('required')">
                    Green button text is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Link</mat-label>
                  <input matInput formControlName="green_button_link" placeholder="https://example.com or /relative-path">
                  <mat-icon matSuffix>link</mat-icon>
                  <mat-error *ngIf="bannerForm.get('green_button_link')?.hasError('required')">
                    Green button link is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="button-group gray-group">
                <h4 class="button-group-title">
                  <div class="color-indicator gray"></div>
                  Gray Button (Secondary)
                </h4>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Text</mat-label>
                  <input matInput formControlName="gray_button" placeholder="e.g., Learn More">
                  <mat-icon matSuffix>text_fields</mat-icon>
                  <mat-error *ngIf="bannerForm.get('gray_button')?.hasError('required')">
                    Gray button text is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Button Link</mat-label>
                  <input matInput formControlName="gray_button_link" placeholder="https://example.com or /relative-path">
                  <mat-icon matSuffix>link</mat-icon>
                  <mat-error *ngIf="bannerForm.get('gray_button_link')?.hasError('required')">
                    Gray button link is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="section">
            <div class="status-section">
              <mat-slide-toggle formControlName="is_active" color="primary">
                <span class="toggle-label">
                  <mat-icon>{{bannerForm.get('is_active')?.value ? 'visibility' : 'visibility_off'}}</mat-icon>
                  {{bannerForm.get('is_active')?.value ? 'Banner is Active' : 'Banner is Inactive'}}
                </span>
              </mat-slide-toggle>
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
          [disabled]="bannerForm.invalid || isSubmitting || (!selectedFile && !isEditMode)"
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

    .banner-form {
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
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .preview-image {
      width: 300px;
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
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
    }

    .upload-area:hover {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    }

    .upload-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
      margin-bottom: 16px;
    }

    .upload-text {
      margin: 0 0 8px 0;
      font-weight: 500;
      color: #333;
    }

    .upload-hint {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .title-field {
      flex: 3;
    }

    .color-field {
      flex: 1;
      min-width: 120px;
    }

    .highlight-text-field {
      flex: 2;
    }

    .full-width {
      width: 100%;
    }

    .buttons-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 16px;
    }

    .button-group {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid;
    }

    .green-group {
      border-color: rgba(67, 233, 123, 0.3);
      background: linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(56, 249, 215, 0.05) 100%);
    }

    .gray-group {
      border-color: rgba(117, 117, 117, 0.3);
      background: linear-gradient(135deg, rgba(117, 117, 117, 0.05) 0%, rgba(158, 158, 158, 0.05) 100%);
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

    .color-indicator.green {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .color-indicator.gray {
      background: #757575;
    }

    .points-container {
      margin-top: 16px;
    }

    .points-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .points-header h4 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .points-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .point-item {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .point-field {
      flex: 1;
    }

    .status-section {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

      .preview-image {
        width: 100%;
        height: 120px;
      }
    }
  `]
})
export class BannerDialogComponent implements OnInit {
  bannerForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<BannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Banner | null
  ) {
    this.isEditMode = !!data;
    this.bannerForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.populateForm();
    } else {
      // Add one point by default for new banners
      this.addPoint();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      banner_title: [this.data?.banner_title || '', [Validators.required]],
      banner_title_color: [this.data?.banner_title_color || '#FFFFFF'],
      banner_title_highlight_text: [this.data?.banner_title_highlight?.text || ''],
      banner_title_highlight_color: [this.data?.banner_title_highlight?.color || '#FFD700'],
      banner_subtitle_type: [this.data?.banner_subtitle_type || 'none', [Validators.required]],
      banner_subtitle_text: [''],
      banner_subtitle_points: this.fb.array([]),
      support_message: [this.data?.support_message || ''],
      green_button: [this.data?.green_button || '', [Validators.required]],
      green_button_link: [this.data?.green_button_link || '', [Validators.required]],
      gray_button: [this.data?.gray_button || '', [Validators.required]],
      gray_button_link: [this.data?.gray_button_link || '', [Validators.required]],
      is_active: [this.data?.is_active !== false]
    });
  }

  populateForm(): void {
    if (this.data) {
      // Set image preview for edit mode
      if (this.data.background_image) {
        this.imagePreview = `http://localhost:3000${this.data.background_image}`;
      }

      // Handle subtitle based on type
      if (this.data.banner_subtitle_type === 'text') {
        this.bannerForm.patchValue({
          banner_subtitle_text: this.data.banner_subtitle
        });
      } else if (this.data.banner_subtitle_type === 'points' && Array.isArray(this.data.banner_subtitle)) {
        this.data.banner_subtitle.forEach(point => {
          this.addPoint(point);
        });
      }
    }
  }

  get subtitlePoints(): FormArray {
    return this.bannerForm.get('banner_subtitle_points') as FormArray;
  }

  onSubtitleTypeChange(): void {
    const type = this.bannerForm.get('banner_subtitle_type')?.value;
    
    // Clear subtitle fields
    this.bannerForm.patchValue({ banner_subtitle_text: '' });
    this.subtitlePoints.clear();
    
    // Add default point if points type is selected
    if (type === 'points') {
      this.addPoint();
    }
  }

  addPoint(value: string = ''): void {
    this.subtitlePoints.push(this.fb.control(value, [Validators.required]));
  }

  removePoint(index: number): void {
    this.subtitlePoints.removeAt(index);
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
    if (this.bannerForm.valid && (this.selectedFile || this.isEditMode)) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const formValue = this.bannerForm.value;

      // Add image if selected
      if (this.selectedFile) {
        formData.append('background_image', this.selectedFile);
      }

      // Add form fields
      formData.append('banner_title', formValue.banner_title);
      formData.append('banner_title_color', formValue.banner_title_color);
      formData.append('banner_title_highlight_text', formValue.banner_title_highlight_text);
      formData.append('banner_title_highlight_color', formValue.banner_title_highlight_color);
      formData.append('banner_subtitle_type', formValue.banner_subtitle_type);
      
      // Handle subtitle based on type
      if (formValue.banner_subtitle_type === 'text') {
        formData.append('banner_subtitle', formValue.banner_subtitle_text);
      } else if (formValue.banner_subtitle_type === 'points') {
        formData.append('banner_subtitle', JSON.stringify(formValue.banner_subtitle_points.filter((point: string) => point.trim())));
      }
      
      formData.append('support_message', formValue.support_message);
      formData.append('green_button', formValue.green_button);
      formData.append('green_button_link', formValue.green_button_link);
      formData.append('gray_button', formValue.gray_button);
      formData.append('gray_button_link', formValue.gray_button_link);
      formData.append('is_active', formValue.is_active.toString());

      const request = this.isEditMode
        ? this.apiService.updateBanner(this.data!._id!, formData)
        : this.apiService.createBanner(formData);

      request.subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error saving banner:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}