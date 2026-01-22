import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService, ContactUs } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  isLoading = false;
  isSaving = false;
  contentForm: FormGroup;
  currentContent: ContactUs | null = null;
  isEditMode = false;

  // Maps
  headquartersMap: L.Map | null = null;
  travelOfficeMap: L.Map | null = null;
  regionalOfficeMaps: Map<number, L.Map> = new Map();

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
        latitude: [33.6844, [Validators.required]],
        longitude: [73.0479, [Validators.required]]
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
        latitude: [33.6844, [Validators.required]],
        longitude: [73.0479, [Validators.required]]
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

  ngAfterViewInit(): void {
    // Maps will be initialized after form is loaded with data
    setTimeout(() => {
      this.initializeMaps();
    }, 1000);
  }

  initializeMaps(): void {
    // Initialize Headquarters Map
    const hqSection = this.contentForm.get('headquarters_section')?.value;
    if (hqSection && document.getElementById('hq-map')) {
      this.initializeHeadquartersMap(hqSection.latitude, hqSection.longitude);
    }

    // Initialize Travel Office Map
    const travelSection = this.contentForm.get('travel_office_section')?.value;
    if (travelSection && document.getElementById('travel-office-map')) {
      this.initializeTravelOfficeMap(travelSection.latitude, travelSection.longitude);
    }

    // Initialize Regional Office Maps
    const regionalOffices = this.regionalOffices.value;
    regionalOffices.forEach((office: any, index: number) => {
      if (document.getElementById(`regional-office-map-${index}`)) {
        this.initializeRegionalOfficeMap(index, office.latitude, office.longitude);
      }
    });
  }

  initializeHeadquartersMap(lat: number, lng: number): void {
    if (this.headquartersMap) {
      this.headquartersMap.remove();
    }

    this.headquartersMap = L.map('hq-map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.headquartersMap);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(this.headquartersMap)
      .bindPopup('<b>OEC Headquarters</b>')
      .openPopup();
  }

  initializeTravelOfficeMap(lat: number, lng: number): void {
    if (this.travelOfficeMap) {
      this.travelOfficeMap.remove();
    }

    this.travelOfficeMap = L.map('travel-office-map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.travelOfficeMap);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(this.travelOfficeMap)
      .bindPopup('<b>OEC Travel Office</b>')
      .openPopup();
  }

  initializeRegionalOfficeMap(index: number, lat: number, lng: number): void {
    const existingMap = this.regionalOfficeMaps.get(index);
    if (existingMap) {
      existingMap.remove();
    }

    const map = L.map(`regional-office-map-${index}`).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const office = this.regionalOffices.at(index).value;
    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${office.city} Office</b>`)
      .openPopup();

    this.regionalOfficeMaps.set(index, map);
  }

  updateMapLocation(mapType: 'headquarters' | 'travel' | 'regional', index?: number): void {
    if (mapType === 'headquarters') {
      const hqSection = this.contentForm.get('headquarters_section')?.value;
      if (hqSection && this.headquartersMap) {
        this.headquartersMap.setView([hqSection.latitude, hqSection.longitude], 15);
        this.initializeHeadquartersMap(hqSection.latitude, hqSection.longitude);
      }
    } else if (mapType === 'travel') {
      const travelSection = this.contentForm.get('travel_office_section')?.value;
      if (travelSection && this.travelOfficeMap) {
        this.travelOfficeMap.setView([travelSection.latitude, travelSection.longitude], 15);
        this.initializeTravelOfficeMap(travelSection.latitude, travelSection.longitude);
      }
    } else if (mapType === 'regional' && index !== undefined) {
      const office = this.regionalOffices.at(index).value;
      if (office && document.getElementById(`regional-office-map-${index}`)) {
        this.initializeRegionalOfficeMap(index, office.latitude, office.longitude);
      }
    }
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
        latitude: content.headquarters_section?.latitude || 33.6844,
        longitude: content.headquarters_section?.longitude || 73.0479
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
        latitude: content.travel_office_section?.latitude || 33.6844,
        longitude: content.travel_office_section?.longitude || 73.0479
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
          latitude: [office.latitude || 33.6844, [Validators.required]],
          longitude: [office.longitude || 73.0479, [Validators.required]]
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
      latitude: [33.6844, [Validators.required]],
      longitude: [73.0479, [Validators.required]]
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
