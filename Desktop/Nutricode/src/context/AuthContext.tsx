import { clearCurrentUser, getCurrentUser, saveCurrentUser } from '@/src/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  token: string | null;
  login: (userData: User, jwtToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@nutricode_jwt');
      const currentUser = await getCurrentUser();
      
      if (storedToken) setToken(storedToken);
      if (currentUser) setUser(currentUser);
      
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (userData: User, jwtToken?: string) => {
    const enrichedUser: User = {
      ...userData,
      totalXP: userData.totalXP ?? 0,
      streak: userData.streak ?? 0,
    };
    setUser(enrichedUser);
    await saveCurrentUser(enrichedUser);

    if (jwtToken) {
      setToken(jwtToken);
      await AsyncStorage.setItem('@nutricode_jwt', jwtToken);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearCurrentUser();
    await AsyncStorage.removeItem('@nutricode_jwt');
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedFields };
      setUser(newUser);
      await saveCurrentUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, token, login, logout, updateUser }}>
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
