#!/usr/bin/env node

/**
 * Database Migration Runner
 *
 * Usage:
 *   node migrations/migrate.js          # Run all pending migrations
 *   node migrations/migrate.js --status # Show migration status
 *   node migrations/migrate.js --create # Create new migration file
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Import config
require('dotenv').config();
const config = require('../../config');

const MIGRATIONS_DIR = path.join(__dirname);
const MIGRATIONS_TABLE = 'schema_migrations';

async function getConnection() {
  return await mysql.createConnection({
    host: config.app.mysql_host || config.db.host,
    user: config.app.mysql_user || config.db.user,
    password: config.app.mysql_pass || config.db.pass,
    database: config.app.mysql_database || config.db.schema,
    multipleStatements: true
  });
}

async function ensureMigrationsTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.execute(query);
}

async function getExecutedMigrations(connection) {
  try {
    const [rows] = await connection.execute(
      `SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY id ASC`
    );
    return rows.map(row => row.filename);
  } catch (error) {
    return [];
  }
}

async function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql') && file !== 'migrate.js')
    .sort();
  return files;
}

async function executeMigration(connection, filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, 'utf8');

  console.log(`Executing migration: ${filename}`);

  // Split SQL by semicolons and execute each statement
  const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await connection.execute(statement);
      } catch (error) {
        console.error(`Error executing statement in ${filename}:`, error.message);
        throw error;
      }
    }
  }

  // Record migration as executed
  await connection.execute(
    `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES (?)`,
    [filename]
  );

  console.log(`✓ Migration ${filename} completed`);
}

async function runMigrations() {
  let connection;

  try {
    console.log('Starting database migrations...\n');

    connection = await getConnection();
    await ensureMigrationsTable(connection);

    const executedMigrations = await getExecutedMigrations(connection);
    const migrationFiles = await getMigrationFiles();

    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('✓ No pending migrations');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach(file => console.log(`  - ${file}`));
    console.log('');

    for (const migration of pendingMigrations) {
      await executeMigration(connection, migration);
    }

    console.log('\n✓ All migrations completed successfully!');

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function showStatus() {
  let connection;

  try {
    connection = await getConnection();
    await ensureMigrationsTable(connection);

    const executedMigrations = await getExecutedMigrations(connection);
    const migrationFiles = await getMigrationFiles();

    console.log('Migration Status:');
    console.log('================');

    migrationFiles.forEach(file => {
      const status = executedMigrations.includes(file) ? '✓' : '○';
      console.log(`${status} ${file}`);
    });

  } catch (error) {
    console.error('Error checking migration status:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createMigration() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${timestamp}_new_migration.sql`;

  const template = `-- Migration: ${filename}
-- Description: [Brief description of what this migration does]
-- Created: ${new Date().toISOString().split('T')[0]}

-- Add your SQL statements here
`;

  fs.writeFileSync(path.join(MIGRATIONS_DIR, filename), template);
  console.log(`Created new migration: ${filename}`);
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case '--status':
    showStatus();
    break;
  case '--create':
    createMigration();
    break;
  default:
    runMigrations();
    break;
}
