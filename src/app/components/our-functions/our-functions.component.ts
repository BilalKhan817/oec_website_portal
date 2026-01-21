import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService, OurFunctions } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-our-functions',
  templateUrl: './our-functions.component.html',
  styleUrls: ['./our-functions.component.css']
})
export class OurFunctionsComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: OurFunctions | null = null;
  isEditMode = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['Core Roles & Responsibilities of the Overseas Employment Corporation (OEC)', [Validators.required]],
      strategic_role_title: ['Strategic Role', [Validators.required]],
      strategic_role_content: ['As Pakistan\'s only government-owned overseas recruitment agency, OEC operates with the mandate to manage, regulate, and facilitate the legal export of Pakistani manpower to foreign countries.', [Validators.required]],
      key_functions_title: ['Key Functions by Category', [Validators.required]],
      key_functions_items: this.fb.array([]),
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  // Getter methods for FormArrays
  get keyFunctionsItems(): FormArray {
    return this.contentForm.get('key_functions_items') as FormArray;
  }

  getFunctionItems(functionIndex: number): FormArray {
    return this.keyFunctionsItems.at(functionIndex).get('items') as FormArray;
  }

  getNestedItems(functionIndex: number, itemIndex: number): FormArray {
    return this.getFunctionItems(functionIndex).at(itemIndex).get('nested_items') as FormArray;
  }

  // Load content from API
  loadContent(): void {
    this.isLoading = true;
    this.apiService.getOurFunctions().subscribe({
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

  populateForm(content: OurFunctions): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      strategic_role_title: content.strategic_role_title,
      strategic_role_content: content.strategic_role_content,
      key_functions_title: content.key_functions_title,
      is_active: content.is_active
    });

    // Populate key functions items
    this.populateKeyFunctionsItems(this.keyFunctionsItems, content.key_functions_items);
  }

  populateKeyFunctionsItems(formArray: FormArray, functions: any[]): void {
    formArray.clear();
    functions.forEach(func => {
      const functionGroup = this.fb.group({
        title: [func.title || '', [Validators.required]],
        items: this.fb.array([])
      });

      const itemsArray = functionGroup.get('items') as FormArray;
      if (func.items && func.items.length > 0) {
        func.items.forEach((item: any) => {
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

          itemsArray.push(itemGroup);
        });
      }

      formArray.push(functionGroup);
    });
  }

  initializeDefaultArrays(): void {
    this.addKeyFunction();
  }

  addKeyFunction(): void {
    this.keyFunctionsItems.push(this.fb.group({
      title: ['', [Validators.required]],
      items: this.fb.array([])
    }));
  }

  addFunctionItem(functionIndex: number): void {
    const items = this.getFunctionItems(functionIndex);
    items.push(this.fb.group({
      text: ['', [Validators.required]],
      nested_items: this.fb.array([])
    }));
  }

  addNestedItem(functionIndex: number, itemIndex: number): void {
    const nestedItems = this.getNestedItems(functionIndex, itemIndex);
    nestedItems.push(this.fb.group({
      text: ['', [Validators.required]]
    }));
  }

  removeKeyFunction(index: number): void {
    this.keyFunctionsItems.removeAt(index);
  }

  removeFunctionItem(functionIndex: number, itemIndex: number): void {
    const items = this.getFunctionItems(functionIndex);
    items.removeAt(itemIndex);
  }

  removeNestedItem(functionIndex: number, itemIndex: number, nestedIndex: number): void {
    const nestedItems = this.getNestedItems(functionIndex, itemIndex);
    nestedItems.removeAt(nestedIndex);
  }

  saveContent(): void {
    if (this.contentForm.valid) {
      this.isSaving = true;
      const formValue = this.contentForm.value;

      if (this.isEditMode && this.currentContent) {
        this.apiService.updateOurFunctions(this.currentContent._id!, formValue).subscribe({
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
        this.apiService.createOurFunctions(formValue).subscribe({
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
