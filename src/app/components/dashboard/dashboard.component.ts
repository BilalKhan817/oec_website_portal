// components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface DashboardCard {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  count?: number;
  loading?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardCards: DashboardCard[] = [
    {
      title: 'Announcements',
      subtitle: 'Manage site announcements and notifications',
      icon: 'campaign',
      route: '/announcements',
      loading: true
    },
    {
      title: 'Banners',
      subtitle: 'Control hero section banners and displays',
      icon: 'wallpaper',
      route: '/banners',
      loading: true
    },
    {
      title: 'About OEC',
      subtitle: 'Update company information and videos',
      icon: 'business',
      route: '/about-oec',
      loading: true
    },
    {
      title: 'Leadership',
      subtitle: 'Manage executive team profiles',
      icon: 'people',
      route: '/executives',
      loading: true
    },
    {
      title: 'Services',
      subtitle: 'Edit service offerings and descriptions',
      icon: 'miscellaneous_services',
      route: '/services',
      loading: true
    }
  ];

  totalAnnouncements = 0;
  activeBanners = 0;
  totalExecutives = 0;
  totalServices = 0;

  recentActivity = [
    { icon: 'add', type: 'create', text: 'New banner created', time: '2 hours ago' },
    { icon: 'edit', type: 'update', text: 'About OEC section updated', time: '4 hours ago' },
    { icon: 'person_add', type: 'create', text: 'Executive profile added', time: '1 day ago' },
    { icon: 'edit', type: 'update', text: 'Service description modified', time: '2 days ago' },
    { icon: 'delete', type: 'delete', text: 'Old announcement removed', time: '3 days ago' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load announcements count
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        this.totalAnnouncements = response.count || 0;
        const card = this.dashboardCards.find(c => c.route === '/announcements');
        if (card) {
          card.count = this.totalAnnouncements;
          card.loading = false;
        }
      },
      error: () => {
        const card = this.dashboardCards.find(c => c.route === '/announcements');
        if (card) {
          card.count = 0;
          card.loading = false;
        }
      }
    });

    // Load active banners count
    this.apiService.getActiveBanners().subscribe({
      next: (response) => {
        this.activeBanners = response.count || 0;
        const card = this.dashboardCards.find(c => c.route === '/banners');
        if (card) {
          card.count = this.activeBanners;
          card.loading = false;
        }
      },
      error: () => {
        const card = this.dashboardCards.find(c => c.route === '/banners');
        if (card) {
          card.count = 0;
          card.loading = false;
        }
      }
    });

    // Load executives count
    this.apiService.getExecutives().subscribe({
      next: (response) => {
        this.totalExecutives = response.count || 0;
        const card = this.dashboardCards.find(c => c.route === '/executives');
        if (card) {
          card.count = this.totalExecutives;
          card.loading = false;
        }
      },
      error: () => {
        const card = this.dashboardCards.find(c => c.route === '/executives');
        if (card) {
          card.count = 0;
          card.loading = false;
        }
      }
    });

    // Load services count
    this.apiService.getServices().subscribe({
      next: (response) => {
        this.totalServices = response.data?.services?.length || 0;
        const card = this.dashboardCards.find(c => c.route === '/services');
        if (card) {
          card.count = this.totalServices;
          card.loading = false;
        }
      },
      error: () => {
        const card = this.dashboardCards.find(c => c.route === '/services');
        if (card) {
          card.count = 0;
          card.loading = false;
        }
      }
    });

    // Load about OEC status
    this.apiService.getAboutOec().subscribe({
      next: () => {
        const card = this.dashboardCards.find(c => c.route === '/about-oec');
        if (card) {
          card.count = 1;
          card.loading = false;
        }
      },
      error: () => {
        const card = this.dashboardCards.find(c => c.route === '/about-oec');
        if (card) {
          card.count = 0;
          card.loading = false;
        }
      }
    });
  }

  navigateToModule(route: string): void {
    this.router.navigate([route]);
  }
}