-- 004_email_verifications.sql: Email OTP Verification for MSRUAS Registration

CREATE TABLE IF NOT EXISTS public.email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by email and active status
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications (email, verified, expires_at DESC);

-- Enable Row Level Security
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Admins and Service Role have full access; students cannot query OTP table directly
DROP POLICY IF EXISTS "Service role manages email verifications" ON public.email_verifications;
CREATE POLICY "Service role manages email verifications"
ON public.email_verifications FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
