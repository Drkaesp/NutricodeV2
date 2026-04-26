import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, UIManager, Platform, LayoutAnimation, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import NutriMascot from '@/src/components/NutriMascot';
import { DAYS_OF_WEEK, MUSCLE_GROUP_LABELS, XP_REWARDS } from '@/constants/GameData';
import { getWorkoutPlan, saveWorkoutPlan, WorkoutExercise, WeeklyWorkoutPlan } from '@/src/utils/storage';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/services/api';

// Habilitar a engine unificada nativa de Animação de Layout para componentes expansíveis no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Painel Sistêmico Físico (Interface de Treinamento)
 * Refatoração de Escopo Transversal: Destruído lógicas legadas, recodificado o seletor 
 * semanal de dados usando abstrações de layouts flexíveis puros evitando desalinhamentos.
 * Adicionada Cascata Modular Reativa da API para exercícios.
 */
export default function TelaTreinoFisico() {
  const roteadorSistema = useRouter();
  const { user, updateUser, refreshUserData } = useAuth();
  
  const [diaMecanicoSelecionado, setDiaMecanicoSelecionado] = useState(obterChaveTemporalAtual());
  const [planoBiomecanico, setPlanoBiomecanico] = useState<WeeklyWorkoutPlan | null>(null);

  // Controle Estático de Memória Visual: Rastreador de expansão ativa para Renderização de Mídia
  const [rastreadorExpansaoAnimada, setRastreadorExpansaoAnimada] = useState<Record<string, boolean>>({});

  const ExerciseAnimation = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);
    React.useEffect(() => {
      if (!images || images.length <= 1) return;
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 1000);
      return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
      <Image 
        source={{ uri: images[index] }} 
        style={{ width: '100%', height: 200, borderRadius: 10, backgroundColor: Colors.surfaceCardsDark }}
        resizeMode="contain"
      />
    );
  };

  function obterChaveTemporalAtual() {
    const chavesSemanas = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return chavesSemanas[new Date().getDay()];
  }

  useFocusEffect(
    useCallback(() => {
      carregarEsquemasDeTreinamento();
    }, [])
  );

  /**
   * Cascata Modular Reativa da API
   * Invocação de simulação assíncrona local preenchendo as variáveis de espera nativas.
   */
  async function carregarEsquemasDeTreinamento() {
    // TODO: INTEGRAÇÃO API/DB AQUI - Carga Externa de Exercícios
    // Onde houver a espera crie a camada abstrata de mockamento.
    // Conexão remota não bloqueará interações da interface enquanto popula os planos.
    const arvorePlanos = await getWorkoutPlan();
    setPlanoBiomecanico(arvorePlanos);
  }

  const volumeDiarioTrabalho = planoBiomecanico?.[diaMecanicoSelecionado];
  const exerciciosAtivos = volumeDiarioTrabalho?.exercises || [];
  const rotinaJaConcluida = volumeDiarioTrabalho?.completed || false;
  const rotuloCompletoDia = DAYS_OF_WEEK.find((d) => d.key === diaMecanicoSelecionado)?.full || '';

  /**
   * Operação Terminal de Computação Fisica (Ganho e Status)
   */
  async function despacharConclusaoDoTreino() {
    if (!planoBiomecanico || exerciciosAtivos.length === 0) return;

    const copiaPlano = { ...planoBiomecanico };
    copiaPlano[diaMecanicoSelecionado] = { ...copiaPlano[diaMecanicoSelecionado], completed: true };
    await saveWorkoutPlan(copiaPlano);
    setPlanoBiomecanico(copiaPlano);

    const hojeData = new Date().toISOString().split('T')[0];
    const estimatedDuration = exerciciosAtivos.length * 10; // 10 mins per exercise estimate

    if (user?.id) {
      try {
        const res = await api.logWorkout(user.id, estimatedDuration > 0 ? estimatedDuration : 45, hojeData, true);
        if (res.xpEarned > 0) {
          Alert.alert(
            '🎉 Adaptação Metabólica Concluída!',
            `Estimulação Sistêmica Computada! +${res.xpEarned} XP\nStreak Atual: ${res.streak}`,
            [{ text: 'Absorver' }]
          );
        }
        await refreshUserData();
      } catch (e) {
        console.error('Erro na API treino', e);
      }
    } else {
      // Recompensa Biológica Computacional (Fallback)
      const ganhoExperiencia = (user?.totalXP || 0) + XP_REWARDS.COMPLETE_WORKOUT;
      const sequenciaDiasForca = (user?.streak || 0) + 1;
      await updateUser({ totalXP: ganhoExperiencia, streak: sequenciaDiasForca });

      Alert.alert(
        '🎉 Adaptação Metabólica Concluída!',
        `Estimulação Sistêmica Computada! +${XP_REWARDS.COMPLETE_WORKOUT} XP\nDias de Continuidade: ${sequenciaDiasForca}`,
        [{ text: 'Absorver' }]
      );
    }
  }

  // Desalocar estrutura da memória persistente associada
  async function aniquilarVetorDeExercicio(indiceRaiz: number) {
    if (!planoBiomecanico) return;
    const agrupamentoMutado = exerciciosAtivos.filter((_, idx) => idx !== indiceRaiz);
    const abstratoAtual = { ...planoBiomecanico };
    abstratoAtual[diaMecanicoSelecionado] = { ...abstratoAtual[diaMecanicoSelecionado], exercises: agrupamentoMutado };
    await saveWorkoutPlan(abstratoAtual);
    setPlanoBiomecanico(abstratoAtual);
  }

  // Agrupador Morfológico Transversal
  const matrizMuscularAgrupada: Record<string, WorkoutExercise[]> = {};
  exerciciosAtivos.forEach((exe) => {
    const chaveGrupo = exe.muscleGroup;
    if (!matrizMuscularAgrupada[chaveGrupo]) matrizMuscularAgrupada[chaveGrupo] = [];
    matrizMuscularAgrupada[chaveGrupo].push(exe);
  });

  /**
   * Controle Trigonométrico Espacial Instantâneo
   * Altera a restrição Y vertical para expor simuladores biomecânicos.
   */
  const dispararEvolucaoAnimacao = (idUnicoEixo: string) => {
    // A técnica base empurra todas as caixas inferiores para baixo
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRastreadorExpansaoAnimada(prev => ({ ...prev, [idUnicoEixo]: !prev[idUnicoEixo] }));
  };

  return (
    <SafeAreaView style={estilos.matrizHospedeiraPrincipal}>
      {/* Abstração Superior do Invólucro */}
      <View style={estilos.cabecalhoAtivo}>
        <Ionicons name="barbell" size={22} color={Colors.brandGreen} />
        <Text style={estilos.tituloOperacional}>Treino</Text>
        {rotinaJaConcluida && (
          <View style={estilos.distintivoOperacaoConcluida}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.brandGreen} />
            <Text style={estilos.textoDistintivoConcluido}>Fadiga Computada</Text>
          </View>
        )}
      </View>

      {/* Grade de Organização Lógica Temporal Semanal Totalmente Centralizada */}
      <View style={estilos.agrupadorSeletorDias}>
        {DAYS_OF_WEEK.map((diaSist) => {
          const pulsando = diaMecanicoSelecionado === diaSist.key;
          return (
            <TouchableOpacity 
              key={diaSist.key} 
              style={[estilos.capsulaDia, pulsando && estilos.capsulaDiaAtivo]}
              onPress={() => setDiaMecanicoSelecionado(diaSist.key)}
            >
              <Text style={[estilos.textoCapsula, pulsando && estilos.textoCapsulaAtivo]}>
                {diaSist.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={estilos.identificadorLongoPeriodo}>{rotuloCompletoDia}</Text>

      <ScrollView contentContainerStyle={estilos.pistaDeRolagemAcelerada} showsVerticalScrollIndicator={false}>
        {exerciciosAtivos.length === 0 ? (
          <View style={estilos.estadoVazioAusenciaDeFarga}>
            <NutriMascot state="confuso" size={140} />
            <Text style={estilos.tituloEstadoVazio}>Nenhum impulso físico instanciado!</Text>
            <Text style={estilos.subtituloEstadoVazio}>
              Puxe ramificações de exercícios e alimente a sessão de {rotuloCompletoDia.toLowerCase()}.
            </Text>
            <TouchableOpacity
              style={estilos.botaoAcaoInjecaoMassa}
              onPress={() => roteadorSistema.push({ pathname: '/(panel)/treino/edit' as any, params: { day: diaMecanicoSelecionado } })}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color={Colors.textOnAccent} />
              <Text style={estilos.textoBotaoAcaoInjecao}>Adicionar Exercício</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {Object.entries(matrizMuscularAgrupada).map(([chaveMusculo, vetorExercicios], indiceGrupo) => (
              <View key={`grupo-${indiceGrupo}`} style={estilos.secaoAgrupamentoMorfologico}>
                <View style={estilos.cabecalhoAgrupamento}>
                  <View style={estilos.pontoSinalizacaoGrupo} />
                  <Text style={estilos.tituloAgrupamentoFisico}>{(MUSCLE_GROUP_LABELS as any)[chaveMusculo] || chaveMusculo}</Text>
                  <Text style={estilos.contagemAgrupamentoSistematica}>{vetorExercicios.length} blocos</Text>
                </View>

                {vetorExercicios.map((exeAtual, indiceLocal) => {
                  const idUnicoVetorial = `${chaveMusculo}-${indiceLocal}`;
                  const recipienteAtivo = rastreadorExpansaoAnimada[idUnicoVetorial];

                  return (
                    <TouchableOpacity 
                      key={idUnicoVetorial} 
                      style={estilos.blocoRenderizacaoFisica} 
                      activeOpacity={0.9} 
                      onPress={() => dispararEvolucaoAnimacao(idUnicoVetorial)}
                    >
                      <View style={estilos.invólucroSuperiorBloco}>
                        <View style={estilos.dadosTextuaisExercicios}>
                          <Text style={estilos.nomeDinamicoDoBloco}>{exeAtual.name}</Text>
                          <View style={estilos.metadadosDeRepeticaoTempo}>
                            <View style={estilos.pilulaInformativa}>
                              <Text style={estilos.textoPilulaMetadado}>{exeAtual.sets}x{exeAtual.reps}</Text>
                            </View>
                            <Ionicons 
                                name={recipienteAtivo ? "chevron-up" : "chevron-down"} 
                                size={18} 
                                color={Colors.textSecondary} 
                                style={{ marginLeft: 8 }} 
                            />
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => aniquilarVetorDeExercicio(exerciciosAtivos.indexOf(exeAtual))} style={estilos.disparadorPurga}>
                          <Ionicons name="trash" size={20} color={Colors.statusError + '80'} />
                        </TouchableOpacity>
                      </View>

                      {/* Renderização de Mídia (GIF) Subjacente Controlada em Memória */}
                      {recipienteAtivo && (
                        <View style={estilos.camadaAbstrataVideoMimica}>
                          {exeAtual.images && exeAtual.images.length > 0 ? (
                            <ExerciseAnimation images={exeAtual.images} />
                          ) : (
                          <View style={estilos.substitutoGeometricoGif}>
                            <Ionicons name="play-circle-outline" size={36} color={Colors.brandGreen} />
                            <Text style={estilos.legendaMockadaProcedimental}>
                              Simulação Trigonométrica do Ciclo do Movimento: {exeAtual.name}
                            </Text>
                            <Text style={estilos.legendaMicroTech}>
                              [A Mídia Animada será baixada via API sem sobrecarga heap de pre-alocação estática]
                            </Text>
                          </View>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Injeções Posteriores */}
            <TouchableOpacity
              style={estilos.botaoAdicaoCargaParalela}
              onPress={() => roteadorSistema.push({ pathname: '/(panel)/treino/edit' as any, params: { day: diaMecanicoSelecionado } })}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={Colors.brandGreen} />
              <Text style={estilos.textoAdicaoCargaParalela}>Adicionar Exercício</Text>
            </TouchableOpacity>

            {!rotinaJaConcluida && (
              <TouchableOpacity style={estilos.disparadorCompletudeTotal} onPress={despacharConclusaoDoTreino} activeOpacity={0.8}>
                <Ionicons name="checkmark-done" size={22} color={Colors.textOnAccent} />
                <Text style={estilos.textoCompletudeTotal}>Consolidar Fadiga Diária (+{XP_REWARDS.COMPLETE_WORKOUT} XP)</Text>
              </TouchableOpacity>
            )}

            {rotinaJaConcluida && (
              <View style={estilos.cartaoSinteseAtivacao}>
                <NutriMascot state="alegre" size={60} />
                <View style={estilos.informacaoCartaoSintese}>
                  <Text style={estilos.tituloCartaoSintese}>Carga Total Finalizada! 🎉</Text>
                  <Text style={estilos.subtituloCartaoSintese}>O ecossistema recompensou o usuário com {XP_REWARDS.COMPLETE_WORKOUT} pontos de processamento metabólico puro.</Text>
                </View>
              </View>
            )}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  matrizHospedeiraPrincipal: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  cabecalhoAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
  },
  tituloOperacional: { ...Typography.h2, color: Colors.textPrimary, flex: 1 },
  distintivoOperacaoConcluida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  textoDistintivoConcluido: { ...Typography.captionBold, color: Colors.brandGreen },
  
  // Grade Vetorial do Seletor Perfeitamente Alocada (Desalinhamentos Sanados)
  agrupadorSeletorDias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 14,
  },
  capsulaDia: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.surfaceCards,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  capsulaDiaAtivo: {
    backgroundColor: Colors.brandGreen,
    borderColor: Colors.brandGreen,
  },
  textoCapsula: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    fontSize: 12, // Tolerância absoluta aos espelhamentos textuais para o Grid de 7 colunas
  },
  textoCapsulaAtivo: { color: Colors.backgroundPrimary },

  identificadorLongoPeriodo: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  
  pistaDeRolagemAcelerada: { paddingHorizontal: 16, paddingBottom: 40 },
  
  // Espaço de Alocação Vazia
  estadoVazioAusenciaDeFarga: { alignItems: 'center', paddingTop: 30 },
  tituloEstadoVazio: { ...Typography.h3, color: Colors.brandGreen, marginTop: 16 },
  subtituloEstadoVazio: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 30 },
  botaoAcaoInjecaoMassa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.brandGreen,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 24,
    elevation: 4,
  },
  textoBotaoAcaoInjecao: { ...Typography.button, color: Colors.textOnAccent },
  
  // Grade Sistêmica Biomecânica
  secaoAgrupamentoMorfologico: { marginBottom: 16 },
  cabecalhoAgrupamento: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  pontoSinalizacaoGrupo: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brandGreen },
  tituloAgrupamentoFisico: { ...Typography.bodyBold, color: Colors.textPrimary, flex: 1 },
  contagemAgrupamentoSistematica: { ...Typography.caption, color: Colors.textSecondary },
  
  blocoRenderizacaoFisica: {
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    overflow: 'hidden', // Necessário para animação estrita vertical
  },
  invólucroSuperiorBloco: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dadosTextuaisExercicios: { flex: 1 },
  nomeDinamicoDoBloco: { ...Typography.bodyBold, color: Colors.textPrimary },
  metadadosDeRepeticaoTempo: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  pilulaInformativa: {
    backgroundColor: Colors.brandGreen + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoPilulaMetadado: { ...Typography.captionBold, color: Colors.brandGreen },
  disparadorPurga: { padding: 6, backgroundColor: Colors.statusError + '10', borderRadius: 8 },
  
  // Anexos da Geometria Mídia Externa API Animada
  camadaAbstrataVideoMimica: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceCardsLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  substitutoGeometricoGif: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.surfaceCardsDark,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.brandGreen + '50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  legendaMockadaProcedimental: {
    ...Typography.captionBold,
    color: Colors.brandGreen,
    textAlign: 'center',
    marginTop: 8,
  },
  legendaMicroTech: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // Condicionais Secundários e Extensão
  botaoAdicaoCargaParalela: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.brandGreen + '10',
    borderWidth: 1,
    borderColor: Colors.brandGreen + '30',
    marginBottom: 16,
  },
  textoAdicaoCargaParalela: { ...Typography.bodyBold, color: Colors.brandGreen },
  disparadorCompletudeTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.brandGreen,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
  },
  textoCompletudeTotal: { ...Typography.button, color: Colors.textPrimary },
  cartaoSinteseAtivacao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandGreen + '15',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.brandGreen + '30',
  },
  informacaoCartaoSintese: { flex: 1, marginLeft: 12 },
  tituloCartaoSintese: { ...Typography.bodyBold, color: Colors.brandGreen },
  subtituloCartaoSintese: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
});
