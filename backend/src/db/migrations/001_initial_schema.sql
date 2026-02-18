-- Migration: 001_initial_schema.sql
-- Description: Initial database schema with users, user levels, and movie table
-- Created: 2024-01-22

-- User levels table (reference data)
CREATE TABLE IF NOT EXISTS user_level (
  id VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL UNIQUE,
  active TINYINT(1) DEFAULT 1,

  -- Prevent empty string IDs
  CONSTRAINT chk_id_not_empty CHECK (LENGTH(TRIM(id)) > 0),
  CONSTRAINT chk_display_name_not_empty CHECK (LENGTH(TRIM(display_name)) > 0),

  -- Indexes
  INDEX idx_active (active)
);

-- Insert default user levels
INSERT INTO user_level (id, display_name) VALUES
('basic', 'basic'),
('admin', 'admin')
ON DUPLICATE KEY UPDATE active = 1;

-- Movie genres table (TMDB genre reference data)
CREATE TABLE IF NOT EXISTS movie_genres (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active TINYINT(1) DEFAULT 1,

  -- Prevent empty strings
  CONSTRAINT chk_genre_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Insert common TMDB genres
INSERT INTO movie_genres (id, name) VALUES
(28, 'Action'),
(12, 'Adventure'),
(16, 'Animation'),
(35, 'Comedy'),
(80, 'Crime'),
(99, 'Documentary'),
(18, 'Drama'),
(10751, 'Family'),
(14, 'Fantasy'),
(36, 'History'),
(27, 'Horror'),
(10402, 'Music'),
(9648, 'Mystery'),
(10749, 'Romance'),
(878, 'Science Fiction'),
(10770, 'TV Movie'),
(53, 'Thriller'),
(10752, 'War'),
(37, 'Western')
ON DUPLICATE KEY UPDATE active = 1;

-- Movie has genre junction table
CREATE TABLE IF NOT EXISTS movie_has_genre (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,

  PRIMARY KEY (movie_id, genre_id),

  -- Foreign keys
  CONSTRAINT fk_movie_has_genre_movie FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
  CONSTRAINT fk_movie_has_genre_genre FOREIGN KEY (genre_id) REFERENCES movie_genres(id),

  -- Indexes for performance
  INDEX idx_movie_has_genre_movie_id (movie_id),
  INDEX idx_movie_has_genre_genre_id (genre_id)
);

-- Users table
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_level VARCHAR(50) DEFAULT 'basic',
  avatar_img_data LONGBLOB,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Prevent empty strings in name fields and user_level
  CONSTRAINT chk_first_name_not_empty CHECK (first_name IS NULL OR LENGTH(TRIM(first_name)) > 0),
  CONSTRAINT chk_last_name_not_empty CHECK (last_name IS NULL OR LENGTH(TRIM(last_name)) > 0),
  CONSTRAINT chk_user_level_not_empty CHECK (LENGTH(TRIM(user_level)) > 0),

  -- Foreign key to user levels
  CONSTRAINT fk_user_level FOREIGN KEY (user_level) REFERENCES user_level(id),

  -- Indexes
  INDEX idx_email (email),
  INDEX idx_active (active),
  INDEX idx_created_at (created_at)
);

-- Movie table for movie library
CREATE TABLE IF NOT EXISTS movie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tmdb_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  release_date DATE,
  poster_path VARCHAR(500),
  backdrop_path VARCHAR(500),
  overview TEXT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active TINYINT(1) DEFAULT 1,

  -- Prevent duplicate movie
  UNIQUE KEY unique_movie (tmdb_id),

  -- Indexes for performance
  INDEX idx_active (active),
  INDEX idx_added_at (added_at)
);

-- Card table for card library
CREATE TABLE card (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  scryfall_id CHAR(36) NOT NULL,
  scryfall_data JSON NOT NULL,
  name VARCHAR(255) NOT NULL,
  non_foil_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  foil_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY (scryfall_id),
  INDEX idx_name (name)
);
