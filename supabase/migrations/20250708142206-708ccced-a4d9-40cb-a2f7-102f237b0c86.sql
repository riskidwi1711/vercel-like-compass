-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create websites table
CREATE TABLE public.websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  theme TEXT NOT NULL DEFAULT 'default',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website_access table for user permissions
CREATE TABLE public.website_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'author', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, website_id)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, website_id)
);

-- Create content table
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'page', 'blog', 'news')) DEFAULT 'article',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  visitor_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create function to get user's website access
CREATE OR REPLACE FUNCTION public.get_user_website_access(user_uuid UUID, website_uuid UUID)
RETURNS TEXT AS $$
  SELECT wa.role FROM public.website_access wa 
  WHERE wa.user_id = user_uuid AND wa.website_id = website_uuid
  UNION
  SELECT 'owner' FROM public.websites w 
  WHERE w.id = website_uuid AND w.owner_id = user_uuid
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user has website access
CREATE OR REPLACE FUNCTION public.user_has_website_access(website_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.website_access wa 
    WHERE wa.user_id = auth.uid() AND wa.website_id = website_uuid
    UNION
    SELECT 1 FROM public.websites w 
    WHERE w.id = website_uuid AND w.owner_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for websites
CREATE POLICY "Users can view websites they have access to" ON public.websites
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM public.website_access wa WHERE wa.user_id = auth.uid() AND wa.website_id = id)
  );

CREATE POLICY "Website owners can update their websites" ON public.websites
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create websites" ON public.websites
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Website owners can delete their websites" ON public.websites
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for website_access
CREATE POLICY "Users can view their own website access" ON public.website_access
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.websites w WHERE w.id = website_id AND w.owner_id = auth.uid())
  );

CREATE POLICY "Website owners can manage access" ON public.website_access
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.websites w WHERE w.id = website_id AND w.owner_id = auth.uid())
  );

-- RLS Policies for categories
CREATE POLICY "Users can view categories for accessible websites" ON public.categories
  FOR SELECT USING (public.user_has_website_access(website_id));

CREATE POLICY "Users with editor+ role can manage categories" ON public.categories
  FOR ALL USING (
    public.get_user_website_access(auth.uid(), website_id) IN ('owner', 'admin', 'editor')
  );

-- RLS Policies for content
CREATE POLICY "Users can view content for accessible websites" ON public.content
  FOR SELECT USING (public.user_has_website_access(website_id));

CREATE POLICY "Authors can manage their own content" ON public.content
  FOR ALL USING (
    auth.uid() = author_id OR
    public.get_user_website_access(auth.uid(), website_id) IN ('owner', 'admin', 'editor')
  );

CREATE POLICY "Users with author+ role can create content" ON public.content
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    public.get_user_website_access(auth.uid(), website_id) IN ('owner', 'admin', 'editor', 'author')
  );

-- RLS Policies for analytics
CREATE POLICY "Users can view analytics for accessible websites" ON public.analytics
  FOR SELECT USING (public.user_has_website_access(website_id));

CREATE POLICY "Anyone can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to auto-grant owner access when creating website
CREATE OR REPLACE FUNCTION public.handle_new_website()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.website_access (user_id, website_id, role)
  VALUES (NEW.owner_id, NEW.id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new website creation
CREATE OR REPLACE TRIGGER on_website_created
  AFTER INSERT ON public.websites
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_website();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_websites_updated_at
  BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_website_access_user_id ON public.website_access(user_id);
CREATE INDEX idx_website_access_website_id ON public.website_access(website_id);
CREATE INDEX idx_categories_website_id ON public.categories(website_id);
CREATE INDEX idx_content_website_id ON public.content(website_id);
CREATE INDEX idx_content_author_id ON public.content(author_id);
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_analytics_website_id ON public.analytics(website_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);