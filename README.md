# Movie Library App

A full-stack movie library application that allows users to browse, search, and manage their personal movie collection using The Movie Database (TMDB) API.

## Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript**
- **React Navigation** for routing

### Backend
- **Node.js** with Express
- **TypeScript**
- **MySQL** database
- **TMDB API** integration

## Project Structure

```
react-test/
├── my-app/                 # React Native frontend
│   ├── app/
│   ├── components/
│   ├── services/
│   └── ...
├── my-app-backend/         # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── routes/
│   │   └── services/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- TMDB API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd my-app-backend
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

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Update API base URL in `services/api.ts` if needed

4. **Start the development server:**
   ```bash
   npm start
   ```

## Features

- 🔍 **Movie Search**: Search TMDB for movies to add to your library
- 📚 **Personal Library**: View and manage your movie collection
- 🎬 **Movie Details**: Detailed information for each movie
- 🏷️ **Genre Support**: Movies are tagged with genres from TMDB
- 🔄 **Real-time Sorting**: Sort movies by title or release date
- 📱 **Responsive Design**: Optimized for mobile devices

## API Endpoints

### Movies
- `GET /api/movies/library` - Get user's movie library
- `POST /api/movies/library` - Add movie to library
- `GET /api/movies/search?q=query` - Search movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/genres/list` - Get available genres

## Database Schema

The application uses MySQL with the following main tables:
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
