-- =============================================================================
-- ResearchMind — Supabase PostgreSQL Schema
-- =============================================================================
-- Run this file in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Execute the sections in order:
--   1. Extensions & helpers
--   2. Enum types
--   3. Tables
--   4. Foreign keys & indexes
--   5. Row Level Security (RLS)
--   6. Triggers & functions
--   7. Realtime publication
-- =============================================================================


-- =============================================================================
-- 1. EXTENSIONS & HELPERS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram indexes for full-text search


-- =============================================================================
-- 2. ENUM TYPES
-- =============================================================================

-- Lab membership roles
CREATE TYPE lab_role AS ENUM (
  'owner',
  'admin',
  'member',
  'guest'
);

-- Project / experiment lifecycle
CREATE TYPE project_status AS ENUM (
  'planning',
  'active',
  'paused',
  'completed',
  'archived'
);

CREATE TYPE experiment_status AS ENUM (
  'draft',
  'running',
  'completed',
  'failed',
  'cancelled',
  'archived'
);

-- Paper / publication types
CREATE TYPE paper_type AS ENUM (
  'preprint',
  'journal_article',
  'conference_paper',
  'thesis',
  'book_chapter',
  'technical_report',
  'other'
);

CREATE TYPE publication_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'published',
  'rejected',
  'withdrawn',
  'archived'
);

-- Dataset formats
CREATE TYPE dataset_type AS ENUM (
  'csv',
  'json',
  'parquet',
  'hdf5',
  'image',
  'video',
  'audio',
  'text',
  'other'
);

-- Meeting types
CREATE TYPE meeting_type AS ENUM (
  'lab_meeting',
  'one_on_one',
  'project_sync',
  'seminar',
  'conference',
  'external',
  'other'
);

-- Decision importance
CREATE TYPE decision_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'mention',
  'comment',
  'decision',
  'experiment_update',
  'paper_update',
  'meeting_reminder',
  'lab_invite',
  'system'
);

-- Activity log entity types (for polymorphic reference)
CREATE TYPE entity_type AS ENUM (
  'lab',
  'project',
  'experiment',
  'research_paper',
  'dataset',
  'meeting',
  'research_decision',
  'publication',
  'user'
);

-- Activity log action types
CREATE TYPE activity_action AS ENUM (
  'created',
  'updated',
  'deleted',
  'archived',
  'restored',
  'shared',
  'commented',
  'mentioned',
  'uploaded',
  'exported'
);


-- =============================================================================
-- 3. TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 3.1  users  (profile extending auth.users)
-- ---------------------------------------------------------------------------
-- One-to-one with auth.users. Created automatically via trigger on sign-up.

CREATE TABLE IF NOT EXISTS public.users (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  position        TEXT,                            -- e.g. "PhD Student", "Professor"
  institution     TEXT,
  orcid_id        TEXT        UNIQUE,              -- ORCID researcher identifier
  google_scholar  TEXT,
  linkedin_url    TEXT,
  website_url     TEXT,
  preferences     JSONB       NOT NULL DEFAULT '{}',
  cognee_user_id  TEXT,                            -- Cognee memory layer reference
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.users IS 'User profiles, extending auth.users with researcher-specific metadata.';
COMMENT ON COLUMN public.users.orcid_id       IS 'Open Researcher and Contributor ID.';
COMMENT ON COLUMN public.users.cognee_user_id IS 'Reference to the user entity in the Cognee memory graph.';
COMMENT ON COLUMN public.users.preferences    IS 'JSON blob for UI preferences, notification settings, etc.';


-- ---------------------------------------------------------------------------
-- 3.2  labs  (research laboratories / groups)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.labs (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,     -- URL-safe identifier
  description     TEXT,
  institution     TEXT,
  department      TEXT,
  website_url     TEXT,
  logo_url        TEXT,
  contact_email   TEXT,
  location        TEXT,
  research_areas  TEXT[]      NOT NULL DEFAULT '{}',
  tags            TEXT[]      NOT NULL DEFAULT '{}',
  settings        JSONB       NOT NULL DEFAULT '{}',
  cognee_lab_id   TEXT,                            -- Cognee memory graph node
  is_public       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by      UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.labs IS 'Research laboratories or groups. Each lab is the top-level organizational unit.';
COMMENT ON COLUMN public.labs.slug          IS 'URL-safe unique identifier generated from the lab name.';
COMMENT ON COLUMN public.labs.research_areas IS 'Array of research domain tags (e.g. machine-learning, genomics).';
COMMENT ON COLUMN public.labs.cognee_lab_id  IS 'Reference to the lab entity in the Cognee memory graph.';


-- ---------------------------------------------------------------------------
-- 3.3  lab_members  (junction: users ↔ labs)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lab_members (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id      UUID        NOT NULL REFERENCES public.labs(id)  ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        lab_role    NOT NULL DEFAULT 'member',
  title       TEXT,                                -- e.g. "Principal Investigator"
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by  UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  UNIQUE (lab_id, user_id)
);

COMMENT ON TABLE public.lab_members IS 'Many-to-many join between users and labs with role information.';


-- ---------------------------------------------------------------------------
-- 3.4  projects  (research projects within a lab)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID           NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  name            TEXT           NOT NULL,
  description     TEXT,
  status          project_status NOT NULL DEFAULT 'planning',
  start_date      DATE,
  end_date        DATE,
  goals           TEXT,
  research_areas  TEXT[]         NOT NULL DEFAULT '{}',
  tags            TEXT[]         NOT NULL DEFAULT '{}',
  funding_source  TEXT,
  budget          NUMERIC(15, 2),
  metadata        JSONB          NOT NULL DEFAULT '{}',
  cognee_node_id  TEXT,
  is_public       BOOLEAN        NOT NULL DEFAULT FALSE,
  created_by      UUID           NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.projects IS 'Research projects scoped to a lab. A project groups experiments, papers, and decisions.';
COMMENT ON COLUMN public.projects.cognee_node_id IS 'Cognee knowledge graph node ID for this project.';


-- ---------------------------------------------------------------------------
-- 3.5  project_members  (junction: users ↔ projects)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.project_members (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.users(id)    ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'contributor',  -- owner | contributor | observer
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

COMMENT ON TABLE public.project_members IS 'Many-to-many join between users and projects.';


-- ---------------------------------------------------------------------------
-- 3.6  experiments
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.experiments (
  id                UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id            UUID                NOT NULL REFERENCES public.labs(id)     ON DELETE CASCADE,
  project_id        UUID                REFERENCES public.projects(id)           ON DELETE SET NULL,
  title             TEXT                NOT NULL,
  description       TEXT,
  hypothesis        TEXT,
  methodology       TEXT,
  status            experiment_status   NOT NULL DEFAULT 'draft',
  start_date        TIMESTAMPTZ,
  end_date          TIMESTAMPTZ,
  results           TEXT,
  conclusions       TEXT,
  notes             TEXT,
  protocol_url      TEXT,               -- link to stored protocol document
  storage_path      TEXT,               -- Supabase Storage path for attachments
  tags              TEXT[]              NOT NULL DEFAULT '{}',
  metadata          JSONB               NOT NULL DEFAULT '{}',
  cognee_node_id    TEXT,
  is_archived       BOOLEAN             NOT NULL DEFAULT FALSE,
  created_by        UUID                NOT NULL REFERENCES public.users(id)     ON DELETE RESTRICT,
  assigned_to       UUID                REFERENCES public.users(id)              ON DELETE SET NULL,
  created_at        TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.experiments IS 'Individual experiments logged within a lab or project.';
COMMENT ON COLUMN public.experiments.protocol_url   IS 'URL or storage path to the experimental protocol document.';
COMMENT ON COLUMN public.experiments.cognee_node_id IS 'Cognee knowledge graph node for this experiment.';


-- ---------------------------------------------------------------------------
-- 3.7  research_papers
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.research_papers (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID        NOT NULL REFERENCES public.labs(id)     ON DELETE CASCADE,
  project_id      UUID        REFERENCES public.projects(id)           ON DELETE SET NULL,
  title           TEXT        NOT NULL,
  abstract        TEXT,
  authors         TEXT[]      NOT NULL DEFAULT '{}',
  paper_type      paper_type  NOT NULL DEFAULT 'preprint',
  doi             TEXT        UNIQUE,
  arxiv_id        TEXT        UNIQUE,
  url             TEXT,
  venue           TEXT,                    -- journal name / conference name
  volume          TEXT,
  issue           TEXT,
  pages           TEXT,
  published_date  DATE,
  keywords        TEXT[]      NOT NULL DEFAULT '{}',
  tags            TEXT[]      NOT NULL DEFAULT '{}',
  storage_path    TEXT,                    -- PDF stored in Supabase Storage
  citation_count  INTEGER     NOT NULL DEFAULT 0,
  notes           TEXT,
  metadata        JSONB       NOT NULL DEFAULT '{}',
  cognee_node_id  TEXT,
  is_archived     BOOLEAN     NOT NULL DEFAULT FALSE,
  added_by        UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.research_papers IS 'Research papers ingested into the lab knowledge base (internal and external).';
COMMENT ON COLUMN public.research_papers.doi           IS 'Digital Object Identifier.';
COMMENT ON COLUMN public.research_papers.arxiv_id      IS 'arXiv preprint identifier.';
COMMENT ON COLUMN public.research_papers.storage_path  IS 'Path to PDF file in Supabase Storage.';
COMMENT ON COLUMN public.research_papers.cognee_node_id IS 'Cognee knowledge graph node for this paper.';


-- ---------------------------------------------------------------------------
-- 3.8  datasets
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.datasets (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID          NOT NULL REFERENCES public.labs(id)     ON DELETE CASCADE,
  project_id      UUID          REFERENCES public.projects(id)           ON DELETE SET NULL,
  experiment_id   UUID          REFERENCES public.experiments(id)        ON DELETE SET NULL,
  name            TEXT          NOT NULL,
  description     TEXT,
  dataset_type    dataset_type  NOT NULL DEFAULT 'other',
  version         TEXT          NOT NULL DEFAULT '1.0.0',
  size_bytes      BIGINT,
  row_count       BIGINT,
  schema_def      JSONB,                   -- column definitions / data dictionary
  source_url      TEXT,
  storage_path    TEXT,                    -- Supabase Storage path
  license         TEXT,                    -- e.g. CC-BY, MIT, proprietary
  is_public       BOOLEAN       NOT NULL DEFAULT FALSE,
  tags            TEXT[]        NOT NULL DEFAULT '{}',
  metadata        JSONB         NOT NULL DEFAULT '{}',
  cognee_node_id  TEXT,
  is_archived     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by      UUID          NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.datasets IS 'Datasets associated with experiments or projects.';
COMMENT ON COLUMN public.datasets.schema_def    IS 'JSON schema / data dictionary describing dataset columns.';
COMMENT ON COLUMN public.datasets.storage_path  IS 'Path to the dataset file(s) in Supabase Storage.';
COMMENT ON COLUMN public.datasets.cognee_node_id IS 'Cognee knowledge graph node for this dataset.';


-- ---------------------------------------------------------------------------
-- 3.9  meetings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.meetings (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID          NOT NULL REFERENCES public.labs(id)  ON DELETE CASCADE,
  project_id      UUID          REFERENCES public.projects(id)        ON DELETE SET NULL,
  title           TEXT          NOT NULL,
  description     TEXT,
  meeting_type    meeting_type  NOT NULL DEFAULT 'lab_meeting',
  scheduled_at    TIMESTAMPTZ   NOT NULL,
  duration_mins   INTEGER,
  location        TEXT,
  meeting_url     TEXT,                    -- virtual meeting link
  agenda          TEXT,
  notes           TEXT,
  summary         TEXT,                    -- AI-generated or manual summary
  action_items    JSONB         NOT NULL DEFAULT '[]',   -- array of {text, assignee_id, due_date, done}
  attendees       UUID[]        NOT NULL DEFAULT '{}',   -- array of user IDs
  recording_url   TEXT,
  storage_path    TEXT,                    -- notes / transcript stored in Storage
  tags            TEXT[]        NOT NULL DEFAULT '{}',
  metadata        JSONB         NOT NULL DEFAULT '{}',
  cognee_node_id  TEXT,
  is_archived     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by      UUID          NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.meetings IS 'Lab or project meeting records with agenda, notes, and action items.';
COMMENT ON COLUMN public.meetings.action_items   IS 'JSON array of action items: [{text, assignee_id, due_date, done}].';
COMMENT ON COLUMN public.meetings.attendees      IS 'Array of user UUIDs who attended or are invited.';
COMMENT ON COLUMN public.meetings.cognee_node_id IS 'Cognee knowledge graph node for this meeting.';


-- ---------------------------------------------------------------------------
-- 3.10  research_decisions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.research_decisions (
  id              UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID              NOT NULL REFERENCES public.labs(id)  ON DELETE CASCADE,
  project_id      UUID              REFERENCES public.projects(id)        ON DELETE SET NULL,
  meeting_id      UUID              REFERENCES public.meetings(id)        ON DELETE SET NULL,
  title           TEXT              NOT NULL,
  context         TEXT,             -- background / problem statement
  decision        TEXT              NOT NULL,
  rationale       TEXT,
  alternatives    JSONB             NOT NULL DEFAULT '[]',  -- [{option, pros, cons}]
  impact          TEXT,
  priority        decision_priority NOT NULL DEFAULT 'medium',
  made_by         UUID              REFERENCES public.users(id) ON DELETE SET NULL,
  made_at         TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  review_date     DATE,             -- when to revisit this decision
  tags            TEXT[]            NOT NULL DEFAULT '{}',
  metadata        JSONB             NOT NULL DEFAULT '{}',
  cognee_node_id  TEXT,
  is_archived     BOOLEAN           NOT NULL DEFAULT FALSE,
  status          TEXT              NOT NULL DEFAULT 'proposed',
  created_by      UUID              NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.research_decisions IS 'Key research decisions with context, rationale, and alternatives.';
COMMENT ON COLUMN public.research_decisions.alternatives  IS 'JSON array of considered alternatives: [{option, pros, cons}].';
COMMENT ON COLUMN public.research_decisions.review_date   IS 'Scheduled date to revisit and validate this decision.';
COMMENT ON COLUMN public.research_decisions.cognee_node_id IS 'Cognee knowledge graph node for this decision.';


-- ---------------------------------------------------------------------------
-- 3.11  publications  (formally published works, distinct from research_papers)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.publications (
  id                UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id            UUID               NOT NULL REFERENCES public.labs(id)     ON DELETE CASCADE,
  project_id        UUID               REFERENCES public.projects(id)           ON DELETE SET NULL,
  research_paper_id UUID               REFERENCES public.research_papers(id)   ON DELETE SET NULL,
  title             TEXT               NOT NULL,
  authors           TEXT[]             NOT NULL DEFAULT '{}',
  abstract          TEXT,
  status            publication_status NOT NULL DEFAULT 'draft',
  paper_type        paper_type         NOT NULL DEFAULT 'journal_article',
  target_venue      TEXT,              -- target journal / conference
  submitted_at      TIMESTAMPTZ,
  accepted_at       TIMESTAMPTZ,
  published_at      TIMESTAMPTZ,
  doi               TEXT               UNIQUE,
  url               TEXT,
  impact_factor     NUMERIC(6, 3),
  citation_count    INTEGER            NOT NULL DEFAULT 0,
  storage_path      TEXT,
  notes             TEXT,
  tags              TEXT[]             NOT NULL DEFAULT '{}',
  metadata          JSONB              NOT NULL DEFAULT '{}',
  cognee_node_id    TEXT,
  is_archived       BOOLEAN            NOT NULL DEFAULT FALSE,
  created_by        UUID               NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.publications IS 'Publication pipeline tracking from draft to published, with submission status.';
COMMENT ON COLUMN public.publications.research_paper_id IS 'Optional link to a related research_papers record (e.g. accepted preprint).';
COMMENT ON COLUMN public.publications.impact_factor     IS 'Journal impact factor at time of publication.';
COMMENT ON COLUMN public.publications.cognee_node_id    IS 'Cognee knowledge graph node for this publication.';


-- ---------------------------------------------------------------------------
-- 3.12  notifications
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
  id              UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID              NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lab_id          UUID              REFERENCES public.labs(id)            ON DELETE CASCADE,
  type            notification_type NOT NULL,
  title           TEXT              NOT NULL,
  body            TEXT,
  entity_type     entity_type,
  entity_id       UUID,             -- polymorphic reference to the related entity
  action_url      TEXT,             -- deep-link into the app
  actor_id        UUID              REFERENCES public.users(id) ON DELETE SET NULL,
  is_read         BOOLEAN           NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  metadata        JSONB             NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.notifications IS 'Per-user notifications with polymorphic entity reference.';
COMMENT ON COLUMN public.notifications.entity_type IS 'Type of the entity this notification refers to.';
COMMENT ON COLUMN public.notifications.entity_id   IS 'UUID of the entity (polymorphic, use entity_type to resolve table).';
COMMENT ON COLUMN public.notifications.actor_id    IS 'The user who triggered this notification.';


-- ---------------------------------------------------------------------------
-- 3.13  activity_logs  (immutable audit trail)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id          UUID            REFERENCES public.labs(id)  ON DELETE SET NULL,
  actor_id        UUID            REFERENCES public.users(id) ON DELETE SET NULL,
  action          activity_action NOT NULL,
  entity_type     entity_type     NOT NULL,
  entity_id       UUID            NOT NULL,
  entity_title    TEXT,           -- snapshot of the entity's title at log time
  changes         JSONB,          -- {field: {old, new}} diff for 'updated' actions
  metadata        JSONB           NOT NULL DEFAULT '{}',
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.activity_logs IS 'Immutable audit trail of all create/update/delete actions across the system.';
COMMENT ON COLUMN public.activity_logs.changes      IS 'Field-level diff for update actions: {field: {old_value, new_value}}.';
COMMENT ON COLUMN public.activity_logs.entity_title IS 'Snapshot of the entity name at the time of the action.';


-- =============================================================================
-- 4. ADDITIONAL INDEXES
-- =============================================================================
-- Primary key indexes are created automatically.
-- We add indexes for all foreign keys and high-cardinality search columns.

-- users
CREATE INDEX IF NOT EXISTS idx_users_email        ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_orcid        ON public.users(orcid_id) WHERE orcid_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_is_active    ON public.users(is_active);

-- labs
CREATE INDEX IF NOT EXISTS idx_labs_slug          ON public.labs(slug);
CREATE INDEX IF NOT EXISTS idx_labs_created_by    ON public.labs(created_by);
CREATE INDEX IF NOT EXISTS idx_labs_is_active     ON public.labs(is_active);
CREATE INDEX IF NOT EXISTS idx_labs_is_public     ON public.labs(is_public);
CREATE INDEX IF NOT EXISTS idx_labs_research_areas ON public.labs USING gin(research_areas);
CREATE INDEX IF NOT EXISTS idx_labs_tags           ON public.labs USING gin(tags);
-- Trigram index for lab name search
CREATE INDEX IF NOT EXISTS idx_labs_name_trgm     ON public.labs USING gin(name gin_trgm_ops);

-- lab_members
CREATE INDEX IF NOT EXISTS idx_lab_members_lab_id  ON public.lab_members(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_members_user_id ON public.lab_members(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_members_role    ON public.lab_members(role);

-- projects
CREATE INDEX IF NOT EXISTS idx_projects_lab_id      ON public.projects(lab_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by  ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status      ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_tags        ON public.projects USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_projects_name_trgm   ON public.projects USING gin(name gin_trgm_ops);

-- project_members
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id    ON public.project_members(user_id);

-- experiments
CREATE INDEX IF NOT EXISTS idx_experiments_lab_id       ON public.experiments(lab_id);
CREATE INDEX IF NOT EXISTS idx_experiments_project_id   ON public.experiments(project_id);
CREATE INDEX IF NOT EXISTS idx_experiments_created_by   ON public.experiments(created_by);
CREATE INDEX IF NOT EXISTS idx_experiments_assigned_to  ON public.experiments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_experiments_status       ON public.experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_tags         ON public.experiments USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_experiments_title_trgm   ON public.experiments USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_experiments_start_date   ON public.experiments(start_date);

-- research_papers
CREATE INDEX IF NOT EXISTS idx_papers_lab_id       ON public.research_papers(lab_id);
CREATE INDEX IF NOT EXISTS idx_papers_project_id   ON public.research_papers(project_id);
CREATE INDEX IF NOT EXISTS idx_papers_added_by     ON public.research_papers(added_by);
CREATE INDEX IF NOT EXISTS idx_papers_paper_type   ON public.research_papers(paper_type);
CREATE INDEX IF NOT EXISTS idx_papers_keywords     ON public.research_papers USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_papers_tags         ON public.research_papers USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_papers_authors      ON public.research_papers USING gin(authors);
CREATE INDEX IF NOT EXISTS idx_papers_published    ON public.research_papers(published_date);
CREATE INDEX IF NOT EXISTS idx_papers_title_trgm   ON public.research_papers USING gin(title gin_trgm_ops);

-- datasets
CREATE INDEX IF NOT EXISTS idx_datasets_lab_id         ON public.datasets(lab_id);
CREATE INDEX IF NOT EXISTS idx_datasets_project_id     ON public.datasets(project_id);
CREATE INDEX IF NOT EXISTS idx_datasets_experiment_id  ON public.datasets(experiment_id);
CREATE INDEX IF NOT EXISTS idx_datasets_created_by     ON public.datasets(created_by);
CREATE INDEX IF NOT EXISTS idx_datasets_dataset_type   ON public.datasets(dataset_type);
CREATE INDEX IF NOT EXISTS idx_datasets_is_public      ON public.datasets(is_public);
CREATE INDEX IF NOT EXISTS idx_datasets_tags           ON public.datasets USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_datasets_name_trgm      ON public.datasets USING gin(name gin_trgm_ops);

-- meetings
CREATE INDEX IF NOT EXISTS idx_meetings_lab_id       ON public.meetings(lab_id);
CREATE INDEX IF NOT EXISTS idx_meetings_project_id   ON public.meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by   ON public.meetings(created_by);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_type ON public.meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON public.meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_attendees    ON public.meetings USING gin(attendees);
CREATE INDEX IF NOT EXISTS idx_meetings_tags         ON public.meetings USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_meetings_title_trgm   ON public.meetings USING gin(title gin_trgm_ops);

-- research_decisions
CREATE INDEX IF NOT EXISTS idx_decisions_lab_id      ON public.research_decisions(lab_id);
CREATE INDEX IF NOT EXISTS idx_decisions_project_id  ON public.research_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_decisions_meeting_id  ON public.research_decisions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_decisions_made_by     ON public.research_decisions(made_by);
CREATE INDEX IF NOT EXISTS idx_decisions_created_by  ON public.research_decisions(created_by);
CREATE INDEX IF NOT EXISTS idx_decisions_priority    ON public.research_decisions(priority);
CREATE INDEX IF NOT EXISTS idx_decisions_made_at     ON public.research_decisions(made_at);
CREATE INDEX IF NOT EXISTS idx_decisions_review_date ON public.research_decisions(review_date);
CREATE INDEX IF NOT EXISTS idx_decisions_tags        ON public.research_decisions USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_decisions_title_trgm  ON public.research_decisions USING gin(title gin_trgm_ops);

-- publications
CREATE INDEX IF NOT EXISTS idx_publications_lab_id      ON public.publications(lab_id);
CREATE INDEX IF NOT EXISTS idx_publications_project_id  ON public.publications(project_id);
CREATE INDEX IF NOT EXISTS idx_publications_paper_id    ON public.publications(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_publications_created_by  ON public.publications(created_by);
CREATE INDEX IF NOT EXISTS idx_publications_status      ON public.publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_paper_type  ON public.publications(paper_type);
CREATE INDEX IF NOT EXISTS idx_publications_submitted   ON public.publications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_publications_published   ON public.publications(published_at);
CREATE INDEX IF NOT EXISTS idx_publications_tags        ON public.publications USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_publications_title_trgm  ON public.publications USING gin(title gin_trgm_ops);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lab_id     ON public.notifications(lab_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type       ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read    ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_entity     ON public.notifications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_lab_id      ON public.activity_logs(lab_id);
CREATE INDEX IF NOT EXISTS idx_activity_actor_id    ON public.activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_action      ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_entity      ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at  ON public.activity_logs(created_at DESC);


-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Security model:
--   • A user can only see/modify data in labs they are a member of.
--   • Lab admins / owners can manage members, settings, and all content.
--   • Public labs and their public resources are readable by anyone authenticated.
--   • Service-role key bypasses RLS (for server-side operations).
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs      ENABLE ROW LEVEL SECURITY;


-- ─── Helper functions used in RLS policies ────────────────────────────────────

-- Returns TRUE if the calling user is a member of the given lab.
CREATE OR REPLACE FUNCTION public.is_lab_member(p_lab_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.lab_members
    WHERE  lab_id  = p_lab_id
      AND  user_id = auth.uid()
      AND  is_active = TRUE
  );
$$;

-- Returns TRUE if the calling user is an admin or owner of the given lab.
CREATE OR REPLACE FUNCTION public.is_lab_admin(p_lab_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.lab_members
    WHERE  lab_id  = p_lab_id
      AND  user_id = auth.uid()
      AND  role    IN ('owner', 'admin')
      AND  is_active = TRUE
  );
$$;

-- Returns TRUE if the calling user is the owner of the given lab.
CREATE OR REPLACE FUNCTION public.is_lab_owner(p_lab_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.lab_members
    WHERE  lab_id  = p_lab_id
      AND  user_id = auth.uid()
      AND  role    = 'owner'
      AND  is_active = TRUE
  );
$$;

-- Returns TRUE if the calling user is a guest of the given lab.
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

-- Returns TRUE if the user has credentials to create a new research laboratory
CREATE OR REPLACE FUNCTION public.can_create_lab()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_position TEXT;
BEGIN
  SELECT position INTO v_position FROM public.users WHERE id = auth.uid();
  IF v_position IN ('Professor', 'Associate Professor', 'Admin', 'PI') THEN
    RETURN TRUE;
  END IF;
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


-- ─── 5.1  users ──────────────────────────────────────────────────────────────

-- Anyone authenticated can read any profile (basic info)
CREATE POLICY "users_select_authenticated"
  ON public.users FOR SELECT
  TO authenticated
  USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Profiles are inserted automatically via trigger (service role only for inserts)
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());


-- ─── 5.2  labs ───────────────────────────────────────────────────────────────

-- Members can see their labs; public labs are visible to all authenticated users
CREATE POLICY "labs_select_member_or_public"
  ON public.labs FOR SELECT
  TO authenticated
  USING (
    is_public = TRUE
    OR public.is_lab_member(id)
  );

-- Only Owner or Admin can create a lab
CREATE POLICY "labs_insert_authenticated"
  ON public.labs FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid() AND public.can_create_lab());

-- Only lab admins / owners can update lab settings
CREATE POLICY "labs_update_admin"
  ON public.labs FOR UPDATE
  TO authenticated
  USING (public.is_lab_admin(id))
  WITH CHECK (public.is_lab_admin(id));

-- Only the lab owner can delete the lab
CREATE POLICY "labs_delete_owner"
  ON public.labs FOR DELETE
  TO authenticated
  USING (public.is_lab_owner(id));


-- ─── 5.3  lab_members ────────────────────────────────────────────────────────

-- Lab members can see the member list of their lab
CREATE POLICY "lab_members_select_member"
  ON public.lab_members FOR SELECT
  TO authenticated
  USING (public.is_lab_member(lab_id));

-- Only admins can add new members
CREATE POLICY "lab_members_insert_admin"
  ON public.lab_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_lab_admin(lab_id));

-- Admins can update roles; users can deactivate themselves
CREATE POLICY "lab_members_update_admin_or_self"
  ON public.lab_members FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR user_id = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR user_id = auth.uid()
  );

-- Only admins can remove members (or members can remove themselves)
CREATE POLICY "lab_members_delete_admin_or_self"
  ON public.lab_members FOR DELETE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR user_id = auth.uid()
  );


-- ─── 5.4  projects ───────────────────────────────────────────────────────────

-- Lab members see all projects in their lab; public completed projects are readable for guests
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

-- Lab members can create projects
CREATE POLICY "projects_insert_member"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

-- Admins or project creator can update
CREATE POLICY "projects_update_admin_or_creator"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );

-- Only lab admins can delete projects
CREATE POLICY "projects_delete_admin"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.is_lab_admin(lab_id));


-- ─── 5.5  project_members ────────────────────────────────────────────────────

CREATE POLICY "project_members_select_lab_member"
  ON public.project_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND public.is_lab_member(p.lab_id)
    )
  );

CREATE POLICY "project_members_insert_lab_admin"
  ON public.project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND public.is_lab_admin(p.lab_id)
    )
  );

CREATE POLICY "project_members_delete_lab_admin"
  ON public.project_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND public.is_lab_admin(p.lab_id)
    )
    OR user_id = auth.uid()
  );


-- ─── 5.6  experiments ────────────────────────────────────────────────────────

CREATE POLICY "experiments_select_lab_member"
  ON public.experiments FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND NOT public.is_lab_guest(lab_id)
  );

CREATE POLICY "experiments_insert_lab_member"
  ON public.experiments FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "experiments_update_admin_or_creator_or_assignee"
  ON public.experiments FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by  = auth.uid()
    OR assigned_to = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by  = auth.uid()
    OR assigned_to = auth.uid()
  );

CREATE POLICY "experiments_delete_admin_or_creator"
  ON public.experiments FOR DELETE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );


-- ─── 5.7  research_papers ────────────────────────────────────────────────────

CREATE POLICY "papers_select_lab_member"
  ON public.research_papers FOR SELECT
  TO authenticated
  USING (public.is_lab_member(lab_id));

CREATE POLICY "papers_insert_lab_member"
  ON public.research_papers FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND added_by = auth.uid()
  );

CREATE POLICY "papers_update_admin_or_adder"
  ON public.research_papers FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR added_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR added_by = auth.uid()
  );

CREATE POLICY "papers_delete_admin_or_adder"
  ON public.research_papers FOR DELETE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR added_by = auth.uid()
  );


-- ─── 5.8  datasets ───────────────────────────────────────────────────────────

CREATE POLICY "datasets_select_member_or_public"
  ON public.datasets FOR SELECT
  TO authenticated
  USING (
    is_public = TRUE
    OR public.is_lab_member(lab_id)
  );

CREATE POLICY "datasets_insert_lab_member"
  ON public.datasets FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "datasets_update_admin_or_creator"
  ON public.datasets FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );

CREATE POLICY "datasets_delete_admin_or_creator"
  ON public.datasets FOR DELETE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );


-- ─── 5.9  meetings ───────────────────────────────────────────────────────────

CREATE POLICY "meetings_select_lab_member"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (
    public.is_lab_member(lab_id)
    AND NOT public.is_lab_guest(lab_id)
  );

CREATE POLICY "meetings_insert_lab_member"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "meetings_update_admin_or_creator"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );

CREATE POLICY "meetings_delete_admin_or_creator"
  ON public.meetings FOR DELETE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );


-- ─── 5.10  research_decisions ────────────────────────────────────────────────

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

CREATE POLICY "decisions_insert_lab_member"
  ON public.research_decisions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "decisions_update_admin_or_creator"
  ON public.research_decisions FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );

CREATE POLICY "decisions_delete_admin"
  ON public.research_decisions FOR DELETE
  TO authenticated
  USING (public.is_lab_admin(lab_id));


-- ─── 5.11  publications ──────────────────────────────────────────────────────

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

CREATE POLICY "publications_insert_lab_member"
  ON public.publications FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_lab_member(lab_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "publications_update_admin_or_creator"
  ON public.publications FOR UPDATE
  TO authenticated
  USING (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  )
  WITH CHECK (
    public.is_lab_admin(lab_id)
    OR created_by = auth.uid()
  );

CREATE POLICY "publications_delete_admin"
  ON public.publications FOR DELETE
  TO authenticated
  USING (public.is_lab_admin(lab_id));


-- ─── 5.12  notifications ─────────────────────────────────────────────────────

-- Users only see their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only the system (service role) creates notifications; users can mark as read
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ─── 5.13  activity_logs ─────────────────────────────────────────────────────

-- Lab members can see their lab's activity logs (read-only)
CREATE POLICY "activity_logs_select_lab_member"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (
    lab_id IS NULL
    OR public.is_lab_member(lab_id)
  );

-- Logs are write-once: no user-level UPDATE or DELETE allowed
-- (Service role handles inserts from triggers)


-- =============================================================================
-- 6. TRIGGERS & FUNCTIONS
-- =============================================================================

-- ─── 6.1  updated_at auto-update trigger ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to every mutable table
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_labs_updated_at
  BEFORE UPDATE ON public.labs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_experiments_updated_at
  BEFORE UPDATE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_papers_updated_at
  BEFORE UPDATE ON public.research_papers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_datasets_updated_at
  BEFORE UPDATE ON public.datasets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_decisions_updated_at
  BEFORE UPDATE ON public.research_decisions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── 6.2  auto-create user profile on sign-up ────────────────────────────────

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

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 6.3  auto-add lab creator as owner ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_lab()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.lab_members (lab_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner')
  ON CONFLICT (lab_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lab_created_add_owner
  AFTER INSERT ON public.labs
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_lab();


-- ─── 6.4  activity log trigger (generic, applied per-table) ──────────────────

CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_action     activity_action;
  v_entity     entity_type;
  v_lab_id     UUID;
  v_title      TEXT;
  v_entity_id  UUID;
  v_changes    JSONB := NULL;
BEGIN
  -- Determine action
  v_action := CASE TG_OP
    WHEN 'INSERT' THEN 'created'
    WHEN 'UPDATE' THEN 'updated'
    WHEN 'DELETE' THEN 'deleted'
  END::activity_action;

  -- Resolve entity type from table name
  v_entity := TG_TABLE_NAME::entity_type;

  -- Use NEW for INSERT/UPDATE, OLD for DELETE
  IF TG_OP = 'DELETE' THEN
    v_entity_id := OLD.id;
    v_lab_id    := CASE WHEN TG_TABLE_NAME = 'labs' THEN OLD.id ELSE OLD.lab_id END;
    v_title     := CASE
      WHEN TG_TABLE_NAME IN ('users') THEN OLD.full_name
      WHEN TG_TABLE_NAME = 'labs'     THEN OLD.name
      ELSE OLD.title
    END;
  ELSE
    v_entity_id := NEW.id;
    v_lab_id    := CASE WHEN TG_TABLE_NAME = 'labs' THEN NEW.id ELSE NEW.lab_id END;
    v_title     := CASE
      WHEN TG_TABLE_NAME IN ('users') THEN NEW.full_name
      WHEN TG_TABLE_NAME = 'labs'     THEN NEW.name
      ELSE NEW.title
    END;
  END IF;

  INSERT INTO public.activity_logs (
    lab_id, actor_id, action, entity_type, entity_id, entity_title, changes
  )
  VALUES (
    v_lab_id,
    auth.uid(),
    v_action,
    v_entity,
    v_entity_id,
    v_title,
    v_changes
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply activity logging to all content tables
CREATE TRIGGER trg_log_experiments
  AFTER INSERT OR UPDATE OR DELETE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_research_papers
  AFTER INSERT OR UPDATE OR DELETE ON public.research_papers
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_datasets
  AFTER INSERT OR UPDATE OR DELETE ON public.datasets
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_meetings
  AFTER INSERT OR UPDATE OR DELETE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_decisions
  AFTER INSERT OR UPDATE OR DELETE ON public.research_decisions
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_publications
  AFTER INSERT OR UPDATE OR DELETE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER trg_log_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();


-- ─── 6.5  auto-generate lab slug ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_lab_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_base_slug TEXT;
  v_slug      TEXT;
  v_counter   INTEGER := 0;
BEGIN
  -- Only set slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    v_base_slug := lower(
      regexp_replace(
        regexp_replace(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      )
    );
    v_slug := v_base_slug;

    LOOP
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM public.labs WHERE slug = v_slug AND id != NEW.id
      );
      v_counter := v_counter + 1;
      v_slug    := v_base_slug || '-' || v_counter;
    END LOOP;

    NEW.slug := v_slug;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_labs_generate_slug
  BEFORE INSERT OR UPDATE OF name ON public.labs
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION public.generate_lab_slug();


-- ─── 6.6  notification helper function ───────────────────────────────────────
-- Use this from application code or other triggers to create notifications.

CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id    UUID,
  p_lab_id     UUID,
  p_type       notification_type,
  p_title      TEXT,
  p_body       TEXT        DEFAULT NULL,
  p_entity_type entity_type DEFAULT NULL,
  p_entity_id  UUID        DEFAULT NULL,
  p_action_url TEXT        DEFAULT NULL,
  p_actor_id   UUID        DEFAULT NULL,
  p_metadata   JSONB       DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, lab_id, type, title, body,
    entity_type, entity_id, action_url, actor_id, metadata
  )
  VALUES (
    p_user_id, p_lab_id, p_type, p_title, p_body,
    p_entity_type, p_entity_id, p_action_url, p_actor_id, p_metadata
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;


-- ─── 6.7  mark all notifications as read ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_lab_id UUID DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.notifications
  SET    is_read  = TRUE,
         read_at  = NOW()
  WHERE  user_id  = auth.uid()
    AND  is_read  = FALSE
    AND  (p_lab_id IS NULL OR lab_id = p_lab_id);

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;


-- ─── 6.8  update last_seen_at on auth event ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET    last_seen_at = NOW()
  WHERE  id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- NOTE: Supabase fires this on auth.sessions insert (uncomment when supported):
-- CREATE TRIGGER trg_user_last_seen
--   AFTER INSERT ON auth.sessions
--   FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();


-- =============================================================================
-- 7. SUPABASE REALTIME
-- =============================================================================
-- Enable realtime change broadcasts for tables that clients subscribe to.

BEGIN;
  -- Drop and recreate to avoid "already exists" errors on re-run
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE
    public.notifications,
    public.activity_logs,
    public.experiments,
    public.meetings,
    public.research_decisions,
    public.projects;
COMMIT;


-- =============================================================================
-- 8. STORAGE BUCKETS  (run via Supabase Dashboard or Management API)
-- =============================================================================
-- The SQL below is informational — storage buckets are managed via the
-- Supabase Storage API / Dashboard, not plain SQL.
-- Create the following buckets:
--
--   Bucket name        | Public | Description
--   -------------------|--------|--------------------------------------
--   research-assets    | false  | PDFs, datasets, experiment files
--   avatars            | true   | User profile pictures
--   lab-logos          | true   | Lab logo images
--
-- Recommended Storage RLS policies (set in Dashboard → Storage → Policies):
--   research-assets: authenticated users who are lab members can read/write
--   avatars:         anyone can read; only owner can write
--   lab-logos:       anyone can read; only lab admins can write
-- =============================================================================


-- =============================================================================
-- DONE — Schema created successfully.
-- =============================================================================
-- Summary:
--   Tables:    users, labs, lab_members, projects, project_members,
--              experiments, research_papers, datasets, meetings,
--              research_decisions, publications, notifications, activity_logs
--   Indexes:   60+ covering FK columns, array columns (GIN), and trigram search
--   RLS:       Enabled on all 13 tables with 40+ policies
--   Triggers:  updated_at (9), handle_new_user, handle_new_lab,
--              generate_lab_slug, log_activity (7 tables)
--   Functions: is_lab_member, is_lab_admin, is_lab_owner,
--              create_notification, mark_all_notifications_read,
--              handle_new_user, handle_new_lab, set_updated_at, log_activity,
--              generate_lab_slug, handle_user_login
--   Realtime:  notifications, activity_logs, experiments, meetings,
--              research_decisions, projects
-- =============================================================================
