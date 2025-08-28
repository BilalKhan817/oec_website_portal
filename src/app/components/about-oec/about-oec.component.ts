// components/about-oec/about-oec.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, AboutOec } from '../../services/api.service';
import { AboutOecDialogComponent } from './about-oec-dialog/about-oec-dialog.component';

@Component({
  selector: 'app-about-oec',
  templateUrl: './about-oec.component.html',
  styleUrls: ['./about-oec.component.css']
})
export class AboutOecComponent implements OnInit {
  aboutOecData: AboutOec | null = null;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAboutOec();
  }

  loadAboutOec(): void {
    this.isLoading = true;
    this.apiService.getAboutOec().subscribe({
      next: (response:any) => {
        if (response.success && response.data) {
          this.aboutOecData = response.data;
        }
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error loading About OEC:', error);
        this.aboutOecData = null;
        this.isLoading = false;
      }
    });
  }

  openDialog(): void {
    if (!this.aboutOecData) return;

    const dialogRef = this.dialog.open(AboutOecDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: this.aboutOecData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.loadAboutOec();
        this.showSnackBar('About OEC content updated successfully');
      }
    });
  }

  createAboutOec(): void {
    const dialogRef = this.dialog.open(AboutOecDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.loadAboutOec();
        this.showSnackBar('About OEC section created successfully');
      }
    });
  }

  getYoutubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}