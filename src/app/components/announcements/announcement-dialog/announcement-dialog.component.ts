// components/announcements/announcement-dialog/announcement-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, Announcement } from '../../../services/api.service';

@Component({
  selector: 'app-announcement-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{isEditMode ? 'edit' : 'add'}}</mat-icon>
        {{isEditMode ? 'Edit' : 'Add'}} Announcement
      </h2>

      <div mat-dialog-content class="dialog-content">
        <form [formGroup]="announcementForm" class="announcement-form">
          
          <!-- Announcement Title with Rich Text Editor -->
          <div class="form-field">
            <label class="field-label">
              Announcement Title <span class="required">*</span>
            </label>
            
            <!-- Rich Text Toolbar -->
            <div class="rich-text-toolbar">
              <div class="toolbar-group">
                <button type="button" mat-icon-button class="toolbar-btn" title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Italic">
                  <em>I</em>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Underline">
                  <u>U</u>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Strikethrough">
                  <s>S</s>
                </button>
              </div>
              
              <div class="toolbar-separator"></div>
              
              <div class="toolbar-group">
                <button type="button" mat-icon-button class="toolbar-btn" title="Quote">
                  <mat-icon>format_quote</mat-icon>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Code">
                  <mat-icon>code</mat-icon>
                </button>
              </div>
              
              <div class="toolbar-separator"></div>
              
              <div class="toolbar-group">
                <button type="button" mat-icon-button class="toolbar-btn" title="Heading 1">
                  H1
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Heading 2">
                  H2
                </button>
              </div>
              
              <div class="toolbar-separator"></div>
              
              <div class="toolbar-group">
                <button type="button" mat-icon-button class="toolbar-btn" title="Bullet List">
                  <mat-icon>format_list_bulleted</mat-icon>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Numbered List">
                  <mat-icon>format_list_numbered</mat-icon>
                </button>
              </div>
              
              <div class="toolbar-separator"></div>
              
              <div class="toolbar-group">
                <mat-select class="toolbar-select" placeholder="Normal" value="normal">
                  <mat-option value="normal">Normal</mat-option>
                  <mat-option value="h1">Heading 1</mat-option>
                  <mat-option value="h2">Heading 2</mat-option>
                </mat-select>
                
                <mat-select class="toolbar-select" placeholder="Sans Serif" value="sans-serif">
                  <mat-option value="sans-serif">Sans Serif</mat-option>
                  <mat-option value="serif">Serif</mat-option>
                  <mat-option value="monospace">Monospace</mat-option>
                </mat-select>
              </div>
              
              <div class="toolbar-separator"></div>
              
              <div class="toolbar-group">
                <button type="button" mat-icon-button class="toolbar-btn" title="Text Color">
                  <mat-icon>format_color_text</mat-icon>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Highlight">
                  <mat-icon>format_color_fill</mat-icon>
                </button>
                <button type="button" mat-icon-button class="toolbar-btn" title="Align">
                  <mat-icon>format_align_left</mat-icon>
                </button>
              </div>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <textarea 
                matInput 
                formControlName="title" 
                placeholder="Enter Text"
                rows="4"
                class="rich-text-area"></textarea>
              <mat-error *ngIf="announcementForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Add Picture in Announcement Title -->
          <div class="form-field">
            <label class="field-label">
              Add Picture in Announcement Title <span class="required">*</span>(Flag)
            </label>
            
            <div class="file-input-container">
              <input 
                type="file" 
                #flagFileInput 
                (change)="onFlagFileSelected($event)"
                accept="image/*"
                style="display: none;">
              
              <div class="file-input-wrapper" (click)="flagFileInput.click()">
                <button type="button" class="file-choose-btn">Choose File</button>
                <span class="file-status">{{selectedFlagFile ? selectedFlagFile.name : 'No file chosen'}}</span>
              </div>
            </div>
            
            <div *ngIf="selectedFlagFile || existingFlagUrl" class="file-preview">
              <div class="preview-info">
                <mat-icon>image</mat-icon>
                <span>{{selectedFlagFile?.name || 'Current image'}}</span>
                <button type="button" mat-icon-button (click)="removeFlagFile()" color="warn">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Dynamic Attachments -->
          <div formArrayName="attachments">
            <div *ngFor="let attachment of attachmentsFormArray.controls; let i = index" 
                 [formGroupName]="i" 
                 class="attachment-section">
              
              <!-- Attachment File Title -->
              <div class="form-field">
                <label class="field-label">
                  Attachment File Title <span class="required">*</span>
                </label>
                <mat-form-field appearance="outline" class="full-width">
                  <input matInput formControlName="file_title" placeholder="Enter Advertisement Title">
                  <mat-error *ngIf="attachment.get('file_title')?.hasError('required')">
                    Attachment title is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Attachment Icon Dropdown -->
              <div class="form-field">
                <label class="field-label">
                  Attachment Icon <span class="required">*</span>
                </label>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-select formControlName="icon" class="icon-select">
                    <mat-option value="advertisement">
                      <div class="icon-option">
                        <mat-icon class="option-icon">campaign</mat-icon>
                        <span>Advertisement</span>
                      </div>
                    </mat-option>
                    <mat-option value="announcement">
                      <div class="icon-option">
                        <mat-icon class="option-icon">notifications</mat-icon>
                        <span>Announcement</span>
                      </div>
                    </mat-option>
                    <mat-option value="pdf">
                      <div class="icon-option">
                        <mat-icon class="option-icon">picture_as_pdf</mat-icon>
                        <span>PDF</span>
                      </div>
                    </mat-option>
                    <mat-option value="clock">
                      <div class="icon-option">
                        <mat-icon class="option-icon">schedule</mat-icon>
                        <span>Clock</span>
                      </div>
                    </mat-option>
                    <mat-option value="video">
                      <div class="icon-option">
                        <mat-icon class="option-icon">videocam</mat-icon>
                        <span>Video</span>
                      </div>
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="attachment.get('icon')?.hasError('required')">
                    Icon is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Attachment Type -->
              <div class="form-field">
                <label class="field-label">
                  Attachment Type 1 <span class="required">*</span>
                </label>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-select formControlName="attachment_type" (selectionChange)="onAttachmentTypeChange(i, $event.value)">
                    <mat-option value="attachment_file">Attachment File</mat-option>
                    <mat-option value="link">Link</mat-option>
                  </mat-select>
                  <mat-error *ngIf="attachment.get('attachment_type')?.hasError('required')">
                    Type is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Conditional Content Based on Attachment Type -->
              
              <!-- File Upload for Attachment File -->
              <div class="form-field" *ngIf="attachment.get('attachment_type')?.value === 'attachment_file'">
                <label class="field-label">
                  Attachment File 1 <span class="required">*</span>
                </label>
                <input 
                  type="file" 
                  [id]="'attachment_' + i"
                  (change)="onAttachmentFileSelected($event, i)"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.mp4,.avi,.mov"
                  style="display: none;">
                
                <div class="file-input-wrapper" (click)="document.getElementById('attachment_' + i)?.click()">
                  <button type="button" class="file-choose-btn">Choose File</button>
                  <span class="file-status">
                    {{attachmentFiles[i] ? attachmentFiles[i]!.name : (attachment.get('original_name')?.value || 'No file chosen')}}
                  </span>
                </div>

                <!-- File Preview -->
                <div *ngIf="attachmentFiles[i] || attachment.get('file_url')?.value" class="file-preview">
                  <div class="preview-info">
                    <mat-icon>attach_file</mat-icon>
                    <span>{{attachmentFiles[i]?.name || attachment.get('original_name')?.value}}</span>
                    <button type="button" mat-icon-button (click)="removeAttachmentFile(i)" color="warn">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Link Input for Link Type -->
              <div class="form-field" *ngIf="attachment.get('attachment_type')?.value === 'link'">
                <label class="field-label">
                  Link <span class="required">*</span>
                </label>
                <mat-form-field appearance="outline" class="full-width">
                  <input matInput formControlName="link_url" placeholder="https://example.com">
                  <mat-icon matSuffix>link</mat-icon>
                  <mat-error *ngIf="attachment.get('link_url')?.hasError('required') && attachment.get('attachment_type')?.value === 'link'">
                    Link URL is required
                  </mat-error>
                  <mat-error *ngIf="attachment.get('link_url')?.hasError('pattern')">
                    Please enter a valid URL
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Remove Attachment Button -->
              <div class="remove-attachment" *ngIf="attachmentsFormArray.length > 1">
                <button type="button" mat-icon-button color="warn" (click)="removeAttachment(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Add Attachment Button -->
          <div class="add-attachment-section">
            <button type="button" mat-stroked-button color="primary" (click)="addAttachment()">
              <mat-icon>add</mat-icon>
              Add Another Attachment
            </button>
          </div>

          <!-- Category -->
          <div class="form-field">
            <label class="field-label">
              Category <span class="required">*</span>
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <mat-select formControlName="announcement_category">
                <mat-option value="general">General</mat-option>
                <mat-option value="urgent">Urgent</mat-option>
                <mat-option value="news">News</mat-option>
                <mat-option value="event">Event</mat-option>
                <mat-option value="update">Update</mat-option>
              </mat-select>
              <mat-error *ngIf="announcementForm.get('announcement_category')?.hasError('required')">
                Category is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Expiry Date -->
          <div class="form-field">
            <label class="field-label">
              Expiry Date <span class="required">*</span>
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput [matDatepicker]="picker" formControlName="deadline" placeholder="mm/dd/yyyy">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="announcementForm.get('deadline')?.hasError('required')">
                Expiry date is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Button Title (Orange Button) -->
          <div class="form-field">
            <label class="field-label">
              Button Title
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="orange_button_title" placeholder="Advertise Attachment">
              <mat-error *ngIf="announcementForm.get('orange_button_title')?.hasError('required')">
                Button title is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Button Url (Orange Button) -->
          <div class="form-field">
            <label class="field-label">
              Button Url
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="orange_button_link" placeholder="Advertise Attachment">
              <mat-error *ngIf="announcementForm.get('orange_button_link')?.hasError('required')">
                Button URL is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Blue Button Title (Optional) -->
          <div class="form-field">
            <label class="field-label">
              Blue Button Title <span class="optional">(Optional)</span>
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="blue_button_title" placeholder="Advertise Attachment">
            </mat-form-field>
          </div>

          <!-- Blue Button Url (Optional) -->
          <div class="form-field">
            <label class="field-label">
              Blue Button Url <span class="optional">(Optional)</span>
            </label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="blue_button_link" placeholder="Advertise Attachment">
            </mat-form-field>
          </div>

        </form>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          Cancel
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSave()"
          [disabled]="announcementForm.invalid || isSubmitting"
          class="submit-button">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <span *ngIf="!isSubmitting">Submit</span>
          <span *ngIf="isSubmitting">Submitting...</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-height: 90vh;
    }

    .dialog-title {
      background: linear-gradient(135deg, #036647 0%, #036647 100%);
      color: white;
      margin: 0;
      padding: 20px 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .dialog-content {
      padding: 24px 32px !important;
      max-height: 70vh;
      overflow-y: auto;
    }

    .announcement-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .required {
      color: #f44336;
      font-weight: bold;
    }

    .optional {
      color: #666;
      font-weight: normal;
      font-style: italic;
    }

    .full-width {
      width: 100%;
    }

    /* Rich Text Toolbar */
    .rich-text-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-bottom: none;
      background: #f9f9f9;
      border-radius: 4px 4px 0 0;
      flex-wrap: wrap;
    }

    .toolbar-group {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .toolbar-separator {
      width: 1px;
      height: 24px;
      background: #ddd;
      margin: 0 4px;
    }

    .toolbar-btn {
      width: 32px;
      height: 32px;
      min-width: 32px;
      font-size: 12px;
      font-weight: bold;
    }

    .toolbar-select {
      font-size: 12px;
      min-width: 80px;
    }

    .rich-text-area {
      border-radius: 0 0 4px 4px !important;
      font-family: inherit;
      resize: vertical;
      min-height: 80px;
    }

    /* File Input Styling */
    .file-input-container {
      width: 100%;
    }

    .file-input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
    }

    .file-choose-btn {
      background: #e0e0e0;
      border: none;
      padding: 12px 16px;
      font-size: 13px;
      cursor: pointer;
      border-right: 1px solid #ddd;
    }

    .file-choose-btn:hover {
      background: #d0d0d0;
    }

    .file-status {
      padding: 12px 16px;
      flex: 1;
      color: #666;
      font-size: 13px;
    }

    .file-preview {
      margin-top: 8px;
      padding: 12px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .preview-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .preview-info mat-icon {
      color: #4caf50;
    }

    .preview-info span {
      flex: 1;
      color: #2e7d32;
      font-size: 14px;
    }

    /* Attachment Sections */
    .attachment-section {
      position: relative;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
      margin: 16px 0;
    }

    .attachment-section:first-child {
      margin-top: 0;
    }

    .remove-attachment {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .add-attachment-section {
      text-align: center;
      margin: 20px 0;
    }

    /* Icon Select Options */
    .icon-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .option-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Dialog Actions */
    .dialog-actions {
      padding: 20px 32px 24px;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    .cancel-button {
      color: #666;
      min-width: 100px;
    }

    .submit-button {
      background: #1976d2;
      color: white;
      min-width: 140px;
    }

    .submit-button:disabled {
      background: #ccc !important;
      color: rgba(0, 0, 0, 0.38) !important;
    }

    /* Responsive Design */
    @media (max-width: 800px) {
      .dialog-container {
        min-width: 95vw;
        max-width: 95vw;
      }
      
      .dialog-title {
        padding: 16px 20px;
        font-size: 1.2rem;
      }
      
      .dialog-content {
        padding: 20px !important;
      }
      
      .dialog-actions {
        padding: 16px 20px 20px;
        flex-direction: column;
      }

      .submit-button, .cancel-button {
        width: 100%;
      }

      .rich-text-toolbar {
        flex-wrap: wrap;
        gap: 2px;
      }

      .toolbar-separator {
        display: none;
      }
    }
  `]
})
export class AnnouncementDialogComponent implements OnInit {
  announcementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  selectedFlagFile: File | null = null;
  existingFlagUrl: string | null = null;
  attachmentFiles: (File | null)[] = [];
  document = document;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement | null
  ) {
    this.isEditMode = !!data;
    this.existingFlagUrl = data?.flag || null;
    
    this.announcementForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      deadline: [data?.deadline ? new Date(data.deadline) : ''],
      announcement_category: [data?.announcement_category || '', [Validators.required]],
      orange_button_title: [data?.orange_button_title || '', [Validators.required]],
      orange_button_link: [data?.orange_button_link || '', [Validators.required]],
      blue_button_title: [data?.blue_button_title || ''],
      blue_button_link: [data?.blue_button_link || ''],
      attachments: this.fb.array([])
    });

    // Add at least one attachment by default
    this.addAttachment();

    // Initialize existing attachments
    if (data?.attachments && data.attachments.length > 0) {
      // Clear the default attachment
      this.attachmentsFormArray.clear();
      this.attachmentFiles = [];
      
      data.attachments.forEach(attachment => {
        this.addAttachmentFromData(attachment);
      });
    }
  }

  ngOnInit(): void {}

  get attachmentsFormArray(): FormArray {
    return this.announcementForm.get('attachments') as FormArray;
  }

  addAttachment(): void {
    const attachmentGroup = this.fb.group({
      file_title: ['', Validators.required],
      icon: ['advertisement', Validators.required],
      attachment_type: ['attachment_file', Validators.required],
      link_url: [''], // For link type
      existing_id: [''],
      file_url: [''],
      original_name: ['']
    });

    this.attachmentsFormArray.push(attachmentGroup);
    this.attachmentFiles.push(null);
  }

  addAttachmentFromData(attachment: any): void {
    const attachmentGroup = this.fb.group({
      file_title: [attachment.file_title, Validators.required],
      icon: [attachment.icon, Validators.required],
      attachment_type: [attachment.attachment_type || 'attachment_file', Validators.required],
      link_url: [attachment.link_url || ''], // For existing link attachments
      existing_id: [attachment._id],
      file_url: [attachment.file_url],
      original_name: [attachment.original_name]
    });

    this.attachmentsFormArray.push(attachmentGroup);
    this.attachmentFiles.push(null);
  }

  onAttachmentTypeChange(index: number, newType: string): void {
    const attachmentControl = this.attachmentsFormArray.at(index);
    
    if (newType === 'link') {
      // When switching to link, add URL validation and clear file
      attachmentControl.get('link_url')?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
      attachmentControl.get('link_url')?.updateValueAndValidity();
      
      // Clear file data
      this.attachmentFiles[index] = null;
      attachmentControl.get('file_url')?.setValue('');
      attachmentControl.get('original_name')?.setValue('');
    } else {
      // When switching to attachment_file, remove URL validation and clear URL
      attachmentControl.get('link_url')?.clearValidators();
      attachmentControl.get('link_url')?.setValue('');
      attachmentControl.get('link_url')?.updateValueAndValidity();
    }
  }

  removeAttachmentFile(index: number): void {
    this.attachmentFiles[index] = null;
    const attachmentControl = this.attachmentsFormArray.at(index);
    attachmentControl.get('file_url')?.setValue('');
    attachmentControl.get('original_name')?.setValue('');
  }

  removeAttachment(index: number): void {
    this.attachmentsFormArray.removeAt(index);
    this.attachmentFiles.splice(index, 1);
  }

  onFlagFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFlagFile = file;
      this.existingFlagUrl = null;
    }
  }

  removeFlagFile(): void {
    this.selectedFlagFile = null;
    this.existingFlagUrl = null;
  }

  onAttachmentFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.attachmentFiles[index] = file;
    }
  }

  onSave(): void {
    if (this.announcementForm.valid) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const formValue = this.announcementForm.value;

      // Add basic fields
      formData.append('title', formValue.title);
      const deadline = formValue.deadline;
      const deadlineString = deadline instanceof Date && !isNaN(deadline.getTime()) 
        ? deadline.toISOString() 
        : '';
      formData.append('deadline', deadlineString);
      formData.append('announcement_category', formValue.announcement_category);
      formData.append('orange_button_title', formValue.orange_button_title);
      formData.append('orange_button_link', formValue.orange_button_link);
      
      if (formValue.blue_button_title) {
        formData.append('blue_button_title', formValue.blue_button_title);
      }
      if (formValue.blue_button_link) {
        formData.append('blue_button_link', formValue.blue_button_link);
      }

      // Add flag image if selected
      if (this.selectedFlagFile) {
        formData.append('flag', this.selectedFlagFile);
      }

      // Process attachments
      const attachmentData: any[] = [];
      let fileIndex = 0; // Keep track of file uploads for FormData ordering
      
      formValue.attachments.forEach((attachment: any, index: number) => {
        if (attachment.attachment_type === 'attachment_file') {
          // Handle file attachments
          if (this.attachmentFiles[index]) {
            formData.append('attachments', this.attachmentFiles[index]!);
            attachmentData.push({
              file_title: attachment.file_title,
              icon: attachment.icon,
              attachment_type: 'attachment_file',
              file_index: fileIndex // Track which file this metadata corresponds to
            });
            fileIndex++;
          } else if (attachment.existing_id) {
            // Handle existing file attachments in edit mode
            attachmentData.push({
              file_title: attachment.file_title,
              icon: attachment.icon,
              attachment_type: 'attachment_file',
              existing_id: attachment.existing_id,
              keep_existing: true
            });
          }
        } else if (attachment.attachment_type === 'link') {
          // Handle link attachments
          if (attachment.link_url) {
            attachmentData.push({
              file_title: attachment.file_title,
              icon: attachment.icon,
              attachment_type: 'link',
              link_url: attachment.link_url
            });
          }
        }
      });

      // Always send attachment metadata, even if empty
      formData.append('attachment_data', JSON.stringify(attachmentData));

      console.log('Submitting attachments:', attachmentData);
      console.log('File attachments count:', fileIndex);

      const request = this.isEditMode
        ? this.apiService.updateAnnouncementWithFiles(this.data!._id!, formData)
        : this.apiService.createAnnouncementWithFiles(formData);

      request.subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(response.data);
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