// components/services/service-dialog/service-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, Services, Service } from '../../../services/api.service';

interface DialogData {
  type: 'section' | 'service';
  servicesData?: Services | null;
  service?: Service | null;
  index?: number;
}

@Component({
  selector: 'app-service-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="dialog-icon">{{getDialogIcon()}}</mat-icon>
        {{getDialogTitle()}}
      </h2>

      <div mat-dialog-content class="dialog-content">
        
        <!-- Section Edit Form -->
        <form [formGroup]="sectionForm" class="section-form" *ngIf="dialogType === 'section'">
          <div class="section">
            <h3 class="section-title">
              <mat-icon>title</mat-icon>
              Section Header
            </h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Section Title</mat-label>
                <input matInput formControlName="section_title" placeholder="e.g., Our Services">
                <mat-icon matSuffix>title</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Section Subtitle</mat-label>
                <textarea matInput formControlName="section_subtitle" rows="2" placeholder="Brief description of your services"></textarea>
                <mat-icon matSuffix>subtitles</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">
              <mat-icon>list</mat-icon>
              Services Management
            </h3>
            
            <div class="services-list" formArrayName="services">
              <div 
                *ngFor="let service of servicesFormArray.controls; let i = index" 
                [formGroupName]="i"
                class="service-item">
                
                <div class="service-item-header">
                  <span class="service-item-number">#{{i + 1}}</span>
                  <button 
                    mat-icon-button 
                    type="button" 
                    color="warn"
                    (click)="removeService(i)"
                    [disabled]="servicesFormArray.length <= 1"
                    matTooltip="Remove Service">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>

                <div class="service-form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Service Title</mat-label>
                    <input matInput formControlName="title" placeholder="e.g., Job Placement">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Icon</mat-label>
                    <mat-select formControlName="icon">
                      <mat-option value="work">Work</mat-option>
                      <mat-option value="business">Business</mat-option>
                      <mat-option value="support">Support</mat-option>
                      <mat-option value="school">Education</mat-option>
                      <mat-option value="language">Language</mat-option>
                      <mat-option value="flight">Travel</mat-option>
                      <mat-option value="security">Security</mat-option>
                      <mat-option value="medical_services">Medical</mat-option>
                      <mat-option value="home">Housing</mat-option>
                      <mat-option value="account_balance">Finance</mat-option>
                      <mat-option value="description">Documentation</mat-option>
                      <mat-option value="groups">Groups</mat-option>
                    </mat-select>
                    <mat-icon matSuffix>{{service.get('icon')?.value || 'help'}}</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Display Order</mat-label>
                    <input matInput type="number" formControlName="order" min="1">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Service Description</mat-label>
                  <textarea matInput formControlName="description" rows="3" placeholder="Describe what this service offers"></textarea>
                </mat-form-field>
              </div>
            </div>

            <button 
              mat-stroked-button 
              type="button" 
              color="primary"
              (click)="addService()"
              class="add-service-btn">
              <mat-icon>add</mat-icon>
              Add Another Service
            </button>
          </div>
        </form>

        <!-- Single Service Form -->
        <form [formGroup]="serviceForm" class="service-form" *ngIf="dialogType === 'service'">
          <div class="section">
            <h3 class="section-title">
              <mat-icon>miscellaneous_services</mat-icon>
              Service Details
            </h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="service-title-field">
                <mat-label>Service Title</mat-label>
                <input matInput formControlName="title" placeholder="e.g., Job Placement Services">
                <mat-icon matSuffix>title</mat-icon>
                <mat-error *ngIf="serviceForm.get('title')?.hasError('required')">
                  Service title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="icon-field">
                <mat-label>Icon</mat-label>
                <mat-select formControlName="icon">
                  <mat-option value="work">
                    <mat-icon>work</mat-icon> Work
                  </mat-option>
                  <mat-option value="business">
                    <mat-icon>business</mat-icon> Business
                  </mat-option>
                  <mat-option value="support">
                    <mat-icon>support</mat-icon> Support
                  </mat-option>
                  <mat-option value="school">
                    <mat-icon>school</mat-icon> Education
                  </mat-option>
                  <mat-option value="language">
                    <mat-icon>language</mat-icon> Language
                  </mat-option>
                  <mat-option value="flight">
                    <mat-icon>flight</mat-icon> Travel
                  </mat-option>
                  <mat-option value="security">
                    <mat-icon>security</mat-icon> Security
                  </mat-option>
                  <mat-option value="medical_services">
                    <mat-icon>medical_services</mat-icon> Medical
                  </mat-option>
                  <mat-option value="home">
                    <mat-icon>home</mat-icon> Housing
                  </mat-option>
                  <mat-option value="account_balance">
                    <mat-icon>account_balance</mat-icon> Finance
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>{{serviceForm.get('icon')?.value || 'help'}}</mat-icon>
                <mat-error *ngIf="serviceForm.get('icon')?.hasError('required')">
                  Icon is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Service Description</mat-label>
                <textarea 
                  matInput 
                  formControlName="description" 
                  rows="4" 
                  placeholder="Describe what this service offers and its benefits"></textarea>
                <mat-icon matSuffix>description</mat-icon>
                <mat-error *ngIf="serviceForm.get('description')?.hasError('required')">
                  Service description is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="order-field">
                <mat-label>Display Order</mat-label>
                <input matInput type="number" formControlName="order" min="1" placeholder="1">
                <mat-icon matSuffix>sort</mat-icon>
                <mat-hint>Lower numbers appear first</mat-hint>
              </mat-form-field>
            </div>

            <div class="preview-section" *ngIf="serviceForm.get('title')?.value || serviceForm.get('description')?.value">
              <h4 class="preview-title">
                <mat-icon>preview</mat-icon>
                Live Preview
              </h4>
              <div class="service-preview">
                <div class="preview-icon-container">
                  <mat-icon class="preview-icon">{{serviceForm.get('icon')?.value || 'help'}}</mat-icon>
                </div>
                <div class="preview-content">
                  <h5 class="preview-service-title">{{serviceForm.get('title')?.value || 'Service Title'}}</h5>
                  <p class="preview-service-description">{{serviceForm.get('description')?.value || 'Service description will appear here...'}}</p>
                </div>
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
          [disabled]="getCurrentForm().invalid || isSubmitting"
          class="save-button">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <mat-icon *ngIf="!isSubmitting">{{getSaveIcon()}}</mat-icon>
          {{getSaveText()}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }

    .dialog-title {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

    .section-form, .service-form {
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

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .service-title-field {
      flex: 2;
    }

    .icon-field {
      flex: 1;
      min-width: 150px;
    }

    .order-field {
      flex: 1;
      min-width: 120px;
    }

    .services-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 20px;
    }

    .service-item {
      background: rgba(67, 233, 123, 0.02);
      border: 1px solid rgba(67, 233, 123, 0.2);
      border-radius: 12px;
      padding: 20px;
    }

    .service-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .service-item-number {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .service-form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .add-service-btn {
      border: 1px solid #43e97b;
      color: #43e97b;
      width: 100%;
      border-radius: 8px;
    }

    .add-service-btn:hover {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .preview-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(67, 233, 123, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(67, 233, 123, 0.2);
    }

    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
    }

    .service-preview {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 16px;
    }

    .preview-icon-container {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 48px;
    }

    .preview-icon {
      color: white;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .preview-content {
      flex: 1;
    }

    .preview-service-title {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    .preview-service-description {
      margin: 0;
      color: #666;
      line-height: 1.5;
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
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

      .service-form-grid {
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
export class ServiceDialogComponent implements OnInit {
  sectionForm: FormGroup;
  serviceForm: FormGroup;
  dialogType: 'section' | 'service';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogType = data.type;
    this.sectionForm = this.createSectionForm();
    this.serviceForm = this.createServiceForm();
  }

  ngOnInit(): void {
    if (this.dialogType === 'section' && this.data.servicesData) {
      this.populateSectionForm();
    } else if (this.dialogType === 'service' && this.data.service) {
      this.populateServiceForm();
    }
  }

  createSectionForm(): FormGroup {
    return this.fb.group({
      section_title: [this.data.servicesData?.section_title || 'Our Services'],
      section_subtitle: [this.data.servicesData?.section_subtitle || 'Comprehensive employment solutions'],
      services: this.fb.array([])
    });
  }

  createServiceForm(): FormGroup {
    return this.fb.group({
      title: [this.data.service?.title || '', [Validators.required]],
      description: [this.data.service?.description || '', [Validators.required]],
      icon: [this.data.service?.icon || 'work', [Validators.required]],
      order: [this.data.service?.order || 1, [Validators.min(1)]]
    });
  }

  populateSectionForm(): void {
    if (this.data.servicesData?.services) {
      this.data.servicesData.services.forEach(service => {
        this.addServiceToArray(service);
      });
    } else {
      // Add one empty service by default
      this.addServiceToArray();
    }
  }

  populateServiceForm(): void {
    // Form is already populated in createServiceForm
  }

  get servicesFormArray(): FormArray {
    return this.sectionForm.get('services') as FormArray;
  }

  addService(): void {
    this.addServiceToArray();
  }

  addServiceToArray(service?: Service): void {
    const serviceGroup = this.fb.group({
      title: [service?.title || '', [Validators.required]],
      description: [service?.description || '', [Validators.required]],
      icon: [service?.icon || 'work', [Validators.required]],
      order: [service?.order || this.servicesFormArray.length + 1, [Validators.min(1)]]
    });
    
    this.servicesFormArray.push(serviceGroup);
  }

  removeService(index: number): void {
    if (this.servicesFormArray.length > 1) {
      this.servicesFormArray.removeAt(index);
    }
  }

  getCurrentForm(): FormGroup {
    return this.dialogType === 'section' ? this.sectionForm : this.serviceForm;
  }

  getDialogTitle(): string {
    if (this.dialogType === 'section') {
      return 'Edit Services Section';
    }
    return this.data.service ? 'Edit Service' : 'Add New Service';
  }

  getDialogIcon(): string {
    if (this.dialogType === 'section') {
      return 'edit';
    }
    return this.data.service ? 'edit' : 'add';
  }

  getSaveText(): string {
    if (this.isSubmitting) {
      return 'Saving...';
    }
    
    if (this.dialogType === 'section') {
      return 'Update Section';
    }
    return this.data.service ? 'Update Service' : 'Add Service';
  }

  getSaveIcon(): string {
    if (this.dialogType === 'section') {
      return 'save';
    }
    return this.data.service ? 'save' : 'add';
  }

  onSave(): void {
    const currentForm = this.getCurrentForm();
    
    if (currentForm.valid) {
      this.isSubmitting = true;

      if (this.dialogType === 'section') {
        this.saveSectionData();
      } else {
        this.saveServiceData();
      }
    }
  }

  saveSectionData(): void {
    const formValue = this.sectionForm.value;
    const updateData: Services = {
      ...this.data.servicesData!,
      section_title: formValue.section_title,
      section_subtitle: formValue.section_subtitle,
      services: formValue.services
    };

    this.apiService.updateServices(this.data.servicesData!._id!, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(true);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating services:', error);
        this.isSubmitting = false;
      }
    });
  }

  saveServiceData(): void {
    if (!this.data.servicesData) return;

    const formValue = this.serviceForm.value;
    const services = [...this.data.servicesData.services];
    
    if (this.data.index !== undefined) {
      // Update existing service
      services[this.data.index] = formValue;
    } else {
      // Add new service
      services.push(formValue);
    }

    const updateData: Services = {
      ...this.data.servicesData,
      services: services
    };

    this.apiService.updateServices(this.data.servicesData._id!, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close(true);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error saving service:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}