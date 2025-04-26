import { API_URL } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/auth';
import { useMutation } from '@tanstack/react-query';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    this.loadStoredData();
  }

  private async loadStoredData() {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedToken) this.token = storedToken;
      if (storedUser) this.user = JSON.parse(storedUser);
    } catch (error) {
      console.error('Error loading stored auth data:', error);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      const userData = response.data;
      
      // Map the server response to our User type
      const user: User = {
        id: userData.user.id,
        name: userData.user.name,
        email: userData.user.email,
        phoneNumber: userData.user.phone_number,
        role: userData.user.role,
        subjects: userData.user.subjects,
        organization: userData.user.organization ? {
          id: userData.user.organization.id,
          name: userData.user.organization.name
        } : undefined,
        token: userData.token
      };
      
      this.token = userData.token;
      this.user = user;
      
      // Store the data
      await AsyncStorage.setItem('auth_token', userData.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      
      return { token: userData.token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async logout(): Promise<void> {
    this.token = null;
    this.user = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
  }
}

export const authService = AuthService.getInstance();

// React Query hooks
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
  });
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    const userData = response.data;
    
    // Ensure the response includes all required fields
    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phone_number,
      role: userData.role,
      subjects: userData.subjects,
      organization: userData.organization,
      token: userData.token,
    };
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}; 