// ✅ Configuração flexível de URL base
const getApiBaseUrl = () => {
  // Se VITE_USE_PROXY for true, usar proxy do Vite
  if (import.meta.env.VITE_USE_PROXY === 'true') {
    return '/api';
  }
  
  // Caso contrário, usar URL direta
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export interface Skatepark {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
    source: string;
  };
}

export interface ApiResponse<T> {
  skateparks?: T[];
  skatepark?: T;
  count?: number;
  message?: string;
  error?: string;
  timestamp?: string;
}

class ApiService {
  private baseURL = API_BASE_URL;

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      
      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }

  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }

  // Skateparks
  async getSkateparks(city?: string): Promise<ApiResponse<Skatepark>> {
    const endpoint = city ? `/skateparks?city=${encodeURIComponent(city)}` : '/skateparks';
    return this.request(endpoint);
  }

  async getSkatepark(id: string): Promise<ApiResponse<Skatepark>> {
    return this.request(`/skateparks/${id}`);
  }

  async getSkateparksByCity(city: string): Promise<ApiResponse<Skatepark>> {
    return this.request(`/skateparks/city/${encodeURIComponent(city)}`);
  }

  // Authentication
  async login(idToken: string, token?: string) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ idToken }),
    });
  }

  async getProfile(token: string) {
    return this.request('/auth/profile', {
      headers: this.getAuthHeaders(token),
    });
  }

  async validateToken(token: string) {
    return this.request('/auth/validate', {
      headers: this.getAuthHeaders(token),
    });
  }

  // Users
  async getUsers(token: string) {
    return this.request('/users', {
      headers: this.getAuthHeaders(token),
    });
  }

  async getUser(uid: string, token: string) {
    return this.request(`/users/${uid}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  async getMyProfile(token: string) {
    return this.request('/users/me', {
      headers: this.getAuthHeaders(token),
    });
  }

  // Monitoring
  async getStats(token: string) {
    return this.request('/monitoring/stats', {
      headers: this.getAuthHeaders(token),
    });
  }

  async getDetailedHealth(token: string) {
    return this.request('/monitoring/health-detailed', {
      headers: this.getAuthHeaders(token),
    });
  }
}

export const apiService = new ApiService();