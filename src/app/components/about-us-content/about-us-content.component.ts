import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, AboutUsContent } from '../../services/api.service';

@Component({
  selector: 'app-about-us-content',
  templateUrl: './about-us-content.component.html',
  styleUrls: ['./about-us-content.component.css']
})
export class AboutUsContentComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: AboutUsContent | null = null;
  isEditMode = false;

  // Icon options for Target Sectors
  iconOptions = [
    { value: '🏥', label: '🏥 Healthcare' },
    { value: '🏗️', label: '🏗️ Construction' },
    { value: '🧑‍🏭', label: '🧑‍🏭 Manufacturing' },
    { value: '🧑‍💼', label: '🧑‍💼 Business/Office' },
    { value: '🇰🇷', label: '🇰🇷 Korea' },
    { value: '🇯🇵', label: '🇯🇵 Japan' },
    { value: '🇸🇦', label: '🇸🇦 Saudi Arabia' },
    { value: '🇦🇪', label: '🇦🇪 UAE' },
    { value: '🇶🇦', label: '🇶🇦 Qatar' },
    { value: '🇴🇲', label: '🇴🇲 Oman' },
    { value: '🇰🇼', label: '🇰🇼 Kuwait' },
    { value: '🇧🇭', label: '🇧🇭 Bahrain' },
    { value: '🇮🇹', label: '🇮🇹 Italy' },
    { value: '🇬🇧', label: '🇬🇧 UK' },
    { value: '🇩🇪', label: '🇩🇪 Germany' },
    { value: '🔧', label: '🔧 Technical' },
    { value: '⚙️', label: '⚙️ Engineering' },
    { value: '💻', label: '💻 IT/Technology' },
    { value: '🍳', label: '🍳 Hospitality' },
    { value: '🚗', label: '🚗 Transportation' },
    { value: '✈️', label: '✈️ Aviation' },
    { value: '🌾', label: '🌾 Agriculture' },
    { value: '🏫', label: '🏫 Education' },
    { value: '🔬', label: '🔬 Research' },
    { value: '⚡', label: '⚡ Electrical' },
    { value: '🛠️', label: '🛠️ Mechanical' },
    { value: '📊', label: '📊 Administrative' },
    { value: '🎓', label: '🎓 Training' },
    { value: '🌍', label: '🌍 Global' }
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['ABOUT US', [Validators.required]],
      organization_name: ['Overseas Employment Corporation (OEC)', [Validators.required]],
      established_year: ['1976', [Validators.required]],
      ministry_name: ['Ministry of Overseas Pakistanis & Human Resource Development', [Validators.required]],

      introduction_title: ['Introduction', [Validators.required]],
      introduction_content: ['', [Validators.required]],

      legal_mandate_title: ['Our Legal Mandate', [Validators.required]],
      legal_mandate_items: this.fb.array([]),

      our_role_title: ['Our Role', [Validators.required]],
      our_role_items: this.fb.array([]),

      target_sectors_title: ['Our Target Sectors', [Validators.required]],
      target_sectors_items: this.fb.array([]),

      unique_strength_title: ['Our Unique Strength', [Validators.required]],
      unique_strength_items: this.fb.array([]),

      vision_title: ['Our Vision', [Validators.required]],
      vision_content: ['', [Validators.required]],

      mission_title: ['Our Mission', [Validators.required]],
      mission_content: ['', [Validators.required]],

      core_values_title: ['Our Core Values', [Validators.required]],
      core_values_items: this.fb.array([]),

      impact_title: ['Our Impact', [Validators.required]],
      impact_items: this.fb.array([]),

      future_goals_title: ['Our Future Goals', [Validators.required]],
      future_goals_items: this.fb.array([]),

      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  // Getter methods for FormArrays
  get legal_mandate_items(): FormArray {
    return this.contentForm.get('legal_mandate_items') as FormArray;
  }

  get our_role_items(): FormArray {
    return this.contentForm.get('our_role_items') as FormArray;
  }

  get target_sectors_items(): FormArray {
    return this.contentForm.get('target_sectors_items') as FormArray;
  }

  get unique_strength_items(): FormArray {
    return this.contentForm.get('unique_strength_items') as FormArray;
  }

  get core_values_items(): FormArray {
    return this.contentForm.get('core_values_items') as FormArray;
  }

  get impact_items(): FormArray {
    return this.contentForm.get('impact_items') as FormArray;
  }

  get future_goals_items(): FormArray {
    return this.contentForm.get('future_goals_items') as FormArray;
  }

  loadContent(): void {
    this.isLoading = true;
    this.apiService.getAboutUsContent().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentContent = response.data;
          this.isEditMode = true;
          this.populateForm(response.data);
        } else {
          // No content exists, prepare for creation
          this.isEditMode = false;
          this.initializeDefaultArrays();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading content:', error);
        this.showSnackBar('Error loading content', 'error');
        this.isLoading = false;
        this.initializeDefaultArrays();
      }
    });
  }

  populateForm(content: AboutUsContent): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      organization_name: content.organization_name,
      established_year: content.established_year,
      ministry_name: content.ministry_name,
      introduction_title: content.introduction_title,
      introduction_content: content.introduction_content,
      legal_mandate_title: content.legal_mandate_title,
      our_role_title: content.our_role_title,
      target_sectors_title: content.target_sectors_title,
      unique_strength_title: content.unique_strength_title,
      vision_title: content.vision_title,
      vision_content: content.vision_content,
      mission_title: content.mission_title,
      mission_content: content.mission_content,
      core_values_title: content.core_values_title,
      impact_title: content.impact_title,
      future_goals_title: content.future_goals_title,
      is_active: content.is_active
    });

    // Populate arrays
    this.populateArray(this.legal_mandate_items, content.legal_mandate_items, false);
    this.populateArray(this.our_role_items, content.our_role_items, false);
    this.populateArray(this.target_sectors_items, content.target_sectors_items, true);
    this.populateArray(this.unique_strength_items, content.unique_strength_items, false);
    this.populateArray(this.core_values_items, content.core_values_items, false);
    this.populateArray(this.impact_items, content.impact_items, false);
    this.populateArray(this.future_goals_items, content.future_goals_items, false);
  }

  populateArray(formArray: FormArray, items: any[], hasIcon: boolean): void {
    formArray.clear();
    items.forEach(item => {
      if (hasIcon) {
        formArray.push(this.fb.group({
          icon: [item.icon || '', [Validators.required]],
          text: [item.text || '', [Validators.required]]
        }));
      } else {
        formArray.push(this.fb.group({
          text: [item.text || '', [Validators.required]]
        }));
      }
    });
  }

  initializeDefaultArrays(): void {
    // Add at least one item to each array for easier initial setup
    this.addItem(this.legal_mandate_items, false);
    this.addItem(this.our_role_items, false);
    this.addItem(this.target_sectors_items, true);
    this.addItem(this.unique_strength_items, false);
    this.addItem(this.core_values_items, false);
    this.addItem(this.impact_items, false);
    this.addItem(this.future_goals_items, false);
  }

  addItem(formArray: FormArray, hasIcon: boolean): void {
    if (hasIcon) {
      formArray.push(this.fb.group({
        icon: ['', [Validators.required]],
        text: ['', [Validators.required]]
      }));
    } else {
      formArray.push(this.fb.group({
        text: ['', [Validators.required]]
      }));
    }
  }

  removeItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  saveContent(): void {
    if (this.contentForm.valid) {
      this.isSaving = true;
      const formValue = this.contentForm.value;

      if (this.isEditMode && this.currentContent) {
        // Update existing content
        this.apiService.updateAboutUsContent(this.currentContent._id!, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.showSnackBar('Content updated successfully');
              this.loadContent();
            }
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error updating content:', error);
            this.showSnackBar('Error updating content', 'error');
            this.isSaving = false;
          }
        });
      } else {
        // Create new content
        this.apiService.createAboutUsContent(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.showSnackBar('Content created successfully');
              this.loadContent();
            }
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error creating content:', error);
            this.showSnackBar('Error creating content', 'error');
            this.isSaving = false;
          }
        });
      }
    } else {
      this.showSnackBar('Please fill all required fields', 'error');
    }
  }

  refreshData(): void {
    this.loadContent();
    this.showSnackBar('Data refreshed successfully');
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}
