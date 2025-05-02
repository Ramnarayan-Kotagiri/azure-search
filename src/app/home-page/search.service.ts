import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SearchDataItem } from '@r-ko/ngx-category-search';

// Define interface for your API response
export interface ApiResponse {
  response: string;
  data: {
    marutiSuzuki: ApiItem[];
    hyundai: ApiItem[];
    renault: ApiItem[];
    toyota: ApiItem[];
    tata: ApiItem[];
    mahindra: ApiItem[];
    honda: ApiItem[];
    kia: ApiItem[];
    mg: ApiItem[];
    volkswagen: ApiItem[];
    carFeatures: ApiItem[]; // This will have null IDs
  };
}

export interface ApiItem {
  id: any;
  name: string;
}

// Define your app-specific data structure
export interface AppSpecificData extends SearchDataItem {
  id: any;
  friendlyId?: string;
  name: string;
  type: string;
}

// --- NEW: Helper function to escape regex characters ---
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Mock API data that will be filtered based on search term
  private mockApiData: ApiResponse = {
    response: "200 Ok",
    data: {
      marutiSuzuki: [
        { id: "MSZ000001", name: "Swift" },
        { id: "MSZ000002", name: "Baleno" },
        { id: "MSZ000003", name: "Alto" },
        { id: "MSZ000004", name: "Dzire" },
        { id: "MSZ000005", name: "Ertiga" },
        { id: "MSZ000006", name: "Brezza" },
        { id: "MSZ000007", name: "WagonR" },
        { id: "MSZ000008", name: "Celerio" },
        { id: "MSZ000009", name: "Ignis" },
        { id: "MSZ000010", name: "Ciaz" }
      ],
      hyundai: [
        { id: "HYD000001", name: "Creta" },
        { id: "HYD000002", name: "i20" },
        { id: "HYD000003", name: "Venue" },
        { id: "HYD000004", name: "i10" },
        { id: "HYD000005", name: "Verna" },
        { id: "HYD000006", name: "Aura" },
        { id: "HYD000007", name: "Alcazar" },
        { id: "HYD000008", name: "Tucson" },
        { id: "HYD000009", name: "Kona Electric" },
        { id: "HYD000010", name: "Grand i10 Nios" }
      ],
      renault: [
        { id: "RNT000001", name: "Kwid" },
        { id: "RNT000002", name: "Triber" },
        { id: "RNT000003", name: "Kiger" },
        { id: "RNT000004", name: "Duster" },
        { id: "RNT000005", name: "Captur" },
        { id: "RNT000006", name: "Lodgy" },
        { id: "RNT000007", name: "Fluence" },
        { id: "RNT000008", name: "Pulse" },
        { id: "RNT000009", name: "Scala" },
        { id: "RNT000010", name: "Koleos" }
      ],
      toyota: [
        { id: "TYT000001", name: "Innova Crysta" },
        { id: "TYT000002", name: "Fortuner" },
        { id: "TYT000003", name: "Glanza" },
        { id: "TYT000004", name: "Urban Cruiser" },
        { id: "TYT000005", name: "Camry" },
        { id: "TYT000006", name: "Vellfire" },
        { id: "TYT000007", name: "Yaris" },
        { id: "TYT000008", name: "Land Cruiser" },
        { id: "TYT000009", name: "Prius" },
        { id: "TYT000010", name: "Corolla Altis" }
      ],
      tata: [
        { id: "TAT000001", name: "Nexon" },
        { id: "TAT000002", name: "Harrier" },
        { id: "TAT000003", name: "Altroz" },
        { id: "TAT000004", name: "Tiago" },
        { id: "TAT000005", name: "Tigor" },
        { id: "TAT000006", name: "Safari" },
        { id: "TAT000007", name: "Punch" },
        { id: "TAT000008", name: "Hexa" },
        { id: "TAT000009", name: "Nexon EV" },
        { id: "TAT000010", name: "Tigor EV" }
      ],
      mahindra: [
        { id: "MHD000001", name: "Scorpio" },
        { id: "MHD000002", name: "XUV700" },
        { id: "MHD000003", name: "Thar" },
        { id: "MHD000004", name: "Bolero" },
        { id: "MHD000005", name: "XUV300" },
        { id: "MHD000006", name: "Marazzo" },
        { id: "MHD000007", name: "KUV100" },
        { id: "MHD000008", name: "Alturas G4" },
        { id: "MHD000009", name: "TUV300" },
        { id: "MHD000010", name: "XUV500" }
      ],
      honda: [
        { id: "HND000001", name: "City" },
        { id: "HND000002", name: "Amaze" },
        { id: "HND000003", name: "WR-V" },
        { id: "HND000004", name: "Jazz" },
        { id: "HND000005", name: "Civic" },
        { id: "HND000006", name: "CR-V" },
        { id: "HND000007", name: "Accord" },
        { id: "HND000008", name: "BR-V" },
        { id: "HND000009", name: "Brio" },
        { id: "HND000010", name: "Mobilio" }
      ],
      kia: [
        { id: "KIA000001", name: "Seltos" },
        { id: "KIA000002", name: "Sonet" },
        { id: "KIA000003", name: "Carnival" },
        { id: "KIA000004", name: "Carens" },
        { id: "KIA000005", name: "EV6" },
        { id: "KIA000006", name: "Sportage" },
        { id: "KIA000007", name: "Sorento" },
        { id: "KIA000008", name: "Rio" },
        { id: "KIA000009", name: "Soul" },
        { id: "KIA000010", name: "Stinger" }
      ],
      mg: [
        { id: "MGM000001", name: "Hector" },
        { id: "MGM000002", name: "Astor" },
        { id: "MGM000003", name: "ZS EV" },
        { id: "MGM000004", name: "Gloster" },
        { id: "MGM000005", name: "Hector Plus" },
        { id: "MGM000006", name: "MG 3" },
        { id: "MGM000007", name: "MG 5" },
        { id: "MGM000008", name: "MG 6" },
        { id: "MGM000009", name: "MG HS" },
        { id: "MGM000010", name: "MG Cyberster" }
      ],
      volkswagen: [
        { id: "VLK000001", name: "Polo" },
        { id: "VLK000002", name: "Vento" },
        { id: "VLK000003", name: "Taigun" },
        { id: "VLK000004", name: "Tiguan" },
        { id: "VLK000005", name: "Virtus" },
        { id: "VLK000006", name: "Passat" },
        { id: "VLK000007", name: "Jetta" },
        { id: "VLK000008", name: "T-Roc" },
        { id: "VLK000009", name: "Ameo" },
        { id: "VLK000010", name: "Tiguan Allspace" }
      ],
      carFeatures: [
        { id: null, name: "Air Conditioning" },
        { id: null, name: "Power Steering" },
        { id: null, name: "Airbags" },
        { id: null, name: "Anti-lock Braking System" },
        { id: null, name: "Infotainment System" },
        { id: null, name: "Sunroof" },
        { id: null, name: "Cruise Control" },
        { id: null, name: "Parking Sensors" },
        { id: null, name: "Electric Windows" },
        { id: null, name: "Navigation System" },
        { id: null, name: "Leather Seats" },
        { id: null, name: "Automatic Transmission" }
      ]
    }
  };

  constructor() { }

  // Simulate an API call with the search term
  searchItems(term: string): Observable<ApiResponse> {
    const trimmedTerm = term?.trim() ?? '';

    // If no search term, return empty results
    if (!trimmedTerm) {
      return of({
        response: "200 Ok",
        data: { 
          marutiSuzuki: [], 
          hyundai: [], 
          renault: [], 
          toyota: [],
          tata: [],
          mahindra: [],
          honda: [],
          kia: [],
          mg: [],
          volkswagen: [],
          carFeatures: []
        }
      }).pipe(delay(100)); // Simulate network delay (reduced for empty)
    }

    // Filter results based on search term using the new prioritized logic
    const filteredData: ApiResponse = {
      response: "200 Ok",
      data: {
        marutiSuzuki: this.filterAndSortItems(this.mockApiData.data.marutiSuzuki, trimmedTerm),
        hyundai: this.filterAndSortItems(this.mockApiData.data.hyundai, trimmedTerm),
        renault: this.filterAndSortItems(this.mockApiData.data.renault, trimmedTerm),
        toyota: this.filterAndSortItems(this.mockApiData.data.toyota, trimmedTerm),
        tata: this.filterAndSortItems(this.mockApiData.data.tata, trimmedTerm),
        mahindra: this.filterAndSortItems(this.mockApiData.data.mahindra, trimmedTerm),
        honda: this.filterAndSortItems(this.mockApiData.data.honda, trimmedTerm),
        kia: this.filterAndSortItems(this.mockApiData.data.kia, trimmedTerm),
        mg: this.filterAndSortItems(this.mockApiData.data.mg, trimmedTerm),
        volkswagen: this.filterAndSortItems(this.mockApiData.data.volkswagen, trimmedTerm),
        carFeatures: this.filterAndSortItems(this.mockApiData.data.carFeatures, trimmedTerm)
      }
    };

    // Return as Observable with delay to simulate network latency
    return of(filteredData).pipe(delay(300));
  }

  private filterAndSortItems(items: ApiItem[], term: string): ApiItem[] {
    const termLower = term.toLowerCase().trim();
    const terms = termLower.split(/\s+/); // Split search term into words
    
    // Check if we're dealing with a multi-word search
    const isMultiWordSearch = terms.length > 1;
    
    const scoredItems = items.map(item => {
      const itemName = item.name.toLowerCase();
      const words = itemName.split(/\s+/);
      let score = 0;
      
      // Generate the friendlyId based on item.id pattern
      let friendlyId = '';
      if (item.id !== null) {
        // For car models, extract the first 3 characters as the brand code
        friendlyId = `${item.id}`.toLowerCase();
      }
      
      // For multi-word searches, first check for exact matches
      if (isMultiWordSearch) {
        // Exact full string match gets highest priority
        if (itemName === termLower) {
          score = 10; // Higher than any other match
          return { item, score };
        }
        
        // Check if all terms appear in the item name in the exact order
        let allTermsMatched = true;
        let currentIndex = 0;
        
        for (const searchTerm of terms) {
          const termIndex = itemName.indexOf(searchTerm, currentIndex);
          if (termIndex === -1) {
            allTermsMatched = false;
            break;
          }
          currentIndex = termIndex + searchTerm.length;
        }
        
        if (allTermsMatched) {
          score = 8; // High priority for containing all terms in order
          return { item, score };
        }
      }
      
      // For single or multi-word searches, continue with other matching logic
      for (const searchTerm of terms) {
        if (!searchTerm) continue;
        
        // Exact item name match
        if (itemName === searchTerm) {
          score = 5;
          break;
        }
        
        // Exact friendlyId match
        if (friendlyId && friendlyId === searchTerm.toLowerCase()) {
          score = 5;
          break;
        }
        
        // Word match
        if (words.some(word => word === searchTerm)) {
          score = Math.max(score, 4);
          continue;
        }
        
        // FriendlyId partial matching (minimum 3 characters)
        if (friendlyId && searchTerm.length >= 3) {
          if (friendlyId.includes(searchTerm.toLowerCase())) {
            score = Math.max(score, 3);
            continue;
          }
        }
        
        // Word boundary checks
        const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(searchTerm)}\\b`, 'i');
        if (wordBoundaryRegex.test(itemName)) {
          score = Math.max(score, 2);
          continue;
        }
        
        // Part boundary checks
        const partBoundaryRegex = new RegExp(`\\b${escapeRegex(searchTerm)}[-_]|[-_]${escapeRegex(searchTerm)}\\b`, 'i');
        if (partBoundaryRegex.test(itemName)) {
          score = Math.max(score, 1);
        }
      }
      
      return { item, score };
    });
  
    // For multi-word searches, only return exact or sequential matches
    if (isMultiWordSearch) {
      return scoredItems
        .filter(scoredItem => scoredItem.score >= 8) // Only keep scores 8 or higher (exact or sequential)
        .sort((a, b) => b.score - a.score)
        .map(scoredItem => scoredItem.item);
    }
  
    // For single-word searches, keep the existing logic
    return scoredItems
      .filter(scoredItem => scoredItem.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(scoredItem => scoredItem.item);
  }

  // --- NEW: Method to get data for initial category calculation ---
  getInitialDataForCategories(): Observable<AppSpecificData[]> {
    // In a real app, this might be a separate, lighter API call
    // or you might fetch all data once and cache it.
    // Here, we'll map the entire mock dataset.
    console.log('[SearchService] Getting initial data for categories...');
    const initialData = this.mapApiResponseToSearchData(this.mockApiData);
    // Simulate a small delay if needed, though often initial data might be faster
    return of(initialData).pipe(delay(50));
  }

  // Convert API data to AppSpecificData format for the search component
  mapApiResponseToSearchData(apiResponse: ApiResponse): AppSpecificData[] {
    const searchData: AppSpecificData[] = [];
    
    // Add Maruti Suzuki
    apiResponse.data.marutiSuzuki.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Maruti Suzuki'
      });
    });
    
    // Add Hyundai
    apiResponse.data.hyundai.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Hyundai'
      });
    });
    
    // Add Renault
    apiResponse.data.renault.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Renault'
      });
    });
    
    // Add Toyota
    apiResponse.data.toyota.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Toyota'
      });
    });
    
    // Add Tata
    apiResponse.data.tata.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Tata'
      });
    });
    
    // Add Mahindra
    apiResponse.data.mahindra.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Mahindra'
      });
    });
    
    // Add Honda
    apiResponse.data.honda.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Honda'
      });
    });
    
    // Add Kia
    apiResponse.data.kia.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Kia'
      });
    });
    
    // Add MG
    apiResponse.data.mg.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'MG'
      });
    });
    
    // Add Volkswagen
    apiResponse.data.volkswagen.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: item.id,
        name: item.name,
        type: 'Volkswagen'
      });
    });
    
    // Add Car Features
    apiResponse.data.carFeatures.forEach(item => {
      searchData.push({
        id: item.id,
        friendlyId: `${item.id}`,
        name: item.name,
        type: 'Car Feature'
      });
    });
    
    return searchData;
  }
}