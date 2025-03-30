import { Component, inject } from '@angular/core'; // Import inject
import { CommonModule } from '@angular/common'; // Often needed
import { MarkdownModule } from 'ngx-markdown'; // <-- Import MarkdownModule
import { CategorySearchComponent, SearchDataItem } from '@r-ko/ngx-category-search'; // Adjust path if needed


// --- Define the specific data structure for THIS application ---
interface AppSpecificData extends SearchDataItem {
    id: string;
    friendlyId: string;
    name: string;
    type: 'App Service' | 'Application gateways' | 'Cloud services (classic)' | 'Function App' | 'Web App' | 'Application Insights' | 'Availability test' | 'Virtual Machine' | 'Storage Account' | 'SQL Database';
  }
  
  // --- Generator Function (for clarity and potential reuse) ---
  function generateAppData(itemsPerCategory: number = 25): AppSpecificData[] {
      const data: AppSpecificData[] = [];
      let globalIdCounter = 1;
  
      const types: AppSpecificData['type'][] = [
          'App Service', 'Application gateways', 'Cloud services (classic)', 'Function App', 'Web App',
          'Application Insights', 'Availability test', 'Virtual Machine', 'Storage Account', 'SQL Database'
      ];
  
      const prefixes: { [key in AppSpecificData['type']]: string } = {
          'App Service': 'AS',
          'Application gateways': 'AG',
          'Cloud services (classic)': 'CS',
          'Function App': 'FA',
          'Web App': 'WA',
          'Application Insights': 'AI',
          'Availability test': 'AT',
          'Virtual Machine': 'VM',
          'Storage Account': 'ST',
          'SQL Database': 'DB'
      };
  
      // More diverse components/roles
      const nameParts1: { [key in AppSpecificData['type']]: string[] } = {
          'App Service': ['User API', 'Product Service', 'Order API', 'Reporting Service', 'Image Processor', 'Notification Hub', 'Backend Worker', 'Sync Service', 'Auth Service', 'Catalog API'],
          'Application gateways': ['Public WAF', 'Internal API Gateway', 'Admin Portal Access', 'Partner Integration', 'Frontend Load Balancer', 'High Traffic Endpoint', 'Regional Gateway', 'API Security'],
          'Cloud services (classic)': ['Worker Role Batch', 'Web Role Frontend', 'Data Migration Task', 'Legacy Processing Unit', 'Archived Web Service', 'Classic Data Sync'],
          'Function App': ['Queue Trigger', 'Image Resize Function', 'Data Validation Hook', 'Timer Job', 'Webhook Receiver', 'Auth Callback', 'Log Parser', 'Event Handler', 'CosmosDB Trigger'],
          'Web App': ['Customer Dashboard', 'Admin Console', 'Public Website', 'Internal Reporting Tool', 'API Documentation Site', 'Live Status Monitor', 'Support Forum App', 'Marketing Campaign Site'],
          'Application Insights': ['Core App Monitoring', 'API Endpoint Analytics', 'Background Task Tracker', 'User Behavior Insights', 'Error Diagnostics', 'Development Telemetry', 'Staging Performance'],
          'Availability test': ['Homepage Ping', 'Login API Check', 'Core Feature Test', 'External Service Monitor', 'Database Health', 'Payment Gateway Test', 'CDN Latency Check'],
          'Virtual Machine': ['Build Server CI', 'Web Server IIS', 'SQL Server Instance', 'Redis Cache Node', 'Dev Environment Box', 'UAT Test Machine', 'Data Analytics Server', 'Jump Box Secure'],
          'Storage Account': ['User Content Blobs', 'Archived Database Backups', 'Media Files CDN', 'Cold Storage Archive', 'Data Lake Gen2 Raw', 'App Configuration Blobs', 'Processed Results Store', 'Log Storage'],
          'SQL Database': ['User Profiles DB', 'Product Catalog Main', 'Order Management System', 'Inventory Tracking', 'Audit Log Store', 'Reporting Staging DB', 'App Configuration Store', 'Session Cache DB']
      };
  
      // Environments, Regions, Qualifiers
      const nameParts2 = ['Prod', 'Dev', 'Test', 'Staging', 'UAT', 'Demo', 'POC', 'DR', 'QA'];
      const nameParts3 = ['East US', 'West Europe', 'Central India', 'Australia East', 'North Europe', 'Japan West', 'Brazil South', 'UK South'];
      const nameParts4 = ['Primary', 'Secondary', 'Read Replica', 'Active', 'Passive', 'Shared', 'Dedicated', 'Internal', 'External', 'Core', 'Edge', 'V1', 'V2', 'New', 'Legacy'];
  
      // Function to get random element
      const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
      types.forEach(type => {
          const typePrefix = prefixes[type];
          let typeCounter = 1;
          for (let i = 1; i <= itemsPerCategory; i++) {
              // Combine parts ensuring variety and avoiding direct repetition if possible
              const part1 = getRandom(nameParts1[type]);
              let part2 = getRandom(nameParts2);
              let part3 = getRandom(nameParts3);
              let part4 = getRandom(nameParts4);
  
              // Simple logic to reduce direct repetition (optional)
              if (part3 === part2) part3 = getRandom(nameParts3);
              if (part4 === part3 || part4 === part2) part4 = getRandom(nameParts4);
  
              const itemName = `${part1} ${part2} ${part3} ${part4}`.trim(); // Combine and trim potential extra space
  
              data.push({
                  id: `${typePrefix.toLowerCase()}${globalIdCounter}`, // Globally unique simple ID
                  friendlyId: `${typePrefix}${1000 + typeCounter + (types.indexOf(type) * itemsPerCategory)}`, // Unique Friendly ID per type
                  name: itemName,
                  type: type
              });
              globalIdCounter++;
              typeCounter++;
          }
      });
  
      return data;
  }
  
  // --- Provide Mock Data (Now lives in the consuming app) ---
  // (Ideally, this would come from a service)
  export const MOCK_APP_DATA: AppSpecificData[] = generateAppData(25); // Generate 25 items per category
  
  // Optional: Log the generated count
  console.log(`Generated ${MOCK_APP_DATA.length} mock AppSpecificData items.`);
@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    // AzureSearchComponent, // Import the search component here
    MarkdownModule,
    CategorySearchComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {

      // Inject Router for handling navigation events from the library
//   private router = inject(Router);

  // --- Data for the Library Component ---
  searchData: AppSpecificData[] = MOCK_APP_DATA; // Provide the data

  // --- Field Name Configuration ---
  // Tell the library component which fields in AppSpecificData to use
  idField: keyof AppSpecificData = 'id';
  displayNameField: keyof AppSpecificData = 'name';
  categoryGroupField: keyof AppSpecificData = 'type';
  optionalFriendlyIdField: keyof AppSpecificData = 'friendlyId';

  // --- Example Configuration Overrides ---
  customPlaceholder = "Search Components, Services, Data...";
  customBatchSize = 5;
  // Markdown content for Card 1
// Updated Markdown content for Card 1 using the detailed prompt
promptCardMarkdown = `
I need Angular (version 17) code for a standalone component named \`AzureSearchComponent\` that replicates the search functionality and UI/UX of the Azure portal search dropdown. This component should be self-contained within a single TypeScript file (\`azure-search.component.ts\`), an HTML template file (\`azure-search.component.html\`), and a CSS stylesheet file (\`azure-search.component.css\`).

**1. Functional Requirements:**

*   **Search Input:**
    *   A text input field should be present with the placeholder "Search resources, services, and docs...".
    *   Magnifying glass icon on the left.
    *   As the user types, the search should dynamically filter and display suggestions.
    *   A clear "X" button should appear within or next to the input field when text is present, allowing the user to clear the input and reset the suggestions to the initial state.
    *   The input field should have a distinct focus state similar to the Azure portal (e.g., a subtle blue glow).
*   **Suggestions Dropdown:**
    *   A dropdown panel should appear below the search input when the input is focused or when a search term yields results.
    *   The dropdown should have a subtle border and shadow, similar to the Azure portal.
    *   Clicking outside the component should close the dropdown and clear the search term.
    *   **Initial View (No Search Term):**
        *   Display a row of category "chiclets" (pill-shaped buttons) for available categories (excluding "All").
        *   Initial chiclets should be gray, fully opaque, and disabled (not clickable).
        *   Each chiclet should display the category name and the total count of items within that category from mock data.
        *   Below the chiclets, display a "Recent Searches" section with a heading.
        *   List the last 5 unique search terms entered by the user (stored in \`localStorage\`).
        *   Each recent search item should be clickable, populating the search input with that term and triggering a new search.
        *   If there are no recent searches, display "No recent searches."
    *   **Search Results View (With Search Term):**
        *   Display a row of category chiclets including "All", reflecting the counts of matching results for the current search term within each category.
        *   Non-selected chiclets should have a light blue background.
        *   The active (selected) chiclet should have a distinct visual indicator (darker blue background, white text).
        *   Search results should be visually grouped by category. The category heading should appear on the same line as "Show more" / "Show all" links, separated by a horizontal line filler.
        *   Each search result item should display:
            *   An icon representative of its type (e.g., Unicode characters).
            *   A \`friendlyId\` (e.g., AS1001).
            *   The name of the item, with the matched search term portion **bolded** and colored differently (e.g., blue).
            *   A subtle indication of the item's type (e.g., in parentheses or a smaller font).
        *   For each category with more results than the initial batch size (e.g., 2), a "Show more" link should appear in the category header. Clicking it should activate that category's chiclet and display all results for that category within the dropdown. The link should appear disabled once all items are shown, until the "All" chiclet is re-selected.
        *   Next to "Show more", a "Show all [count] results" link should appear if results exceed the batch size. Clicking it should navigate to a dedicated search results page (\`/search\`) with the current search term and the specific category as query parameters (e.g., \`/search?q=term&category=App%20Service\`).
        *   If no results are found for the search term, display a clear "No results found for '[search term]'." message.
        *   At the very bottom of the search results dropdown, a "Show all [total count of matching results] results" button should be present, which navigates to the dedicated search results page (\`/search\`) with only the search term as a query parameter (e.g., \`/search?q=term\`).
*   **Data Handling:**
    *   Use a mock data array of objects with properties: \`id\`, \`friendlyId\`, \`name\`, \`type\`. Provide at least 20 diverse mock data items.
    *   Implement filtering logic:
        *   Match \`searchTerm\` against \`name\` (case-insensitive, whole word/phrase match).
        *   Match \`searchTerm\` against \`friendlyId\` (case-insensitive, substring match, only if search term length >= 3).
    *   Simulate a brief delay (e.g., 300ms) after the user stops typing before suggestions update using RxJS \`debounceTime\`.
*   **UI/UX Details:**
    *   Use 'Montserrat', sans-serif font.
    *   Suggestions dropdown appears below input, same width or slightly wider.
    *   Subtle hover effects on suggestion items.
    *   Clean, modern style resembling Azure portal (neutral base, blue accents).

**2. Technical Requirements:**

*   **Standalone Component:** Solution must be a standalone Angular component.
*   **Imports:** Include necessary Angular modules (CommonModule, ReactiveFormsModule) and RxJS operators directly. Import custom pipes (\`HighlightPipe\`).
*   **State Management:** Manage state within the component class.
*   **\`localStorage\`:** Use for recent searches.
*   **Icon Handling:** Use Unicode characters.
*   **CSS Styling:** Provide comprehensive CSS in \`azure-search.component.css\`.

**3. Checklist of Expected Features:**

*   [x] Functional search input with placeholder, icon, clear button.
*   [x] Dynamic filtering (debounced).
*   [x] Suggestions dropdown (focus/results trigger, outside click close/clear).
*   [x] Initial view chiclets (no "All", gray, disabled, counts).
*   [x] Recent Searches section (\`localStorage\`, clickable, limit 5).
*   [x] No recent searches message.
*   [x] Search results chiclets ("All" included, filtered counts, light blue bg).
*   [x] Active chiclet indicator (darker blue).
*   [x] Filtering results based on active chiclet.
*   [x] Visual grouping by category in results.
*   [x] Category header with links/filler line.
*   [x] Result item display (icon, friendlyId, name, type).
*   [x] Name highlighting (**bold**, blue text).
*   [x] "Show more" link (activates chiclet, shows all in dropdown, disables when appropriate).
*   [x] "Show all [count] results" link (navigates with category param).
*   [x] "No results found" message.
*   [x] "Show all [total count] results" button (navigates with search term only).
*   [x] Mock data array used (with \`friendlyId\`).
*   [x] Filtering logic (name: whole word; friendlyId: substring, length>=3).
*   [x] RxJS \`debounceTime\`.
*   [x] Standalone Angular component structure.
*   [x] Necessary imports included.
*   [x] State management within the component.
*   [x] Use of \`localStorage\`.
*   [x] Unicode icons implemented.
*   [x] Comprehensive CSS styling ('Montserrat', Azure-like).
*   [x] Component named \`AzureSearchComponent\` in specified files.
`;

  // Markdown content for Card 2
  searchExamplesCardMarkdown = `
  Explore the search capabilities with generic names:
  
  *   **Resource Names (Whole Word):**
      *   \`Portal\` (matches 'Customer Portal ...', 'Admin Portal ...')
      *   \`Prod\` (matches items containing ' Prod ')
      *   \`API\` (matches 'Product API ...', 'API Traffic ...' etc.)
      *   \`Data\` (matches 'Data Import ...', 'Data Lake ...', 'Reporting Data Mart ...')
  *   **Friendly IDs (Substring, min 3 chars):**
      *   \`AS1\` (matches friendly IDs starting 'AS1...')
      *   \`ag1\` (matches friendly IDs starting 'AG1...')
      *   \`100\` (matches friendly IDs containing '100', e.g., 'AS1001', 'FA1004')
      *   \`015\` (matches friendly IDs containing '015', e.g., 'ST1015', 'DB1015')
  *   **Combined Terms (in name, whole words):**
      *   \`User Prod\` (matches 'User Auth Prod ...', 'User Profiles Prod ...')
      *   \`API East US\` (matches names containing both 'API' and 'East US')
      *   \`Test Server\` (matches 'Web Frontend Test Server ...', etc.)
  *   **Environment/Region:**
      *   \`Dev\`
      *   \`Staging\`
      *   \`West Europe\`
  `;

    // --- Event Handlers for Library Outputs ---

    onSearchResultSelected(selectedItem: AppSpecificData): void {
        console.log('HomePage: Item Selected!', selectedItem);
        // Example: Navigate to a detail page for this item
        // this.router.navigate(['/details', selectedItem.id]);
        alert(`You selected: ${selectedItem[this.displayNameField]}`); // Simple alert for demo
      }
    
      onRecentSelected(term: string): void {
        console.log('HomePage: Recent search selected:', term);
        // No action needed here usually, as the library component updates its input
      }
    
      onCategoryNavigate(event: { term: string; category: string }): void {
        console.log('HomePage: Navigate To Category Requested', event);
        // Navigate using the application's router
        // this.router.navigate(['/search'], { // Your app's search results route
        //   queryParams: {
        //     q: event.term,
        //     category: event.category
        //   }
        // });
      }
    
      onAllResultsNavigate(event: { term: string }): void {
        console.log('HomePage: Navigate To All Results Requested', event);
        // Navigate using the application's router
        // this.router.navigate(['/search'], { // Your app's search results route
        //   queryParams: {
        //     q: event.term
        //     // No category specified
        //   }
        // });
      }
    
      onSearchCleared(): void {
        console.log('HomePage: Search Cleared');
        // Perform any app-specific actions needed when search is cleared
      }
    
      onTermChanged(term: string): void {
          console.log('HomePage: Debounced search term changed:', term);
          // Could potentially trigger other actions in the app based on the term
      }
    
      onDropdownVisibilityChanged(isVisible: boolean): void {
          console.log('HomePage: Dropdown visibility changed:', isVisible);
      }
    
      // --- Other Methods ---
      getFriendlyId(item: AppSpecificData): string {
         // Helper for the custom template, accessing the configured field
         return item[this.optionalFriendlyIdField] ?? '';
      }
    
      getCategory(item: AppSpecificData): string {
         // Helper for the custom template
         return item[this.categoryGroupField] ?? 'Unknown';
      }
}
