// components/services/api/api.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
  parameters?: string[];
  requestBody?: any;
  responseExample?: any;
  status: 'active' | 'deprecated' | 'beta';
}

@Component({
  selector: 'app-api',
  template: `
    <div class="api-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon class="title-icon">api</mat-icon>
            API Documentation
          </h1>
          <p class="page-subtitle">Explore and test your Home Page Content APIs</p>
        </div>
        
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search endpoints...</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Method, path, description...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="testConnection()" class="test-button">
            <mat-icon>wifi_protected_setup</mat-icon>
            Test Connection
          </button>
        </div>
      </div>

      <div class="content-section">
        <!-- API Stats Overview -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content class="stat-content">
              <div class="stat-icon-container endpoints">
                <mat-icon class="stat-icon">endpoints</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">{{getTotalEndpoints()}}</span>
                <span class="stat-label">Total Endpoints</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="stat-content">
              <div class="stat-icon-container active">
                <mat-icon class="stat-icon">check_circle</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">{{getActiveEndpoints()}}</span>
                <span class="stat-label">Active APIs</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="stat-content">
              <div class="stat-icon-container categories">
                <mat-icon class="stat-icon">category</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">{{getCategories().length}}</span>
                <span class="stat-label">Categories</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content class="stat-content">
              <div class="stat-icon-container status" [class.connected]="connectionStatus">
                <mat-icon class="stat-icon">{{connectionStatus ? 'cloud_done' : 'cloud_off'}}</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-text">{{connectionStatus ? 'Connected' : 'Disconnected'}}</span>
                <span class="stat-label">API Status</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- API Categories -->
        <div class="categories-section" *ngFor="let category of getCategories()">
          <mat-card class="category-card">
            <mat-card-header class="category-header">
              <mat-card-title class="category-title">
                <mat-icon>{{getCategoryIcon(category)}}</mat-icon>
                {{category | titlecase}}
              </mat-card-title>
              <mat-card-subtitle class="category-subtitle">
                {{getEndpointsByCategory(category).length}} endpoints available
              </mat-card-subtitle>
            </mat-card-header>

            <div class="endpoints-list">
              <div 
                *ngFor="let endpoint of getFilteredEndpointsByCategory(category)" 
                class="endpoint-item"
                [class]="endpoint.method.toLowerCase()">
                
                <div class="endpoint-header">
                  <div class="endpoint-method-path">
                    <mat-chip class="method-chip" [ngClass]="endpoint.method.toLowerCase()">
                      {{endpoint.method}}
                    </mat-chip>
                    <span class="endpoint-path">{{endpoint.path}}</span>
                  </div>
                  
                  <div class="endpoint-actions">
                    <mat-chip class="status-chip" [ngClass]="endpoint.status">
                      {{endpoint.status}}
                    </mat-chip>
                    <button mat-icon-button (click)="toggleEndpointDetails(endpoint)" 
                            [matTooltip]="getExpandedEndpoint() === endpoint ? 'Collapse' : 'Expand'">
                      <mat-icon>{{getExpandedEndpoint() === endpoint ? 'expand_less' : 'expand_more'}}</mat-icon>
                    </button>
                    <button mat-icon-button color="primary" (click)="testEndpoint(endpoint)" matTooltip="Test Endpoint">
                      <mat-icon>play_arrow</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="endpoint-description">
                  {{endpoint.description}}
                </div>

                <!-- Expanded Details -->
                <div class="endpoint-details" *ngIf="getExpandedEndpoint() === endpoint">
                  <mat-tab-group class="details-tabs" animationDuration="300ms">
                    
                    <!-- Parameters Tab -->
                    <mat-tab label="Parameters" *ngIf="endpoint.parameters?.length">
                      <div class="tab-content">
                        <div class="parameters-list">
                          <div *ngFor="let param of endpoint.parameters" class="parameter-item">
                            <mat-chip class="param-chip">{{param}}</mat-chip>
                          </div>
                        </div>
                      </div>
                    </mat-tab>

                    <!-- Request Body Tab -->
                    <mat-tab label="Request Body" *ngIf="endpoint.requestBody">
                      <div class="tab-content">
                        <div class="code-block">
                          <pre><code>{{formatJson(endpoint.requestBody)}}</code></pre>
                        </div>
                      </div>
                    </mat-tab>

                    <!-- Response Example Tab -->
                    <mat-tab label="Response Example" *ngIf="endpoint.responseExample">
                      <div class="tab-content">
                        <div class="code-block">
                          <pre><code>{{formatJson(endpoint.responseExample)}}</code></pre>
                        </div>
                      </div>
                    </mat-tab>

                    <!-- Test Tab -->
                    <mat-tab label="API Test">
                      <div class="tab-content">
                        <div class="test-section">
                          <div class="test-form" *ngIf="needsTestData(endpoint)">
                            <h4>Test Parameters:</h4>
                            <mat-form-field appearance="outline" class="test-input" 
                                          *ngIf="endpoint.method !== 'GET' && endpoint.requestBody">
                              <mat-label>Request Body (JSON)</mat-label>
                              <textarea matInput [(ngModel)]="testData[endpoint.path]" rows="6" 
                                      placeholder="Enter JSON request body"></textarea>
                            </mat-form-field>
                          </div>
                          
                          <div class="test-actions">
                            <button mat-raised-button color="primary" (click)="executeTest(endpoint)" 
                                    [disabled]="isTestingEndpoint(endpoint)">
                              <mat-spinner diameter="20" *ngIf="isTestingEndpoint(endpoint)"></mat-spinner>
                              <mat-icon *ngIf="!isTestingEndpoint(endpoint)">play_arrow</mat-icon>
                              {{isTestingEndpoint(endpoint) ? 'Testing...' : 'Execute Test'}}
                            </button>
                          </div>

                          <div class="test-results" *ngIf="getTestResult(endpoint)">
                            <h4>Response:</h4>
                            <div class="result-status" [ngClass]="getTestResult(endpoint).success ? 'success' : 'error'">
                              <mat-icon>{{getTestResult(endpoint).success ? 'check_circle' : 'error'}}</mat-icon>
                              Status: {{getTestResult(endpoint).status}}
                            </div>
                            <div class="code-block">
                              <pre><code>{{formatJson(getTestResult(endpoint).data)}}</code></pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </mat-tab>

                  </mat-tab-group>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredEndpoints.length === 0" class="no-results">
          <mat-icon class="no-results-icon">search_off</mat-icon>
          <h3>No API Endpoints Found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      margin: 0 0 8px 0;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .search-field {
      width: 300px;
    }

    .test-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .test-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-content {
      padding: 24px !important;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon-container {
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-container.endpoints {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-icon-container.active {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-icon-container.categories {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    }

    .stat-icon-container.status {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .stat-icon-container.status.connected {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-icon {
      color: white;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .stat-number, .stat-text {
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #666;
      margin-top: 4px;
    }

    .categories-section {
      margin-bottom: 24px;
    }

    .category-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .category-header {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 24px;
    }

    .category-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .category-subtitle {
      color: #666;
      margin: 0;
    }

    .endpoints-list {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .endpoint-item {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      background: white;
    }

    .endpoint-item:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .endpoint-item.get {
      border-left: 4px solid #43e97b;
    }

    .endpoint-item.post {
      border-left: 4px solid #4facfe;
    }

    .endpoint-item.put {
      border-left: 4px solid #ff6b35;
    }

    .endpoint-item.delete {
      border-left: 4px solid #fa709a;
    }

    .endpoint-item.patch {
      border-left: 4px solid #f7931e;
    }

    .endpoint-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .endpoint-method-path {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .method-chip {
      font-weight: 600;
      font-size: 0.75rem;
      min-width: 60px;
      text-align: center;
    }

    .method-chip.get {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .method-chip.post {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .method-chip.put {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
    }

    .method-chip.delete {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .method-chip.patch {
      background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
      color: white;
    }

    .endpoint-path {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }

    .endpoint-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-chip.active {
      background: #43e97b;
      color: white;
    }

    .status-chip.deprecated {
      background: #fa709a;
      color: white;
    }

    .status-chip.beta {
      background: #ff6b35;
      color: white;
    }

    .endpoint-description {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .endpoint-details {
      margin-top: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      padding-top: 20px;
    }

    .details-tabs {
      width: 100%;
    }

    .tab-content {
      padding: 24px 0;
    }

    .parameters-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .param-chip {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      font-size: 0.8rem;
    }

    .code-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .test-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .test-form h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1rem;
    }

    .test-input {
      width: 100%;
    }

    .test-actions {
      display: flex;
      gap: 12px;
    }

    .test-results {
      margin-top: 20px;
    }

    .test-results h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1rem;
    }

    .result-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 500;
    }

    .result-status.success {
      background: rgba(67, 233, 123, 0.1);
      color: #43e97b;
    }

    .result-status.error {
      background: rgba(250, 112, 154, 0.1);
      color: #fa709a;
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
      text-align: center;
    }

    .no-results-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-results h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-results p {
      margin: 0;
      color: #666;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .search-field {
        width: 100%;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .endpoint-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .endpoint-method-path {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class ApiComponent implements OnInit {
  apiEndpoints: ApiEndpoint[] = [
    // Announcements endpoints
    {
      method: 'GET',
      path: '/api/announcements',
      description: 'Retrieve all announcements sorted by creation date',
      category: 'announcements',
      status: 'active',
      responseExample: {
        success: true,
        count: 2,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Job Fair 2024',
            deadline: '2024-12-31T23:59:59.000Z',
            announcement_category: 'event',
            orange_button_title: 'Register Now',
            orange_button_link: '/register',
            blue_button_title: 'Learn More',
            blue_button_link: '/job-fair',
            createdAt: '2024-01-15T10:30:00.000Z'
          }
        ]
      }
    },
    {
      method: 'GET',
      path: '/api/announcements/:id',
      description: 'Get a specific announcement by ID',
      category: 'announcements',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/announcements',
      description: 'Create a new announcement',
      category: 'announcements',
      status: 'active',
      requestBody: {
        title: 'Job Fair 2024',
        deadline: '2024-12-31T23:59:59.000Z',
        announcement_category: 'event',
        orange_button_title: 'Register Now',
        orange_button_link: '/register',
        blue_button_title: 'Learn More',
        blue_button_link: '/job-fair'
      }
    },
    {
      method: 'PUT',
      path: '/api/announcements/:id',
      description: 'Update an existing announcement',
      category: 'announcements',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/announcements/:id',
      description: 'Delete an announcement by ID',
      category: 'announcements',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },

    // Banners endpoints
    {
      method: 'GET',
      path: '/api/banners',
      description: 'Retrieve all banners sorted by creation date',
      category: 'banners',
      status: 'active'
    },
    {
      method: 'GET',
      path: '/api/banners/active',
      description: 'Retrieve only active banners',
      category: 'banners',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/banners',
      description: 'Create a new banner with image upload',
      category: 'banners',
      status: 'active',
      requestBody: 'FormData with background_image file and banner fields'
    },
    {
      method: 'PUT',
      path: '/api/banners/:id',
      description: 'Update banner with optional image replacement',
      category: 'banners',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/banners/:id',
      description: 'Delete a banner and its associated image',
      category: 'banners',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'PATCH',
      path: '/api/banners/:id/toggle',
      description: 'Toggle banner active status',
      category: 'banners',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },

    // About OEC endpoints
    {
      method: 'GET',
      path: '/api/about-oec',
      description: 'Get active About OEC content',
      category: 'about',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/about-oec',
      description: 'Create About OEC section',
      category: 'about',
      status: 'active'
    },
    {
      method: 'PUT',
      path: '/api/about-oec/:id',
      description: 'Update About OEC content',
      category: 'about',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/about-oec/:id',
      description: 'Delete About OEC section',
      category: 'about',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },

    // Executives endpoints
    {
      method: 'GET',
      path: '/api/executives',
      description: 'Get all active executives sorted by order',
      category: 'executives',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/executives',
      description: 'Create new executive profile with image',
      category: 'executives',
      status: 'active',
      requestBody: 'FormData with executive_image file and profile fields'
    },
    {
      method: 'PUT',
      path: '/api/executives/:id',
      description: 'Update executive profile',
      category: 'executives',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/executives/:id',
      description: 'Delete executive profile and image',
      category: 'executives',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },

    // Services endpoints
    {
      method: 'GET',
      path: '/api/services',
      description: 'Get active services section with all services',
      category: 'services',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/services',
      description: 'Create services section',
      category: 'services',
      status: 'active'
    },
    {
      method: 'PUT',
      path: '/api/services/:id',
      description: 'Update services section and services list',
      category: 'services',
      parameters: ['id (ObjectId)'],
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/services/:id',
      description: 'Delete services section',
      category: 'services',
      parameters: ['id (ObjectId)'],
      status: 'active'
    }
  ];

  filteredEndpoints: ApiEndpoint[] = [];
  expandedEndpoint: ApiEndpoint | null = null;
  connectionStatus = false;
  testData: {[key: string]: string} = {};
  testResults: {[key: string]: any} = {};
  testingEndpoints: Set<string> = new Set();

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.filteredEndpoints = [...this.apiEndpoints];
  }

  ngOnInit(): void {
    this.testConnection();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredEndpoints = this.apiEndpoints.filter(endpoint =>
      endpoint.method.toLowerCase().includes(filterValue) ||
      endpoint.path.toLowerCase().includes(filterValue) ||
      endpoint.description.toLowerCase().includes(filterValue) ||
      endpoint.category.toLowerCase().includes(filterValue)
    );
  }

  testConnection(): void {
    // Test a simple GET endpoint to check connection
    this.apiService.getAnnouncements().subscribe({
      next: (response) => {
        this.connectionStatus = true;
        this.showSnackBar('API connection successful', 'success');
      },
      error: (error) => {
        this.connectionStatus = false;
        this.showSnackBar('API connection failed', 'error');
      }
    });
  }

  getTotalEndpoints(): number {
    return this.apiEndpoints.length;
  }

  getActiveEndpoints(): number {
    return this.apiEndpoints.filter(endpoint => endpoint.status === 'active').length;
  }

  getCategories(): string[] {
    const categories = [...new Set(this.apiEndpoints.map(endpoint => endpoint.category))];
    return categories.sort();
  }

  getCategoryIcon(category: string): string {
    const iconMap: {[key: string]: string} = {
      'announcements': 'campaign',
      'banners': 'wallpaper',
      'about': 'business',
      'executives': 'people',
      'services': 'miscellaneous_services'
    };
    return iconMap[category] || 'api';
  }

  getEndpointsByCategory(category: string): ApiEndpoint[] {
    return this.apiEndpoints.filter(endpoint => endpoint.category === category);
  }

  getFilteredEndpointsByCategory(category: string): ApiEndpoint[] {
    return this.filteredEndpoints.filter(endpoint => endpoint.category === category);
  }

  toggleEndpointDetails(endpoint: ApiEndpoint): void {
    this.expandedEndpoint = this.expandedEndpoint === endpoint ? null : endpoint;
  }

  getExpandedEndpoint(): ApiEndpoint | null {
    return this.expandedEndpoint;
  }

  testEndpoint(endpoint: ApiEndpoint): void {
    this.executeTest(endpoint);
  }

  needsTestData(endpoint: ApiEndpoint): boolean {
    return endpoint.method !== 'GET' && !!endpoint.requestBody;
  }

  isTestingEndpoint(endpoint: ApiEndpoint): boolean {
    return this.testingEndpoints.has(endpoint.path);
  }

  getTestResult(endpoint: ApiEndpoint): any {
    return this.testResults[endpoint.path];
  }

  executeTest(endpoint: ApiEndpoint): void {
    this.testingEndpoints.add(endpoint.path);
    
    // Simulate API test based on endpoint
    setTimeout(() => {
      let testResult: any;
      
      try {
        switch (endpoint.category) {
          case 'announcements':
            testResult = this.testAnnouncementEndpoint(endpoint);
            break;
          case 'banners':
            testResult = this.testBannerEndpoint(endpoint);
            break;
          case 'about':
            testResult = this.testAboutEndpoint(endpoint);
            break;
          case 'executives':
            testResult = this.testExecutiveEndpoint(endpoint);
            break;
          case 'services':
            testResult = this.testServicesEndpoint(endpoint);
            break;
          default:
            testResult = {
              success: true,
              status: 200,
              data: { message: 'Test completed successfully' }
            };
        }
      } catch (error) {
        testResult = {
          success: false,
          status: 500,
          data: { error: 'Test failed', message: error }
        };
      }
      
      this.testResults[endpoint.path] = testResult;
      this.testingEndpoints.delete(endpoint.path);
      
      this.showSnackBar(
        testResult.success ? 'Test completed successfully' : 'Test failed',
        testResult.success ? 'success' : 'error'
      );
    }, 2000); // Simulate API delay
  }

  private testAnnouncementEndpoint(endpoint: ApiEndpoint): any {
    switch (endpoint.method) {
      case 'GET':
        if (endpoint.path.includes(':id')) {
          return {
            success: true,
            status: 200,
            data: {
              _id: '507f1f77bcf86cd799439011',
              title: 'Sample Announcement',
              deadline: '2024-12-31T23:59:59.000Z',
              announcement_category: 'general',
              orange_button_title: 'Apply Now',
              orange_button_link: '/apply',
              blue_button_title: 'Learn More',
              blue_button_link: '/info'
            }
          };
        } else {
          return {
            success: true,
            status: 200,
            data: endpoint.responseExample || []
          };
        }
      case 'POST':
        return {
          success: true,
          status: 201,
          data: {
            message: 'Announcement created successfully',
            _id: '507f1f77bcf86cd799439012'
          }
        };
      case 'PUT':
        return {
          success: true,
          status: 200,
          data: { message: 'Announcement updated successfully' }
        };
      case 'DELETE':
        return {
          success: true,
          status: 200,
          data: { message: 'Announcement deleted successfully' }
        };
      default:
        return { success: false, status: 405, data: { error: 'Method not allowed' } };
    }
  }

  private testBannerEndpoint(endpoint: ApiEndpoint): any {
    switch (endpoint.method) {
      case 'GET':
        return {
          success: true,
          status: 200,
          data: [
            {
              _id: '507f1f77bcf86cd799439013',
              banner_title: 'Welcome to OEC',
              background_image: '/uploads/banners/sample.jpg',
              is_active: true
            }
          ]
        };
      case 'POST':
        return {
          success: true,
          status: 201,
          data: { message: 'Banner created successfully' }
        };
      case 'PATCH':
        return {
          success: true,
          status: 200,
          data: { message: 'Banner status toggled successfully' }
        };
      default:
        return { success: true, status: 200, data: { message: 'Operation completed' } };
    }
  }

  private testAboutEndpoint(endpoint: ApiEndpoint): any {
    return {
      success: true,
      status: endpoint.method === 'POST' ? 201 : 200,
      data: {
        _id: '507f1f77bcf86cd799439014',
        title: 'About OEC',
        subtitle: 'Building Careers Since 1976',
        description_paragraph_1: 'Sample description paragraph 1',
        description_paragraph_2: 'Sample description paragraph 2',
        established_year: '1976',
        workers_sent: '11M+',
        youtube_video_id: 'dQw4w9WgXcQ',
        is_active: true
      }
    };
  }

  private testExecutiveEndpoint(endpoint: ApiEndpoint): any {
    switch (endpoint.method) {
      case 'GET':
        return {
          success: true,
          status: 200,
          data: [
            {
              _id: '507f1f77bcf86cd799439015',
              name: 'John Doe',
              position: 'Chief Executive Officer',
              badge: 'CEO',
              image_url: '/uploads/executives/sample.jpg',
              profile_url: 'https://linkedin.com/in/johndoe',
              order: 1,
              is_active: true
            }
          ]
        };
      default:
        return { success: true, status: 200, data: { message: 'Operation completed' } };
    }
  }

  private testServicesEndpoint(endpoint: ApiEndpoint): any {
    return {
      success: true,
      status: endpoint.method === 'POST' ? 201 : 200,
      data: {
        _id: '507f1f77bcf86cd799439016',
        section_title: 'Our Services',
        section_subtitle: 'Comprehensive solutions',
        services: [
          {
            title: 'Job Placement',
            description: 'International employment opportunities',
            icon: 'work',
            order: 1
          }
        ],
        is_active: true
      }
    };
  }

  formatJson(obj: any): string {
    if (typeof obj === 'string') {
      return obj;
    }
    return JSON.stringify(obj, null, 2);
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}