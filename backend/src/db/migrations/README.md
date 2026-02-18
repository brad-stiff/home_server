# Database Migrations

This directory contains database migration files for managing schema changes over time.

## 📁 Structure

```
migrations/
├── 001_initial_schema.sql    # Initial database schema
├── 002_add_new_feature.sql   # Future migrations (timestamped)
├── migrate.js                # Migration runner script
└── README.md                 # This file
```

## 🚀 Usage

### Run All Pending Migrations

```bash
# From the backend root directory
node migrations/migrate.js
```

### Check Migration Status

```bash
node migrations/migrate.js --status
```

### Create New Migration

```bash
node migrations/migrate.js --create
```

## 📋 Migration Files

### Naming Convention
- Files are named with timestamps: `YYY-MM-DD-HH-MM-SS_description.sql`
- Example: `2024-01-22-14-30-00_add_user_profiles.sql`

### File Structure
Each migration file should contain:

```sql
-- Migration: 001_initial_schema.sql
-- Description: Brief description of what this migration does
-- Created: 2024-01-22

-- Your SQL statements here
CREATE TABLE example (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

### Best Practices

1. **Idempotent**: Use `IF NOT EXISTS` and `INSERT IGNORE` where appropriate
2. **Transactional**: Each migration should be atomic
3. **Descriptive**: Clear comments explaining what each change does
4. **Tested**: Test migrations on a copy of production data first
5. **Reversible**: Consider how to undo changes if needed

## 🔄 How It Works

1. **Migrations Table**: Tracks which migrations have been executed
2. **Version Control**: Git tracks migration files
3. **Order Execution**: Files run in alphabetical order
4. **No Re-runs**: Already executed migrations are skipped

## 🗃️ Current Schema

### Tables Created:
- `user_level` - User permission levels
- `user` - User accounts and profiles
- `movies` - User movie library
- `schema_migrations` - Migration tracking (auto-created)

### Sample Data:
- Default user levels (Regular, Premium, Admin)
- Sample users for testing
- Sample movies in user libraries

## 🛠️ Development Workflow

1. **Make Schema Changes**:
   ```bash
   node migrations/migrate.js --create
   ```

2. **Edit Migration File**:
   Add your SQL statements to the new migration file

3. **Test Migration**:
   ```bash
   node migrations/migrate.js --status  # Check status
   node migrations/migrate.js           # Run migrations
   ```

4. **Commit Changes**:
   ```bash
   git add migrations/
   git commit -m "Add new database migration"
   ```

## ⚠️ Important Notes

- **Never Edit Executed Migrations**: Create new migrations instead
- **Test on Development First**: Always test migrations before production
- **Backup Data**: Backup database before running migrations
- **Team Coordination**: Communicate schema changes to team members

## 🔧 Environment Setup

Make sure your `.env` file has the correct database credentials:

```env
MYSQL_HOST=localhost
MYSQL_DATABASE=your_database
MYSQL_USER=your_username
MYSQL_PASS=your_password
```

The migration script will use these credentials to connect to your database.
