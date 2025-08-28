// components/announcements/announcements.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, Announcement } from '../../services/api.service';
import { AnnouncementDialogComponent } from './announcement-dialog/announcement-dialog.component';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'category', 'deadline', 'buttons', 'created', 'actions'];
  dataSource = new MatTableDataSource<Announcement>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.showSnackBar('Error loading announcements', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadAnnouncements();
    this.showSnackBar('Data refreshed successfully');
  }

  openDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: announcement || null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnouncements();
        this.showSnackBar(
          announcement ? 'Announcement updated successfully' : 'Announcement created successfully'
        );
      }
    });
  }

  deleteAnnouncement(announcement: Announcement): void {
    if (confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      this.apiService.deleteAnnouncement(announcement._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadAnnouncements();
            this.showSnackBar('Announcement deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting announcement:', error);
          this.showSnackBar('Error deleting announcement', 'error');
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