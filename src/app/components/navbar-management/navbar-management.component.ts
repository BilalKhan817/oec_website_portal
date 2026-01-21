import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar-management',
  templateUrl: './navbar-management.component.html',
  styleUrls: ['./navbar-management.component.css']
})
export class NavbarManagementComponent implements OnInit {
  menus: any[] = [];
  submenus: any[] = [];
  isLoading = false;

  // Menu management
  showMenuForm = false;
  isEditingMenu = false;
  currentMenuId: string | null = null;
  menuForm: FormGroup;

  // Submenu management
  showSubmenuForm = false;
  isEditingSubmenu = false;
  currentSubmenuId: string | null = null;
  selectedMenuForSubmenu: string | null = null;
  submenuForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.menuForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      url: [''],
      icon: [''],
      hasSubmenu: [false],
      order: [0, Validators.required],
      isActive: [true],
      openInNewTab: [false],
      cssClass: ['']
    });

    this.submenuForm = this.fb.group({
      menuId: ['', Validators.required],
      title: ['', Validators.required],
      slug: ['', Validators.required],
      url: [''],
      icon: [''],
      description: [''], // This is the key field for navbar descriptions
      order: [0, Validators.required],
      isActive: [true],
      openInNewTab: [false],
      cssClass: ['']
    });
  }

  ngOnInit(): void {
    this.loadMenus();
    this.loadSubmenus();
  }

  // ==================== MENU CRUD ====================

  loadMenus(): void {
    this.isLoading = true;
    this.apiService.getNavbarMenus().subscribe({
      next: (response: any) => {
        this.menus = response || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading menus:', error);
        this.snackBar.open('Error loading menus', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  showCreateMenuForm(): void {
    this.showMenuForm = true;
    this.isEditingMenu = false;
    this.currentMenuId = null;
    this.menuForm.reset({ isActive: true, hasSubmenu: false, order: 0 });
  }

  showEditMenuForm(menu: any): void {
    this.showMenuForm = true;
    this.isEditingMenu = true;
    this.currentMenuId = menu._id;
    this.menuForm.patchValue(menu);
  }

  cancelMenuForm(): void {
    this.showMenuForm = false;
    this.menuForm.reset();
  }

  onSubmitMenu(): void {
    if (this.menuForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const request = this.isEditingMenu && this.currentMenuId
      ? this.apiService.updateNavbarMenu(this.currentMenuId, this.menuForm.value)
      : this.apiService.createNavbarMenu(this.menuForm.value);

    request.subscribe({
      next: (response: any) => {
        this.snackBar.open(
          `Menu ${this.isEditingMenu ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.showMenuForm = false;
        this.menuForm.reset();
        this.loadMenus();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving menu:', error);
        this.snackBar.open('Error saving menu', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteMenu(id: string): void {
    if (confirm('Are you sure you want to delete this menu? All submenus will also be deleted.')) {
      this.isLoading = true;
      this.apiService.deleteNavbarMenu(id).subscribe({
        next: () => {
          this.snackBar.open('Menu deleted successfully', 'Close', { duration: 3000 });
          this.loadMenus();
          this.loadSubmenus();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error deleting menu:', error);
          this.snackBar.open('Error deleting menu', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  // ==================== SUBMENU CRUD ====================

  loadSubmenus(menuId?: string): void {
    this.isLoading = true;
    this.apiService.getNavbarSubmenus(menuId).subscribe({
      next: (response: any) => {
        this.submenus = response || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading submenus:', error);
        this.snackBar.open('Error loading submenus', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getSubmenusByMenuId(menuId: string): any[] {
    return this.submenus.filter(sub => sub.menuId === menuId || sub.menuId?._id === menuId);
  }

  showCreateSubmenuForm(menuId: string): void {
    this.showSubmenuForm = true;
    this.isEditingSubmenu = false;
    this.currentSubmenuId = null;
    this.selectedMenuForSubmenu = menuId;
    this.submenuForm.reset({ menuId, isActive: true, order: 0 });
  }

  showEditSubmenuForm(submenu: any): void {
    this.showSubmenuForm = true;
    this.isEditingSubmenu = true;
    this.currentSubmenuId = submenu._id;
    this.selectedMenuForSubmenu = submenu.menuId._id || submenu.menuId;
    this.submenuForm.patchValue({
      menuId: submenu.menuId._id || submenu.menuId,
      title: submenu.title,
      slug: submenu.slug,
      url: submenu.url,
      icon: submenu.icon,
      description: submenu.description,
      order: submenu.order,
      isActive: submenu.isActive,
      openInNewTab: submenu.openInNewTab,
      cssClass: submenu.cssClass
    });
  }

  cancelSubmenuForm(): void {
    this.showSubmenuForm = false;
    this.submenuForm.reset();
    this.selectedMenuForSubmenu = null;
  }

  onSubmitSubmenu(): void {
    if (this.submenuForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const request = this.isEditingSubmenu && this.currentSubmenuId
      ? this.apiService.updateNavbarSubmenu(this.currentSubmenuId, this.submenuForm.value)
      : this.apiService.createNavbarSubmenu(this.submenuForm.value);

    request.subscribe({
      next: (response: any) => {
        this.snackBar.open(
          `Submenu ${this.isEditingSubmenu ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.showSubmenuForm = false;
        this.submenuForm.reset();
        this.loadSubmenus();
        this.loadMenus(); // Refresh menus to update hasSubmenu flag
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving submenu:', error);
        this.snackBar.open('Error saving submenu', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteSubmenu(id: string): void {
    if (confirm('Are you sure you want to delete this submenu?')) {
      this.isLoading = true;
      this.apiService.deleteNavbarSubmenu(id).subscribe({
        next: () => {
          this.snackBar.open('Submenu deleted successfully', 'Close', { duration: 3000 });
          this.loadSubmenus();
          this.loadMenus();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error deleting submenu:', error);
          this.snackBar.open('Error deleting submenu', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
