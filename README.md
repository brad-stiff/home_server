# Home Server App

A full-stack home server application featuring a movie library and basic games. Built as a centralized entertainment and media hub for home networks.

## Current Features

- 🎬 **Movie Library**: Browse, search, and manage your personal movie collection using The Movie Database (TMDB) API
- 🎮 **Basic Games**: Simple games for entertainment

## Tech Stack

### Frontend Mobile
- **React Native** with Expo
- **TypeScript**
- **React Navigation** for routing

### Backend
- **Node.js** with Express
- **TypeScript**
- **MySQL** database
- **TMDB API** integration
- **Scryfall API** integration

## Project Structure

```
home-server/
├── backend/                # Node.js backend server
│   ├── bruno_collections   # Api request collections for testing
│   ├── src/
│   │   ├── config/         # App configuration files
│   │   ├── db/             # Database layer
│   │   │   ├── sql/        # SQL queries
│   │   │   └── migrations/ # Database migrations
│   │   ├── loaders/        # Initializes services
│   │   ├── router/         # Routing layer
│   │   │   ├── controllers/    # Route-specific logic
│   │   │   ├── middleware/     # Auth, validation, rate limiting, etc.
│   │   │   ├── routes/         # Route definitions
│   │   │   └── validators/     # Request validation schemas
│   │   └── services/       # External service integrations
│   └── ...
├── core/                   # App shared utilities
│   ├── types/              # Typescript object definitions
│   └── ...
├── frontend-mobile/        # React Native frontend (Expo)
│   ├── app/
│   │   ├── (tabs)/         # App screens/tabs
│   │   │   ├── movies.tsx      # Movie library interface
│   │   │   └── games.tsx       # Games interface
│   ├── components/         # Reusable UI components
│   ├── context/            # Global app context
│   ├── services/           # API services
│   ├── types/              # Typescript object definitions
│   ├── utils/              # Helper functions and utilities
│   └── ...
├── frontend-web/           # React frontend (Vite)
│   ├── TBD - Work In Progress
│   └── ...
└── README.md
```

## Getting Started

This home server application provides a centralized platform for entertainment and media management on your local network. Currently features a movie library and basic games, with a modular architecture for easy expansion.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- TMDB API key (for movie features)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Add your TMDB API key
   - Configure database connection settings

4. **Database Setup:**
   ```bash
   npm run migrate
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

### Frontend Mobile Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Add your API base URL

4. **Start the development server:**
   ```bash
   npm start
   ```

## Features

### Card Library Module
- 🔍 **Card Search**: Search Scryfall for cards to add to your library
- 📚 **Personal Library**: View and manage your card collection with persistent storage

### Movie Library Module
- 🔍 **Movie Search**: Search The Movie Database (TMDB) for movies to add to your library
- 📚 **Personal Library**: View and manage your movie collection with persistent storage
- 🎬 **Movie Details**: Detailed information including cast, crew, and descriptions
- 🏷️ **Genre Support**: Automatic genre tagging from TMDB with visual sorting
- 🔄 **Smart Sorting**: Sort by title (ascending/descending) or release date
- 📱 **Mobile-First Design**: Optimized interface for tablets and phones

### Games Module
- 🎮 **Basic Games**: Simple entertainment games
- 🔄 **Extensible Architecture**: Easy to add new games and features

### Platform Features
- 🏠 **Home Server**: Designed to run on local home networks
- 📡 **API-Driven**: RESTful API backend with modular architecture
- 💾 **Persistent Storage**: MySQL database for data persistence
- 🔧 **Modular Design**: Easy to add new apps and features

## API Architecture

The backend provides a RESTful API with modular endpoints for different features:

### Cards Module
- `GET    /api/cards/library` - Get user's card library
- `POST   /api/cards/library` - Update library card count
- `GET    /api/cards/sets` - Get Scryfall MTG sets
- `GET    /api/cards/sets/:set_id/cards` - Get Scryfall MTG card data by set
- `GET    /api/cards/:scryfall_card_id` - Get Scryfall MTG card data by id

### Movies Module
- `GET    /api/movies/library` - Get user's movie library
- `POST   /api/movies/library` - Add movie to library
- `DELETE /api/movies/library/:id` - Remove movie from library
- `GET    /api/movies/search?q=query` - Search TMDB movies
- `GET    /api/movies/now-playing` - Get movies in theaters
- `GET    /api/movies/popular` - Get popular movies
- `GET    /api/movies/top-rated` - Get top rated movies
- `GET    /api/movies/upcoming` - Get upcoming movie releases
- `GET    /api/movies/genres/list` - Get available movie genres
- `GET    /api/movies/:id` - Get detailed movie information
- `GET    /api/movies/:id/credits` - Get movie cast and crew
- `GET    /api/movies/:id/images` - Get movie logos and posters
- `GET    /api/movies/:id/recommendations` - Get recommended movies
- `GET    /api/movies/:id/similar` - Get similar movies

### Extensible Design
The API is designed with modularity in mind. New features and modules can be added by:
- Creating new route files in `/routes/`
- Adding corresponding controllers
- Extending the database schema as needed

## Database Schema

The application uses MySQL with the following main tables:
- `card` - Card information
- `movie` - Movie information
- `movie_genres` - Genre definitions
- `movie_has_genre` - Many-to-many relationship between movies and genres
- `user` - User accounts

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations

**Frontend:**
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

## Future Development

This home server platform is designed for expansion. Potential modules to add:
- 📺 **TV Shows**: Series tracking and episode management
- 🎵 **Music Library**: Personal music collection management
- 📖 **Book Tracker**: Reading list and progress tracking
- 📊 **Usage Analytics**: View statistics and recommendations
- 👥 **Multi-user Support**: Family accounts and sharing
- 📱 **Mobile Apps**: Native apps for different platforms

### Adding New Modules

1. **Backend**: Create new routes and controllers following the existing pattern
2. **Database**: Add migrations for new data models
3. **Frontend**: Add new screens/tabs in the React Native app
4. **API**: Extend the API service layer for new endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
