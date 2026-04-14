import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-faqs-management',
  templateUrl: './faqs-management.component.html',
  styleUrls: ['./faqs-management.component.css']
})
export class FaqsManagementComponent implements OnInit {
  categories: any[] = [];
  isLoading = false;

  iconOptions = [
    { value: 'fa-building', label: 'Building' },
    { value: 'fa-file-alt', label: 'Documents' },
    { value: 'fa-passport', label: 'Visa / Passport' },
    { value: 'fa-briefcase-medical', label: 'Medical' },
    { value: 'fa-money-bill-wave', label: 'Fees / Payments' },
    { value: 'fa-globe-asia', label: 'Global / International' },
    { value: 'fa-user-edit', label: 'Registration' },
    { value: 'fa-handshake', label: 'Agreements / MoUs' },
    { value: 'fa-plane-departure', label: 'Travel / Departure' },
    { value: 'fa-graduation-cap', label: 'Training / Education' },
    { value: 'fa-flag', label: 'Country / EPS Korea' },
    { value: 'fa-question-circle', label: 'General' },
    { value: 'fa-phone-alt', label: 'Contact / Support' },
    { value: 'fa-shield-alt', label: 'Protection / Safety' },
    { value: 'fa-users', label: 'Employers / People' },
    { value: 'fa-clipboard-list', label: 'Checklist / Requirements' },
  ];

  // New category
  newCategoryName = '';
  newCategoryIcon = '';

  // Edit category
  editingCategoryId: string | null = null;
  editCategoryName = '';
  editCategoryIcon = '';

  // New FAQ
  addingFaqToCategoryId: string | null = null;
  newQuestion = '';
  newAnswer = '';

  // Edit FAQ
  editingFaqId: string | null = null;
  editingFaqCategoryId: string | null = null;
  editQuestion = '';
  editAnswer = '';

  // Need More Help settings
  settingsPhone = '';
  settingsEmail = '';
  isSavingSettings = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSettings();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.apiService.getFaqCategories().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading FAQs', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    });
  }

  // --- Category CRUD ---

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.apiService.createFaqCategory({ name: this.newCategoryName.trim(), icon: this.newCategoryIcon.trim() }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.newCategoryName = '';
          this.newCategoryIcon = '';
          this.loadCategories();
          this.snackBar.open('Category added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  startEditCategory(cat: any): void {
    this.editingCategoryId = cat._id;
    this.editCategoryName = cat.name;
    this.editCategoryIcon = cat.icon || '';
  }

  cancelEditCategory(): void {
    this.editingCategoryId = null;
    this.editCategoryName = '';
    this.editCategoryIcon = '';
  }

  saveCategory(): void {
    if (!this.editCategoryName.trim() || !this.editingCategoryId) return;
    this.apiService.updateFaqCategory(this.editingCategoryId, { name: this.editCategoryName.trim(), icon: this.editCategoryIcon.trim() }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cancelEditCategory();
          this.loadCategories();
          this.snackBar.open('Category updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error updating category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteCategory(cat: any): void {
    if (confirm(`Delete category "${cat.name}" and all its FAQs?`)) {
      this.apiService.deleteFaqCategory(cat._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadCategories();
            this.snackBar.open('Category deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting category', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  // --- FAQ CRUD ---

  startAddFaq(categoryId: string): void {
    this.addingFaqToCategoryId = categoryId;
    this.newQuestion = '';
    this.newAnswer = '';
  }

  cancelAddFaq(): void {
    this.addingFaqToCategoryId = null;
    this.newQuestion = '';
    this.newAnswer = '';
  }

  addFaq(): void {
    if (!this.newQuestion.trim() || !this.newAnswer.trim() || !this.addingFaqToCategoryId) return;
    this.apiService.addFaq(this.addingFaqToCategoryId, {
      question: this.newQuestion.trim(),
      answer: this.newAnswer.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cancelAddFaq();
          this.loadCategories();
          this.snackBar.open('FAQ added', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error adding FAQ', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  startEditFaq(categoryId: string, faq: any): void {
    this.editingFaqCategoryId = categoryId;
    this.editingFaqId = faq._id;
    this.editQuestion = faq.question;
    this.editAnswer = faq.answer;
  }

  cancelEditFaq(): void {
    this.editingFaqId = null;
    this.editingFaqCategoryId = null;
    this.editQuestion = '';
    this.editAnswer = '';
  }

  saveEditFaq(): void {
    if (!this.editQuestion.trim() || !this.editAnswer.trim() || !this.editingFaqCategoryId || !this.editingFaqId) return;
    this.apiService.updateFaq(this.editingFaqCategoryId, this.editingFaqId, {
      question: this.editQuestion.trim(),
      answer: this.editAnswer.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cancelEditFaq();
          this.loadCategories();
          this.snackBar.open('FAQ updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Error updating FAQ', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  deleteFaq(categoryId: string, faq: any): void {
    if (confirm(`Delete FAQ "${faq.question}"?`)) {
      this.apiService.deleteFaq(categoryId, faq._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadCategories();
            this.snackBar.open('FAQ deleted', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
          }
        },
        error: () => this.snackBar.open('Error deleting FAQ', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
      });
    }
  }

  // --- Need More Help Settings ---

  loadSettings(): void {
    this.apiService.getFaqSettings().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.settingsPhone = response.data.phone || '';
          this.settingsEmail = response.data.email || '';
        }
      },
      error: () => this.snackBar.open('Error loading settings', 'Close', { duration: 3000, panelClass: ['error-snackbar'] })
    });
  }

  saveSettings(): void {
    this.isSavingSettings = true;
    this.apiService.updateFaqSettings({
      phone: this.settingsPhone.trim(),
      email: this.settingsEmail.trim()
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Settings updated', 'Close', { duration: 2000, panelClass: ['success-snackbar'] });
        }
        this.isSavingSettings = false;
      },
      error: () => {
        this.snackBar.open('Error updating settings', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        this.isSavingSettings = false;
      }
    });
  }
}
