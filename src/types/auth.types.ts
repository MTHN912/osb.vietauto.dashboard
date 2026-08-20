export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phone: string;
  dealerName?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'dealer_manager' | 'staff';
  dealerId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}
