-- ==============================================================================
-- MediAgent Phase 2: AI Disease Assessment Agent Migration
-- Description: Creates disease_assessments table, status constraints,
--              RLS policies, performance indexes, and automatic timestamp updates.
-- ==============================================================================

-- 1. Create disease_assessments table
CREATE TABLE IF NOT EXISTS public.disease_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Symptom Assessment',
    status TEXT NOT NULL DEFAULT 'in_progress' 
        CHECK (status IN ('in_progress', 'requires_follow_up', 'completed', 'emergency_escalated', 'abandoned')),
    initial_symptoms JSONB NOT NULL DEFAULT '{}'::jsonb,
    follow_up_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    follow_up_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB,
    red_flags_detected JSONB NOT NULL DEFAULT '[]'::jsonb,
    urgency_level TEXT DEFAULT 'routine' 
        CHECK (urgency_level IN ('routine', 'prompt', 'urgent', 'emergency')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

-- 2. Indexes for fast patient lookup, history, and status filtering
CREATE INDEX IF NOT EXISTS idx_disease_assessments_patient_id ON public.disease_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_disease_assessments_status ON public.disease_assessments(status);
CREATE INDEX IF NOT EXISTS idx_disease_assessments_created_at ON public.disease_assessments(created_at DESC);

-- 3. Automatic updated_at trigger (reuses handle_updated_at function from Phase 1)
DROP TRIGGER IF EXISTS set_disease_assessments_updated_at ON public.disease_assessments;
CREATE TRIGGER set_disease_assessments_updated_at
    BEFORE UPDATE ON public.disease_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.disease_assessments ENABLE ROW LEVEL SECURITY;

-- Explicit Table Grants for Supabase Authenticated Role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.disease_assessments TO authenticated;

-- 5. Row Level Security Policies
-- Patients can ONLY read their own assessments
DROP POLICY IF EXISTS "assessments_select_own" ON public.disease_assessments;
CREATE POLICY "assessments_select_own"
    ON public.disease_assessments
    FOR SELECT
    USING (auth.uid() = patient_id);

-- Patients can ONLY insert assessments where they are the owner
DROP POLICY IF EXISTS "assessments_insert_own" ON public.disease_assessments;
CREATE POLICY "assessments_insert_own"
    ON public.disease_assessments
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Patients can ONLY update their own assessments (and cannot reassign ownership)
DROP POLICY IF EXISTS "assessments_update_own" ON public.disease_assessments;
CREATE POLICY "assessments_update_own"
    ON public.disease_assessments
    FOR UPDATE
    USING (auth.uid() = patient_id)
    WITH CHECK (auth.uid() = patient_id);

-- Patients can ONLY delete their own assessments
DROP POLICY IF EXISTS "assessments_delete_own" ON public.disease_assessments;
CREATE POLICY "assessments_delete_own"
    ON public.disease_assessments
    FOR DELETE
    USING (auth.uid() = patient_id);

-- ==============================================================================
-- End of Phase 2 Migration
-- ==============================================================================
