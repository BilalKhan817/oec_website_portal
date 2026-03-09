import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
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
    { value: '\u{1F4DD}', label: '\u{1F4DD} Feedback/Writing' },
    { value: '\u{1F198}', label: '\u{1F198} SOS/Help' },
    { value: '\u{1F4DE}', label: '\u{1F4DE} Phone' },
    { value: '\u{1F4E7}', label: '\u{1F4E7} Email' },
    { value: '\u{1F4AC}', label: '\u{1F4AC} Chat/Message' },
    { value: '\u{1F4EE}', label: '\u{1F4EE} Mailbox' },
    { value: '\u{1F4EC}', label: '\u{1F4EC} Mail' },
    { value: '\u{1F4CB}', label: '\u{1F4CB} Form/Clipboard' },
    { value: '\u2709\uFE0F', label: '\u2709\uFE0F Envelope' },
    { value: '\u{1F4BC}', label: '\u{1F4BC} Business' },
    { value: '\u{1F3E2}', label: '\u{1F3E2} Office Building' },
    { value: '\u{1F3DB}\uFE0F', label: '\u{1F3DB}\uFE0F Government Building' },
    { value: '\u{1F4CD}', label: '\u{1F4CD} Location Pin' },
    { value: '\u{1F5FA}\uFE0F', label: '\u{1F5FA}\uFE0F Map' },
    { value: '\u{1F310}', label: '\u{1F310} Globe/Website' },
    { value: '\u{1F4F1}', label: '\u{1F4F1} Mobile Phone' },
    { value: '\u260E\uFE0F', label: '\u260E\uFE0F Telephone' },
    { value: '\u{1F4F2}', label: '\u{1F4F2} Mobile with Arrow' },
    { value: '\u{1F514}', label: '\u{1F514} Notification Bell' },
    { value: '\u{1F4A1}', label: '\u{1F4A1} Light Bulb/Idea' },
    { value: '\u{1F550}', label: '\u{1F550} Clock/Time' },
    { value: '\u2708\uFE0F', label: '\u2708\uFE0F Travel/Airplane' }
  ];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      page_title: ['Get in Touch with OEC'],
      headquarters_section: this.fb.group({
        title: ['Headquarters'],
        icon: ['\u{1F3E2}'],
        address: [''],
        phones: this.fb.array([['']]),
        emails: this.fb.array([['']]),
        contact_persons: this.fb.array([]),
        latitude: [33.6844],
        longitude: [73.0479]
      }),
      regional_offices_section: this.fb.group({
        title: ['Regional Offices'],
        icon: ['\u{1F3DB}\uFE0F'],
        offices: this.fb.array([])
      }),
      travel_office_section: this.fb.group({
        title: ['OEC Travel Office'],
        icon: ['\u2708\uFE0F'],
        address: [''],
        phones: this.fb.array([['']]),
        emails: this.fb.array([['']]),
        contact_persons: this.fb.array([]),
        latitude: [33.6844],
        longitude: [73.0479]
      }),
      feedback_section: this.fb.group({
        title: ['Feedback'],
        icon: ['\u{1F4DD}'],
        description: ['If you need information, want to share feedback or highlight a concern, we are here. You can also drop an email to us your feedback through the form given below.']
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

  // ─── FormArray Getters ───

  get hqPhones(): FormArray {
    return this.contentForm.get('headquarters_section.phones') as FormArray;
  }

  get hqEmails(): FormArray {
    return this.contentForm.get('headquarters_section.emails') as FormArray;
  }

  get hqContactPersons(): FormArray {
    return this.contentForm.get('headquarters_section.contact_persons') as FormArray;
  }

  get travelPhones(): FormArray {
    return this.contentForm.get('travel_office_section.phones') as FormArray;
  }

  get travelEmails(): FormArray {
    return this.contentForm.get('travel_office_section.emails') as FormArray;
  }

  get travelContactPersons(): FormArray {
    return this.contentForm.get('travel_office_section.contact_persons') as FormArray;
  }

  get regionalOffices(): FormArray {
    return this.contentForm.get('regional_offices_section.offices') as FormArray;
  }

  // ─── Phone/Email helpers for HQ & Travel ───

  addHqPhone(): void {
    this.hqPhones.push(new FormControl(''));
  }

  removeHqPhone(index: number): void {
    if (this.hqPhones.length > 1) this.hqPhones.removeAt(index);
  }

  addHqEmail(): void {
    this.hqEmails.push(new FormControl(''));
  }

  removeHqEmail(index: number): void {
    if (this.hqEmails.length > 1) this.hqEmails.removeAt(index);
  }

  addTravelPhone(): void {
    this.travelPhones.push(new FormControl(''));
  }

  removeTravelPhone(index: number): void {
    if (this.travelPhones.length > 1) this.travelPhones.removeAt(index);
  }

  addTravelEmail(): void {
    this.travelEmails.push(new FormControl(''));
  }

  removeTravelEmail(index: number): void {
    if (this.travelEmails.length > 1) this.travelEmails.removeAt(index);
  }

  // ─── Contact Persons helpers for HQ & Travel ───

  createContactPersonGroup(cp?: any): FormGroup {
    const phonesData = cp?.phones?.length ? cp.phones : (cp?.phone ? [cp.phone] : ['']);
    const emailsData = cp?.emails?.length ? cp.emails : (cp?.email ? [cp.email] : ['']);
    return this.fb.group({
      full_name: [cp?.full_name || ''],
      designation: [cp?.designation || ''],
      phones: this.fb.array(phonesData.map((p: string) => new FormControl(p))),
      emails: this.fb.array(emailsData.map((e: string) => new FormControl(e)))
    });
  }

  getContactPersonPhones(section: 'hq' | 'travel', personIndex: number): FormArray {
    const persons = section === 'hq' ? this.hqContactPersons : this.travelContactPersons;
    return persons.at(personIndex).get('phones') as FormArray;
  }

  getContactPersonEmails(section: 'hq' | 'travel', personIndex: number): FormArray {
    const persons = section === 'hq' ? this.hqContactPersons : this.travelContactPersons;
    return persons.at(personIndex).get('emails') as FormArray;
  }

  addContactPersonPhone(section: 'hq' | 'travel', personIndex: number): void {
    this.getContactPersonPhones(section, personIndex).push(new FormControl(''));
  }

  removeContactPersonPhone(section: 'hq' | 'travel', personIndex: number, phoneIndex: number): void {
    const phones = this.getContactPersonPhones(section, personIndex);
    if (phones.length > 1) phones.removeAt(phoneIndex);
  }

  addContactPersonEmail(section: 'hq' | 'travel', personIndex: number): void {
    this.getContactPersonEmails(section, personIndex).push(new FormControl(''));
  }

  removeContactPersonEmail(section: 'hq' | 'travel', personIndex: number, emailIndex: number): void {
    const emails = this.getContactPersonEmails(section, personIndex);
    if (emails.length > 1) emails.removeAt(emailIndex);
  }

  addHqContactPerson(): void {
    this.hqContactPersons.push(this.createContactPersonGroup());
  }

  removeHqContactPerson(index: number): void {
    this.hqContactPersons.removeAt(index);
  }

  addTravelContactPerson(): void {
    this.travelContactPersons.push(this.createContactPersonGroup());
  }

  removeTravelContactPerson(index: number): void {
    this.travelContactPersons.removeAt(index);
  }

  // ─── Regional Office helpers ───

  getRegionalPhones(officeIndex: number): FormArray {
    return this.regionalOffices.at(officeIndex).get('phones') as FormArray;
  }

  getRegionalEmails(officeIndex: number): FormArray {
    return this.regionalOffices.at(officeIndex).get('emails') as FormArray;
  }

  getRegionalContactPersons(officeIndex: number): FormArray {
    return this.regionalOffices.at(officeIndex).get('contact_persons') as FormArray;
  }

  addRegionalPhone(officeIndex: number): void {
    this.getRegionalPhones(officeIndex).push(new FormControl(''));
  }

  removeRegionalPhone(officeIndex: number, phoneIndex: number): void {
    const phones = this.getRegionalPhones(officeIndex);
    if (phones.length > 1) phones.removeAt(phoneIndex);
  }

  addRegionalEmail(officeIndex: number): void {
    this.getRegionalEmails(officeIndex).push(new FormControl(''));
  }

  removeRegionalEmail(officeIndex: number, emailIndex: number): void {
    const emails = this.getRegionalEmails(officeIndex);
    if (emails.length > 1) emails.removeAt(emailIndex);
  }

  getRegionalContactPersonPhones(officeIndex: number, personIndex: number): FormArray {
    return this.getRegionalContactPersons(officeIndex).at(personIndex).get('phones') as FormArray;
  }

  getRegionalContactPersonEmails(officeIndex: number, personIndex: number): FormArray {
    return this.getRegionalContactPersons(officeIndex).at(personIndex).get('emails') as FormArray;
  }

  addRegionalContactPersonPhone(officeIndex: number, personIndex: number): void {
    this.getRegionalContactPersonPhones(officeIndex, personIndex).push(new FormControl(''));
  }

  removeRegionalContactPersonPhone(officeIndex: number, personIndex: number, phoneIndex: number): void {
    const phones = this.getRegionalContactPersonPhones(officeIndex, personIndex);
    if (phones.length > 1) phones.removeAt(phoneIndex);
  }

  addRegionalContactPersonEmail(officeIndex: number, personIndex: number): void {
    this.getRegionalContactPersonEmails(officeIndex, personIndex).push(new FormControl(''));
  }

  removeRegionalContactPersonEmail(officeIndex: number, personIndex: number, emailIndex: number): void {
    const emails = this.getRegionalContactPersonEmails(officeIndex, personIndex);
    if (emails.length > 1) emails.removeAt(emailIndex);
  }

  addRegionalContactPerson(officeIndex: number): void {
    this.getRegionalContactPersons(officeIndex).push(this.createContactPersonGroup());
  }

  removeRegionalContactPerson(officeIndex: number, personIndex: number): void {
    this.getRegionalContactPersons(officeIndex).removeAt(personIndex);
  }

  addRegionalOffice(): void {
    this.regionalOffices.push(this.fb.group({
      city: [''],
      address: [''],
      phones: this.fb.array([['']]),
      emails: this.fb.array([['']]),
      contact_persons: this.fb.array([]),
      latitude: [33.6844],
      longitude: [73.0479]
    }));
  }

  removeRegionalOffice(index: number): void {
    this.regionalOffices.removeAt(index);
  }

  // ─── Map Methods ───

  initializeMaps(): void {
    const hqSection = this.contentForm.get('headquarters_section')?.value;
    if (hqSection && document.getElementById('hq-map')) {
      this.initializeHeadquartersMap(hqSection.latitude, hqSection.longitude);
    }

    const travelSection = this.contentForm.get('travel_office_section')?.value;
    if (travelSection && document.getElementById('travel-office-map')) {
      this.initializeTravelOfficeMap(travelSection.latitude, travelSection.longitude);
    }

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
      attribution: '\u00A9 OpenStreetMap contributors',
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
      attribution: '\u00A9 OpenStreetMap contributors',
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
      attribution: '\u00A9 OpenStreetMap contributors',
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

  // ─── Data Loading ───

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

  populateForm(content: any): void {
    this.contentForm.patchValue({
      page_title: content.page_title,
      headquarters_section: {
        title: content.headquarters_section?.title || 'Headquarters',
        icon: content.headquarters_section?.icon || '\u{1F3E2}',
        address: content.headquarters_section?.address || '',
        latitude: content.headquarters_section?.latitude || 33.6844,
        longitude: content.headquarters_section?.longitude || 73.0479
      },
      regional_offices_section: {
        title: content.regional_offices_section?.title || 'Regional Offices',
        icon: content.regional_offices_section?.icon || '\u{1F3DB}\uFE0F'
      },
      travel_office_section: {
        title: content.travel_office_section?.title || 'OEC Travel Office',
        icon: content.travel_office_section?.icon || '\u2708\uFE0F',
        address: content.travel_office_section?.address || '',
        latitude: content.travel_office_section?.latitude || 33.6844,
        longitude: content.travel_office_section?.longitude || 73.0479
      },
      feedback_section: {
        title: content.feedback_section?.title || 'Feedback',
        icon: content.feedback_section?.icon || '\u{1F4DD}',
        description: content.feedback_section?.description || ''
      },
      is_active: content.is_active
    });

    // Populate HQ phones (backward compat: old data has single 'phone')
    this.hqPhones.clear();
    const hqPhonesData = content.headquarters_section?.phones?.length
      ? content.headquarters_section.phones
      : (content.headquarters_section?.phone ? [content.headquarters_section.phone] : ['']);
    hqPhonesData.forEach((p: string) => this.hqPhones.push(new FormControl(p)));

    // Populate HQ emails
    this.hqEmails.clear();
    const hqEmailsData = content.headquarters_section?.emails?.length
      ? content.headquarters_section.emails
      : (content.headquarters_section?.email ? [content.headquarters_section.email] : ['']);
    hqEmailsData.forEach((e: string) => this.hqEmails.push(new FormControl(e)));

    // Populate HQ contact persons
    this.hqContactPersons.clear();
    if (content.headquarters_section?.contact_persons) {
      content.headquarters_section.contact_persons.forEach((cp: any) => {
        this.hqContactPersons.push(this.createContactPersonGroup(cp));
      });
    }

    // Populate Travel phones
    this.travelPhones.clear();
    const travelPhonesData = content.travel_office_section?.phones?.length
      ? content.travel_office_section.phones
      : (content.travel_office_section?.phone ? [content.travel_office_section.phone] : ['']);
    travelPhonesData.forEach((p: string) => this.travelPhones.push(new FormControl(p)));

    // Populate Travel emails
    this.travelEmails.clear();
    const travelEmailsData = content.travel_office_section?.emails?.length
      ? content.travel_office_section.emails
      : [''];
    travelEmailsData.forEach((e: string) => this.travelEmails.push(new FormControl(e)));

    // Populate Travel contact persons
    this.travelContactPersons.clear();
    if (content.travel_office_section?.contact_persons) {
      content.travel_office_section.contact_persons.forEach((cp: any) => {
        this.travelContactPersons.push(this.createContactPersonGroup(cp));
      });
    }

    // Populate regional offices
    this.regionalOffices.clear();
    if (content.regional_offices_section?.offices) {
      content.regional_offices_section.offices.forEach((office: any) => {
        const phonesData = office.phones?.length
          ? office.phones
          : (office.phone ? [office.phone] : ['']);
        const emailsData = office.emails?.length
          ? office.emails
          : (office.email ? [office.email] : ['']);

        const phonesArray = this.fb.array(phonesData.map((p: string) => new FormControl(p)));
        const emailsArray = this.fb.array(emailsData.map((e: string) => new FormControl(e)));

        const contactPersonsArray = this.fb.array(
          (office.contact_persons || []).map((cp: any) => this.createContactPersonGroup(cp))
        );

        this.regionalOffices.push(this.fb.group({
          city: [office.city || ''],
          address: [office.address || ''],
          phones: phonesArray,
          emails: emailsArray,
          contact_persons: contactPersonsArray,
          latitude: [office.latitude || 33.6844],
          longitude: [office.longitude || 73.0479]
        }));
      });
    }
  }

  initializeDefaultArrays(): void {
    this.addRegionalOffice();
  }

  // ─── Save ───

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
