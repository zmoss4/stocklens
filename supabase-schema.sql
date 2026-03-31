-- StockLens Supabase Schema

-- Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ticker TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- Historical Grades Table
CREATE TABLE IF NOT EXISTS historical_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  grade TEXT NOT NULL,
  verdict TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  data_points JSONB NOT NULL,
  analysis_date TIMESTAMPTZ DEFAULT NOW()
);

-- Shareable Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policies for watchlist
CREATE POLICY "Users can manage their own watchlist"
ON watchlist
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for historical_grades (Read for all, Write restricted if needed, but for now simple)
ALTER TABLE historical_grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for historical grades" ON historical_grades FOR SELECT USING (true);
-- Write policy would normally be restricted to backend service role

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for reports" ON reports FOR SELECT USING (true);
