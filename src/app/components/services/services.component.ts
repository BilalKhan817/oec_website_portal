// components/services/services.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, Services, Service } from '../../services/api.service';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  servicesData: Services | null = null;
  filteredServices: Service[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.apiService.getServices().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.servicesData = response.data;
          this.filteredServices = [...(this.servicesData.services || [])];
          this.applyCurrentFilter();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.servicesData = null;
        this.filteredServices = [];
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = filterValue;
    this.applyCurrentFilter();
  }

  applyCurrentFilter(): void {
    if (!this.servicesData || !this.servicesData.services) return;
    
    this.filteredServices = this.servicesData.services.filter(service => 
      service.title.toLowerCase().includes(this.searchTerm) ||
      service.description.toLowerCase().includes(this.searchTerm) ||
      service.icon.toLowerCase().includes(this.searchTerm)
    );
  }

  refreshData(): void {
    this.loadServices();
    this.showSnackBar('Data refreshed successfully');
  }

  editSection(): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { type: 'section', servicesData: this.servicesData },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
        this.showSnackBar('Services section updated successfully');
      }
    });
  }

  openServiceDialog(service?: Service, index?: number): void {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { 
        type: 'service', 
        service: service || null, 
        index: index,
        servicesData: this.servicesData 
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
        this.showSnackBar(
          service ? 'Service updated successfully' : 'Service added successfully'
        );
      }
    });
  }

  deleteService(index: number): void {
    if (!this.servicesData || !this.servicesData.services) return;

    const service = this.servicesData.services[index];
    if (confirm(`Are you sure you want to delete the service "${service.title}"?`)) {
      const updatedServices = [...this.servicesData.services];
      updatedServices.splice(index, 1);

      const updateData = {
        ...this.servicesData,
        services: updatedServices
      };

      this.apiService.updateServices(this.servicesData._id!, updateData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadServices();
            this.showSnackBar('Service deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.showSnackBar('Error deleting service', 'error');
        }
      });
    }
  }

  createInitialServices(): void {
    const initialData: Services = {
      section_title: 'Our Services',
      section_subtitle: 'Comprehensive employment solutions for job seekers and employers',
      services: [
        {
          title: 'Job Placement',
          description: 'Connect with international employment opportunities',
          icon: 'work',
          order: 1
        }
      ],
      is_active: true
    };

    this.apiService.createServices(initialData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadServices();
          this.showSnackBar('Services section created successfully');
        }
      },
      error: (error) => {
        console.error('Error creating services:', error);
        this.showSnackBar('Error creating services section', 'error');
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}