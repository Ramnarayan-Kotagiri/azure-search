// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown'; // Import provideMarkdown
import { HttpClient, provideHttpClient } from '@angular/common/http'; // Needed by ngx-markdown

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Add provideHttpClient
    provideMarkdown({ loader: HttpClient }) // Add provideMarkdown
  ]
};