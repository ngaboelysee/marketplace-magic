-- Create product_variants table for size/color combinations with stock
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  stock_count INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, size, color)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Variants are viewable by everyone" 
ON public.product_variants 
FOR SELECT 
USING (true);

CREATE POLICY "Store owners can manage their product variants" 
ON public.product_variants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM products p
    JOIN stores s ON s.id = p.store_id
    WHERE p.id = product_variants.product_id
    AND s.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all variants" 
ON public.product_variants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for filtering performance
CREATE INDEX idx_product_variants_size ON public.product_variants(size);
CREATE INDEX idx_product_variants_color ON public.product_variants(color);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);