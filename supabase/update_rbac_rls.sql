-- =============================================================================
-- ResearchMind — RBAC & soft-delete RLS Updates
-- =============================================================================

-- 1. Alter Enums to include 'archived'
ALTER TYPE public.publication_status ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE public.experiment_status ADD VALUE IF NOT EXISTS 'archived';

-- 2. Add is_archived columns to research entities
ALTER TABLE public.experiments ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.research_papers ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.datasets ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.research_decisions ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Add status column to research_decisions
ALTER TABLE public.research_decisions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'proposed';

-- 4. Drop existing RLS helper functions and recreate them with new checks
DROP FUNCTION IF EXISTS public.can_create_lab();
CREATE OR REPLACE FUNCTION public.can_create_lab()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_position TEXT;
BEGIN
  -- Get user position from user profile
  SELECT position INTO v_position FROM public.users WHERE id = auth.uid();
  
  -- If user has Professor, Associate Professor, Admin or PI role, allow
  IF v_position IN ('Professor', 'Associate Professor', 'Admin', 'PI') THEN
    RETURN TRUE;
  END IF;

  -- Block if they are registered as a non-privileged member/guest in any lab
  IF EXISTS (
    SELECT 1 
    FROM public.lab_members 
    WHERE user_id = auth.uid() 
      AND role IN ('member', 'guest')
  ) THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Helper to check if a user is a guest
CREATE OR REPLACE FUNCTION public.is_lab_guest(p_lab_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.lab_members
    WHERE  lab_id  = p_lab_id
      AND  user_id = auth.uid()
      AND  role    = 'guest'
      AND  is_active = TRUE
  );
$$;

-- 5. Recreate RLS Policies to enforce role restrictions

-- Labs Creation
DROP POLICY IF EXISTS "labs_insert_authenticated" ON public.labs;
CREATE POLICY "labs_insert_authenticated"
  ON public.labs FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid() AND public.can_create_lab());

-- Projects select
DROP POLICY IF EXISTS "projects_select_member_or_public" ON public.projects;
CREATE POLICY "projects_select_member_or_public"
  ON public.projects FOR SELECT
  TO authenticated
  USING (
    (is_public = TRUE AND NOT public.is_lab_guest(lab_id))
    OR (
      public.is_lab_member(lab_id)
      AND (
        NOT public.is_lab_guest(lab_id)
        OR status = 'completed'
      )
    )
  );

-- Experiments select
DROP POLICY IF EXISTS "experiments_select_lab_member" ON public.experiments;
CREATE POLICY "experiments_select_lab_member"
  ON public.experiments FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND NOT public.is_lab_guest(lab_id)
  );

-- Meetings select
DROP POLICY IF EXISTS "meetings_select_lab_member" ON public.meetings;
CREATE POLICY "meetings_select_lab_member"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND NOT public.is_lab_guest(lab_id)
  );

-- Decisions select
DROP POLICY IF EXISTS "decisions_select_lab_member" ON public.research_decisions;
CREATE POLICY "decisions_select_lab_member"
  ON public.research_decisions FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND (
      NOT public.is_lab_guest(lab_id)
      OR status = 'approved'
    )
  );

-- Publications select
DROP POLICY IF EXISTS "publications_select_lab_member" ON public.publications;
CREATE POLICY "publications_select_lab_member"
  ON public.publications FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND (
      NOT public.is_lab_guest(lab_id)
      OR status = 'published'
    )
  );

-- Enforce delete policies to block standard deletions (must be done by Soft-Delete update policies)
-- The application services will perform update operations to mark records as archived.

-- 6. Update user trigger to sync position and institution from raw metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, position, institution)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'position',
    NEW.raw_user_meta_data->>'institution'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
