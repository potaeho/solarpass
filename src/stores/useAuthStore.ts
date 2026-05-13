import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { User } from '../types/user';

const KEY_SESSION = 'auth_session';   // 현재 로그인 유저 JSON
const KEY_USERS   = 'auth_users';     // 가입된 유저 목록 JSON

// ── 내부 헬퍼 ─────────────────────────────────────────────────────────────────

type StoredUser = User & { passwordHash: string };

async function loadUsers(): Promise<StoredUser[]> {
  try {
    const raw = await SecureStore.getItemAsync(KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: StoredUser[]): Promise<void> {
  await SecureStore.setItemAsync(KEY_USERS, JSON.stringify(users));
}

// 단순 해시 (프로덕션에선 bcrypt 사용)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

// ── 스토어 ────────────────────────────────────────────────────────────────────

type AuthStore = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  loadSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string; email: string; password: string;
    phone?: string; company?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'company'>>) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  loadSession: async () => {
    try {
      const raw = await SecureStore.getItemAsync(KEY_SESSION);
      if (raw) {
        const user: User = JSON.parse(raw);
        set({ user, isLoggedIn: true });
      }
    } catch {
      // 세션 없음 — 로그인 필요
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const users = await loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, error: '등록되지 않은 이메일입니다.' };
    }
    if (found.passwordHash !== hashPassword(password)) {
      return { success: false, error: '비밀번호가 올바르지 않습니다.' };
    }

    const { passwordHash: _, ...user } = found;
    await SecureStore.setItemAsync(KEY_SESSION, JSON.stringify(user));
    set({ user, isLoggedIn: true });
    return { success: true };
  },

  register: async ({ name, email, password, phone, company }) => {
    const users = await loadUsers();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: '이미 사용 중인 이메일입니다.' };
    }

    const newUser: StoredUser = {
      id:           `user_${Date.now()}`,
      name,
      email,
      phone,
      company,
      createdAt:    new Date().toISOString(),
      passwordHash: hashPassword(password),
    };

    await saveUsers([...users, newUser]);

    const { passwordHash: _, ...user } = newUser;
    await SecureStore.setItemAsync(KEY_SESSION, JSON.stringify(user));
    set({ user, isLoggedIn: true });
    return { success: true };
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(KEY_SESSION);
    set({ user: null, isLoggedIn: false });
  },

  updateProfile: async (data) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    await SecureStore.setItemAsync(KEY_SESSION, JSON.stringify(updated));

    // 유저 목록도 업데이트
    const users = await loadUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      await saveUsers(users);
    }
    set({ user: updated });
  },
}));
