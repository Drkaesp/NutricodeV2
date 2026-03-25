import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import NutriMascot from '@/src/components/NutriMascot';
import { useAuth } from '@/src/context/AuthContext';

/**
 * Tela de Splash — NutriCode v2
 * Exibe o mascote enquanto carrega a sessão do usuário.
 * Espera tanto o carregamento de dados quanto o tempo mínimo de exibição.
 */

const TEMPO_MINIMO_SPLASH_MS = 2000;

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tempoMinimoAtingido, setTempoMinimoAtingido] = useState(false);

  // Iniciar timer do tempo mínimo de splash
  useEffect(() => {
    const timer = setTimeout(() => {
      setTempoMinimoAtingido(true);
    }, TEMPO_MINIMO_SPLASH_MS);

    return () => clearTimeout(timer);
  }, []);

  // Navegar quando ambas as condições forem atendidas
  useEffect(() => {
    if (isLoading || !tempoMinimoAtingido) return;

    if (user) {
      if (user.onboardingCompleto) {
        router.replace('/(panel)/home/page');
      } else {
        router.replace('/(auth)/onboarding/page');
      }
    } else {
      router.replace('/(auth)/signup/page');
    }
  }, [isLoading, tempoMinimoAtingido, user]);

  return (
    <View style={estilos.container}>
      <NutriMascot state="alegre" size={120} />
      <Text style={estilos.titulo}>NutriCode</Text>
      <Text style={estilos.subtitulo}>Seu assistente de saúde</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.brandAccent,
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
