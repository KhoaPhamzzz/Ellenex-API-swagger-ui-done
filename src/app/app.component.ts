import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import SwaggerUI from 'swagger-ui';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'API-swagger-ui';
  apiSections: { tag: string, name: string }[] = [];
  selectedTag: string | null = null;
  isSideNavVisible: boolean = false; // Added for responsiveness

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadApiSpec();
    }
  }

  loadApiSpec() {
    this.http.get<any>('./assets/ellenex-api.json').subscribe(data => {
      this.apiSections = this.extractTagGroups(data);
      SwaggerUI({
        dom_id: '#swagger-ui',
        spec: data
      });
    });
  }

  extractTagGroups(data: any): { tag: string, name: string, id: string }[] { 
    const sections: { tag: string, name: string, id: string }[] = [];
    for (const group of data['x-tagGroups'] || []) {   
      for (const tag of group.tags) {
        sections.push({ tag: tag, name: tag, id: `operations-tag-${tag}` });
      }
    }
    return sections;
  }

  navigateToTag(tag: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedTag = tag;
    const targetId = `operations-tag-${tag}`;
    setTimeout(() => {
      const element = document.querySelector(`#${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  navigateToModels(event: MouseEvent): void {
    event.preventDefault();
    this.selectedTag = 'schemas';
    const modelsElement = document.querySelector('.models-control');
    if (modelsElement) {
      modelsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // New method to toggle side navigation
  toggleSideNav() {
    this.isSideNavVisible = !this.isSideNavVisible;
  }
}
