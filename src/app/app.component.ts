// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
  <mat-toolbar class="app-toolbar">
    <button mat-icon-button (click)="drawer.toggle()" class="menu-button">
      <mat-icon>menu</mat-icon>
    </button>
    <span class="app-title">
      <mat-icon class="title-icon">dashboard</mat-icon>
      OEC Admin Dashboard
    </span>
    <span class="spacer"></span>
    <button mat-icon-button>
      <mat-icon>account_circle</mat-icon>
    </button>
  </mat-toolbar>

  <mat-sidenav-container class="sidenav-container">
    <mat-sidenav #drawer class="sidenav" mode="side" opened>
      <app-sidebar></app-sidebar>
    </mat-sidenav>
    
    <mat-sidenav-content class="main-content">
      <div class="content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
</div>
  `,
  styles: [`
   /* src/app/app.component.css - Clean Professional Override */

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc !important; /* Clean gray background */
}

.app-toolbar {
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  background: #059669 !important; /* Professional green */
  color: white !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-title {
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white !important;
}

.title-icon {
  color: #22c55e !important;
  font-size: 1.5rem;
}

.spacer {
  flex: 1 1 auto;
}

.menu-button {
  margin-right: 16px;
  color: white !important;
}

.sidenav-container {
  flex: 1;
  margin-top: 64px;
  background: #f8fafc !important; /* Clean background */
}

.sidenav {
  width: 280px;
  border-right: 1px solid #e2e8f0 !important;
  background: white !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.main-content {
  background: #f8fafc !important; /* Override any gradient */
  min-height: calc(100vh - 64px);
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 112px);
  background: transparent !important;
}

/* User profile button styling */
.app-toolbar .mat-icon-button {
  color: white !important;
}

.app-toolbar .mat-icon-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 768px) {
  .sidenav {
    width: 240px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .app-title {
    font-size: 1rem;
  }
}
  `]
})
export class AppComponent {
  title = 'OEC Admin Dashboard';
}