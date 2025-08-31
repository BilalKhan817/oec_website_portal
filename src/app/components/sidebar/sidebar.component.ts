// components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      description: 'Overview & analytics'
    },
    {
      title: 'Announcements',
      icon: 'campaign',
      route: '/announcements',
      description: 'Manage announcements'
    },
    {
      title: 'Banners',
      icon: 'wallpaper',
      route: '/banners',
      description: 'Hero section banners'
    },
    {
      title: 'About OEC',
      icon: 'business',
      route: '/about-oec',
      description: 'Company information'
    },
    {
      title: 'Leadership',
      icon: 'people',
      route: '/executives',
      description: 'Executive team'
    },
    {
      title: 'Board of Directors',
      icon: 'groups',
      route: '/board-directors',
      description: 'Board members'
    },
    {
      title: 'Services',
      icon: 'miscellaneous_services',
      route: '/services',
      description: 'Service offerings'
    },
    {
      title: 'API Docs',
      icon: 'api',
      route: '/api',
      description: 'API documentation'
    }
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}