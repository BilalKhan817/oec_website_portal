// components/about-oec/about-oec-dialog/about-oec-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, AboutOec } from '../../../services/api.service';

@Component({
  selector: 'app-about-oec-dialog',
  templateUrl: './about-oec-dialog.component.html',
  styleUrls: ['./about-oec-dialog.component.html']
})
export class AboutOecDialogComponent implements OnInit {
  aboutOecForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AboutOecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AboutOec | null
  ) {
    this.isEditMode = !!data;
    this.aboutOecForm = this.fb.group({
      title: [data?.title || 'About OEC'],
      subtitle: [data?.subtitle || 'Building Careers, Connecting Nations Since 1976'],
      description_paragraph_1: [data?.description_paragraph_1 || '', [Validators.required]],
      description_paragraph_2: [data?.description_paragraph_2 || '', [Validators.required]],
      established_year: [data?.established_year || '1976'],
      workers_sent: [data?.workers_sent || '11M+'],
      youtube_video_id: [data?.youtube_video_id || '', [Validators.required]],
      video_title: [data?.video_title || 'A brief introduction about Overseas Employment Corporation'],
      button_text: [data?.button_text || 'Learn More About OEC'],
      button_link: [data?.button_link || '/about'],
      is_active: [data?.is_active !== false]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onVideoIdChange(): void {
    // This method can be used to validate video ID or provide real-time feedback
  }

  getYoutubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  onSave(): void {
    if (this.aboutOecForm.valid) {
      this.isSubmitting = true;
      const formValue = this.aboutOecForm.value;

      const request = this.isEditMode
        ? this.apiService.updateAboutOec(this.data!._id!, formValue)
        : this.apiService.createAboutOec(formValue);

      request.subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error saving About OEC:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}