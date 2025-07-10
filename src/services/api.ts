
import { supabase } from '@/integrations/supabase/client';

interface ApiResponse<T> {
  responseCode: string;
  responseMessage: string;
  data: T;
  count?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  websiteAccess: Array<{
    websiteId: string;
    role: string;
  }>;
  createdAt: string;
}

interface Website {
  _id: string;
  name: string;
  domain: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  websiteId: string;
  createdAt: string;
  updatedAt: string;
}

interface Content {
  _id: string;
  title: string;
  body: string;
  contentType: string;
  status: string;
  websiteId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  categoryId?: string;
  stockQuantity: number;
  status: string;
  images: string[];
  websiteId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  userCount: number;
  contentCount: number;
  categoryCount: number;
  productCount: number;
}

class ApiService {
  // Auth methods
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data: { token: data.session?.access_token || '' } };
  }

  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw error;
    return { data: { token: data.session?.access_token || '' } };
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    
    // Get website access for user (only if not superadmin)
    let websiteAccess = [];
    if (profile.role !== 'superadmin') {
      const { data: access } = await supabase
        .from('website_access')
        .select('website_id, role')
        .eq('user_id', user.id);
      
      websiteAccess = access?.map(a => ({ websiteId: a.website_id, role: a.role })) || [];
    }
    
    return {
      data: {
        _id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        websiteAccess,
        createdAt: profile.created_at,
      }
    };
  }

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { data: 'Password reset email sent' };
  }

  // Website methods
  async getWebsites() {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(w => ({
        _id: w.id,
        name: w.name,
        domain: w.domain,
        theme: w.theme,
        createdAt: w.created_at,
        updatedAt: w.updated_at,
      }))
    };
  }

  async createWebsite(name: string, domain: string, theme: string = 'default') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('websites')
      .insert({
        name,
        domain,
        theme,
        owner_id: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        domain: data.domain,
        theme: data.theme,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async updateWebsite(websiteId: string, updateData: Partial<Website>) {
    const { data, error } = await supabase
      .from('websites')
      .update({
        name: updateData.name,
        domain: updateData.domain,
        theme: updateData.theme,
      })
      .eq('id', websiteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        domain: data.domain,
        theme: data.theme,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async deleteWebsite(websiteId: string) {
    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId);
    
    if (error) throw error;
    return { data: null };
  }

  // Dashboard methods
  async getDashboardStats(websiteId: string) {
    const [usersCount, contentCount, categoriesCount, productsCount] = await Promise.all([
      supabase.from('website_access').select('*', { count: 'exact', head: true }).eq('website_id', websiteId),
      supabase.from('content').select('*', { count: 'exact', head: true }).eq('website_id', websiteId),
      supabase.from('categories').select('*', { count: 'exact', head: true }).eq('website_id', websiteId),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('website_id', websiteId),
    ]);
    
    return {
      data: {
        userCount: usersCount.count || 0,
        contentCount: contentCount.count || 0,
        categoryCount: categoriesCount.count || 0,
        productCount: productsCount.count || 0,
      }
    };
  }

  // Categories methods
  async getCategories(websiteId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(c => ({
        _id: c.id,
        name: c.name,
        websiteId: c.website_id,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }))
    };
  }

  async createCategory(websiteId: string, name: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        website_id: websiteId,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async updateCategory(websiteId: string, categoryId: string, name: string) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', categoryId)
      .eq('website_id', websiteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async deleteCategory(websiteId: string, categoryId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('website_id', websiteId);
    
    if (error) throw error;
    return { data: null };
  }

  // Content methods
  async getContent(websiteId: string) {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(c => ({
        _id: c.id,
        title: c.title,
        body: c.body,
        contentType: c.content_type,
        status: c.status,
        websiteId: c.website_id,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }))
    };
  }

  async createContent(websiteId: string, title: string, body: string, contentType: string, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('content')
      .insert({
        title,
        body,
        content_type: contentType,
        status,
        website_id: websiteId,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        title: data.title,
        body: data.body,
        contentType: data.content_type,
        status: data.status,
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async updateContent(websiteId: string, contentId: string, updateData: Partial<Content>) {
    const { data, error } = await supabase
      .from('content')
      .update({
        title: updateData.title,
        body: updateData.body,
        content_type: updateData.contentType,
        status: updateData.status,
        published_at: updateData.status === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', contentId)
      .eq('website_id', websiteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        title: data.title,
        body: data.body,
        contentType: data.content_type,
        status: data.status,
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async deleteContent(websiteId: string, contentId: string) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', contentId)
      .eq('website_id', websiteId);
    
    if (error) throw error;
    return { data: null };
  }

  // Users methods
  async getUsers(websiteId: string) {
    // Get website access records
    const { data: accessData, error: accessError } = await supabase
      .from('website_access')
      .select('user_id, role')
      .eq('website_id', websiteId);
    
    if (accessError) throw accessError;
    
    if (!accessData || accessData.length === 0) {
      return { data: [] };
    }
    
    // Get user profiles for those users
    const userIds = accessData.map(a => a.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', userIds);
    
    if (profilesError) throw profilesError;
    
    // Combine the data
    const userData = accessData.map(access => {
      const profile = profiles?.find(p => p.user_id === access.user_id);
      return {
        _id: profile?.id || access.user_id,
        name: profile?.name || 'Unknown',
        email: profile?.email || 'Unknown',
        websiteAccess: [{ websiteId, role: access.role }],
        createdAt: profile?.created_at || new Date().toISOString(),
      };
    });
    
    return { data: userData };
  }

  async createUser(websiteId: string, userData: { name: string; email: string; password: string; role: string }) {
    // This would typically be handled by an admin panel or invitation system
    // For now, we'll just add existing users to website access
    throw new Error('User creation not implemented - users must register themselves');
  }

  async updateUser(websiteId: string, userId: string, userData: Partial<User>) {
    // Update user role in website access
    if (userData.websiteAccess && userData.websiteAccess.length > 0) {
      const { error } = await supabase
        .from('website_access')
        .update({ role: userData.websiteAccess[0].role })
        .eq('website_id', websiteId)
        .eq('user_id', userId);
      
      if (error) throw error;
    }
    
    return { data: userData };
  }

  async deleteUser(websiteId: string, userId: string) {
    const { error } = await supabase
      .from('website_access')
      .delete()
      .eq('website_id', websiteId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { data: null };
  }

  // Products methods
  async getProducts(websiteId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(p => ({
        _id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        sku: p.sku,
        categoryId: p.category_id,
        stockQuantity: p.stock_quantity,
        status: p.status,
        images: Array.isArray(p.images) ? p.images.filter((img): img is string => typeof img === 'string') : [],
        websiteId: p.website_id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }))
    };
  }

  async createProduct(websiteId: string, productData: {
    name: string;
    description?: string;
    price?: number;
    sku?: string;
    categoryId?: string;
    stockQuantity?: number;
    status?: string;
    images?: string[];
  }) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sku: productData.sku,
        category_id: productData.categoryId,
        stock_quantity: productData.stockQuantity || 0,
        status: productData.status || 'active',
        images: productData.images || [],
        website_id: websiteId,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
        categoryId: data.category_id,
        stockQuantity: data.stock_quantity,
        status: data.status,
        images: data.images || [],
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async updateProduct(websiteId: string, productId: string, updateData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        sku: updateData.sku,
        category_id: updateData.categoryId,
        stock_quantity: updateData.stockQuantity,
        status: updateData.status,
        images: updateData.images,
      })
      .eq('id', productId)
      .eq('website_id', websiteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: {
        _id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
        categoryId: data.category_id,
        stockQuantity: data.stock_quantity,
        status: data.status,
        images: data.images || [],
        websiteId: data.website_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async deleteProduct(websiteId: string, productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('website_id', websiteId);
    
    if (error) throw error;
    return { data: null };
  }
}

export const apiService = new ApiService();
export type { User, Category, Content, Product, DashboardStats, Website, ApiResponse };
