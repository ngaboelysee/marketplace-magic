-- Add Instagram integration fields to stores table
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
ADD COLUMN IF NOT EXISTS instagram_username TEXT,
ADD COLUMN IF NOT EXISTS instagram_connected_at TIMESTAMP WITH TIME ZONE;

-- Create draft_products table for Instagram imports
CREATE TABLE public.draft_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  instagram_post_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  instagram_permalink TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on draft_products
ALTER TABLE public.draft_products ENABLE ROW LEVEL SECURITY;

-- RLS policies for draft_products
CREATE POLICY "Vendors can view their own draft products"
ON public.draft_products FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.stores 
  WHERE stores.id = draft_products.store_id 
  AND stores.owner_id = auth.uid()
));

CREATE POLICY "Vendors can insert their own draft products"
ON public.draft_products FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.stores 
  WHERE stores.id = draft_products.store_id 
  AND stores.owner_id = auth.uid()
));

CREATE POLICY "Vendors can update their own draft products"
ON public.draft_products FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.stores 
  WHERE stores.id = draft_products.store_id 
  AND stores.owner_id = auth.uid()
));

CREATE POLICY "Vendors can delete their own draft products"
ON public.draft_products FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.stores 
  WHERE stores.id = draft_products.store_id 
  AND stores.owner_id = auth.uid()
));

-- Trigger for updated_at
CREATE TRIGGER update_draft_products_updated_at
BEFORE UPDATE ON public.draft_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();