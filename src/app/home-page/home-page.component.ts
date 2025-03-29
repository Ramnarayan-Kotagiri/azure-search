import { Component } from '@angular/core';
import { AzureSearchComponent } from '../azure-search/azure-search.component'; // Adjust path
import { CommonModule } from '@angular/common'; // Often needed
import { MarkdownModule } from 'ngx-markdown'; // <-- Import MarkdownModule

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    AzureSearchComponent, // Import the search component here
    MarkdownModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
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
}
