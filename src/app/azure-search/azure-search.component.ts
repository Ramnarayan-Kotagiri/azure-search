import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HighlightPipe } from '../highlight.pipe';

// --- Mock Data Structure and Data ---
interface MockDataItem {
  id: string; // Unique ID for trackBy
  friendlyId: string; // <-- ADDED Friendly Identifier
  name: string;
  type: 'App Service' | 'Application gateways' | 'Cloud services (classic)' | 'Function App' | 'Web App' | 'Application Insights' | 'Availability test' | 'Virtual Machine' | 'Storage Account' | 'SQL Database';
}

// Helper to generate data (conceptual)
function generateMockData(): MockDataItem[] {
  const data: MockDataItem[] = [];
  let idCounter = 1;

  const types: MockDataItem['type'][] = [
      'App Service', 'Application gateways', 'Cloud services (classic)', 'Function App', 'Web App',
      'Application Insights', 'Availability test', 'Virtual Machine', 'Storage Account', 'SQL Database'
  ];

  const prefixes: { [key in MockDataItem['type']]: string[] } = {
      'App Service': ['AS', 'AppSvc', 'WebApp', 'ApiService'],
      'Application gateways': ['AG', 'Gateway', 'LoadBalancer', 'WAF'],
      'Cloud services (classic)': ['CS', 'ClassicSvc', 'LegacyApp'],
      'Function App': ['FA', 'Func', 'Trigger', 'Job'],
      'Web App': ['WA', 'Website', 'Portal', 'Site'],
      'Application Insights': ['AI', 'AppInsights', 'Telemetry', 'Monitor'],
      'Availability test': ['AT', 'PingTest', 'HealthCheck', 'WebTest'],
      'Virtual Machine': ['VM', 'Server', 'Instance', 'Box'],
      'Storage Account': ['ST', 'Storage', 'DataLake', 'Blob'],
      'SQL Database': ['DB', 'SQL', 'Database', 'Catalog']
  };

  const names: { [key in MockDataItem['type']]: string[] } = {
      'App Service': ['User Auth', 'Product API', 'Order Processor', 'Reporting Job', 'Image Resizer', 'Notification Service', 'Backend Worker', 'Mobile Sync'],
      'Application gateways': ['Public Facing', 'Internal Services', 'API Traffic', 'Admin Access', 'Partner Connection', 'High Availability', 'Regional Endpoint'],
      'Cloud services (classic)': ['Worker Role', 'Web Role', 'Data Import', 'Legacy System', 'Batch Process', 'Archived Component'],
      'Function App': ['Queue Processor', 'Image Analysis', 'Data Validation', 'Scheduled Task', 'Webhook Listener', 'Auth Endpoint', 'Log Aggregator'],
      'Web App': ['Customer Portal', 'Admin Dashboard', 'Marketing Site', 'Internal Tool', 'API Documentation', 'Status Page', 'User Forum'],
      'Application Insights': ['Main App Telemetry', 'API Performance', 'Background Jobs', 'User Flow Tracking', 'Error Logging', 'Dev Environment Metrics'],
      'Availability test': ['Homepage Up Check', 'Login Endpoint Test', 'API Core Functionality', 'External Dependency Check', 'Database Connection Test'],
      'Virtual Machine': ['Build Agent', 'Web Frontend', 'Database Server', 'Cache Node', 'Development Box', 'Test Environment', 'Analytics Engine'],
      'Storage Account': ['User Uploads', 'Archived Logs', 'Media Library', 'Backup Repository', 'Data Lake Raw', 'Configuration Files', 'Processed Data'],
      'SQL Database': ['Users', 'Products', 'Orders', 'Inventory', 'Audit Trail', 'Reporting Data Mart', 'Configuration', 'Session State']
  };

  const suffixes = ['Prod', 'Dev', 'Test', 'Staging', 'UAT', 'East US', 'West Europe', 'Shared', 'Dedicated', 'Primary', 'Secondary', 'V1', 'V2', 'Internal', 'External', 'Main', 'Core', 'Alpha', 'Beta', 'Gamma'];

  types.forEach(type => {
      const typePrefix = prefixes[type][0]; // Use the first prefix for friendly ID convention
      for (let i = 1; i <= 25; i++) {
          const namePart1 = names[type][Math.floor(Math.random() * names[type].length)];
          const namePart2 = suffixes[Math.floor(Math.random() * suffixes.length)];
          const namePart3 = suffixes[Math.floor(Math.random() * suffixes.length)]; // Add more variation
          const itemName = `${namePart1} ${namePart2} ${namePart3}`.replace(/  +/g, ' '); // Ensure single spaces

          data.push({
              id: `${typePrefix.toLowerCase()}${idCounter}`,
              friendlyId: `${typePrefix}${1000 + idCounter}`, // Example ID format
              name: itemName,
              type: type
          });
          idCounter++;
      }
  });

  return data;
}

// Assign the generated data
const mockSearchData: MockDataItem[] = generateMockData();
console.log(`Generated ${mockSearchData.length} mock data items.`); // Log count for verification
// --- End Mock Data ---

type Category = 'All' | MockDataItem['type'];
type GroupedResults = { [key in MockDataItem['type']]?: MockDataItem[] };
type CategoryCounts = { [key in Category]?: number };
type VisibleCounts = { [key in MockDataItem['type']]?: number };

const RECENT_SEARCH_KEY = 'azure_portal_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const RESULTS_BATCH_SIZE = 5; // Number of results per category to show initially/load more

// Helper function to escape regex characters (can be defined outside the class or inside if preferred)
function escapeRegex(s: string): string {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@Component({
  selector: 'app-azure-search',
  imports: [CommonModule, ReactiveFormsModule,HighlightPipe],
  templateUrl: './azure-search.component.html',
  styleUrl: './azure-search.component.css'
})
export class AzureSearchComponent implements OnInit, OnDestroy {
  searchTerm = new FormControl('');
  isDropdownVisible = false;
  isLoading = false;
  activeCategory: Category = 'All';

  // Initial state (before search)
  initialCategories: CategoryCounts = {};
  recentSearches: string[] = [];

  // Search results state
  filteredResults: MockDataItem[] = [];
  groupedResults: GroupedResults = {};
  filteredCategories: CategoryCounts = {};
  visibleCounts: VisibleCounts = {}; // Tracks how many items per category are visible

  private searchSubscription: Subscription | null = null;
  private blurTimeout: any;

  // Markdown content for Card 1
//   promptCardMarkdown = `
// Generates an Angular standalone component named \`AzureSearchComponent\` replicating Azure portal search.

// **Key Features:**
// *   Dynamic suggestions & debounced input
// *   Category chiclets (initial count / filtered results)
// *   Recent searches (\`localStorage\`)
// *   Result grouping by category
// *   Friendly ID display & search (min 3 chars, substring match)
// *   Result name matching (whole word, case-insensitive)
// *   **Bold** highlighting for name matches
// *   Navigation integration for "Show all" links
// *   Clean CSS mimicking Azure style (Montserrat font)
// *   Self-contained (\`.ts\`, \`.html\`, \`.css\`)
// *   Target: Angular 17
// `;

//   // Markdown content for Card 2
//   searchExamplesCardMarkdown = `
// Explore the search capabilities:

// *   **Resource Names:**
//     *   \`Portal\` (matches 'AdminPortal-Staging', 'CustomerPortal-Prod')
//     *   \`Gateway\` (matches 'Global-Gateway', 'Internal-API-Gateway')
//     *   \`Prod\` (matches items ending in '-Prod')
// *   **Friendly IDs (min 3 chars):**
//     *   \`AS1\` (matches 'AS1001', 'AS1002', 'AS1003')
//     *   \`ag2\` (matches 'AG2023', 'AG2024')
//     *   \`DB0\` (matches 'DB0101', 'DB0102', 'DB0103')
// *   **Resource Types:**
//     *   \`App Service\`
//     *   \`Virtual Machine\`
// *   **Combined Terms (in name):**
//     *   \`API Gateway\` (matches 'Internal-API-Gateway')
//     *   \`Prod DB\` (matches 'ProductCatalogDB' if name contains 'Prod DB')
// `;


  constructor(private elementRef: ElementRef,private router: Router) {}

  ngOnInit(): void {
    this.loadRecentSearches();
    this.calculateInitialCategoryCounts();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    clearTimeout(this.blurTimeout);
  }
  // --- Event Handlers ---

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Only close if the click is truly outside the component root element
      this.isDropdownVisible = false;

      // *** ADD THIS LINE ***
      // Clear the search term if it has a value when clicking outside
      if (this.searchTerm.value) {
          this.searchTerm.setValue(''); // Setting to empty triggers valueChanges -> resetToInitialState
      }
    }
  }

  onFocus(): void {
    clearTimeout(this.blurTimeout); // Cancel any pending blur timeout on focus gain
    this.isDropdownVisible = true;
    if (!this.searchTerm.value) {
        this.resetToInitialState();
    }
  }

  onBlur(): void {
    // Use timeout to allow clicks inside dropdown before potentially closing
    this.blurTimeout = setTimeout(() => {
      // This timeout will be cleared if a click inside the dropdown happens
      this.isDropdownVisible = false;
    }, 150); // Small delay
  }

  clearSearch(event: MouseEvent): void {
    clearTimeout(this.blurTimeout); // Prevent blur timeout when clicking clear
    event.stopPropagation();
    this.searchTerm.setValue('');
    this.isDropdownVisible = true; // Keep open
     if (!this.searchTerm.value) {
         this.resetToInitialState();
     }
  }

  selectCategory(category: Category, event?: MouseEvent): void {
    clearTimeout(this.blurTimeout);
    if (event) event.stopPropagation();
    this.activeCategory = category;

    // *** ADD THIS: Reset visible counts if 'All' is selected ***
    if (category === 'All') {
       this.resetVisibleCounts(); // Reset counts to initial batch size
    }
    // Note: If a specific category is clicked, we *don't* reset counts here.
    // The 'show more' link logic handles showing all for that specific one if needed.
 }
  selectRecentSearch(term: string, event: Event): void {
    clearTimeout(this.blurTimeout); // ** ADD THIS ** Prevent close on recent search click
    event.stopPropagation();
    this.searchTerm.setValue(term);
    this.isDropdownVisible = true;
  }

   selectResultItem(item: MockDataItem, event: Event): void {
    clearTimeout(this.blurTimeout); // ** ADD THIS ** Prevent close on result item click
    event.stopPropagation();
    console.log('Selected item:', item);
    // this.addRecentSearch(item.name); // Decide if needed here
    this.isDropdownVisible = false; // Close after selection is *intended*
  }

  showMore(category: MockDataItem['type'], event: MouseEvent): void {
    clearTimeout(this.blurTimeout);
    event.stopPropagation();
    // 1. Set the active category (like clicking the chiclet)
    this.activeCategory = category;
    // 2. Set the visible count for this category to its total count
    this.visibleCounts[category] = this.groupedResults[category]?.length ?? 0;
  }

  // showAllCategoryResults(category: MockDataItem['type'], event: MouseEvent): void {
  //    clearTimeout(this.blurTimeout); // ** ADD THIS ** Prevent close on show all category click
  //    event.stopPropagation();
  //    this.activeCategory = category;
  //    this.visibleCounts[category] = this.groupedResults[category]?.length ?? 0;
  // }

  /**
   * NEW METHOD: Navigates to search page with category context.
   */
  navigateToCategorySearch(category: MockDataItem['type'], event: MouseEvent): void {
    clearTimeout(this.blurTimeout);
    event.stopPropagation();
    const currentSearchTerm = this.searchTerm.value || '';
    console.log(`Attempting to navigate to /search with query: ${currentSearchTerm} and category: ${category}`);

    this.router.navigate(['/search'], { // Use your actual search route path
      queryParams: {
        q: currentSearchTerm,
        category: category // Add category as a query parameter
      }
    }).then(success => {
      if (success) {
        console.log('Category search navigation successful!');
        this.isDropdownVisible = false; // Close dropdown on successful navigation
      } else {
        console.error('Category search navigation failed!');
      }
    }).catch(error => {
      console.error('Error during category search navigation:', error);
    });
  }

  showAllResultsPage(event: MouseEvent): void {
    clearTimeout(this.blurTimeout);
    event.stopPropagation();
    const currentSearchTerm = this.searchTerm.value || '';
    console.log(`Attempting to navigate to /search with query: ${currentSearchTerm}`);

    this.router.navigate(['/search'], { // Use your actual search route path
      queryParams: { q: currentSearchTerm } // Pass ONLY search term
    }).then(success => {
      if (success) {
        console.log('Overall search navigation successful!');
        this.isDropdownVisible = false; // Close dropdown on successful navigation
      } else {
        console.error('Overall search navigation failed!');
      }
    }).catch(error => {
      console.error('Error during overall search navigation:', error);
    });
  }


  // --- Search & Data Logic ---

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchTerm.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after last keystroke
        distinctUntilChanged(), // Only emit if value changed
        tap(() => this.isLoading = true) // Show loading indicator
        // switchMap(term => this.simulateApiCall(term)) // Use if simulating async
      )
      .subscribe(term => {
        this.performSearch(term ?? ''); // Handle null case from FormControl
        this.isLoading = false; // Hide loading indicator
      });
  }

  // --- MODIFIED: performSearch ---
  // --- MODIFIED AGAIN: performSearch ---
  private performSearch(term: string): void {
    const searchTermTrimmed = term.trim();
    if (!searchTermTrimmed) {
      this.resetToInitialState();
      this.isDropdownVisible = document.activeElement === this.elementRef.nativeElement.querySelector('input');
      return;
    }

    const escapedTerm = escapeRegex(searchTermTrimmed);

    // *** Create TWO separate regexes ***
    // Regex for Name: Requires word boundaries (\b), case-insensitive
    const nameSearchRegex = new RegExp('\\b' + escapedTerm + '\\b', 'i');
    // Regex for Friendly ID: Simple substring search, case-insensitive
    const idSearchRegex = new RegExp(escapedTerm, 'i');

    // Filter data: Use the correct regex for each check
    this.filteredResults = mockSearchData.filter(item => {
        // Check 1: Does the name match (whole word/phrase)?
        const nameMatches = nameSearchRegex.test(item.name); // <-- Use nameSearchRegex

        // Check 2: Does the ID match (substring), *only if* the search term is long enough?
        const idMatches = (searchTermTrimmed.length >= 3) // Condition: Length check
                          && idSearchRegex.test(item.friendlyId); // <-- Use idSearchRegex

        // Return true if either the name matches OR (the term is long enough AND the ID matches)
        return nameMatches || idMatches;
    });

    // --- Keep the rest of the method ---
    this.groupResults();
    this.calculateFilteredCategoryCounts();
    this.resetVisibleCounts();
    this.activeCategory = 'All';
    this.isDropdownVisible = true;
    this.addRecentSearch(term);
  }

  private resetToInitialState(): void {
    this.filteredResults = [];
    this.groupedResults = {};
    this.filteredCategories = {};
    this.visibleCounts = {};
    this.activeCategory = 'All'; // Reset to 'All' category
    this.calculateInitialCategoryCounts(); // Ensure initial counts are up-to-date
    // Keep recent searches loaded
  }

  private calculateInitialCategoryCounts(): void {
    this.initialCategories = mockSearchData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as CategoryCounts);
    this.initialCategories['All'] = mockSearchData.length;
  }

  private calculateFilteredCategoryCounts(): void {
    this.filteredCategories = this.filteredResults.reduce((acc, item) => {
       acc[item.type] = (acc[item.type] || 0) + 1;
       return acc;
    }, {} as CategoryCounts);
     this.filteredCategories['All'] = this.filteredResults.length;
  }

  private groupResults(): void {
    this.groupedResults = this.filteredResults.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type]!.push(item);
      return acc;
    }, {} as GroupedResults);
  }

   private resetVisibleCounts(): void {
    this.visibleCounts = {};
    Object.keys(this.groupedResults).forEach(category => {
      this.visibleCounts[category as MockDataItem['type']] = RESULTS_BATCH_SIZE;
    });
  }

  // --- Recent Searches (LocalStorage) ---

  private loadRecentSearches(): void {
    try {
      const storedSearches = localStorage.getItem(RECENT_SEARCH_KEY);
      if (storedSearches) {
        this.recentSearches = JSON.parse(storedSearches);
      } else {
        this.recentSearches = [];
      }
    } catch (e) {
      console.error("Error loading recent searches from localStorage:", e);
      this.recentSearches = [];
    }
  }

  private saveRecentSearches(): void {
    try {
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(this.recentSearches));
    } catch (e) {
      console.error("Error saving recent searches to localStorage:", e);
    }
  }

  private addRecentSearch(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    // Remove existing instance of the term to move it to the top
    this.recentSearches = this.recentSearches.filter(s => s.toLowerCase() !== trimmedTerm.toLowerCase());

    // Add the new term to the beginning
    this.recentSearches.unshift(trimmedTerm);

    // Limit the number of recent searches
    if (this.recentSearches.length > MAX_RECENT_SEARCHES) {
      this.recentSearches.pop(); // Remove the oldest
    }

    this.saveRecentSearches();
  }

  // --- Template Helpers ---

  getIconForType(type: MockDataItem['type']): string {
    // Placeholder icons using Unicode or simple characters.
    // Replace with actual icon classes (e.g., Font Awesome) if available.
    switch (type) {
      case 'App Service': return '⚙️'; // Gear
      case 'Application gateways': return '↔️'; // Left-Right Arrow
      case 'Cloud services (classic)': return '☁️'; // Cloud
      case 'Function App': return '🔌'; // Plug
      case 'Web App': return '🌐'; // Globe
      case 'Application Insights': return '📊'; // Bar Chart
      case 'Availability test': return '✔️'; // Check Mark
      case 'Virtual Machine': return '💻'; // Laptop
      case 'Storage Account': return '📦'; // Package
      case 'SQL Database': return '💾'; // Floppy Disk
      default: return '❓'; // Question Mark
    }
  }

  // For iterating over groupedResults object in the template
  getGroupedResultKeys(): MockDataItem['type'][] {
    return Object.keys(this.groupedResults) as MockDataItem['type'][];
  }

   // Get categories to display in chiclets (initial or filtered)
   getCurrentCategories(): Category[] {
    const categoriesToShow = this.searchTerm.value ? this.filteredCategories : this.initialCategories;
    // Sort categories: 'All' first, then alphabetically by type
    return Object.keys(categoriesToShow)
        .sort((a, b) => {
            if (a === 'All') return -1;
            if (b === 'All') return 1;
            return a.localeCompare(b);
        }) as Category[];
  }

  getCategoryCount(category: Category): number | undefined {
     const counts = this.searchTerm.value ? this.filteredCategories : this.initialCategories;
     return counts[category];
  }

   getVisibleResultsForCategory(category: MockDataItem['type']): MockDataItem[] {
    const results = this.groupedResults[category] ?? [];
    const count = this.visibleCounts[category] ?? RESULTS_BATCH_SIZE;
    return results.slice(0, count);
  }

  getTotalResultsForCategory(category: MockDataItem['type']): number {
     return this.groupedResults[category]?.length ?? 0;
  }

  shouldShowMoreLink(category: MockDataItem['type']): boolean {
    const total = this.getTotalResultsForCategory(category);
    const visible = this.visibleCounts[category] ?? RESULTS_BATCH_SIZE;
    return total > visible;
  }

  /**
   * NEW HELPER: Condition to show the category-specific "Show all [count]" navigation link.
   * Let's show it if the total results exceed the initial batch size (consistent with previous logic).
   */
  shouldShowCategoryShowAllLink(category: MockDataItem['type']): boolean {
    return this.getTotalResultsForCategory(category) > RESULTS_BATCH_SIZE;
    // Or, if you want it whenever there's *any* result in that category:
    // return this.getTotalResultsForCategory(category) > 0;
  }

  //  shouldShowAllCategoryLink(category: MockDataItem['type']): boolean {
  //    return this.getTotalResultsForCategory(category) > RESULTS_BATCH_SIZE;
  //  }

  // TrackBy function for ngFor loops
  trackById(index: number, item: MockDataItem): string {
    return item.id;
  }
  trackByTerm(index: number, term: string): string {
    return term;
  }
   trackByCategory(index: number, category: Category): string {
    return category;
  }
}
