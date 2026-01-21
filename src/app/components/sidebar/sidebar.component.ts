// components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SubMenuItem {
  title: string;
  route?: string;
  expanded?: boolean;
  submenu?: SubMenuItem[];
}

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  description: string;
  expanded?: boolean;
  submenu?: SubMenuItem[];
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
      title: 'Navbar Management',
      icon: 'view_list',
      description: 'Manage navigation & descriptions',
      expanded: false,
      submenu: [
        {
          title: 'About Us Pages',
          expanded: false,
          submenu: [
            { title: 'About OEC', route: '/about-us/about-oec' },
            { title: 'Governing Law', route: '/about-us/governing-law' },
            { title: 'OEC at a Glance', route: '/about-us/oec-at-glance' },
            { title: 'Our Functions', route: '/about-us/our-functions' },
            { title: 'Leadership', route: '/about-us/our-executives' },
            { title: 'Mission & Vision', route: '/about-us/mission-vision' },
            { title: 'Achievements', route: '/about-us/achievements' },
            { title: 'Why Choose OEC', route: '/about-us/why-choose-oec' }
          ]
        },
        {
          title: 'Emigrants',
          expanded: false,
          submenu: [
            { title: 'EPS Korea', route: '/emigrants/eps-korea' },
            { title: 'Labour Contracts', route: '/emigrants/labour-contracts' },
            { title: 'EPS Results', route: '/emigrants/eps-results' },
            { title: 'Services', route: '/emigrants/service-agreements' },
            { title: 'Industries', route: '/emigrants/industries' }
          ]
        },
        {
          title: 'Development Hub',
          route: '/development-hub/boxes'
        },
        {
          title: 'Media Center',
          expanded: false,
          submenu: [
            { title: 'Latest Announcements', route: '/media-center/latest-announcements' },
            { title: 'Press Releases', route: '/media-center/press-releases' },
            { title: 'News Highlights', route: '/media-center/news-highlights' },
            { title: 'Events', route: '/media-center/events' }
          ]
        },
        {
          title: 'Contact Us',
          expanded: false,
          submenu: [
            { title: 'Headquarters', route: '/contact-us/headquarters' },
            { title: 'Travel Office', route: '/contact-us/travel-office' },
            { title: 'Regional Offices', route: '/contact-us/regional-offices' },
            { title: 'Contact Form Settings', route: '/contact-us/contact-form' }
          ]
        }
      ]
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

  toggleSubmenu(item: MenuItem | SubMenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isParentActive(item: MenuItem): boolean {
    if (item.submenu) {
      return item.submenu.some(subItem => this.router.url === subItem.route);
    }
    return false;
  }
}