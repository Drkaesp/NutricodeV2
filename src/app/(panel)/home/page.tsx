import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import NutriMascot from '@/src/components/NutriMascot';
import XPBar from '@/src/components/XPBar';
import StatCard from '@/src/components/StatCard';
import MaquinaDeEscreverTexto from '@/src/components/MaquinaDeEscreverTexto';
import { useAuth } from '@/src/context/AuthContext';
import { getLevelFromXP, calculateDailyWaterGoal } from '@/constants/GameData';
import { getTodayWater, getTodayWorkout, getTodayMeals } from '@/src/utils/storage';

/**
 * Tela Principal — NutriCode v2
 * Exibe resumo diário: água, treino, refeições, XP e streak.
 */
export default function TelaPrincipal() {
  const { user } = useAuth();

  const [agua, setAgua] = useState(0);
  const [treinoConcluido, setTreinoConcluido] = useState(false);
  const [totalRefeicoes, setTotalRefeicoes] = useState(0);

  const xpTotal = user?.totalXP || 0;
  const { level, currentXP, nextLevelXP } = getLevelFromXP(xpTotal);
  const streak = user?.streak || 0;

  const metaAgua = calculateDailyWaterGoal(user?.peso || 70);
  const peso = user?.peso || 0;
  const altura = user?.altura || 0;
  const imc = altura > 0 ? (peso / ((altura / 100) ** 2)).toFixed(1) : '—';

  const rotuloObjetivo =
    user?.objetivo === 'perder_peso' ? 'Perder Peso'
    : user?.objetivo === 'ganhar_massa' ? 'Ganhar Massa'
    : user?.objetivo === 'manter_forma' ? 'Manter Forma'
    : 'Não definido';

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const aguaHoje = await getTodayWater();
    setAgua(aguaHoje);

    const treino = await getTodayWorkout();
    setTreinoConcluido(treino.completed);

    const refeicoes = await getTodayMeals();
    setTotalRefeicoes(refeicoes.length);
  }

  const percentAgua = Math.min(Math.round((agua / metaAgua) * 100), 100);

  const mensagens = [
    `Você já bebeu ${(agua / 1000).toFixed(1)}L de água hoje`,
    `${totalRefeicoes} refeições registradas hoje`,
    `Nível ${level} — Continue assim!`,
  ];

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho */}
        <View style={estilos.header}>
          <View>
            <Text style={estilos.saudacao}>Olá, {user?.nome?.split(' ')[0] || 'Atleta'}!</Text>
            <Text style={estilos.subtitulo}>Vamos treinar hoje?</Text>
          </View>
          <View style={estilos.badgeStreak}>
            <Ionicons name="flame" size={16} color={Colors.streakFire} />
            <Text style={estilos.textoStreak}>{streak}</Text>
          </View>
        </View>

        {/* Cartão de Perfil + XP */}
        <View style={estilos.cartaoPerfil}>
          <View style={estilos.linhaPerfil}>
            <NutriMascot state="alegre" size={60} />
            <View style={estilos.infoPerfil}>
              <Text style={estilos.nomePerfil}>{user?.nome || 'Atleta'}</Text>
              <Text style={estilos.objetivoPerfil}>{rotuloObjetivo}</Text>
            </View>
          </View>
          <XPBar currentXP={currentXP} nextLevelXP={nextLevelXP} level={level} />
        </View>

        {/* Mensagem Rotativa */}
        <View style={estilos.painelMensagem}>
          <MaquinaDeEscreverTexto
            mensagens={mensagens}
            velocidadeDigitacao={45}
            tempoPausa={4000}
            estilo={estilos.textoMensagem}
          />
        </View>

        {/* Resumo Diário */}
        <Text style={estilos.tituloSecao}>Resumo do Dia</Text>
        <View style={estilos.grade}>
          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.waterMedium + '20' }]}>
              <Ionicons name="water" size={20} color={Colors.waterMedium} />
            </View>
            <Text style={estilos.valorResumo}>{percentAgua}%</Text>
            <Text style={estilos.rotuloResumo}>Água</Text>
            <View style={estilos.barraMini}>
              <View style={[estilos.barraPreenchida, { width: `${percentAgua}%`, backgroundColor: Colors.waterMedium }]} />
            </View>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.brandGreen + '20' }]}>
              <Ionicons name="barbell" size={20} color={Colors.brandGreen} />
            </View>
            <Text style={estilos.valorResumo}>{treinoConcluido ? '✅' : '⏳'}</Text>
            <Text style={estilos.rotuloResumo}>Treino</Text>
            <View style={estilos.barraMini}>
              <View style={[estilos.barraPreenchida, { width: treinoConcluido ? '100%' : '0%', backgroundColor: Colors.brandGreen }]} />
            </View>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.brandAccent + '20' }]}>
              <Ionicons name="restaurant" size={20} color={Colors.brandAccent} />
            </View>
            <Text style={estilos.valorResumo}>{totalRefeicoes}/4</Text>
            <Text style={estilos.rotuloResumo}>Refeições</Text>
            <View style={estilos.barraMini}>
              <View style={[estilos.barraPreenchida, { width: `${(totalRefeicoes / 4) * 100}%`, backgroundColor: Colors.brandAccent }]} />
            </View>
          </View>
        </View>

        {/* Métricas Corporais */}
        <Text style={estilos.tituloSecao}>Métricas</Text>
        <View style={estilos.linhaStats}>
          <StatCard icon="body" iconColor={Colors.brandGreen} label="Peso" value={peso > 0 ? `${peso}kg` : '—'} />
          <View style={{ width: 10 }} />
          <StatCard icon="pulse" iconColor={Colors.brandAccentWarm} label="IMC" value={String(imc)} />
          <View style={{ width: 10 }} />
          <StatCard icon="flame" iconColor={Colors.streakFire} label="Streak" value={`${streak}d`} />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saudacao: { ...Typography.h2, color: Colors.textPrimary },
  subtitulo: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  badgeStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.streakFire + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.streakFire + '40',
  },
  textoStreak: { ...Typography.captionBold, color: Colors.streakFire },
  cartaoPerfil: {
    backgroundColor: Colors.surfaceCards,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  linhaPerfil: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  infoPerfil: { flex: 1, marginLeft: 14 },
  nomePerfil: { ...Typography.h3, color: Colors.textPrimary },
  objetivoPerfil: { ...Typography.caption, color: Colors.brandAccent, marginTop: 2 },
  painelMensagem: {
    backgroundColor: Colors.brandAccent + '15',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brandAccent,
  },
  textoMensagem: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  tituloSecao: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 14 },
  grade: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  cartaoResumo: {
    flex: 1,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  iconeResumo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valorResumo: { ...Typography.metricSmall, color: Colors.textPrimary, fontSize: 18 },
  rotuloResumo: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  barraMini: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceCardsLight,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  barraPreenchida: { height: '100%', borderRadius: 2 },
  linhaStats: { flexDirection: 'row', marginBottom: 24 },
});
