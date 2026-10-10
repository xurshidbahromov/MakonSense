import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  businessCategory?: string;
  role: 'owner' | 'analyst' | 'investor';
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  token: string | null;
  authMode: 'login' | 'register';

  // Actions
  setAuthMode: (mode: 'login' | 'register') => void;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    emailOrPhone: string,
    password: string,
    businessCategory?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: 'google' | 'telegram') => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const STORAGE_KEY = 'makonsense_auth_session';

const loadSavedSession = (): { user: UserProfile | null; token: string | null; isAuthenticated: boolean; isGuest: boolean } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null, isAuthenticated: false, isGuest: false };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
      isAuthenticated: !!parsed.user,
      isGuest: !!parsed.isGuest,
    };
  } catch {
    return { user: null, token: null, isAuthenticated: false, isGuest: false };
  }
};

const saved = loadSavedSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: saved.user,
  isAuthenticated: saved.isAuthenticated,
  isGuest: saved.isGuest,
  token: saved.token,
  authMode: 'register',

  setAuthMode: (mode) => set({ authMode: mode }),

  login: async (emailOrPhone, password) => {
    // Validate inputs
    if (!emailOrPhone.trim()) {
      return { success: false, error: 'Email yoki telefon raqamini kiriting' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Parol kamida 6 belgidan iborat bo‘lishi kerak' };
    }

    // Mock API authentication with fast response
    await new Promise((r) => setTimeout(r, 600));

    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Tadbirkor',
      emailOrPhone: emailOrPhone.trim(),
      businessCategory: 'cafe',
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    const token = 'jwt_tok_' + Math.random().toString(36).substring(2, 16);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: mockUser, token, isGuest: false })
    );

    set({
      user: mockUser,
      token,
      isAuthenticated: true,
      isGuest: false,
    });

    return { success: true };
  },

  register: async (name, emailOrPhone, password, businessCategory) => {
    if (!name.trim()) {
      return { success: false, error: 'Ismingiz yoki kompaniya nomini kiriting' };
    }
    if (!emailOrPhone.trim()) {
      return { success: false, error: 'Email yoki telefon raqamini kiriting' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Parol kamida 6 belgidan iborat bo‘lishi kerak' };
    }

    await new Promise((r) => setTimeout(r, 700));

    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      businessCategory: businessCategory || 'general',
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    const token = 'jwt_tok_' + Math.random().toString(36).substring(2, 16);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: newUser, token, isGuest: false })
    );

    set({
      user: newUser,
      token,
      isAuthenticated: true,
      isGuest: false,
    });

    return { success: true };
  },

  loginWithSocial: async (provider) => {
    await new Promise((r) => setTimeout(r, 500));

    const socialUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: provider === 'google' ? 'Google Foydalanuvchisi' : 'Telegram Tadbirkor',
      emailOrPhone: provider === 'google' ? 'user@gmail.com' : '+998901234567',
      businessCategory: 'cafe',
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    const token = 'jwt_tok_' + Math.random().toString(36).substring(2, 16);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: socialUser, token, isGuest: false })
    );

    set({
      user: socialUser,
      token,
      isAuthenticated: true,
      isGuest: false,
    });
  },

  continueAsGuest: () => {
    const guestUser: UserProfile = {
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: 'Mehmon',
      emailOrPhone: 'guest@makonsense.uz',
      businessCategory: 'cafe',
      role: 'analyst',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: guestUser, token: null, isGuest: true })
    );

    set({
      user: guestUser,
      token: null,
      isAuthenticated: true,
      isGuest: true,
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
    });
  },
}));
