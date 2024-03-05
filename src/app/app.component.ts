import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import SwaggerUI from 'swagger-ui';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Define the interface for each API section
interface ApiSection {
  tag: string;
  name: string;
  customName?: string; // Optional property for custom names
}

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
  apiSections: ApiSection[] = []; // Use the ApiSection interface here
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
    this.http.get<any>('./assets/ellenex-api.json').subscribe(data => {  // import json file
      let sections: ApiSection[] = this.extractTagGroups(data);

      // Assign custom names to each section on side nav
      if (sections.length > 0) sections[0].customName = 'DEVICE INVENTORY';
      if (sections.length > 1) sections[1].customName = 'ALERT RULES';
      if (sections.length > 2) sections[2].customName = 'DATA NOTIFICATIONS';
      if (sections.length > 3) sections[3].customName = 'DATA PROCESSING';
      if (sections.length > 4) sections[4].customName = 'DATA STORE';
      if (sections.length > 5) sections[5].customName = 'USER & SUBSCRIPTION MANAGEMENT';
      // ... add more as needed

      this.apiSections = sections;

      SwaggerUI({
        dom_id: '#swagger-ui',
        spec: data
      });
    });
  }

  extractTagGroups(data: any): ApiSection[] {     // get tag  name based on from json file and display to list
    const sections: ApiSection[] = [];
    for (const group of data['x-tagGroups'] || []) {   
      for (const tag of group.tags) {
        sections.push({ tag: tag, name: tag });
      }
    }
    return sections;
  }

  // Uncomment the code below for default Open API specification tags with Ctrl + / 

  // extractTagGroups(data: any): ApiSection[] {
  //   const sections: ApiSection[] = [];
  //   for (const tag of data.tags || []) {   
  //     sections.push({ tag: tag.name, name: tag.description });
  //   }
  //   return sections;
  // }
  

  navigateToTag(tag: string, event: MouseEvent): void {  // navigation based on perations-tag-tag of swagger UI
    event.preventDefault();
    event.stopPropagation(); // prevent the page from going to ttop when  click 2nd time
    this.selectedTag = tag;
    const targetId = `operations-tag-${tag}`;
    setTimeout(() => {
      const element = document.querySelector(`#${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  navigateToModels(event: MouseEvent): void {  // navigate to schemas  sections
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
