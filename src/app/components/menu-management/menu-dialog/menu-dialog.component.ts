import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, MenuItem } from '../../../services/api.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialogComponent implements OnInit {
  menuForm: FormGroup;
  isEditMode = false;
  loading = false;
  showJsonEditor = false;
  jsonContent = '';

  dropdownTypes = [
    { value: 'simple', label: 'Simple List' },
    { value: 'tabs', label: 'Tabbed Content' },
    { value: 'mega', label: 'Mega Menu' }
  ];

  linkTypes = [
    { value: 'internal', label: 'Internal (Router Link)' },
    { value: 'external', label: 'External (href)' },
    { value: 'none', label: 'None (Has Dropdown)' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuItem
  ) {
    this.isEditMode = !!data;
    this.menuForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      icon: [data?.icon || 'fas fa-home', Validators.required],
      link: [data?.link || ''],
      link_type: [data?.link_type || 'internal'],
      has_dropdown: [data?.has_dropdown || false],
      dropdown_type: [data?.dropdown_type || 'simple'],
      dropdown_width: [data?.dropdown_width || '400px'],
      is_active: [data?.is_active !== false],
      order: [data?.order || 0]
    });

    if (this.isEditMode && data) {
      this.jsonContent = JSON.stringify({
        tabs: data.tabs || [],
        items: data.items || []
      }, null, 2);
    } else {
      this.jsonContent = JSON.stringify({
        tabs: [],
        items: []
      }, null, 2);
    }
  }

  ngOnInit(): void {
    // Watch has_dropdown changes
    this.menuForm.get('has_dropdown')?.valueChanges.subscribe(hasDropdown => {
      if (!hasDropdown) {
        this.menuForm.patchValue({ link_type: 'internal' });
      } else {
        this.menuForm.patchValue({ link_type: 'none' });
      }
    });
  }

  save(): void {
    if (this.menuForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    let additionalData: any = {};

    if (this.showJsonEditor) {
      try {
        additionalData = JSON.parse(this.jsonContent);
      } catch (e) {
        this.snackBar.open('Invalid JSON format', 'Close', { duration: 3000 });
        return;
      }
    }

    const menuItemData: MenuItem = {
      ...this.menuForm.value,
      ...additionalData
    };

    this.loading = true;

    const apiCall = this.isEditMode
      ? this.apiService.updateMenuItem(this.data._id!, menuItemData)
      : this.apiService.createMenuItem(menuItemData);

    apiCall.subscribe({
      next: () => {
        this.snackBar.open(
          `Menu item ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error saving menu item:', error);
        this.snackBar.open('Error saving menu item', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  toggleJsonEditor(): void {
    this.showJsonEditor = !this.showJsonEditor;
  }
}
