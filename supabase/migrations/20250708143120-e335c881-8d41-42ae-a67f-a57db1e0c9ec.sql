-- Add superadmin role to website_access role check
ALTER TABLE public.website_access DROP CONSTRAINT IF EXISTS website_access_role_check;
ALTER TABLE public.website_access ADD CONSTRAINT website_access_role_check 
CHECK (role IN ('owner', 'admin', 'editor', 'author', 'viewer', 'superadmin'));

-- Create superadmin role in profiles table  
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'superadmin'));

-- Update RLS policies to allow superadmin access to everything
DROP POLICY IF EXISTS "Superadmin can view all websites" ON public.websites;
CREATE POLICY "Superadmin can view all websites" ON public.websites
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );

DROP POLICY IF EXISTS "Superadmin can manage all websites" ON public.websites;
CREATE POLICY "Superadmin can manage all websites" ON public.websites
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );

-- Update function to check superadmin access
CREATE OR REPLACE FUNCTION public.user_has_website_access(website_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT (
    -- Check if user is superadmin
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
    OR
    -- Check normal website access
    EXISTS (
      SELECT 1 FROM public.website_access wa 
      WHERE wa.user_id = auth.uid() AND wa.website_id = website_uuid
      UNION
      SELECT 1 FROM public.websites w 
      WHERE w.id = website_uuid AND w.owner_id = auth.uid()
    )
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update get_user_website_access function to handle superadmin
CREATE OR REPLACE FUNCTION public.get_user_website_access(user_uuid UUID, website_uuid UUID)
RETURNS TEXT AS $$
  SELECT CASE 
    WHEN (SELECT role FROM public.profiles WHERE user_id = user_uuid) = 'superadmin' THEN 'superadmin'
    ELSE (
      SELECT wa.role FROM public.website_access wa 
      WHERE wa.user_id = user_uuid AND wa.website_id = website_uuid
      UNION
      SELECT 'owner' FROM public.websites w 
      WHERE w.id = website_uuid AND w.owner_id = user_uuid
      LIMIT 1
    )
  END;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update categories policy for superadmin
DROP POLICY IF EXISTS "Superadmin can manage all categories" ON public.categories;
CREATE POLICY "Superadmin can manage all categories" ON public.categories
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );

-- Update content policy for superadmin  
DROP POLICY IF EXISTS "Superadmin can manage all content" ON public.content;
CREATE POLICY "Superadmin can manage all content" ON public.content
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );

-- Update analytics policy for superadmin
DROP POLICY IF EXISTS "Superadmin can view all analytics" ON public.analytics;
CREATE POLICY "Superadmin can view all analytics" ON public.analytics
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );

-- Update website_access policy for superadmin
DROP POLICY IF EXISTS "Superadmin can manage all website access" ON public.website_access;
CREATE POLICY "Superadmin can manage all website access" ON public.website_access
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'superadmin'
  );