import { Component, inject, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySearchComponent, MultiWordHighlightPipe, SearchDataItem } from '../../../node_modules/@r-ko/ngx-category-search';
import { SearchService, AppSpecificData } from './search.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    MultiWordHighlightPipe,
    CategorySearchComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [SearchService],
  standalone: true
})
export class HomePageComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);
  private searchSubscription: Subscription | null = null;

  // Data for the search component
  searchData: AppSpecificData[] = [];
  initialCategoryData$: Observable<Record<string, number> | null> | null = null;

  // Configuration for ngx-category-search
  idField: keyof AppSpecificData = 'id';
  displayNameField: keyof AppSpecificData = 'name';
  categoryGroupField: keyof AppSpecificData = 'type';
  optionalFriendlyIdField: keyof AppSpecificData = 'friendlyId';
  // descriptionField: keyof AppSpecificData = 'description'; // Removed as per requirement

  customPlaceholder = 'Search AWS services (e.g., EC2, S3, Lambda)...';
  customBatchSize = 5;
  customShowChicletContainerBorder = true;

  // TemplateRefs for custom content
  @ViewChild('customResultItem', { static: true }) customResultItemTemplate!: TemplateRef<any>;
  @ViewChild('customChicletContent', { static: true }) customChicletContentTemplate!: TemplateRef<any>;
  @ViewChild('customCategoryHeaderContent', { static: true }) customCategoryHeaderContentTemplate!: TemplateRef<any>;
  @ViewChild('customRecentItem', { static: true }) customRecentItemTemplate!: TemplateRef<any>;
  @ViewChild('customNoResults', { static: true }) customNoResultsTemplate!: TemplateRef<any>;
  @ViewChild('customLoading', { static: true }) customLoadingTemplate!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {
    this.initialCategoryData$ = this.searchService.getInitialDataForCategories();
    this.initialCategoryData$.subscribe(counts => {
      console.log('Parent: Initial category counts loaded:', counts);
    });
  }

  onSearchRequested(term: string): void {
    console.log('Parent: Search requested for term:', term);
    this.searchSubscription?.unsubscribe();
    if (!term) {
      this.searchData = [];
      console.log('Parent: Term is empty, clearing results.');
    } else {
      this.searchSubscription = this.searchService.searchItems(term)
        .subscribe(apiResponse => {
          this.searchData = this.searchService.mapApiResponseToSearchData(apiResponse);
          console.log('Parent: Received and mapped results:', this.searchData);
        }, error => {
          console.error("Parent: Error fetching search results:", error);
          this.searchData = [];
        });
    }
  }

  // Helper for templates - now returns empty string for no icons
  getCategoryIcon(categoryType: string): string {
    return ''; // No icons
  }

  // Event Handlers from ngx-category-search
  onSearchResultSelected(item: SearchDataItem): void {
    const appSpecificItem = item as AppSpecificData;
    console.log('Parent: Item selected:', appSpecificItem);
    alert(`Item Selected: ${appSpecificItem.name} (ID: ${appSpecificItem.id}, Category: ${appSpecificItem.type})`);
  }

  onEnterPressed(term: string): void {
    console.log('Parent: Enter key pressed with term:', term);
    alert(`Enter pressed with: ${term}. Triggering search.`);
    this.onSearchRequested(term); // Example: trigger search on enter
  }

  onRecentSelected(term: string): void {
    console.log('Parent: Recent item selected:', term);
    // The library typically handles re-triggering search, but you can add custom logic
    // alert(`Recent search selected: ${term}`);
  }

  onCategoryNavigate(event: { term: string; category: string }): void {
    console.log('Parent: Navigate to category page:', event);
    alert(`Navigate to full results for "${event.term}" in category "${event.category}"`);
  }

  onCategorySelected(category: string): void {
    console.log('Parent: Category chiclet selected:', category);
    // This is informational; the library filters based on the selection.
  }

  onAllResultsNavigate(event: { term: string }): void {
    console.log('Parent: Navigate to all results for term:', event.term);
    alert(`Navigate to all results page for term: "${event.term}"`);
  }

  onSearchCleared(): void {
    console.log('Parent: Search cleared event received.');
    this.searchData = []; // Ensure results are cleared
  }

  onTermChanged(term: string): void {
    console.log('Parent: Raw search term changed (for info only):', term);
  }

  onDropdownVisibilityChanged(visible: boolean): void {
    console.log('Parent: Dropdown visibility changed:', visible);
  }

  onSearchForTermClicked(term: string): void {
    console.log('Parent: "Search for term" line clicked:', term);
    // Optionally, trigger a search or other action here
    // this.onSearchRequested(term); 
    alert(`"Search for ${term}" clicked. You can trigger a search here.`);
  }

  handleSearchForTermGlobal(term: string) {
  console.log('Global search requested for:', term);
  // Implement navigation or other logic
}

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}