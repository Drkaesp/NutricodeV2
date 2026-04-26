import { clearCurrentUser, getCurrentUser, saveCurrentUser } from '@/src/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/src/services/api';

export interface User {
  id: string;
  nome: string;
  email: string;
  // Onboarding data
  peso?: number;       // kg
  altura?: number;     // cm
  nascimento?: string; // DD/MM/AAAA
  idade?: number;
  genero?: 'masculino' | 'feminino' | 'outro';
  objetivo?: 'perder_peso' | 'ganhar_massa' | 'manter_forma';
  nivelAtividade?: 'sedentario' | 'moderado' | 'ativo';
  avatar?: string;
  // Gamification
  totalXP: number;
  level?: number;
  nextLevelRequirement?: number;
  currentReward?: number;
  streak: number;
  progression?: any;
  lastActiveDate?: string; // ISO date
  isPremium?: boolean;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (jwtToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserDataFromApi = async () => {
    try {
      const me = await api.getUserMe();
      let info = null;
      let progression = null;
      
      const actualUserId = me.id || me.userId;
      try { info = await api.getUserInfo(actualUserId); } catch(e) {}
      try { progression = await api.getUserProgression(actualUserId); } catch(e) {}

      const currentUser = await getCurrentUser() || {}; // Keep local fields like objetivo, peso

      const enrichedUser: User = {
        ...currentUser,
        id: actualUserId,
        nome: me.username,
        email: me.email,
        altura: info?.height ?? currentUser.altura,
        idade: info?.age,
        genero: info?.sex === 'MALE' ? 'masculino' : info?.sex === 'FEMALE' ? 'feminino' : currentUser.genero,
        totalXP: progression?.xp ?? 0,
        streak: progression?.currentWorkoutStreak ?? 0,
        level: progression?.level ?? 1,
        nextLevelRequirement: progression?.nextLevelRequirement ?? 240,
        currentReward: progression?.currentReward ?? 100,
        progression: progression,
      };
      
      setUser(enrichedUser);
      await saveCurrentUser(enrichedUser);
      return enrichedUser;
    } catch(e: any) {
      console.error("Failed to fetch user data from API:", e);
      if (e.message === 'Sessão expirada') {
        await logout();
      }
      throw e;
    }
  };

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@nutricode_jwt');
      const currentUser = await getCurrentUser();
      
      if (storedToken) {
        setToken(storedToken);
        try {
          await loadUserDataFromApi();
        } catch(e) {
          if (currentUser) setUser(currentUser);
        }
      } else {
        if (currentUser) setUser(currentUser);
      }
      
      setIsLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (jwtToken: string) => {
    setToken(jwtToken);
    await AsyncStorage.setItem('@nutricode_jwt', jwtToken);
    return await loadUserDataFromApi();
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
    <AuthContext.Provider value={{ user, isLoading, token, login, logout, updateUser, refreshUserData: loadUserDataFromApi }}>
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
