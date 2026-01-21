import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService, ContactUs } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: ContactUs | null = null;
  isEditMode = false;

  // Icon options for dropdowns
  sectionIcons = [
    { value: '📝', label: '📝 Feedback/Writing' },
    { value: '🆘', label: '🆘 SOS/Help' },
    { value: '📞', label: '📞 Phone' },
    { value: '📧', label: '📧 Email' },
    { value: '💬', label: '💬 Chat/Message' },
    { value: '📮', label: '📮 Mailbox' },
    { value: '📬', label: '📬 Mail' },
    { value: '📋', label: '📋 Form/Clipboard' },
    { value: '✉️', label: '✉️ Envelope' },
    { value: '💼', label: '💼 Business' },
    { value: '🏢', label: '🏢 Office Building' },
    { value: '🏛️', label: '🏛️ Government Building' },
    { value: '📍', label: '📍 Location Pin' },
    { value: '🗺️', label: '🗺️ Map' },
    { value: '🌐', label: '🌐 Globe/Website' },
    { value: '📱', label: '📱 Mobile Phone' },
    { value: '☎️', label: '☎️ Telephone' },
    { value: '📲', label: '📲 Mobile with Arrow' },
    { value: '🔔', label: '🔔 Notification Bell' },
    { value: '💡', label: '💡 Light Bulb/Idea' },
    { value: '🕐', label: '🕐 Clock/Time' },
    { value: '✈️', label: '✈️ Travel/Airplane' }
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['Get in Touch with OEC', [Validators.required]],
      headquarters_section: this.fb.group({
        title: ['Headquarters', [Validators.required]],
        icon: ['🏢', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        map_embed_url: ['']
      }),
      regional_offices_section: this.fb.group({
        title: ['Regional Offices', [Validators.required]],
        icon: ['🏛️', [Validators.required]],
        offices: this.fb.array([])
      }),
      travel_office_section: this.fb.group({
        title: ['OEC Travel Office', [Validators.required]],
        icon: ['✈️', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        map_embed_url: ['']
      }),
      feedback_section: this.fb.group({
        title: ['Feedback', [Validators.required]],
        icon: ['📝', [Validators.required]],
        description: ['If you need information, want to share feedback or highlight a concern, we are here. You can also drop an email to us your feedback through the form given below.', [Validators.required]]
      }),
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  // Getter for regional offices FormArray
  get regionalOffices(): FormArray {
    return this.contentForm.get('regional_offices_section.offices') as FormArray;
  }

  // Load content from API
  loadContent(): void {
    this.isLoading = true;
    this.apiService.getContactUs().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentContent = response.data;
          this.isEditMode = true;
          this.populateForm(response.data);
        } else {
          this.isEditMode = false;
          this.initializeDefaultArrays();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading content:', error);
        this.showSnackBar('Error loading content', 'error');
        this.isLoading = false;
        this.initializeDefaultArrays();
      }
    });
  }

  populateForm(content: ContactUs): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      headquarters_section: {
        title: content.headquarters_section?.title || 'Headquarters',
        icon: content.headquarters_section?.icon || '🏢',
        address: content.headquarters_section?.address || '',
        phone: content.headquarters_section?.phone || '',
        email: content.headquarters_section?.email || '',
        map_embed_url: content.headquarters_section?.map_embed_url || ''
      },
      regional_offices_section: {
        title: content.regional_offices_section?.title || 'Regional Offices',
        icon: content.regional_offices_section?.icon || '🏛️'
      },
      travel_office_section: {
        title: content.travel_office_section?.title || 'OEC Travel Office',
        icon: content.travel_office_section?.icon || '✈️',
        address: content.travel_office_section?.address || '',
        phone: content.travel_office_section?.phone || '',
        map_embed_url: content.travel_office_section?.map_embed_url || ''
      },
      feedback_section: {
        title: content.feedback_section?.title || 'Feedback',
        icon: content.feedback_section?.icon || '📝',
        description: content.feedback_section?.description || ''
      },
      is_active: content.is_active
    });

    // Populate regional offices
    this.regionalOffices.clear();
    if (content.regional_offices_section?.offices) {
      content.regional_offices_section.offices.forEach(office => {
        this.regionalOffices.push(this.fb.group({
          city: [office.city || '', [Validators.required]],
          address: [office.address || '', [Validators.required]],
          phone: [office.phone || '', [Validators.required]],
          email: [office.email || '', [Validators.required]],
          map_embed_url: [office.map_embed_url || '']
        }));
      });
    }

  }

  initializeDefaultArrays(): void {
    // Add default regional office
    this.addRegionalOffice();
  }

  addRegionalOffice(): void {
    this.regionalOffices.push(this.fb.group({
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      map_embed_url: ['']
    }));
  }

  removeRegionalOffice(index: number): void {
    this.regionalOffices.removeAt(index);
  }

  saveContent(): void {
    if (this.contentForm.valid) {
      this.isSaving = true;
      const formValue = this.contentForm.value;

      if (this.isEditMode && this.currentContent) {
        this.apiService.updateContactUs(this.currentContent._id!, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.showSnackBar('Content updated successfully');
              this.loadContent();
            }
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error updating content:', error);
            this.showSnackBar('Error updating content', 'error');
            this.isSaving = false;
          }
        });
      } else {
        this.apiService.createContactUs(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.showSnackBar('Content created successfully');
              this.loadContent();
            }
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error creating content:', error);
            this.showSnackBar('Error creating content', 'error');
            this.isSaving = false;
          }
        });
      }
    } else {
      this.showSnackBar('Please fill all required fields', 'error');
    }
  }

  refreshData(): void {
    this.loadContent();
  }

  showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
