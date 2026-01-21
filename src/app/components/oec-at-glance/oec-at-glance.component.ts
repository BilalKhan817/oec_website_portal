import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, OecAtGlance } from '../../services/api.service';

@Component({
  selector: 'app-oec-at-glance',
  templateUrl: './oec-at-glance.component.html',
  styleUrls: ['./oec-at-glance.component.css']
})
export class OecAtGlanceComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: OecAtGlance | null = null;
  isEditMode = false;

  // Icon options
  iconOptions = [
    { value: '📅', label: '📅 Calendar' },
    { value: '📜', label: '📜 Scroll' },
    { value: '🏢', label: '🏢 Building' },
    { value: '👷', label: '👷 Worker' },
    { value: '🗂️', label: '🗂️ Files' },
    { value: '🌍', label: '🌍 Globe' },
    { value: '🤝', label: '🤝 Handshake' },
    { value: '🗣️', label: '🗣️ Speaking' },
    { value: '💻', label: '💻 Computer' },
    { value: '🛠️', label: '🛠️ Tools' },
    { value: '🏛️', label: '🏛️ Government' },
    { value: '📢', label: '📢 Megaphone' },
    { value: '📝', label: '📝 Memo' },
    { value: '📄', label: '📄 Document' },
    { value: '✈️', label: '✈️ Airplane' },
    { value: '📊', label: '📊 Chart' },
    { value: '🎓', label: '🎓 Graduate' },
    { value: '⚙️', label: '⚙️ Gear' }
  ];

  // Country flag options
  flagOptions = [
    { value: '🇸🇦', label: '🇸🇦 Saudi Arabia' },
    { value: '🇰🇷', label: '🇰🇷 South Korea' },
    { value: '🇮🇹', label: '🇮🇹 Italy' },
    { value: '🇯🇵', label: '🇯🇵 Japan' },
    { value: '🇶🇦', label: '🇶🇦 Qatar' },
    { value: '🇦🇪', label: '🇦🇪 UAE' },
    { value: '🇰🇼', label: '🇰🇼 Kuwait' },
    { value: '🇴🇲', label: '🇴🇲 Oman' },
    { value: '🇧🇭', label: '🇧🇭 Bahrain' },
    { value: '🇬🇧', label: '🇬🇧 UK' },
    { value: '🇩🇪', label: '🇩🇪 Germany' },
    { value: '🇫🇷', label: '🇫🇷 France' },
    { value: '🇪🇸', label: '🇪🇸 Spain' },
    { value: '🇨🇦', label: '🇨🇦 Canada' },
    { value: '🇦🇺', label: '🇦🇺 Australia' },
    { value: '', label: 'No Flag' }
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['OEC at Glance', [Validators.required]],
      page_subtitle: ['A visual and statistical snapshot of OEC\'s national impact and international reach.', [Validators.required]],

      establishment_icon: ['📅', [Validators.required]],
      establishment_label: ['Year of Establishment', [Validators.required]],
      establishment_year: ['1976', [Validators.required]],
      establishment_note: ['Under the Ministry of Overseas Pakistanis & Human Resource Development', [Validators.required]],

      legal_icon: ['📜', [Validators.required]],
      legal_label: ['Legal Foundation', [Validators.required]],
      legal_items: this.fb.array([]),

      headquarters_icon: ['🏢', [Validators.required]],
      headquarters_label: ['Headquarters', [Validators.required]],
      headquarters_items: this.fb.array([]),

      workforce_icon: ['👷', [Validators.required]],
      workforce_label: ['Workforce Deployed', [Validators.required]],
      workforce_value: ['150,000+ Pakistani workers successfully deployed to:', [Validators.required]],
      workforce_countries: this.fb.array([]),

      job_seekers_icon: ['🗂️', [Validators.required]],
      job_seekers_label: ['Registered Job Seekers', [Validators.required]],
      job_seekers_value: ['400,000+ active applicants across Pakistan', [Validators.required]],
      job_seekers_note: ['Regularly verified and matched to live demands'],

      employers_icon: ['🌍', [Validators.required]],
      employers_label: ['International Employers Served', [Validators.required]],
      employers_value: ['4,500+ reputable employers & organizations', [Validators.required]],

      programs_icon: ['🤝', [Validators.required]],
      programs_label: ['Key Programs & Agreements', [Validators.required]],
      programs_items: this.fb.array([]),

      training_icon: ['🗣️', [Validators.required]],
      training_label: ['Language Training & Development', [Validators.required]],
      training_items: this.fb.array([]),

      tech_icon: ['💻', [Validators.required]],
      tech_label: ['Technological Milestones', [Validators.required]],
      tech_items: this.fb.array([]),

      functions_icon: ['🛠️', [Validators.required]],
      functions_label: ['Core Functions in One Glance', [Validators.required]],
      functions_steps: this.fb.array([]),

      org_structure_icon: ['🏛️', [Validators.required]],
      org_structure_label: ['Organizational Structure', [Validators.required]],
      org_structure_items: this.fb.array([]),

      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  // Getter methods for FormArrays
  get legal_items(): FormArray {
    return this.contentForm.get('legal_items') as FormArray;
  }

  get headquarters_items(): FormArray {
    return this.contentForm.get('headquarters_items') as FormArray;
  }

  get workforce_countries(): FormArray {
    return this.contentForm.get('workforce_countries') as FormArray;
  }

  get programs_items(): FormArray {
    return this.contentForm.get('programs_items') as FormArray;
  }

  get training_items(): FormArray {
    return this.contentForm.get('training_items') as FormArray;
  }

  get tech_items(): FormArray {
    return this.contentForm.get('tech_items') as FormArray;
  }

  get functions_steps(): FormArray {
    return this.contentForm.get('functions_steps') as FormArray;
  }

  get org_structure_items(): FormArray {
    return this.contentForm.get('org_structure_items') as FormArray;
  }

  loadContent(): void {
    this.isLoading = true;
    this.apiService.getOecAtGlance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentContent = response.data;
          this.isEditMode = true;
          this.populateForm(response.data);
        } else {
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

  populateForm(content: OecAtGlance): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      page_subtitle: content.page_subtitle,
      establishment_icon: content.establishment_icon,
      establishment_label: content.establishment_label,
      establishment_year: content.establishment_year,
      establishment_note: content.establishment_note,
      legal_icon: content.legal_icon,
      legal_label: content.legal_label,
      headquarters_icon: content.headquarters_icon,
      headquarters_label: content.headquarters_label,
      workforce_icon: content.workforce_icon,
      workforce_label: content.workforce_label,
      workforce_value: content.workforce_value,
      job_seekers_icon: content.job_seekers_icon,
      job_seekers_label: content.job_seekers_label,
      job_seekers_value: content.job_seekers_value,
      job_seekers_note: content.job_seekers_note,
      employers_icon: content.employers_icon,
      employers_label: content.employers_label,
      employers_value: content.employers_value,
      programs_icon: content.programs_icon,
      programs_label: content.programs_label,
      training_icon: content.training_icon,
      training_label: content.training_label,
      tech_icon: content.tech_icon,
      tech_label: content.tech_label,
      functions_icon: content.functions_icon,
      functions_label: content.functions_label,
      org_structure_icon: content.org_structure_icon,
      org_structure_label: content.org_structure_label,
      is_active: content.is_active
    });

    // Populate arrays
    this.populateTextArray(this.legal_items, content.legal_items);
    this.populateTextArray(this.headquarters_items, content.headquarters_items);
    this.populateCountryArray(this.workforce_countries, content.workforce_countries);
    this.populateTextArray(this.programs_items, content.programs_items);
    this.populateTextArray(this.training_items, content.training_items);
    this.populateTextArray(this.tech_items, content.tech_items);
    this.populateFunctionSteps(this.functions_steps, content.functions_steps);
    this.populateTextArray(this.org_structure_items, content.org_structure_items);
  }

  populateTextArray(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      formArray.push(this.fb.group({
        text: [item.text || '', [Validators.required]]
      }));
    });
  }

  populateCountryArray(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      formArray.push(this.fb.group({
        country: [item.country || '', [Validators.required]],
        flag: [item.flag || '']
      }));
    });
  }

  populateFunctionSteps(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      formArray.push(this.fb.group({
        icon: [item.icon || '', [Validators.required]],
        label: [item.label || '', [Validators.required]],
        description: [item.description || '', [Validators.required]]
      }));
    });
  }

  initializeDefaultArrays(): void {
    this.addTextItem(this.legal_items);
    this.addTextItem(this.headquarters_items);
    this.addCountryItem(this.workforce_countries);
    this.addTextItem(this.programs_items);
    this.addTextItem(this.training_items);
    this.addTextItem(this.tech_items);
    this.addFunctionStep(this.functions_steps);
    this.addTextItem(this.org_structure_items);
  }

  addTextItem(formArray: FormArray): void {
    formArray.push(this.fb.group({
      text: ['', [Validators.required]]
    }));
  }

  addCountryItem(formArray: FormArray): void {
    formArray.push(this.fb.group({
      country: ['', [Validators.required]],
      flag: ['']
    }));
  }

  addFunctionStep(formArray: FormArray): void {
    formArray.push(this.fb.group({
      icon: ['', [Validators.required]],
      label: ['', [Validators.required]],
      description: ['', [Validators.required]]
    }));
  }

  removeItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  saveContent(): void {
    if (this.contentForm.valid) {
      this.isSaving = true;
      const formValue = this.contentForm.value;

      if (this.isEditMode && this.currentContent) {
        this.apiService.updateOecAtGlance(this.currentContent._id!, formValue).subscribe({
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
        this.apiService.createOecAtGlance(formValue).subscribe({
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
