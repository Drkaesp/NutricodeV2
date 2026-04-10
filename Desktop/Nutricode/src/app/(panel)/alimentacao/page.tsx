import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, UIManager, Platform, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { DAYS_OF_WEEK, MEAL_SLOTS } from '@/constants/GameData';
import { getMealPlan, WeeklyMealPlan, MealFood } from '@/src/utils/storage';

// Habilitar a engine unificada nativa de Animação de Layout para componentes expansíveis no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Interface Estruturada de Ingestão Alimentar
 * Objetivo: Geometria e Navegação Vetorial Temporal fixa para a semana, listando refeições
 * e permitindo a adição (Mock API/DB) e a conclusão visual das mesmas através de expansão elástica.
 */
export default function TelaAlimentacao() {
  const roteadorNativo = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState(obterChaveDiaAtual());
  const [planoAlimentacao, setPlanoAlimentacao] = useState<WeeklyMealPlan | null>(null);
  
  // Controle Rítmico do Estado de Expansão dos blocos isolados (id: bool)
  const [blocosExpandidos, setBlocosExpandidos] = useState<Record<string, boolean>>({});

  function obterChaveDiaAtual() {
    const marcadoresSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return marcadoresSemana[new Date().getDay()];
  }

  useFocusEffect(
    useCallback(() => {
      carregarBancoDadosAlimentar();
    }, [])
  );

  /**
   * Integradror Mock - Banco de Dados Local
   * Alimenta a matriz plana de objetos alimentícios.
   */
  async function carregarBancoDadosAlimentar() {
    // TODO: INTEGRAÇÃO API/DB AQUI - [Insira a lógica assíncrona com os Models estipulados]
    // Esta camada deve mapear DTOs do servidor para a matriz estrita isolada 'WeeklyMealPlan'.
    const planoIsolado = await getMealPlan();
    setPlanoAlimentacao(planoIsolado);
  }

  const refeicoesDoDia = planoAlimentacao?.[diaSelecionado];

  function extratorDeAlimentos(chaveRefeicao: string): MealFood[] {
    if (!refeicoesDoDia) return [];
    return (refeicoesDoDia as any)[chaveRefeicao]?.foods || [];
  }

  function calcularMatrizTotal(alimentos: MealFood[]) {
    return alimentos.reduce(
      (acumulador, alimento) => ({
        calorias: acumulador.calorias + alimento.kcal,
        proteina: acumulador.proteina + alimento.protein,
        carboidratos: acumulador.carboidratos + alimento.carbs,
        gordura: acumulador.gordura + alimento.fat,
      }),
      { calorias: 0, proteina: 0, carboidratos: 0, gordura: 0 }
    );
  }

  const matrizAgregada = ['cafe', 'almoco', 'lanche', 'janta'].flatMap((chave) => extratorDeAlimentos(chave));
  const totaisDiarios = calcularMatrizTotal(matrizAgregada);

  const rotuloDiaCompleto = DAYS_OF_WEEK.find((d) => d.key === diaSelecionado)?.full || '';

  /**
   * Gatilho Elástico para Injeção Visual
   * Expande a geometria interna do contêiner empurrando a grade física.
   */
  const alternarExpansaoBloco = (chaveRefeicao: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBlocosExpandidos(prev => ({ ...prev, [chaveRefeicao]: !prev[chaveRefeicao] }));
  };

  /**
   * Condicional Finalizador Biológico
   * Registo visual de âncoramento definitivo para confirmar a digestão no relógio.
   */
  const confirmarDigestaoCompleta = async (chaveRefeicao: string) => {
    if (!planoAlimentacao || !diaSelecionado) return;
    
    // Create copy for immutability
    const planoAtualizado = { ...planoAlimentacao };
    const diaAtual = planoAtualizado[diaSelecionado] as any;
    
    // Ensure day object exists
    if (!diaAtual) return;
    if (!diaAtual[chaveRefeicao]) return;

    // Set meal as completed
    diaAtual[chaveRefeicao] = { ...diaAtual[chaveRefeicao], completed: true };
    
    // Save to local storage mock DB
    await import('@/src/utils/storage').then(module => module.saveMealPlan(planoAtualizado));
    
    // Update local state
    setPlanoAlimentacao(planoAtualizado);
    console.log(`Digestão do bloco ${chaveRefeicao} computada e persistida.`);
  };

  return (
    <SafeAreaView style={estilos.areaSeguraFisica}>
      
      {/* Geometria e Navegação Vetorial Temporal - Calendário Perfeitamente Centralizado */}
      <View style={estilos.cabecalhoEstrutural}>
        <Ionicons name="restaurant" size={22} color={Colors.brandAccent} />
        <Text style={estilos.tituloEstrutural}>Plano Nutricional</Text>
      </View>

      <View style={estilos.containerTemporalVetorial}>
        {DAYS_OF_WEEK.map((dia) => {
          const ativo = diaSelecionado === dia.key;
          return (
            <TouchableOpacity 
              key={dia.key} 
              style={[estilos.caixaPilulaDia, ativo && estilos.caixaPilulaDiaAtiva]}
              onPress={() => setDiaSelecionado(dia.key)}
            >
              <Text style={[estilos.textoPilulaDia, ativo && estilos.textoPilulaDiaAtivo]}>
                {dia.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <Text style={estilos.rotuloDiaCentrico}>{rotuloDiaCompleto}</Text>

      <ScrollView contentContainerStyle={estilos.ancoragemDeRolagem} showsVerticalScrollIndicator={false}>
        {/* Física de Transição Expansível (Cards Lineares) */}
        {MEAL_SLOTS.map((slot) => {
          const listaAlimentos = extratorDeAlimentos(slot.key);
          const valoresSubtotais = calcularMatrizTotal(listaAlimentos);
          const estaExpandido = blocosExpandidos[slot.key];

          return (
            <TouchableOpacity 
              key={slot.key} 
              style={estilos.blocoRefeicao} 
              activeOpacity={0.9} 
              onPress={() => alternarExpansaoBloco(slot.key)}
            >
              <View style={estilos.cabecalhoBlocoRefeicao}>
                <View style={estilos.invólucroIcone}>
                  <Ionicons name={slot.icon as any} size={20} color={Colors.brandAccent} />
                </View>
                <View style={estilos.informacoesBlocoRefeicao}>
                  <Text style={estilos.tituloRefeicao}>{slot.label}</Text>
                  <Text style={estilos.tempoRefeicao}>{slot.time}</Text>
                </View>
                
                {listaAlimentos.length > 0 && (
                  <View style={estilos.distintivoCalorico}>
                    <Text style={estilos.textoCalorico}>{Math.round(valoresSubtotais.calorias)} kcal</Text>
                  </View>
                )}
                
                <Ionicons 
                  name={estaExpandido ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={Colors.textSecondary} 
                  style={{ marginLeft: 8 }} 
                />
              </View>

              {/* Renderização Condicional Expansiva Nativa */}
              {estaExpandido && (
                <View style={estilos.containerConteudoExpandido}>
                  {listaAlimentos.length > 0 ? (
                    <View style={estilos.listaAlimentosAcoplada}>
                      {listaAlimentos.map((comida, indice) => (
                        <View key={indice} style={estilos.itemAlimentoIndividual}>
                          <Text style={estilos.nomeAlimento}>{comida.name}</Text>
                          <Text style={estilos.gramasAlimento}>{comida.grams}g</Text>
                          <Text style={estilos.caloriasAlimento}>{Math.round(comida.kcal)} kcal</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={estilos.textoEspacoVazio}>Nenhuma carga biológica acoplada.</Text>
                  )}

                  {/* Abstração de Puxadas Externas */}
                  <View style={estilos.botoesDeAcaoInferior}>
                    <TouchableOpacity
                      style={estilos.botaoAdicaoBiologica}
                      onPress={(e) => {
                        e.stopPropagation(); // Previne fechar o card principal
                        roteadorNativo.push({ pathname: '/(panel)/alimentacao/edit' as any, params: { day: diaSelecionado, slot: slot.key } });
                      }}
                    >
                      <Ionicons name="add-circle" size={18} color={Colors.brandAccent} />
                      <Text style={estilos.textoBotaoAdicao}>Adicionar Alimento</Text>
                    </TouchableOpacity>

                    {/* Botão de Finalização Expresso */}
                    <TouchableOpacity
                      style={estilos.botaoConclusaoExpressa}
                      onPress={(e) => {
                        e.stopPropagation();
                        confirmarDigestaoCompleta(slot.key);
                      }}
                    >
                      <Ionicons name="checkmark-done" size={18} color={Colors.brandGreen} />
                      <Text style={estilos.textoBotaoConclusao}>Completar Digestão</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Componente Finalizador Diário */}
        <TouchableOpacity
            style={[estilos.botaoAdicaoBiologica, { backgroundColor: Colors.brandGreen, marginVertical: 20, paddingVertical: 14 }]}
            onPress={async () => {
              // Concede XP e simboliza fechamento do dia!
              const userXP = await import('@/src/utils/storage').then(module => module.getUserProfile());
              if(userXP){
                 const novaExp = (userXP.totalXP || 0) + 150; // XP_REWARDS equivalente
                 await import('@/src/utils/storage').then(module => module.saveUserProfile({ ...userXP, totalXP: novaExp }));
                 import('react-native').then(rn => rn.Alert.alert("🎉 Parabéns!", "Dia de alimentação finalizado com sucesso! +150 XP absorvido."));
              }
            }}
            activeOpacity={0.8}
        >
          <Ionicons name="trophy" size={20} color={Colors.textPrimary} />
          <Text style={[estilos.textoBotaoAdicao, { color: Colors.textPrimary, fontSize: 16 }]}>Completar Dia de Alimentação</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Geometria de Rodapé Vetorial Fixo */}
      <View style={estilos.rodapeAbsoluto}>
        <View style={estilos.celulaRodape}>
          <Text style={[estilos.valorCelulaRodape, { color: Colors.macroCalories }]}>{Math.round(totaisDiarios.calorias)}</Text>
          <Text style={estilos.rotuloCelulaRodape}>kcal</Text>
        </View>
        <View style={estilos.divisorVerticalRodape} />
        <View style={estilos.celulaRodape}>
          <Text style={[estilos.valorCelulaRodape, { color: Colors.macroProtein }]}>{totaisDiarios.proteina.toFixed(0)}g</Text>
          <Text style={estilos.rotuloCelulaRodape}>Proteína</Text>
        </View>
        <View style={estilos.divisorVerticalRodape} />
        <View style={estilos.celulaRodape}>
          <Text style={[estilos.valorCelulaRodape, { color: Colors.macroCarbs }]}>{totaisDiarios.carboidratos.toFixed(0)}g</Text>
          <Text style={estilos.rotuloCelulaRodape}>Carbos</Text>
        </View>
        <View style={estilos.divisorVerticalRodape} />
        <View style={estilos.celulaRodape}>
          <Text style={[estilos.valorCelulaRodape, { color: Colors.macroFat }]}>{totaisDiarios.gordura.toFixed(0)}g</Text>
          <Text style={estilos.rotuloCelulaRodape}>Gordura</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSeguraFisica: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  cabecalhoEstrutural: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
  },
  tituloEstrutural: { ...Typography.h2, color: Colors.textPrimary },
  
  // Reposicionamento do Calendário Central Vetorial (Flexível Absoluto)
  containerTemporalVetorial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 14,
  },
  caixaPilulaDia: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.surfaceCards,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  caixaPilulaDiaAtiva: {
    backgroundColor: Colors.brandAccent,
    borderColor: Colors.brandAccent,
  },
  textoPilulaDia: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    fontSize: 12, // Tamanho milimetricamente estrito para não quebrar a UI
  },
  textoPilulaDiaAtivo: {
    color: Colors.backgroundPrimary,
  },

  rotuloDiaCentrico: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  ancoragemDeRolagem: { paddingHorizontal: 16, paddingBottom: 40 },
  
  // Manipulação Geométrica Mutante
  blocoRefeicao: {
    backgroundColor: Colors.surfaceCards,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    overflow: 'hidden', // Segura a expansão contínua
  },
  cabecalhoBlocoRefeicao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invólucroIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.brandAccent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  informacoesBlocoRefeicao: { flex: 1 },
  tituloRefeicao: { ...Typography.bodyBold, color: Colors.textPrimary },
  tempoRefeicao: { ...Typography.caption, color: Colors.textSecondary },
  distintivoCalorico: {
    backgroundColor: Colors.macroCalories + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  textoCalorico: { ...Typography.captionBold, color: Colors.macroCalories },
  
  containerConteudoExpandido: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceCardsLight,
  },
  listaAlimentosAcoplada: { marginBottom: 12 },
  itemAlimentoIndividual: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nomeAlimento: { ...Typography.body, color: Colors.textPrimary, flex: 1 },
  gramasAlimento: { ...Typography.caption, color: Colors.textSecondary, marginRight: 12 },
  caloriasAlimento: { ...Typography.captionBold, color: Colors.brandAccent },
  textoEspacoVazio: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  
  // Ações Paralelas no Card Expandido
  botoesDeAcaoInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  botaoAdicaoBiologica: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.brandAccent + '15',
  },
  textoBotaoAdicao: { ...Typography.captionBold, color: Colors.brandAccent },
  
  botaoConclusaoExpressa: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.brandGreen + '15',
  },
  textoBotaoConclusao: { ...Typography.captionBold, color: Colors.brandGreen },

  rodapeAbsoluto: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceCardsDark,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceCardsLight,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  celulaRodape: { alignItems: 'center', flex: 1 },
  valorCelulaRodape: { ...Typography.bodyBold, fontSize: 16 },
  rotuloCelulaRodape: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  divisorVerticalRodape: { width: 1, backgroundColor: Colors.surfaceCardsLight },
});
