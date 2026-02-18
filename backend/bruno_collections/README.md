# Bruno API Tests

This collection contains API tests for the Home Server backend.

## Setup

1. Install Bruno: https://www.usebruno.com/
2. Open this collection in Bruno
3. Select the "Local" environment
4. Run tests

## API Key Security

The TMDB API key is handled server-side and not exposed in these tests. The backend reads the API key from environment variables:

- `TMDB_API_KEY` - Your TMDB API key (set in `.env` file)

## Available Tests

### Movies API
- **Search Movies** - Search for movies by query
- **Popular Movies** - Get popular movies
- **Movie Details** - Get detailed info for a specific movie
- **Movie Credits** - Get cast and crew for a movie

### Users API
- **Login** - User authentication
- **Register** - User registration
- **User Levels** - Get available user levels

## Environment Variables

Create a `.env` file in the backend root with:
```
TMDB_API_KEY=your_tmdb_api_key_here
MYSQL_HOST=localhost
MYSQL_DATABASE=your_db
MYSQL_USER=your_user
MYSQL_PASS=your_password
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## Running Tests

1. Start your backend server: `npm start`
2. Open Bruno and load this collection
3. Select "Local" environment
4. Run individual tests or the full collection

## Test Variables

Some tests use pre-request variables that can be modified:
- `movie_query` - Search term for movie search
- `movie_id` - TMDB movie ID for details/credits tests
