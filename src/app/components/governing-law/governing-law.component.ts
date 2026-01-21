import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService, GoverningLaw } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-governing-law',
  templateUrl: './governing-law.component.html',
  styleUrls: ['./governing-law.component.css']
})
export class GoverningLawComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: GoverningLaw | null = null;
  isEditMode = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['Legal Framework of the Overseas Employment Corporation (OEC)', [Validators.required]],

      // Statutory Status Section
      statutory_status_title: ['Statutory Status', [Validators.required]],
      statutory_status_intro: ['The Overseas Employment Corporation (OEC) is a public sector company wholly owned by the Government of Pakistan. It operates under:', [Validators.required]],
      statutory_status_items: this.fb.array([]),

      // Regulatory Oversight Section
      regulatory_oversight_title: ['Regulatory Oversight', [Validators.required]],
      regulatory_oversight_intro: ['OEC functions under the umbrella of the:', [Validators.required]],
      regulatory_oversight_items: this.fb.array([]),

      // Licensing Section
      licensing_title: ['Licensing & Exclusivity', [Validators.required]],
      licensing_items: this.fb.array([]),

      // Legal Obligations Section
      legal_obligations_title: ['Key Legal Obligations OEC Complies With', [Validators.required]],
      legal_obligations_table: this.fb.array([]),

      // Protection Measures Section
      protection_measures_title: ['Public Protection Measures', [Validators.required]],
      protection_measures_items: this.fb.array([]),

      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  // Getter methods for FormArrays
  get statutoryStatusItems(): FormArray {
    return this.contentForm.get('statutory_status_items') as FormArray;
  }

  get regulatoryOversightItems(): FormArray {
    return this.contentForm.get('regulatory_oversight_items') as FormArray;
  }

  get licensingItems(): FormArray {
    return this.contentForm.get('licensing_items') as FormArray;
  }

  get legalObligationsTable(): FormArray {
    return this.contentForm.get('legal_obligations_table') as FormArray;
  }

  get protectionMeasuresItems(): FormArray {
    return this.contentForm.get('protection_measures_items') as FormArray;
  }

  getNestedItems(parentIndex: number): FormArray {
    return this.regulatoryOversightItems.at(parentIndex).get('nested_items') as FormArray;
  }

  // Load content from API
  loadContent(): void {
    this.isLoading = true;
    this.apiService.getGoverningLaw().subscribe({
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

  populateForm(content: GoverningLaw): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      statutory_status_title: content.statutory_status_title,
      statutory_status_intro: content.statutory_status_intro,
      regulatory_oversight_title: content.regulatory_oversight_title,
      regulatory_oversight_intro: content.regulatory_oversight_intro,
      licensing_title: content.licensing_title,
      legal_obligations_title: content.legal_obligations_title,
      protection_measures_title: content.protection_measures_title,
      is_active: content.is_active
    });

    // Populate arrays
    this.populateTextItems(this.statutoryStatusItems, content.statutory_status_items);
    this.populateRegulatoryOversightItems(this.regulatoryOversightItems, content.regulatory_oversight_items);
    this.populateTextItems(this.licensingItems, content.licensing_items);
    this.populateLegalObligationsTable(this.legalObligationsTable, content.legal_obligations_table);
    this.populateTextItems(this.protectionMeasuresItems, content.protection_measures_items);
  }

  populateTextItems(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      formArray.push(this.fb.group({
        text: [item.text || '', [Validators.required]]
      }));
    });
  }

  populateRegulatoryOversightItems(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      const itemGroup = this.fb.group({
        text: [item.text || '', [Validators.required]],
        nested_items: this.fb.array([])
      });

      const nestedArray = itemGroup.get('nested_items') as FormArray;
      if (item.nested_items && item.nested_items.length > 0) {
        item.nested_items.forEach((nestedItem: any) => {
          nestedArray.push(this.fb.group({
            text: [nestedItem.text || '', [Validators.required]]
          }));
        });
      }

      formArray.push(itemGroup);
    });
  }

  populateLegalObligationsTable(formArray: FormArray, items: any[]): void {
    formArray.clear();
    items.forEach(item => {
      formArray.push(this.fb.group({
        regulation: [item.regulation || '', [Validators.required]],
        purpose: [item.purpose || '', [Validators.required]]
      }));
    });
  }

  initializeDefaultArrays(): void {
    this.addTextItem(this.statutoryStatusItems);
    this.addRegulatoryOversightItem();
    this.addTextItem(this.licensingItems);
    this.addLegalObligationRow();
    this.addTextItem(this.protectionMeasuresItems);
  }

  addTextItem(formArray: FormArray): void {
    formArray.push(this.fb.group({
      text: ['', [Validators.required]]
    }));
  }

  addRegulatoryOversightItem(): void {
    this.regulatoryOversightItems.push(this.fb.group({
      text: ['', [Validators.required]],
      nested_items: this.fb.array([])
    }));
  }

  addNestedItem(parentIndex: number): void {
    const nestedItems = this.getNestedItems(parentIndex);
    nestedItems.push(this.fb.group({
      text: ['', [Validators.required]]
    }));
  }

  removeNestedItem(parentIndex: number, nestedIndex: number): void {
    const nestedItems = this.getNestedItems(parentIndex);
    nestedItems.removeAt(nestedIndex);
  }

  addLegalObligationRow(): void {
    this.legalObligationsTable.push(this.fb.group({
      regulation: ['', [Validators.required]],
      purpose: ['', [Validators.required]]
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
        this.apiService.updateGoverningLaw(this.currentContent._id!, formValue).subscribe({
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
        this.apiService.createGoverningLaw(formValue).subscribe({
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
  }

  showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
