# 🚀 @r-ko/ngx-category-search Demo

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

<div align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png" alt="Angular Logo" width="100">
  <br>
  <h3>Official Demo Application for @r-ko/ngx-category-search</h3>
  <a href="https://www.npmjs.com/package/@r-ko/ngx-category-search">
    <img src="https://img.shields.io/npm/v/@r-ko/ngx-category-search?label=npm&style=flat-square" alt="NPM Version">
  </a>
</div>

## ✨ Demo Overview

This application serves as the official demonstration of the `@r-ko/ngx-category-search` Angular library. The demo showcases how to implement a powerful, category-based search interface using the library with an example dataset of Indian car brands and models.

### 📦 About the Library

The `@r-ko/ngx-category-search` is a versatile Angular component that provides:
- Category-based search functionality
- Real-time filtering
- Custom templates for search results
- Keyboard navigation
- Recent searches tracking
- Category indicators with counts

**[View on npm](https://www.npmjs.com/package/@r-ko/ngx-category-search) | [GitHub Repository](https://github.com/yourusername/ngx-category-search)**

## 🌟 Key Features

- **🔍 Advanced Category Search**: Find car models across 10 major Indian car brands
- **🚗 Comprehensive Car Database**: Over 100 car models from manufacturers like Maruti Suzuki, Hyundai, Tata, and more
- **⚡ Prioritized Search Logic**: Smart ranking algorithm that understands search intent
- **🎭 Interactive Animations**: Visual feedback shows search process and data flow
- **📱 Responsive Design**: Works beautifully on all devices and screen sizes
- **🧩 Multiple Search Categories**: Filter by car brand, model, or feature

## 🚗 Car Brands Featured

| Brand | Logo | Popular Models |
|-------|------|----------------|
| Maruti Suzuki | 🚗 | Swift, Baleno, Alto, Dzire |
| Hyundai | 🚙 | Creta, i20, Venue, Verna |
| Tata | 🚚 | Nexon, Harrier, Altroz, Tiago |
| Mahindra | 🚜 | Scorpio, XUV700, Thar, Bolero |
| Honda | 🏍️ | City, Amaze, WR-V, Jazz |
| Toyota | 🚐 | Innova Crysta, Fortuner, Glanza |
| Renault | 🚘 | Kwid, Triber, Kiger, Duster |
| Kia | 🚗 | Seltos, Sonet, Carnival, Carens |
| MG | 🚓 | Hector, Astor, ZS EV, Gloster |
| Volkswagen | 🚕 | Polo, Vento, Taigun, Tiguan |

## 🏗️ Architecture

The application uses a clean, modular architecture:

```
src/
├── app/
│   ├── home-page/               # Main search interface
│   │   ├── home-page.component.ts
│   │   ├── home-page.component.html
│   │   ├── home-page.component.css
│   │   └── search.service.ts    # Search logic and data provider
│   ├── shared/                  # Shared components and utilities
│   └── app.module.ts
├── assets/                      # Static resources
└── styles/                      # Global styles
```

## 🛠️ Technical Implementation

- **Smart Search Algorithm**: Implements multi-word search with sequential matching
- **Friendly ID System**: Car models use 6-digit IDs with 3-digit brand prefixes
- **RxJS Integration**: Reactive search with debounce and proper subscription management
- **Category Indicators**: Visual cues help distinguish between car brands
- **Mock API**: Simulated backend with configurable response delays

## 📖 Usage Examples

```typescript
// Search for specific models
"Swift"         // Finds Maruti Suzuki Swift
"Creta Hyundai" // Finds Hyundai Creta

// Search by ID
"MSZ000001"     // Finds Maruti Suzuki Swift
"HYD000004"     // Finds Hyundai i10

// Search by feature
"Electric"      // Finds all electric vehicles
"SUV"           // Finds SUV models
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Navigate to `http://localhost:4200/`

## 🎨 Customization

The search interface can be easily customized:
- Add new car brands or models to the `mockApiData` object in `search.service.ts`
- Modify search behavior in the `filterAndSortItems` method
- Update the visual appearance through the CSS files

## 📋 Future Enhancements

- [ ] Add detailed car specifications
- [ ] Implement price comparison features
- [ ] Add dealer location finder
- [ ] Create test drive booking functionality
- [ ] Integrate real-time inventory data

---

<div align="center">
  <p>Powered by <a href="https://www.npmjs.com/package/@r-ko/ngx-category-search">@r-ko/ngx-category-search</a></p>
  <p>Created with ❤️ for all Indian car enthusiasts</p>
</div>