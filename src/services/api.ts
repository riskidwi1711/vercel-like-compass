
const API_BASE_URL = 'https://your-api-base-url.com/api';

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

interface DashboardStats {
  userCount: number;
  contentCount: number;
  categoryCount: number;
}

class ApiService {
  private getHeaders(websiteId?: string): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    if (websiteId) {
      headers['x-website-id'] = websiteId;
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, websiteId?: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders(websiteId),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string }>('/auth/login', undefined, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role: string = 'user') {
    return this.request<{ token: string }>('/auth/register', undefined, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  async forgotPassword(email: string) {
    return this.request<string>('/auth/forgot-password', undefined, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Website methods
  async getWebsites() {
    return this.request<Website[]>('/websites');
  }

  async createWebsite(name: string, domain: string, theme: string = 'default') {
    return this.request<Website>('/websites', undefined, {
      method: 'POST',
      body: JSON.stringify({ name, domain, theme }),
    });
  }

  async updateWebsite(websiteId: string, data: Partial<Website>) {
    return this.request<Website>(`/websites/${websiteId}`, undefined, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWebsite(websiteId: string) {
    return this.request<void>(`/websites/${websiteId}`, undefined, {
      method: 'DELETE',
    });
  }

  // Dashboard methods (website-scoped)
  async getDashboardStats(websiteId: string) {
    return this.request<DashboardStats>('/dashboard/stats', websiteId);
  }

  // Categories methods (website-scoped)
  async getCategories(websiteId: string) {
    return this.request<Category[]>('/categories', websiteId);
  }

  async createCategory(websiteId: string, name: string) {
    return this.request<Category>('/categories', websiteId, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateCategory(websiteId: string, categoryId: string, name: string) {
    return this.request<Category>(`/categories/${categoryId}`, websiteId, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCategory(websiteId: string, categoryId: string) {
    return this.request<void>(`/categories/${categoryId}`, websiteId, {
      method: 'DELETE',
    });
  }

  // Content methods (website-scoped)
  async getContent(websiteId: string) {
    return this.request<Content[]>('/content', websiteId);
  }

  async createContent(websiteId: string, title: string, body: string, contentType: string, status: string) {
    return this.request<Content>('/content', websiteId, {
      method: 'POST',
      body: JSON.stringify({ title, body, contentType, status }),
    });
  }

  async updateContent(websiteId: string, contentId: string, data: Partial<Content>) {
    return this.request<Content>(`/content/${contentId}`, websiteId, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContent(websiteId: string, contentId: string) {
    return this.request<void>(`/content/${contentId}`, websiteId, {
      method: 'DELETE',
    });
  }

  // Users methods (website-scoped)
  async getUsers(websiteId: string) {
    return this.request<User[]>('/users', websiteId);
  }

  async createUser(websiteId: string, userData: { name: string; email: string; password: string; role: string }) {
    return this.request<User>('/users', websiteId, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(websiteId: string, userId: string, userData: Partial<User>) {
    return this.request<User>(`/users/${userId}`, websiteId, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(websiteId: string, userId: string) {
    return this.request<void>(`/users/${userId}`, websiteId, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { User, Category, Content, DashboardStats, Website, ApiResponse };
