-- Create products table for catalog/product management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  sku TEXT,
  category_id UUID,
  stock_quantity INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT products_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE,
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL,
  CONSTRAINT products_status_check CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  CONSTRAINT products_sku_website_unique UNIQUE (website_id, sku)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Superadmin can manage all products" 
ON public.products 
FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
);

CREATE POLICY "Users can view products for accessible websites" 
ON public.products 
FOR SELECT 
USING (user_has_website_access(website_id));

CREATE POLICY "Users with editor+ role can manage products" 
ON public.products 
FOR ALL 
USING (
  get_user_website_access(auth.uid(), website_id) = ANY(ARRAY['owner', 'admin', 'editor'])
);

CREATE POLICY "Users with author+ role can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  get_user_website_access(auth.uid(), website_id) = ANY(ARRAY['owner', 'admin', 'editor', 'author'])
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_products_website_id ON public.products(website_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_sku ON public.products(website_id, sku);
CREATE INDEX idx_products_status ON public.products(status);