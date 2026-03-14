// components/announcements/announcements.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, Announcement } from '../../services/api.service';
import { AnnouncementDialogComponent } from './announcement-dialog/announcement-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'category', 'attachments', 'deadline', 'scheduled_date', 'buttons', 'created', 'status', 'actions'];
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
      const statusStr = data.is_active !== false ? 'active' : 'inactive';
      return data.title.toLowerCase().includes(searchStr) ||
             data.announcement_category.toLowerCase().includes(searchStr) ||
             data.orange_button_title.toLowerCase().includes(searchStr) ||
             (data.blue_button_title?.toLowerCase().includes(searchStr) || false) ||
             statusStr.includes(searchStr) ||
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

  exportToExcel(): void {
    const data = this.dataSource.data.map(announcement => ({
      'Title': announcement.title,
      'Category': announcement.announcement_category,
      'Deadline': announcement.deadline
        ? new Date(announcement.deadline).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })
        : 'No deadline',
      'Scheduled Date': announcement.scheduled_date
        ? new Date(announcement.scheduled_date).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : 'Immediate',
      'Status': announcement.is_active !== false ? 'Active' : 'Inactive',
      'Orange Button Title': announcement.orange_button_title || '',
      'Blue Button Title': announcement.blue_button_title || '',
      'Created Date': announcement.createdAt
        ? new Date(announcement.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })
        : '',
      'Number of Attachments': announcement.attachments ? announcement.attachments.length : 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Announcements');

    // Auto-size columns
    if (data.length > 0) {
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, ...data.map(row => String(row[key as keyof typeof row]).length)) + 2
      }));
      worksheet['!cols'] = colWidths;
    }

    XLSX.writeFile(workbook, `Announcements_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.showSnackBar('Announcements exported successfully');
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
    console.log('Viewing announcement details:', announcement);
    this.showSnackBar(`Viewing: ${announcement.title}`, 'success');
  }

  toggleAnnouncementStatus(announcement: Announcement): void {
    const action = announcement.is_active !== false ? 'deactivate' : 'activate';

    if (confirm(`Are you sure you want to ${action} "${announcement.title}"?`)) {
      this.apiService.toggleAnnouncementStatus(announcement._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadAnnouncements();
            this.showSnackBar(
              `Announcement ${action}d successfully`
            );
          }
        },
        error: (error) => {
          console.error('Error toggling announcement status:', error);
          this.showSnackBar('Error toggling announcement status', 'error');
          this.loadAnnouncements(); // Refresh to reset toggle visual state
        }
      });
    } else {
      // User cancelled — reload to reset the toggle visual state
      this.loadAnnouncements();
    }
  }

  // Helper methods for table display

getCategoryClass(category: string | null | undefined): string {
  if (!category) {
    return 'default-category';
  }
  return category.toLowerCase();
}
getFlagClass(flag: string | null | undefined): string {
  if (!flag) {
    return 'no-flag';
  }
  return 'has-flag';
}

  getAttachmentIcon(attachmentType: string, icon?: string): string {
    if (attachmentType === 'link') {
      return 'link';
    }

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

  getScheduledStatus(scheduled_date: string): string {
    if (!scheduled_date) return 'none';
    const now = new Date();
    const scheduledDate = new Date(scheduled_date);
    if (scheduledDate > now) return 'pending';
    return 'published';
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
