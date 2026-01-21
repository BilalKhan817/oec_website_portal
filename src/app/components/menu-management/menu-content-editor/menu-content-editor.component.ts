import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu-content-editor',
  templateUrl: './menu-content-editor.component.html',
  styleUrls: ['./menu-content-editor.component.css']
})
export class MenuContentEditorComponent {
  contentForm: FormGroup;
  menuItem: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MenuContentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuItem = data.menuItem;
    this.contentForm = this.fb.group({
      title: [data.menuItem?.title || '', Validators.required],
      tabs: this.fb.array([]),
      items: this.fb.array([])
    });

    // Load existing tabs
    if (data.menuItem?.tabs) {
      data.menuItem.tabs.forEach((tab: any) => {
        this.addTab(tab);
      });
    }

    // Load existing items
    if (data.menuItem?.items) {
      data.menuItem.items.forEach((item: any) => {
        this.addItem(item);
      });
    }
  }

  get tabs(): FormArray {
    return this.contentForm.get('tabs') as FormArray;
  }

  get items(): FormArray {
    return this.contentForm.get('items') as FormArray;
  }

  createTabForm(tab?: any): FormGroup {
    return this.fb.group({
      tab_title: [tab?.tab_title || '', Validators.required],
      tab_icon: [tab?.tab_icon || 'fas fa-star'],
      tab_id: [tab?.tab_id || ''],
      order: [tab?.order || 0],
      items: this.fb.array(tab?.items?.map((item: any) => this.createItemForm(item)) || [])
    });
  }

  createItemForm(item?: any): FormGroup {
    return this.fb.group({
      title: [item?.title || '', Validators.required],
      icon: [item?.icon || 'fas fa-circle'],
      description: [item?.description || ''],
      link: [item?.link || ''],
      link_type: [item?.link_type || 'internal'],
      image_url: [item?.image_url || ''],
      badge_text: [item?.badge_text || ''],
      badge_color: [item?.badge_color || ''],
      expandable: [item?.expandable || false],
      expand_content: [item?.expand_content || ''],
      order: [item?.order || 0]
    });
  }

  addTab(tab?: any): void {
    this.tabs.push(this.createTabForm(tab));
  }

  removeTab(index: number): void {
    this.tabs.removeAt(index);
  }

  addItem(item?: any): void {
    this.items.push(this.createItemForm(item));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  getTabItems(tabIndex: number): FormArray {
    return this.tabs.at(tabIndex).get('items') as FormArray;
  }

  addTabItem(tabIndex: number, item?: any): void {
    this.getTabItems(tabIndex).push(this.createItemForm(item));
  }

  removeTabItem(tabIndex: number, itemIndex: number): void {
    this.getTabItems(tabIndex).removeAt(itemIndex);
  }

  save(): void {
    if (this.contentForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.dialogRef.close(this.contentForm.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
