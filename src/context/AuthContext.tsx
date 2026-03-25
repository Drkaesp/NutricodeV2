import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * Contexto de Autenticação — NutriCode v2
 * Gerencia registro, login, logout e atualização de perfil.
 * Senhas são armazenadas como hash SHA-256 (nunca em texto plano).
 */

// ─── Tipos ───────────────────────────────────────────────
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  peso: number;
  altura: number;
  idade: number;
  sexo: string;
  objetivo: string;
  nivelAtividade: string;
  totalXP: number;
  streak: number;
  onboardingCompleto: boolean;
  dataCriacao: string;
}

interface AuthContextData {
  user: Usuario | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (email: string, senha: string, nome: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (dados: Partial<Usuario>) => Promise<void>;
  completeOnboarding: (dados: Partial<Usuario>) => Promise<void>;
  addXP: (quantidade: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const CHAVE_USUARIOS = '@nutricode_usuarios';
const CHAVE_USUARIO_LOGADO = '@nutricode_usuario_logado';

// ─── Helpers ─────────────────────────────────────────────

async function hashSenha(senha: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    senha
  );
}

async function carregarUsuarios(): Promise<Usuario[]> {
  const dados = await AsyncStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

async function salvarUsuarios(usuarios: Usuario[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// ─── Provider ────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao abrir o app
  useEffect(() => {
    restaurarSessao();
  }, []);

  async function restaurarSessao() {
    try {
      const emailSalvo = await AsyncStorage.getItem(CHAVE_USUARIO_LOGADO);
      if (emailSalvo) {
        const usuarios = await carregarUsuarios();
        const encontrado = usuarios.find((u) => u.email === emailSalvo);
        if (encontrado) {
          setUser(encontrado);
        }
      }
    } catch (erro) {
      console.error('Erro ao restaurar sessão:', erro);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, senha: string): Promise<boolean> {
    const usuarios = await carregarUsuarios();
    const hash = await hashSenha(senha);
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senhaHash === hash
    );

    if (encontrado) {
      setUser(encontrado);
      await AsyncStorage.setItem(CHAVE_USUARIO_LOGADO, encontrado.email);
      return true;
    }
    return false;
  }

  async function register(email: string, senha: string, nome: string): Promise<boolean> {
    const usuarios = await carregarUsuarios();
    const jaExiste = usuarios.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (jaExiste) return false;

    const hash = await hashSenha(senha);
    const novoUsuario: Usuario = {
      id: Date.now().toString(),
      nome,
      email: email.toLowerCase(),
      senhaHash: hash,
      peso: 0,
      altura: 0,
      idade: 0,
      sexo: '',
      objetivo: '',
      nivelAtividade: '',
      totalXP: 0,
      streak: 0,
      onboardingCompleto: false,
      dataCriacao: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    await salvarUsuarios(usuarios);

    setUser(novoUsuario);
    await AsyncStorage.setItem(CHAVE_USUARIO_LOGADO, novoUsuario.email);
    return true;
  }

  async function logout(): Promise<void> {
    setUser(null);
    await AsyncStorage.removeItem(CHAVE_USUARIO_LOGADO);
  }

  async function updateUser(dados: Partial<Usuario>): Promise<void> {
    if (!user) return;

    const usuarioAtualizado = { ...user, ...dados };
    setUser(usuarioAtualizado);

    const usuarios = await carregarUsuarios();
    const indice = usuarios.findIndex((u) => u.id === user.id);
    if (indice !== -1) {
      usuarios[indice] = usuarioAtualizado;
      await salvarUsuarios(usuarios);
    }
  }

  async function completeOnboarding(dados: Partial<Usuario>): Promise<void> {
    await updateUser({ ...dados, onboardingCompleto: true });
  }

  async function addXP(quantidade: number): Promise<void> {
    if (!user) return;
    const novoXP = (user.totalXP || 0) + quantidade;
    await updateUser({ totalXP: novoXP });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        completeOnboarding,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
