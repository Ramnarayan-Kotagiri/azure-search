import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { CategorySearchComponent, SearchDataItem, HighlightPipe } from '@r-ko/ngx-category-search'; // Adjust path
import { SearchService, AppSpecificData } from './search.service';
import { Subscription } from 'rxjs'; // Import Subscription if needed for manual management

@Component({
    selector: 'app-home-page',
    imports: [
        CommonModule,
        MarkdownModule,
        MarkdownModule,
        HighlightPipe,
        CategorySearchComponent
    ],
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css'],
    providers: [SearchService],
    standalone: true
})
export class HomePageComponent implements OnInit, OnDestroy {

    // Animation state
    animationState = {
        highlightedNodes: [] as number[],
        flowActive: false,
        loading: false,
        results: [] as any[]
    };

    // Node data for visualization - updated for car brands
    nodeData = [
        { id: 1, label: 'Maruti Suzuki', category: 'marutiSuzuki' },
        { id: 2, label: 'Hyundai', category: 'hyundai' },
        { id: 3, label: 'Renault', category: 'renault' },
        { id: 4, label: 'Toyota', category: 'toyota' },
        { id: 5, label: 'Tata', category: 'tata' },
        { id: 6, label: 'Mahindra', category: 'mahindra' },
        { id: 7, label: 'Honda', category: 'honda' },
        { id: 8, label: 'Kia', category: 'kia' },
        { id: 9, label: 'MG', category: 'mg' },
        { id: 10, label: 'Volkswagen', category: 'volkswagen' },
        { id: 11, label: 'Car Features', category: 'carFeatures' }
    ];

    // Mock results for different categories - updated for car brands
    mockResults = {
        marutiSuzuki: [
            { id: 'MSZ000001', name: 'Swift', category: 'marutiSuzuki' },
            { id: 'MSZ000002', name: 'Baleno', category: 'marutiSuzuki' },
            { id: 'MSZ000003', name: 'Alto', category: 'marutiSuzuki' }
        ],
        hyundai: [
            { id: 'HYD000001', name: 'Creta', category: 'hyundai' },
            { id: 'HYD000002', name: 'i20', category: 'hyundai' },
            { id: 'HYD000003', name: 'Venue', category: 'hyundai' }
        ],
        tata: [
            { id: 'TAT000001', name: 'Nexon', category: 'tata' },
            { id: 'TAT000002', name: 'Harrier', category: 'tata' },
            { id: 'TAT000003', name: 'Altroz', category: 'tata' }
        ]
    };

    // Method to get icons for categories - updated for car brands
    getCategoryIcon(category: string): string {
        switch (category) {
            case 'marutiSuzuki': return '🚗';
            case 'hyundai': return '🚙';
            case 'renault': return '🚘';
            case 'toyota': return '🚐';
            case 'tata': return '🚚';
            case 'mahindra': return '🚜';
            case 'honda': return '🏍️';
            case 'kia': return '🚗';
            case 'mg': return '🚓';
            case 'volkswagen': return '🚕';
            case 'carFeatures': return '🔧';
            default: return '🔍';
        }
    }

    // Get label for node by ID
    getNodeLabel(id: number): string {
        const node = this.nodeData.find(n => n.id === id);
        return node ? node.label : `Node ${id}`;
    }

    // Trigger animation flow
    triggerAnimation(category: string): void {
        // Reset state
        this.animationState.results = [];
        this.animationState.highlightedNodes = [];

        // Find nodes related to the category
        const relevantNodes = this.nodeData
            .filter(node => node.category === category || Math.random() > 0.5)
            .map(node => node.id);

        // Highlight nodes
        setTimeout(() => {
            this.animationState.highlightedNodes = relevantNodes;
        }, 300);

        // Activate flow
        setTimeout(() => {
            this.animationState.flowActive = true;
            this.animationState.loading = true;
        }, 800);

        // Show results
        setTimeout(() => {
            this.animationState.loading = false;
            this.animationState.results = this.mockResults[category as keyof typeof this.mockResults] || [];
        }, 2500);

        // Reset flow after animation completes
        setTimeout(() => {
            this.animationState.flowActive = false;
        }, 4000);
    }

    private searchService = inject(SearchService);

    // Property to hold the results for the library component
    searchData: AppSpecificData[] = [];
    // *** NEW: Property to hold all items for initial category display ***
    initialDataForCategories: AppSpecificData[] = [];
    // Optional: Property to hold all items for initial category display
    // allPossibleItems: AppSpecificData[] = []; // Populate this if using [data] for initial counts

    // Define search component configuration (remains the same)
    idField: keyof AppSpecificData = 'id';
    displayNameField: keyof AppSpecificData = 'name';
    categoryGroupField: keyof AppSpecificData = 'type';
    optionalFriendlyIdField: keyof AppSpecificData = 'friendlyId';
    customPlaceholder = 'Search for car brands, models, features...';
    customBatchSize = 3;

    // Markdown content (remains the same)
    promptCardMarkdown = `...`;
    searchExamplesCardMarkdown = `...`;

    private searchSubscription: Subscription | null = null; // To manage ongoing requests
    private initialDataSubscription: Subscription | null = null; // For initial data fetch

    constructor() {
        // REMOVE: Old searchTerms subscription logic
        // Optional: Load initial data for category counts if needed
        // this.allPossibleItems = this.searchService.getAllPossibleItemsSynchronously(); // Example
    }

    // *** NEW: Implement OnInit ***
    ngOnInit(): void {
        // Fetch data needed for initial category counts
        this.initialDataSubscription = this.searchService.getInitialDataForCategories()
            .subscribe(data => {
                this.initialDataForCategories = data;
                console.log('Parent: Received initial data for categories:', this.initialDataForCategories);
                // Note: Angular's change detection will pass this to the [data] input
                // If using OnPush strategy in this component, might need cdr.markForCheck()
            }, error => {
                console.error("Parent: Error fetching initial data:", error);
                this.initialDataForCategories = []; // Ensure it's an empty array on error
            });

        // Initial animation after a delay - update to use a car brand category
        setTimeout(() => {
            this.triggerAnimation('marutiSuzuki');
        }, 1500);
    }

    // --- NEW: Handle the search request from the library ---
    onSearchRequested(term: string): void {
        console.log('Parent: Search requested for term:', term);

        // Cancel any previous ongoing search request
        this.searchSubscription?.unsubscribe();

        if (!term) {
            // If the term is empty, clear the results
            this.searchData = []; // Set to empty array for no results state
            console.log('Parent: Term is empty, clearing results.');
        } else {
            // If there's a term, call the service
            this.searchSubscription = this.searchService.searchItems(term)
                .subscribe(apiResponse => {
                    this.searchData = this.searchService.mapApiResponseToSearchData(apiResponse);
                    console.log('Parent: Received and mapped results:', this.searchData);
                }, error => {
                    console.error("Parent: Error fetching search results:", error);
                    this.searchData = []; // Clear results on error
                });
        }
    }

    // REMOVE or keep for logging: onTermChanged is not driving the search now
    onTermChanged(term: string): void {
        console.log('Parent: Raw search term changed (for info only):', term);
    }

    // Helper methods for the custom template (remain the same)
    getFriendlyId(item: AppSpecificData): string {
        return item.friendlyId || item.id;
    }
    getCategory(item: AppSpecificData): string {
        return item.type;
    }

    // Your existing event handlers (signatures might need checking against library outputs)
    onSearchResultSelected(item: AppSpecificData): void {
        console.log('Parent: Item selected:', item);
        // Handle item selection
    }

    onRecentSelected(term: string): void { // Assuming library emits string
        console.log('Parent: Recent item selected:', term);
        // Library should automatically trigger onSearchRequested(term) after setting input value
    }

    onCategoryNavigate(event: { term: string; category: string }): void {
        console.log('Parent: Navigate to category:', event);
        // Handle navigation
    }
    // *** ADDED Example Logic ***
    onCategorySelected(category: string): void {
        console.log('Parent: Category chiclet selected:', category);
        // Example Action: Maybe pre-filter some other part of your UI,
        // or just log it. The library handles filtering internally based on this.
    }

    // CHANGE: Update signature to accept event object
    onAllResultsNavigate(event: { term: string }): void {
        console.log('Parent: Navigate to all results for term:', event.term);
        // Handle navigation
    }

    onSearchCleared(): void {
        console.log('Parent: Search cleared event received.');
        // Add any specific parent logic needed beyond clearing data (which onSearchRequested('') handles)
        // this.searchData = []; // This is likely redundant if onSearchRequested handles empty term
    }

    onDropdownVisibilityChanged(visible: boolean): void {
        console.log('Parent: Dropdown visibility changed:', visible);
        // Handle dropdown visibility change
    }

    // *** NEW: Implement OnDestroy ***
    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
        this.initialDataSubscription?.unsubscribe(); // Unsubscribe from initial data fetch too
    }
}