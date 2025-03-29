// app.routes.ts (example)
import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
// import { Az } from './search-results-page/search-results-page.component'; // Assuming this exists

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' }, // Route default path to HomePage
//   { path: 'search', component: SearchResultsPageComponent }, // Keep search results route
  // Add other routes if needed
  // { path: '**', redirectTo: '' } // Optional fallback
];