import { clearCurrentUser, getCurrentUser, saveCurrentUser } from '@/src/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  nome: string;
  email: string;
  // Onboarding data
  peso?: number;       // kg
  altura?: number;     // cm
  nascimento?: string; // DD/MM/AAAA
  genero?: 'masculino' | 'feminino' | 'outro';
  objetivo?: 'perder_peso' | 'ganhar_massa' | 'manter_forma';
  nivelAtividade?: 'sedentario' | 'moderado' | 'ativo';
  // Gamification
  totalXP: number;
  streak: number;
  lastActiveDate?: string; // ISO date
  isPremium?: boolean;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (userData: User) => {
    const enrichedUser: User = {
      ...userData,
      totalXP: userData.totalXP ?? 0,
      streak: userData.streak ?? 0,
    };
    setUser(enrichedUser);
    await saveCurrentUser(enrichedUser);
  };

  const logout = async () => {
    setUser(null);
    await clearCurrentUser();
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedFields };
      setUser(newUser);
      await saveCurrentUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
