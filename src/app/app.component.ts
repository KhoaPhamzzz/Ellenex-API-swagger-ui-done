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

  // Constructor to inject necessary dependencies
  constructor(
    private http: HttpClient, // HttpClient for making HTTP requests
    @Inject(PLATFORM_ID) private platformId: Object // PLATFORM_ID to check the platform (browser or server)
  ) {}

  // Lifecycle hook that runs after Angular has fully initialized the view
  ngAfterViewInit() {
    // Ensures the code runs only in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadApiSpec(); // Calls the function to load the API specification
    }
  }

  // Function to load the API specification from a JSON file
  loadApiSpec() {
    // Fetches the API specification from a JSON file
    this.http.get<any>('./assets/ellenex-api.json').subscribe(data => {
      this.apiSections = this.extractTagGroups(data); // Processes the data to extract API sections
      // Initializes SwaggerUI with the fetched API specification
      SwaggerUI({
        dom_id: '#swagger-ui', // The DOM element where SwaggerUI will be rendered
        spec: data // The API specification data
      });
    });
  }

  // Function to extract tag groups from the API data
  extractTagGroups(data: any): { tag: string, name: string, id: string }[] { 
    const sections: { tag: string, name: string, id: string }[] = [];
    // Iterates over the tag groups in the API data
    for (const group of data['x-tagGroups'] || []) {   
      for (const tag of group.tags) {
        // Adds each tag to the sections array
        sections.push({ tag: tag, name: tag, id: `operations-tag-${tag}` });
      }
    }
    return sections;
  }

  // Function to handle navigation to a specific API tag
  navigateToTag(tag: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation(); // This command is very important for  fixing the navigate to top after click 2nd time.
    this.selectedTag = tag; // Sets the currently selected tag
    const targetId = `operations-tag-${tag}`;
    setTimeout(() => {
      // Scrolls to the element corresponding to the selected tag
      const element = document.querySelector(`#${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scrolling effect
      }
    }, 300);
  }

  // Function to navigate to the API models section
  navigateToModels(event: MouseEvent): void {
    event.preventDefault();
    this.selectedTag = 'schemas';
    const modelsElement = document.querySelector('.models-control');
    if (modelsElement) {
      // Scrolls to the models section within Swagger UI
      modelsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
