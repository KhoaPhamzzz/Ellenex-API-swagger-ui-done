import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,      // Common module for *ngFor and other common directives
    HttpClientModule   // Import HttpClientModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'API-swagger-ui';
  apiSections: { tag: string, name: string }[] = [];

  constructor(
    private el: ElementRef, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadApiSpec();
    }
  }

  loadApiSpec() {
    this.http.get<any>('./assets/ellenex-api.json').subscribe(data => {
      this.apiSections = this.extractSections(data);
      SwaggerUI({
        dom_id: '#swagger-ui',
        spec: data
      });
    });
  }

  extractSections(data: any): { tag: string, name: string }[] {
    const sections: { tag: string, name: string }[] = [];
    for (const [tag, section] of Object.entries(data.paths || {})) {
      const name = (section as any)?.get?.summary || '';
      sections.push({ tag, name });
    }
    return sections;
  }

  navigateToTag(tag: string, event: MouseEvent): void {
    event.preventDefault(); // Prevent the default anchor behavior
    
    const element = document.querySelector(`#path-${tag.replace(/\//g, '-')}`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the element
    }
  }
}
