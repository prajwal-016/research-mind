-- =============================================================================
-- ResearchMind — Total Database Purge & Reset Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- WARNING: This will permanently delete ALL users, labs, projects, and data.
-- =============================================================================

-- 1. Disable constraints and triggers temporarily
SET session_replication_role = 'replica';

-- 2. Truncate all public database tables
TRUNCATE TABLE 
  public.memory_queue,
  public.activity_logs,
  public.notifications,
  public.publications,
  public.research_decisions,
  public.meetings,
  public.datasets,
  public.research_papers,
  public.experiments,
  public.project_members,
  public.projects,
  public.lab_members,
  public.labs,
  public.users
CASCADE;

-- 3. Clear all Supabase Auth user accounts
-- (Foreign key CASCADE constraints will clean up any left-over profile rows)
DELETE FROM auth.users;

-- 4. Re-enable constraints and triggers
SET session_replication_role = 'origin';

SELECT 'Database successfully reset to a blank canvas!' as status;
