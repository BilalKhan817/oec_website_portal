// components/executives/executives.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, Executive } from '../../services/api.service';
import { ExecutiveDialogComponent } from './executive-dialog/executive-dialog.component';

@Component({
  selector: 'app-executives',
  templateUrl: './executives.component.html',
  styleUrls: ['./executives.component.css']
})
export class ExecutivesComponent implements OnInit {
  executives: Executive[] = [];
  filteredExecutives: Executive[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExecutives();
  }

  loadExecutives(): void {
    this.isLoading = true;
    this.apiService.getExecutives().subscribe({
      next: (response:any) => {
        if (response.success && response.data) {
          this.executives = response.data.sort((a:any, b:any) => (a.order || 0) - (b.order || 0));
          this.filteredExecutives = [...this.executives];
        }
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error loading executives:', error);
        this.showSnackBar('Error loading executives', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = filterValue;
    
    this.filteredExecutives = this.executives.filter(executive => 
      executive.name.toLowerCase().includes(filterValue) ||
      executive.position.toLowerCase().includes(filterValue) ||
      executive.badge.toLowerCase().includes(filterValue)
    );
  }

  refreshData(): void {
    this.loadExecutives();
    this.showSnackBar('Data refreshed successfully');
  }

  openDialog(executive?: Executive): void {
    const dialogRef = this.dialog.open(ExecutiveDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: executive || null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.loadExecutives();
        this.showSnackBar(
          executive ? 'Executive updated successfully' : 'Executive created successfully'
        );
      }
    });
  }

  deleteExecutive(executive: Executive): void {
    if (confirm(`Are you sure you want to delete "${executive.name}"?`)) {
      this.apiService.deleteExecutive(executive._id!).subscribe({
        next: (response:any) => {
          if (response.success) {
            this.loadExecutives();
            this.showSnackBar('Executive deleted successfully');
          }
        },
        error: (error:any) => {
          console.error('Error deleting executive:', error);
          this.showSnackBar('Error deleting executive', 'error');
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    return `http://localhost:3000${imagePath}`;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/placeholder-avatar.png'; // Add a placeholder image
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}