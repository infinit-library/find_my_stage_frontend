import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { SearchInput, EventResult } from './search';
import { config } from './config';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (axiosConfig) => {
    const token = localStorage.getItem(config.storage.accessToken);
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(config.storage.accessToken);
      localStorage.removeItem(config.storage.user);
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SignupResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Authentication API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('auth/signin', credentials);
    return response.data.data; // Extract data from the nested structure
  },

  signup: async (userData: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post('auth/signup', userData);
    return response.data.data; // Extract data from the nested structure
  },

  googleAuth: async (): Promise<void> => {
    
    // Redirect to Google OAuth
    window.location.href = `${config.api.baseUrl}auth/google`;
  },

  refreshToken: async (): Promise<{token: string}> => {
    const response = await apiClient.post('auth/refresh');
    return response.data.data; // Extract data from the nested structure
  },

  logout: async (): Promise<void> => {
    await apiClient.post('auth/logout');
    localStorage.removeItem(config.storage.accessToken);
    localStorage.removeItem(config.storage.user);
  },
};

// Search API functions
export const searchApi = {
  search: async (input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> => {
    const response = await apiClient.post('/api/search', input);
    return response.data;
  },
};

// Ticketmaster API functions
export const ticketmasterApi = {
  searchEvents: async (params: {
    q: string;
    city?: string;
    country?: string;
    size?: number;
    num?: number;
    page?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      events: any[];
      total_results: number;
      total_pages: number;
      current_page: number;
      page_size: number;
      query: string;
      location: string;
      count: number;
      requests_made: number;
      events_fetched: number;
      max_requested: number;
      source: string;
    };
  }> => {
    const response = await apiClient.get('events/ticketmaster', { params });
    return response.data;
  },
};

// Payment API functions
export const paymentApi = {
  createCheckout: async (email: string): Promise<{ url: string; id?: string }> => {
    const response = await apiClient.post('/api/checkout', { email });
    return response.data;
  },

  getSubscription: async (email: string): Promise<{ activeUntil: string | null }> => {
    const response = await apiClient.get(`/api/subscription/${encodeURIComponent(email)}`);
    return response.data;
  },

  createTerminalConnectionToken: async (): Promise<{ secret: string }> => {
    const response = await apiClient.post('/api/terminal/connection_token');
    return response.data;
  },
};

export async function apiSearch(input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
  return searchApi.search(input);
}

export async function apiCreateCheckout(email: string): Promise<{ url: string; id?: string }> {
  return paymentApi.createCheckout(email);
}

export async function apiGetSubscription(email: string): Promise<{ activeUntil: string | null }> {
  return paymentApi.getSubscription(email);
}

export async function apiCreateTerminalConnectionToken(): Promise<{ secret: string }> {
  return paymentApi.createTerminalConnectionToken();
}

