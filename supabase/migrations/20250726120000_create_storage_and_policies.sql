/*
          # Create Storage Bucket and Policies
          This migration creates the 'avatars' storage bucket and sets up Row Level Security policies to ensure users can only manage their own files.

          ## Query Description: 
          - Creates a new storage bucket named 'avatars' for profile pictures.
          - Enables public access to the bucket for easy URL retrieval, but secures it with policies.
          - Adds policies to allow authenticated users to view, upload, update, and delete their own avatars within a folder matching their user ID.
          - This operation is safe and does not affect existing data.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - storage.buckets: Inserts a new row for 'avatars'.
          - storage.objects: Policies will control access.

          ## Security Implications:
          - RLS Status: Policies are created for storage access.
          - Policy Changes: Yes, new storage policies are added.
          - Auth Requirements: Policies rely on `auth.uid()`.

          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact.
          */

-- Create a public bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to view their own avatars
CREATE POLICY "Allow authenticated read access to own avatars"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Allow authenticated insert for own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow authenticated users to update their own avatar
CREATE POLICY "Allow authenticated update for own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Allow authenticated delete for own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );
