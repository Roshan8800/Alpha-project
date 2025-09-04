/*
# [SECURITY FIX] Enable Row Level Security (RLS)
This migration addresses critical security advisories by enabling Row Level Security (RLS) on all user-data tables in the public schema. This ensures that the existing data access policies are enforced, preventing unauthorized data access.

## Query Description: This operation is a critical security enhancement. It activates the data access rules (policies) you've already defined. Without this, your policies have no effect, and any user could potentially access data from other users. It's highly recommended to apply this migration immediately. There is no risk of data loss.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Enables RLS for the following tables:
  - public.profiles
  - public.accounts
  - public.savings_goals
  - public.transactions
  - public.investments
  - public.user_achievements
  - public.notifications

## Security Implications:
- RLS Status: Enabled
- Policy Changes: No (Activates existing policies)
- Auth Requirements: Enforces existing `auth.uid()` based policies.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: A minor performance overhead on queries to these tables due to RLS policy checks, which is necessary for security.
*/

-- Enable RLS on all user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
