
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
  role: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Content {
  _id: string;
  title: string;
  body: string;
  contentType: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardStats {
  userCount: number;
  contentCount: number;
  categoryCount: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role: string = 'user') {
    return this.request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  async forgotPassword(email: string) {
    return this.request<string>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  // Categories methods
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async createCategory(name: string) {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Content methods
  async createContent(title: string, body: string, contentType: string, status: string) {
    return this.request<Content>('/content', {
      method: 'POST',
      body: JSON.stringify({ title, body, contentType, status }),
    });
  }
}

export const apiService = new ApiService();
export type { User, Category, Content, DashboardStats, ApiResponse };
