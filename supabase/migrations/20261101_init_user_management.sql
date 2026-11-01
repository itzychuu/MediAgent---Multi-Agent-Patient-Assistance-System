-- ==============================================================================
-- MediAgent Phase 1: System Foundation and User Management Migration
-- Description: Creates user profiles table, role constraints, RLS policies,
--              automated user profile creation trigger, and role security guards.
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'hospital', 'admin')),
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'pending', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance and lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Updated At Auto-Refresh Function & Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Security Helper Function to check if authenticated user is active Admin
-- Using SECURITY DEFINER avoids infinite recursion in RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
          AND account_status = 'active'
    );
$$;

-- 4. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
-- 5a. SELECT: Users can view their own profile; Admins can view all profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
    ON public.profiles
    FOR SELECT
    USING (public.is_admin());

-- 5b. INSERT: Allow user to insert their own profile on registration (fallback), or admin
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = id 
        AND role != 'admin' -- Prevent self-assigning admin role
    );

DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
CREATE POLICY "profiles_insert_admin"
    ON public.profiles
    FOR INSERT
    WITH CHECK (public.is_admin());

-- 5c. UPDATE: Users can update their own profile; Admins can update any profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
    ON public.profiles
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Trigger to Prevent Privilege and Status Escalation
-- Ensures a non-admin user can NEVER modify their own role or account_status
CREATE OR REPLACE FUNCTION public.prevent_role_and_status_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If invoking user is an active admin, allow all modifications
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- Non-admin users cannot alter role or account_status
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Forbidden: You cannot modify your user role.';
    END IF;

    IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
        RAISE EXCEPTION 'Forbidden: You cannot modify your account status.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_security ON public.profiles;
CREATE TRIGGER enforce_profile_security
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_and_status_escalation();

-- 7. Trigger to Automatically Create Profile upon Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT;
    v_status TEXT;
    v_full_name TEXT;
BEGIN
    -- Extract role from metadata, strictly sanitize and reject 'admin'
    v_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'patient'));
    IF v_role NOT IN ('patient', 'doctor', 'hospital') THEN
        v_role := 'patient';
    END IF;

    -- Doctors and Hospitals require administrative verification
    IF v_role IN ('doctor', 'hospital') THEN
        v_status := 'pending';
    ELSE
        v_status := 'active';
    END IF;

    v_full_name := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), 'MediAgent User');

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role,
        account_status,
        avatar_url,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        v_full_name,
        NEW.email,
        v_role,
        v_status,
        NEW.raw_user_meta_data->>'avatar_url',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- End of Migration
-- ==============================================================================

