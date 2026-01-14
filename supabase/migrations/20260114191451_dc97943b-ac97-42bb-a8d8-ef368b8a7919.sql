-- Add subaccount_id to stores table for Flutterwave integration
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS subaccount_id text,
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS account_number text,
ADD COLUMN IF NOT EXISTS business_name text;