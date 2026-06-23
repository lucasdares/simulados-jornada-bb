-- ====================================================================
-- SUPABASE / POSTGRESQL DATABASE SCHEMA
-- PLATFORMA JORNADA BB SIMULADOS
-- ====================================================================

-- 1. Create PUBLIC.USERS Table
CREATE TABLE IF NOT EXISTS public.users (
  uid TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  "createdAt" TEXT NOT NULL,
  "lastLoginAt" TEXT NOT NULL,
  source TEXT,
  "utm_source" TEXT,
  "utm_campaign" TEXT,
  "utm_content" TEXT,
  "acceptedTerms" BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Create PUBLIC.ATTEMPTS Table
CREATE TABLE IF NOT EXISTS public.attempts (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userEmail" TEXT NOT NULL,
  "simuladoId" TEXT NOT NULL,
  "startedAt" TEXT NOT NULL,
  "submittedAt" TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  "totalAnswered" INTEGER NOT NULL DEFAULT 0,
  score NUMERIC NOT NULL DEFAULT 0,
  "scoreBySubject" JSONB,
  "timeSpent" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  "whatsappClicked" BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. Create PUBLIC.EVENTS Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "eventName" TEXT NOT NULL,
  "createdAt" TEXT NOT NULL,
  metadata JSONB
);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON public.attempts("userId");
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events("userId");
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 5. Row Level Security Configuration (Optional but Recommended)
-- If Row Level Security is NOT yet configured or you wish to bypass/simplify,
-- you can run "ALTER TABLE ... DISABLE ROW LEVEL SECURITY;".
-- Below are standard open authorization policies:

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
DROP POLICY IF EXISTS "Public select users" ON public.users;
CREATE POLICY "Public select users" ON public.users 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert users" ON public.users;
CREATE POLICY "Public insert users" ON public.users 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update users" ON public.users;
CREATE POLICY "Public update users" ON public.users 
  FOR UPDATE USING (true);

-- Attempts Table Policies
DROP POLICY IF EXISTS "Public select attempts" ON public.attempts;
CREATE POLICY "Public select attempts" ON public.attempts 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert attempts" ON public.attempts;
CREATE POLICY "Public insert attempts" ON public.attempts 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update attempts" ON public.attempts;
CREATE POLICY "Public update attempts" ON public.attempts 
  FOR UPDATE USING (true);

-- Events Table Policies
DROP POLICY IF EXISTS "Public select events" ON public.events;
CREATE POLICY "Public select events" ON public.events 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert events" ON public.events;
CREATE POLICY "Public insert events" ON public.events 
  FOR INSERT WITH CHECK (true);
