-- ============================================================
-- Learning Platform - Database Initialization Script
-- ============================================================
-- This script is run when PostgreSQL container first starts
-- It sets up the database, extensions, and initial schema

-- ==================== Extensions ====================
-- Enable required PostgreSQL extensions

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search in Chinese (if needed)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== Custom Types ====================

-- User roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User status
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course status
DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Video status
DO $$ BEGIN
    CREATE TYPE video_status AS ENUM ('uploading', 'processing', 'ready', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Order status
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'refunded', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment status
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==================== Functions ====================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==================== Indexes (Common Patterns) ====================
-- Note: SQLAlchemy/Alembic will create tables and most indexes
-- These are additional indexes for optimization

-- Create indexes after tables exist (run after Alembic migrations)
-- Example: CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- ==================== Initial Data ====================

-- Insert default categories (if courses table exists)
-- This will be handled by Alembic seed data or application code

-- ==================== Grants ====================
-- Grant permissions to application user

-- Note: The main database user is set via POSTGRES_USER env var
-- Additional grants can be added here if using separate read-only users

-- ==================== Maintenance ====================

-- Set default statistics target for better query planning
ALTER DATABASE learning_platform SET default_statistics_target = 100;

-- Enable auto-vacuum optimization
ALTER DATABASE learning_platform SET autovacuum_vacuum_scale_factor = 0.1;
ALTER DATABASE learning_platform SET autovacuum_analyze_scale_factor = 0.05;

-- ============================================================
-- End of initialization script
-- ============================================================
