# CS601 Final Project - Full Stack Portfolio

A modern full-stack TypeScript portfolio application showcasing React 19 with direct external API integrations.

## 🎯 Project Overview

This portfolio demonstrates advanced web development skills including:
- Interactive drag-and-drop game with New England state capitals
- Real-time location detection and weather information
- Live tech news feed from Hacker News
- Boston sports team scores (Bruins, Red Sox, Patriots, Celtics)
- Responsive design with CSS Grid, Flexbox, and custom CSS variables
- Clean architecture with service layer for API calls

## 📁 Project Structure

```
cs601_final/
├── frontend/             # React + TypeScript app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service functions
│   │   │   ├── capitalsService.ts
│   │   │   ├── weatherService.ts
│   │   │   ├── newsService.ts
│   │   │   └── sportsService.ts
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app with routing
│   │   ├── main.tsx      # Entry point
│   │   └── styles.css    # Global styles
│   ├── index.html
│   ├── package.json      # All dependencies
│   ├── tsconfig.json
│   └── vite.config.ts
├── vercel.json           # Vercel deployment config
├── package.json          # Root scripts
└── README.md
```

## ✨ Features

### Frontend
- **React 19 with TypeScript** - Modern React with hooks and functional components
- **React Router v7** - Client-side routing with 6 distinct pages
- **Vite** - Lightning-fast development server and optimized builds
- **CSS Variables** - Centralized design system with custom properties
- **Responsive Design** - Mobile-first approach with CSS Grid and Flexbox
- **Service Layer Architecture** - Clean separation of API logic in service modules
- **Interactive Components**:
  - Drag-and-drop capitals matching game
  - Browser geolocation with weather display
  - Tech news feed with external links
  - Sports scores with win/loss indicators
  - Navigation cards with hover effects

### External API Integrations
- **ESPN API** - Sports scores (public endpoints, no authentication)
- **Hacker News API** - Tech news stories
- **Open-Meteo API** - Weather data in Fahrenheit
- **OpenStreetMap Nominatim** - Geocoding and reverse geocoding

All API calls are handled directly from the frontend through service modules in `src/services/`.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Vercel CLI** - Install globally: `npm install -g vercel`
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thedude459/cs601_final.git
   cd cs601_final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Or install directly in the frontend folder:
   ```bash
   cd frontend && npm install
   ```

### Development

**Run the application locally:**

```bash
cd frontend
npm run dev
```

This starts the Vite development server, typically on `http://localhost:5173`.

The application makes direct API calls to external services (ESPN, Hacker News, Open-Meteo, OpenStreetMap) from the browser.

### Building for Production

**Build the frontend:**
```bash
npm run build
```

This creates an optimized production build in `frontend/dist/`.

### Deployment

**Deploy to Vercel:**

```bash
vercel          # Preview deployment
vercel --prod   # Production deployment
```

The deployment serves the static frontend built by Vite. All API calls are made directly from the browser to external services.

### Code Quality

**Lint the code:**
```bash
npm run lint
```

**Auto-fix linting issues:**
```bash
npm run lint:fix
```

The project uses:
- ESLint 9 with flat config
- Prettier for code formatting
- TypeScript strict mode

## 🌐 Service Architecture

The application uses a service layer pattern for clean API integration:

### `src/services/capitalsService.ts`
Provides static data for the drag-and-drop game:
- `getCapitals()` - Returns New England state capitals

### `src/services/weatherService.ts`
Integrates with Open-Meteo and OpenStreetMap:
- `getWeather(lat, lon)` - Fetches weather data based on coordinates
- Returns temperature, conditions, wind, humidity, UV index, etc.

### `src/services/newsService.ts`
Integrates with Hacker News API:
- `getNews()` - Fetches top 12 tech news stories
- Returns articles with title, description, URL, and timestamp

### `src/services/sportsService.ts`
Integrates with ESPN API:
- `getSportsScores()` - Fetches recent games for Boston teams
- Returns scores for Bruins, Red Sox, Patriots, and Celtics
  ]
}
```

### GET `/api/weather`
Returns weather data for given coordinates.

**Query Parameters:**
- `lat` - Latitude (required)
- `lon` - Longitude (required)

**Response:**
```json
{
  "temperature": 45.2,
  "conditions": "Partly cloudy",
  "windSpeed": 12.5,
  "location": "Boston, MA"
}
```

### GET `/api/news`
Returns top 12 tech stories from Hacker News.

**Response:**
```json
{
  "articles": [
    {
      "title": "Story Title",
      "url": "https://...",
      "source": { "name": "Hacker News" },
      "publishedAt": "2025-12-08T...",
      "description": "Story excerpt..."
    }
  ]
}
```

### GET `/api/sports`
Returns recent game scores for Boston sports teams (7-day lookback).

**Response:**
```json
{
  "games": [
    {
      "team": "Boston Bruins",
      "logo": "🏒",
      "opponent": "Toronto Maple Leafs",
      "teamScore": 4,
      "opponentScore": 2,
      "status": "Final",
      "date": "2025-12-07"
    }
  ]
}
```

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with navigation cards to all features |
| `/drag-drop` | Interactive New England capitals matching game |
| `/geolocation` | Location detection with weather information |
| `/news` | Latest tech news from Hacker News |
| `/sports` | Boston sports team scores (last 7 days) |
| `/about` | Project information and technologies used |

## 🎨 Design System

### Color Palette
- **Primary**: `#10b981` (Green)
- **Secondary**: `#3b82f6` (Blue)
- **Text**: `#333` / `#495057` / `#6c757d`
- **Background**: `#ffffff` / `#f8f9fa`
- **Gradient**: Linear gradient from green to blue

### CSS Architecture
- CSS custom properties (variables) for consistent theming
- Modular component-based styling
- Responsive breakpoints at 768px
- Smooth animations and transitions

## 🛠️ Technologies

### Frontend Stack
- React 19
- TypeScript 5.7
- React Router DOM v7
- Vite 7
- ESLint 9 (flat config)
- Prettier 3.7

### External APIs
- ESPN API (sports scores)
- Hacker News API (tech news)
- Open-Meteo API (weather)
- OpenStreetMap API (geocoding)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Matthew Savage**
- GitHub: [@thedude459](https://github.com/thedude459)
- Course: CS601 - Web Application Development
