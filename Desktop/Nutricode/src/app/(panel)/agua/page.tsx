import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import GarrafaAguaProcedimental from '@/src/components/WaterBottle';
import { useAuth } from '@/src/context/AuthContext';
import { calculateDailyWaterGoal, XP_REWARDS, getLevelFromXP } from '@/constants/GameData';
import { addWater, getTodayWater, getWaterLog, WaterLog } from '@/src/utils/storage';
import { api } from '@/src/services/api';

/**
 * Matriz Lógica Hidrológica - Painel Principal
 * Interrompe o colapso nativo das bordas desenhando vetores orientados à grade base transversal.
 */
const OPCOES_VOLUME_HIDRICO = [
  { ml: 300, rotulo: '300ml', icone: 'water-outline' },
  { ml: 900, rotulo: '900ml', icone: 'water' },
  { ml: 1000, rotulo: '1L', icone: 'beaker' },
];

export default function TelaHidrologicaMestra() {
  const { user, updateUser, refreshUserData } = useAuth();
  const [ingestaoAtual, setIngestaoAtual] = useState(0);
  const [historicoCicloSemanal, setHistoricoCicloSemanal] = useState<WaterLog[]>([]);
  const [patamarAtingido, setPatamarAtingido] = useState(false);
  
  // Customização paramétrica destravável via gamificação
  const niveisLivre = getLevelFromXP(user?.totalXP || 0);
  const nivelEngajamento = niveisLivre.level || 1;
  const estiloTampaProgresso = nivelEngajamento > 5 ? 'premium' : nivelEngajamento > 2 ? 'esportiva' : 'padrao';

  const metaCilindricaVolume = calculateDailyWaterGoal(user?.peso || 70);

  useFocusEffect(
    useCallback(() => {
      inicializarRastreioOrganico();
    }, [])
  );

  async function inicializarRastreioOrganico() {
    const hojeColetado = await getTodayWater();
    setIngestaoAtual(hojeColetado);
    setPatamarAtingido(hojeColetado >= metaCilindricaVolume);

    const logsRelacionais = await getWaterLog();
    // Reconstrução retroativa matricial (7 dias lógicos)
    const ultimosSeteEspacos = [];
    for (let i = 6; i >= 0; i--) {
      const ponteiroData = new Date();
      ponteiroData.setDate(ponteiroData.getDate() - i);
      const chaveDataISO = ponteiroData.toISOString().split('T')[0];
      const blocoLocal = logsRelacionais.find((l) => l.date === chaveDataISO);
      ultimosSeteEspacos.push({ date: chaveDataISO, intakeMl: blocoLocal?.intakeMl || 0 });
    }
    setHistoricoCicloSemanal(ultimosSeteEspacos);
  }

  async function invocarInjecaoVolume(mlTransicionado: number) {
    const topoAgregado = await addWater(mlTransicionado);
    setIngestaoAtual(topoAgregado);

    const completouAgora = topoAgregado >= metaCilindricaVolume && !patamarAtingido;
    const hojeData = new Date().toISOString().split('T')[0];

    if (user?.id) {
      try {
        const res = await api.logWater(user.id, mlTransicionado, hojeData, completouAgora);
        if (completouAgora && res.xpEarned > 0) {
          setPatamarAtingido(true);
          Alert.alert(
            '💧 Saciedade Hídrica Biológica!',
            `Estrutura purgada e otimizada!\n+${res.xpEarned} XP`,
            [{ text: 'Estabilizar' }]
          );
        }
        await refreshUserData();
      } catch (e) {
        console.error('Erro ao logar água na API', e);
      }
    } else {
      // Fallback
      if (completouAgora) {
        setPatamarAtingido(true);
        const acumuloExp = (user?.totalXP || 0) + XP_REWARDS.COMPLETE_WATER_GOAL;
        await updateUser({ totalXP: acumuloExp });
        Alert.alert(
          '💧 Saciedade Hídrica Biológica!',
          `Estrutura purgada e otimizada!\n+${XP_REWARDS.COMPLETE_WATER_GOAL} Pts de Processamento`,
          [{ text: 'Estabilizar' }]
        );
      }
    }
  }

  const terminologiaDiasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <SafeAreaView style={estilos.malhaProtetoraAbsoluta}>
      <ScrollView contentContainerStyle={estilos.matrizDeRolagemFluidica} showsVerticalScrollIndicator={false}>
        
        {/* Cabine de Identificação Direcional */}
        <View style={estilos.cabineSuperior}>
          <Ionicons name="water" size={24} color={Colors.waterMedium} />
          <Text style={estilos.tituloCabine}>Fluxo Orgânico</Text>
          {patamarAtingido && (
            <View style={estilos.seloComprovacaoEstavel}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.brandGreen} />
              <Text style={estilos.textoComprovacao}>Estável</Text>
            </View>
          )}
        </View>

        {/* Quadro Analítico Limitante */}
        <View style={estilos.quadroDadosBiologicos}>
          <Text style={estilos.legendaAnalitica}>Taxa Metabólica Base ({user?.peso || 70}kg)</Text>
          <Text style={estilos.medidorAbsoluto}>{metaCilindricaVolume}ml</Text>
        </View>

        {/* Componente Core Procedimental Trigonométrico */}
        <View style={estilos.epicentroGeometricoDaGarrafa}>
          {/* Customização: Adesivos Superficiais Baseados Em Engajamento */}
          {nivelEngajamento > 3 && (
              <View style={estilos.adesivoFlutuante}>
                  <Text>🛡️</Text>
              </View>
          )}
          
          <GarrafaAguaProcedimental 
            volumeAtualMl={ingestaoAtual} 
            volumeMetaMl={metaCilindricaVolume} 
            escalaGeometrica={280} 
            formatoTampa={estiloTampaProgresso}
          />
        </View>

        {/* Console de Injeção Direta Vetorial (Redesenhados para evitar sobreposição plana) */}
        <Text style={estilos.tituloSessaoOperacional}>Painel de Captação Físico</Text>
        <View style={estilos.trilhaBotoesDesacoplados}>
          {OPCOES_VOLUME_HIDRICO.map((recurso) => (
            <TouchableOpacity
              key={recurso.ml}
              style={estilos.injetorBotao}
              onPress={() => invocarInjecaoVolume(recurso.ml)}
              activeOpacity={0.8}>
              <View style={estilos.capsulaIconeInjetor}>
                <Ionicons name={recurso.icone as any} size={28} color={Colors.waterMedium} />
              </View>
              <Text style={estilos.textoRecursoRotulo}>{recurso.rotulo}</Text>
              <Text style={estilos.textoRecursoAporte}>+ {recurso.ml}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grade do Ciclo Histórico Temporal */}
        <Text style={estilos.tituloSessaoOperacional}>Retenção Semanal Computada</Text>
        <View style={estilos.bancoDeMemoriaSecundario}>
          <View style={estilos.trilhaMemoriaDistribuida}>
            {historicoCicloSemanal.map((registro, idx) => {
              const dataSincrona = new Date(registro.date + 'T12:00:00');
              const nomeDiaVetorial = terminologiaDiasSemana[dataSincrona.getDay()];
              const grauRendimento = Math.min((registro.intakeMl / metaCilindricaVolume) * 100, 100);
              const indicadorPresente = idx === historicoCicloSemanal.length - 1;

              return (
                <View key={registro.date} style={estilos.nichoMemoriaIndividual}>
                  <View style={estilos.hologramaMiniaturaFisica}>
                    <View style={estilos.hologramaContornoFixo}>
                      <View
                        style={[
                          estilos.hologramaPreenchimentoVariavel,
                          {
                            height: `${grauRendimento}%`,
                            backgroundColor: grauRendimento >= 100 ? Colors.brandGreen : Colors.waterMedium,
                          },
                        ]}
                      />
                    </View>
                    {grauRendimento >= 100 && (
                      <Ionicons name="shield-checkmark" size={12} color={Colors.brandGreen} style={estilos.travaEstabilidadeLateral} />
                    )}
                  </View>
                  <Text style={[estilos.rotuloDiaVetorial, indicadorPresente && estilos.rotuloDiaPulsoAcelerado]}>{nomeDiaVetorial}</Text>
                  <Text style={estilos.medidaFisicaMicro}>{registro.intakeMl > 0 ? `${(registro.intakeMl / 1000).toFixed(1)}L` : '—'}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {patamarAtingido && (
          <View style={estilos.interfaceMotoraExtrema}>
            <Ionicons name="planet" size={32} color={Colors.brandYellowBright} />
            <View style={estilos.interfaceBlocoTexto}>
              <Text style={estilos.tituloExtremo}>Ecossistema Interno Estabilizado!</Text>
              <Text style={estilos.textoOrientativoExtremo}>
                O corpo biológico anfitrião alcançou os limiares perfeitos de viscosidade. Não exceda desnecessariamente os macros limites hídricos estipulados.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  malhaProtetoraAbsoluta: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  matrizDeRolagemFluidica: { padding: 20, paddingBottom: 50 },
  cabineSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tituloCabine: { ...Typography.h2, color: Colors.textPrimary, flex: 1 },
  seloComprovacaoEstavel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.brandGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.brandGreen + '30'
  },
  textoComprovacao: { ...Typography.captionBold, color: Colors.brandGreen },
  quadroDadosBiologicos: {
    backgroundColor: Colors.waterBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 24,
  },
  legendaAnalitica: { ...Typography.caption, color: Colors.textSecondary },
  medidorAbsoluto: { ...Typography.h1, color: Colors.waterMedium, marginTop: 4 },
  
  epicentroGeometricoDaGarrafa: { alignItems: 'center', marginBottom: 30, position: 'relative' },
  adesivoFlutuante: { position: 'absolute', top: 90, left: 60, zIndex: 100, transform: [{ rotate: '-15deg' }] },

  tituloSessaoOperacional: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 16 },
  
  // Parametrização Vetorial (Flex = 1 para Redes transversais elásticas sem estouro)
  trilhaBotoesDesacoplados: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  injetorBotao: {
    flex: 1,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    elevation: 2,
  },
  capsulaIconeInjetor: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoRecursoRotulo: { ...Typography.bodyBold, color: Colors.textPrimary },
  textoRecursoAporte: { ...Typography.caption, color: Colors.waterMedium, marginTop: 2 },
  
  bancoDeMemoriaSecundario: {
    backgroundColor: Colors.surfaceCards,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    marginBottom: 24,
  },
  trilhaMemoriaDistribuida: { flexDirection: 'row', justifyContent: 'space-between' },
  nichoMemoriaIndividual: { alignItems: 'center', flex: 1 },
  hologramaMiniaturaFisica: { position: 'relative', marginBottom: 6 },
  hologramaContornoFixo: {
    width: 24,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.waterBackground,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  hologramaPreenchimentoVariavel: {
    width: '100%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  travaEstabilidadeLateral: { position: 'absolute', top: -6, right: -8 },
  rotuloDiaVetorial: { ...Typography.caption, color: Colors.textSecondary },
  rotuloDiaPulsoAcelerado: { color: Colors.waterMedium, fontWeight: '800' },
  medidaFisicaMicro: { ...Typography.caption, color: Colors.textMuted, marginTop: 2, fontSize: 10 },
  
  interfaceMotoraExtrema: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandYellowBright + '15',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.brandYellowBright + '30',
    gap: 16,
  },
  interfaceBlocoTexto: { flex: 1 },
  tituloExtremo: { ...Typography.bodyBold, color: Colors.brandYellowBright },
  textoOrientativoExtremo: { ...Typography.caption, color: Colors.textSecondary, marginTop: 6, lineHeight: 20 },
});
