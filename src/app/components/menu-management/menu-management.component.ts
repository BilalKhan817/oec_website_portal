import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, MenuItem } from '../../services/api.service';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
  menuItems: MenuItem[] = [];
  loading = false;
  displayedColumns: string[] = ['drag', 'order', 'title', 'icon', 'has_dropdown', 'dropdown_type', 'is_active', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.loading = true;
    this.apiService.getMenuItems().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.menuItems = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
        this.snackBar.open('Error loading menu items', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openDialog(menuItem?: MenuItem): void {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: menuItem ? { ...menuItem } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuItems();
      }
    });
  }

  deleteMenuItem(menuItem: MenuItem): void {
    if (confirm(`Are you sure you want to delete "${menuItem.title}"?`)) {
      this.apiService.deleteMenuItem(menuItem._id!).subscribe({
        next: () => {
          this.snackBar.open('Menu item deleted successfully', 'Close', { duration: 3000 });
          this.loadMenuItems();
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
          this.snackBar.open('Error deleting menu item', 'Close', { duration: 3000 });
        }
      });
    }
  }

  toggleActive(menuItem: MenuItem): void {
    const updatedItem = { ...menuItem, is_active: !menuItem.is_active };
    this.apiService.updateMenuItem(menuItem._id!, updatedItem).subscribe({
      next: () => {
        this.snackBar.open('Menu item updated successfully', 'Close', { duration: 2000 });
        this.loadMenuItems();
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
        this.snackBar.open('Error updating menu item', 'Close', { duration: 3000 });
      }
    });
  }

  drop(event: CdkDragDrop<MenuItem[]>): void {
    moveItemInArray(this.menuItems, event.previousIndex, event.currentIndex);

    // Update order for all items
    const reorderData = this.menuItems.map((item, index) => ({
      id: item._id!,
      order: index
    }));

    this.apiService.reorderMenuItems(reorderData).subscribe({
      next: () => {
        this.snackBar.open('Menu order updated successfully', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error reordering menu items:', error);
        this.snackBar.open('Error reordering menu items', 'Close', { duration: 3000 });
        this.loadMenuItems(); // Reload to reset order
      }
    });
  }

  getDropdownTypeDisplay(type?: string): string {
    const types: { [key: string]: string } = {
      'simple': 'Simple List',
      'tabs': 'Tabbed Content',
      'mega': 'Mega Menu'
    };
    return type ? types[type] || type : '-';
  }
}
