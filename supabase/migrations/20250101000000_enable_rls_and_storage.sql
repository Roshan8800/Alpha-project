/*
          # [Enable RLS and Configure Storage]
          This migration enables Row Level Security (RLS) on all user-data tables to enforce data privacy. It also sets up a dedicated Supabase Storage bucket for user avatars with appropriate access policies.

          ## Query Description: [This operation is critical for securing user data. It enables RLS on all tables containing user information, ensuring users can only access their own data. It also configures a secure storage bucket for profile pictures. This is a foundational security step and is required for a production environment.]
          
          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Enables RLS on: profiles, accounts, savings_goals, transactions, investments, user_achievements, notifications.
          - Creates Storage Bucket: 'avatars'.
          - Creates Policies on: storage.objects for the 'avatars' bucket.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: All data access will now be governed by RLS policies based on the authenticated user's ID.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact. RLS checks are highly optimized in PostgreSQL.
          */

-- 1. Enable RLS on all user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Create Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Add RLS policies for Storage
-- Allow users to view their own avatars
CREATE POLICY "Allow authenticated user to view their own avatar"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'avatars' AND owner = auth.uid() );

-- Allow users to upload their own avatar
CREATE POLICY "Allow authenticated user to upload an avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND owner = auth.uid() );

-- Allow users to update their own avatar
CREATE POLICY "Allow authenticated user to update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND owner = auth.uid() );

-- Allow users to delete their own avatar
CREATE POLICY "Allow authenticated user to delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND owner = auth.uid() );
