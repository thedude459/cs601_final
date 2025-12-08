# CS601 Final Project - Full Stack Portfolio

A modern full-stack TypeScript portfolio application showcasing React 19, Express backend, and integration with multiple external APIs.

## 🎯 Project Overview

This portfolio demonstrates advanced web development skills including:
- Interactive drag-and-drop game with New England state capitals
- Real-time location detection and weather information
- Live tech news feed from Hacker News
- Boston sports team scores (Bruins, Red Sox, Patriots, Celtics)
- Responsive design with CSS Grid, Flexbox, and custom CSS variables
- Clean architecture with separate frontend and backend

## 📁 Project Structure

```
cs601_final/
├── backend/              # Express API server
│   ├── src/
│   │   └── server.ts     # API endpoints and integrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # React + TypeScript app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app with routing
│   │   ├── main.tsx      # Entry point
│   │   └── styles.css    # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
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
- **Interactive Components**:
  - Drag-and-drop capitals matching game
  - Browser geolocation with weather display
  - Tech news feed with external links
  - Sports scores with win/loss indicators
  - Navigation cards with hover effects

### Backend
- **Express 4** - RESTful API server
- **TypeScript** - Type-safe server code
- **CORS Enabled** - Secure cross-origin requests
- **External API Integrations**:
  - **ESPN API** - Sports scores (public endpoints, no authentication)
  - **Hacker News API** - Tech news stories
  - **Open-Meteo API** - Weather data in Fahrenheit
  - **OpenStreetMap Nominatim** - Geocoding and reverse geocoding

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thedude459/cs601_final.git
   cd cs601_final
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

### Development

Run both servers in separate terminals:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

The frontend is configured to proxy API requests to the backend automatically.

### Building for Production

**Build both frontend and backend:**
```bash
npm run build
```

**Or build individually:**
```bash
npm run build:backend   # Compiles TypeScript to dist/
npm run build:frontend  # Creates optimized build in dist/
```

### Code Quality

**Lint both projects:**
```bash
npm run lint
```

**Auto-fix linting issues:**
```bash
npm run lint:fix
```

Both frontend and backend use:
- ESLint 9 with flat config
- Prettier for code formatting
- TypeScript strict mode

## 🌐 API Endpoints

### GET `/api/capitals`
Returns New England state capitals for the drag-and-drop game.

**Response:**
```json
{
  "capitals": [
    { "state": "Massachusetts", "capital": "Boston", "emoji": "🏛️" },
    { "state": "Connecticut", "capital": "Hartford", "emoji": "⚓" }
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

### Backend Stack
- Node.js
- Express 4
- TypeScript 5.7
- Axios (HTTP client)
- CORS
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
