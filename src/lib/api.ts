import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { SearchInput, EventResult } from './search';
import { config } from './config';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem(config.storage.accessToken);
      localStorage.removeItem(config.storage.user);
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

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

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('auth/signin', credentials);
    return response.data.data;
  },
  signup: async (userData: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post('auth/signup', userData);
    return response.data.data;
  },
  googleAuth: async (): Promise<void> => {


    const baseUrl = config.api.baseUrl.endsWith('/') ? config.api.baseUrl : `${config.api.baseUrl}/`;
    window.location.href = `${baseUrl}api/auth/google/login`;
  },
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post('auth/refresh');
    return response.data.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post('auth/logout');
    localStorage.removeItem(config.storage.accessToken);
    localStorage.removeItem(config.storage.user);
  },
};

export const searchApi = {
  search: async (input: SearchInput): Promise<{ top20: EventResult[]; more100: EventResult[] }> => {
    const response = await apiClient.post('/api/search', input);
    return response.data;
  },
  ninjaSearch: async (topic: string, industry: string): Promise<any> => {
    const response = await apiClient.post('/openwebninja/getdata', { topic, industry });
    return response.data;
  },
};

export const ticketmasterApi = {
  searchEvents: async (params: {
    q?: string;
    industry?: string;
    topic?: string;
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

export const eventbriteApi = {
  searchEvents: async (params: {
    q?: string;
    industry?: string;
    topic?: string;
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
    const response = await apiClient.get('events/eventbrite', { params });
    return response.data;
  },
};

export const callForDataSpeakersApi = {
  searchEvents: async (params: {
    q?: string;
    industry?: string;
    topic?: string;
    region?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      events: any[];
      total_count: number;
      pagination: any;
      filter: any;
      search: any;
      count: number;
      source: string;
      fetched_at: string;
    };
  }> => {
    const response = await apiClient.get('events/call-for-data-speakers-events', { params });
    return response.data;
  },
};

export const pretalxApi = {
  searchEvents: async (params: {
    maxEvents?: number | null;
    saveToDatabase?: boolean;
    headless?: boolean;
    delay?: number;
    includePageDetails?: boolean;
    topic?: string | null;
    industry?: string | null;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      eventsFound: number;
      allEvents: any[];
      saveResult: any;
      method: string;
      scrapedAt: string;
      summary: any;
      errors: any[];
    };
  }> => {
    const response = await apiClient.post('scraper/pretalx', params);
    return response.data;
  },
};

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
export async function ninjaSearch(topic: string, industry: string): Promise<{ top20: EventResult[]; more100: EventResult[] }> {
  return searchApi.ninjaSearch(topic, industry);
}