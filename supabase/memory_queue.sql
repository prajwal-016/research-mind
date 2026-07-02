-- Memory Queue — stores failed Cognee operations for retry
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.memory_queue (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation       TEXT        NOT NULL,  -- 'remember', 'improve', 'forget'
  entity_type     TEXT        NOT NULL,
  entity_id       UUID        NOT NULL,
  payload         JSONB       NOT NULL DEFAULT '{}',
  status          TEXT        NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
  retry_count     INTEGER     NOT NULL DEFAULT 0,
  max_retries     INTEGER     NOT NULL DEFAULT 3,
  last_error      TEXT,
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_queue_status ON public.memory_queue(status);
CREATE INDEX IF NOT EXISTS idx_memory_queue_created ON public.memory_queue(created_at);

-- Enable RLS
ALTER TABLE public.memory_queue ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage the queue
CREATE POLICY "memory_queue_authenticated"
  ON public.memory_queue
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for queue monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_queue;

COMMENT ON TABLE public.memory_queue IS 'Queue for failed Cognee memory operations. Supports automatic retry with exponential backoff.';
