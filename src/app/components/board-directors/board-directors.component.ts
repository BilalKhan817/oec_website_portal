// components/board-directors/board-directors.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, BoardMember } from '../../services/api.service';

@Component({
  selector: 'app-board-directors',
  templateUrl: './board-directors.component.html',
  styleUrls: ['./board-directors.component.css']
})
export class BoardDirectorsComponent implements OnInit {
  boardMembers: BoardMember[] = [];
  filteredBoardMembers: BoardMember[] = [];
  isLoading = false;
  searchTerm = '';
  
  // Modal properties
  showModal = false;
  isEditMode = false;
  editingMember: BoardMember | null = null;
  boardMemberForm: FormGroup;
  displayedColumns: string[] = ['name', 'designation', 'representing', 'actions'];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.boardMemberForm = this.fb.group({
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      representing: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadBoardMembers();
  }

  loadBoardMembers(): void {
    this.isLoading = true;
    this.apiService.getBoardMembers().subscribe({
      next: (response: any) => {
        if (response) {
          this.boardMembers = response;
          this.filteredBoardMembers = [...this.boardMembers];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading board members:', error);
        this.showSnackBar('Error loading board members', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = filterValue;
    
    this.filteredBoardMembers = this.boardMembers.filter(member => 
      member.name.toLowerCase().includes(filterValue) ||
      member.designation.toLowerCase().includes(filterValue) ||
      member.representing.toLowerCase().includes(filterValue)
    );
  }

  refreshData(): void {
    this.loadBoardMembers();
    this.showSnackBar('Data refreshed successfully');
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingMember = null;
    this.boardMemberForm.reset();
    this.showModal = true;
  }

  openEditModal(member: BoardMember): void {
    this.isEditMode = true;
    this.editingMember = member;
    this.boardMemberForm.patchValue({
      name: member.name,
      designation: member.designation,
      representing: member.representing
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.editingMember = null;
    this.boardMemberForm.reset();
  }

  saveBoardMember(): void {
    if (this.boardMemberForm.valid) {
      const formValue = this.boardMemberForm.value;
      
      if (this.isEditMode && this.editingMember) {
        // Update existing member
        this.apiService.updateBoardMember(this.editingMember._id!, formValue).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.loadBoardMembers();
              this.showSnackBar('Board member updated successfully');
              this.closeModal();
            }
          },
          error: (error: any) => {
            console.error('Error updating board member:', error);
            this.showSnackBar('Error updating board member', 'error');
          }
        });
      } else {
        // Create new member
        this.apiService.createBoardMember(formValue).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.loadBoardMembers();
              this.showSnackBar('Board member created successfully');
              this.closeModal();
            }
          },
          error: (error: any) => {
            console.error('Error creating board member:', error);
            this.showSnackBar('Error creating board member', 'error');
          }
        });
      }
    }
  }

  deleteBoardMember(member: BoardMember): void {
    if (confirm(`Are you sure you want to delete "${member.name}"?`)) {
      this.apiService.deleteBoardMember(member._id!).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadBoardMembers();
            this.showSnackBar('Board member deleted successfully');
          }
        },
        error: (error: any) => {
          console.error('Error deleting board member:', error);
          this.showSnackBar('Error deleting board member', 'error');
        }
      });
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}
