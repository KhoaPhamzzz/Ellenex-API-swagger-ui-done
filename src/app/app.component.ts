import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import SwaggerUI from 'swagger-ui';
import { CommonModule } from '@angular/common'; // Import CommonModule for common directives
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // CommonModule for *ngFor and other common directives
    HttpClientModule // HttpClientModule for HTTP operations
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'API-swagger-ui';
  apiSections: { tag: string, name: string }[] = []; //  declare array here - used to display list items
  titleName = "AK IS THE GOAT"

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
      this.apiSections = this.extractTagGroups(data); // 
      SwaggerUI({
        dom_id: '#swagger-ui',
        spec: data
      });
    });
  }

  extractTagGroups(data: any): { tag: string, name: string, id: string }[] { // gets tags in ellenex-api.json
    const sections: { tag: string, name: string, id: string }[] = [];

    for (const group of data['x-tagGroups'] || []) {   // gets the group from Xtagname it would not work if json file does not have this.
      for (const tag of group.tags) {
        sections.push({ tag: tag, name: tag, id: `operations-tag-${tag}` });
      }
    }

    return sections; // return array of objects to be used in apiSections
  }

  // Modify this function to navigate to the new ID
  navigateToTag(tag: string, event: MouseEvent): void {
    event.preventDefault();
    const targetId = `operations-tag-${tag}`;
    setTimeout(() => {
      const element = document.querySelector(`#${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }
}
