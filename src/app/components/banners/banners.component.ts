// components/banners/banners.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, Banner } from '../../services/api.service';
import { BannerDialogComponent } from './banner-dialog/banner-dialog.component';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  displayedColumns: string[] = ['preview', 'title', 'buttons', 'status', 'created', 'actions'];
  dataSource = new MatTableDataSource<Banner>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBanners(): void {
    this.isLoading = true;
    this.apiService.getBanners().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banners:', error);
        this.showSnackBar('Error loading banners', 'error');
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
    this.loadBanners();
    this.showSnackBar('Data refreshed successfully');
  }

  openDialog(banner?: Banner): void {
    const dialogRef = this.dialog.open(BannerDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: banner || null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.loadBanners();
        this.showSnackBar(
          banner ? 'Banner updated successfully' : 'Banner created successfully'
        );
      }
    });
  }

  toggleBannerStatus(banner: Banner): void {
    this.apiService.toggleBannerStatus(banner._id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBanners();
          this.showSnackBar(`Banner ${response.data?.is_active ? 'activated' : 'deactivated'} successfully`);
        }
      },
      error: (error) => {
        console.error('Error toggling banner status:', error);
        this.showSnackBar('Error updating banner status', 'error');
        this.loadBanners(); // Reload to reset the toggle
      }
    });
  }

  deleteBanner(banner: Banner): void {
    if (confirm(`Are you sure you want to delete the banner "${banner.banner_title}"?`)) {
      this.apiService.deleteBanner(banner._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBanners();
            this.showSnackBar('Banner deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting banner:', error);
          this.showSnackBar('Error deleting banner', 'error');
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    // Adjust this based on your server configuration
    return `http://localhost:3000${imagePath}`;
  }

  getSubtitleText(banner: Banner): string {
    if (banner.banner_subtitle_type === 'text') {
      return banner.banner_subtitle as string;
    } else if (banner.banner_subtitle_type === 'points' && Array.isArray(banner.banner_subtitle)) {
      return `${banner.banner_subtitle.length} bullet points`;
    }
    return '';
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}