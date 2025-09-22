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
  // Updated to include attachments column
  displayedColumns: string[] = ['title', 'category', 'attachments', 'deadline', 'buttons', 'created', 'actions'];
  dataSource = new MatTableDataSource<Announcement>();
  isLoading = false;
  baseUrl:any
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
    
    // Custom filter predicate for searching through nested properties
    this.dataSource.filterPredicate = (data: Announcement, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return data.title.toLowerCase().includes(searchStr) ||
             data.announcement_category.toLowerCase().includes(searchStr) ||
             data.orange_button_title.toLowerCase().includes(searchStr) ||
             (data.blue_button_title?.toLowerCase().includes(searchStr) || false) ||
             (data.attachments?.some(att => 
               att.file_title.toLowerCase().includes(searchStr)
             ) || false);
    };
  }

  loadAnnouncements(): void {
    this.baseUrl = this.apiService.MainbaseUrl
    this.isLoading = true;
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          console.log('Loaded announcements:', response.data);
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
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
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

  viewAnnouncement(announcement: Announcement): void {
    // Open a detailed view dialog showing all announcement information
    console.log('Viewing announcement details:', announcement);
    
    // You can implement a detailed view dialog here
    // Example: this.dialog.open(AnnouncementViewDialogComponent, { data: announcement });
    
    // For now, show basic info in snackbar
    this.showSnackBar(`Viewing: ${announcement.title}`, 'success');
  }

  deleteAnnouncement(announcement: Announcement): void {
    const hasAttachments = announcement.attachments && announcement.attachments.length > 0;
    const hasFlag = !!announcement.flag;
    
    let confirmMessage = `Are you sure you want to delete "${announcement.title}"?`;
    if (hasAttachments || hasFlag) {
      confirmMessage += '\n\nThis will also permanently delete:';
      if (hasFlag) confirmMessage += '\n• Banner image';
      if (hasAttachments) confirmMessage += `\n• ${announcement.attachments!.length} attachment(s)`;
    }

    if (confirm(confirmMessage)) {
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

  // Helper methods for table display

getCategoryClass(category: string | null | undefined): string {
  if (!category) {
    return 'default-category'; // or return empty string ''
  }
  return category.toLowerCase();
}
getFlagClass(flag: string | null | undefined): string {
  if (!flag) {
    return 'no-flag';
  }
  // You might want to extract category from flag path or use a different logic
  // For now, returning a generic class
  return 'has-flag';
}

  getAttachmentIcon(attachmentType: string, icon?: string): string {
    if (attachmentType === 'link') {
      return 'link';
    }
    
    // Map frontend icons to Material icons
    switch (icon) {
      case 'advertisement': return 'campaign';
      case 'announcement': return 'notifications';
      case 'pdf': return 'picture_as_pdf';
      case 'clock': return 'schedule';
      case 'video': return 'videocam';
      default: return 'attach_file';
    }
  }

  getDeadlineStatus(deadline: string): string {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 0) {
      return 'expired';
    } else if (diffInHours < 24) {
      return 'warning';
    } else {
      return 'active';
    }
  }

  getDeadlineIcon(deadline: string): string {
    const status = this.getDeadlineStatus(deadline);
    switch (status) {
      case 'expired': return 'error';
      case 'warning': return 'warning';
      case 'active': return 'check_circle';
      default: return 'schedule';
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}

// Optional: Create interfaces for better type safety
export interface AttachmentDisplay {
  _id?: string;
  file_title: string;
  icon: string;
  attachment_type: 'attachment_file' | 'link';
  file_path?: string;
  file_url?: string;
  original_name?: string;
  file_size?: number;
  mime_type?: string;
  link_url?: string;
}

export interface AnnouncementDisplay extends Omit<Announcement, 'attachments'> {
  attachments?: AttachmentDisplay[];
}