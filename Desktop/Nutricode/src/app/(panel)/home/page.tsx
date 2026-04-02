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
import { getLevelFromXP, FITNESS_TIPS, calculateDailyWaterGoal } from '@/constants/GameData';
import { getTodayWater, getWorkoutPlan, getMealPlan } from '@/src/utils/storage';

/**
 * Interface Inicial (Painel Centralizado de Métricas)
 * Objetivo: O escopo superior exibirá graficamente dados consolidados complexos estatísticos
 * do progresso do usuário vinculando variações macro calóricas alimentares ingeridas
 * combinadas às eficiências mecânicas de levantamentos físicos escalonados através do
 * vetor logado anterior e os recálculos visuais.
 */
export default function TelaPrincipal() {
  const { user } = useAuth();
  
  // Matriz Lógica - Variáveis Nativas Translacionadas (PT-BR)
  const [aguaHoje, setAguaHoje] = useState(0);
  const [treinoHojeConcluido, setTreinoHojeConcluido] = useState(false);
  const [refeicoesHojeRegistradas, setRefeicoesHojeRegistradas] = useState(0);

  const experienciaTotal = user?.totalXP || 0;
  const { level: nivel, currentXP: experienciaAtual, nextLevelXP: experienciaProximoNivel } = getLevelFromXP(experienciaTotal);
  const sequenciaDias = user?.streak || 0;
  
  const metaAguaDiaria = calculateDailyWaterGoal(user?.peso || 70);
  const pesoCorporalFisico = user?.peso || 0;
  const alturaCorporalVertical = user?.altura || 0;
  
  // Cálculo Biométrico Matemático
  const indiceMassaCorporal = alturaCorporalVertical > 0 
    ? (pesoCorporalFisico / ((alturaCorporalVertical / 100) ** 2)).toFixed(1) 
    : '—';

  // Matriz Temporal de Acesso ao Repositório
  const chavesDosDias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const chaveDiaAtual = chavesDosDias[new Date().getDay()];

  // Pulso Lógico Reativo Inicial
  const isPrimeiroLogin = !user?.lastActiveDate || user?.totalXP === 0;

  useEffect(() => {
    carregarDadosDiariosSubjacentes();
  }, []);

  /**
   * Blocos Curtos Controlados
   * Invoca as persistências e carrega limites no tempo de execução.
   */
  async function carregarDadosDiariosSubjacentes() {
    // TODO: INTEGRAÇÃO API/DB AQUI - [Insira a lógica assíncrona com os Models estipulados]
    // A integração futura substituirá chamadas locais por repositórios RESTful
    
    const agua = await getTodayWater();
    setAguaHoje(agua);
    
    const treinos = await getWorkoutPlan();
    const treinoDeHoje = treinos[chaveDiaAtual];
    if (treinoDeHoje) {
      setTreinoHojeConcluido(treinoDeHoje.completed);
    }
    
    const refeicoes = await getMealPlan();
    const refeicaoDeHoje = refeicoes[chaveDiaAtual];
    if (refeicaoDeHoje) {
      let contagem = 0;
      if (refeicaoDeHoje.cafe?.foods?.length > 0) contagem++;
      if (refeicaoDeHoje.almoco?.foods?.length > 0) contagem++;
      if (refeicaoDeHoje.lanche?.foods?.length > 0) contagem++;
      if (refeicaoDeHoje.janta?.foods?.length > 0) contagem++;
      setRefeicoesHojeRegistradas(contagem);
    }
  }

  // Estatística Limítrofe Biológica
  const percentualAgua = Math.min(Math.round((aguaHoje / metaAguaDiaria) * 100), 100);
  const rotuloObjetivo = user?.objetivo === 'perder_peso' ? 'Perder Peso'
    : user?.objetivo === 'ganhar_massa' ? 'Ganhar Massa'
    : user?.objetivo === 'manter_forma' ? 'Manter Forma'
    : 'Não definido';

  const mensagensCiclicas = [
    `Até este limiar biológico você consumiu ${((aguaHoje) / 1000).toFixed(1)} Litros Essenciais de Água`,
    `A carga atual superada ingerida é de ${refeicoesHojeRegistradas * 150} gramas exatas de compostos de carboidrato em sua circulação diária`,
    `Energia metabólica alcançada no nível ${nivel}! Continue o fluxo!`,
  ];

  return (
    <SafeAreaView style={estilos.areaSeguraHospedeira}>
      <ScrollView contentContainerStyle={estilos.containerDeRolagem} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho Gráfico Superior */}
        <View style={estilos.cabecalhoEstrutural}>
          <View>
            <Text style={estilos.saudacaoPrincipal}>Saudações, {user?.nome?.split(' ')[0] || 'Atleta'}!</Text>
            <Text style={estilos.saudacaoSubjacente}>Vamos arquitetar seu metabolismo hoje.</Text>
          </View>
          <View style={estilos.distintivoSequencia}>
            <Ionicons name="flame" size={16} color={Colors.streakFire} />
            <Text style={estilos.textoSequencia}>{sequenciaDias}</Text>
          </View>
        </View>

        {/* Validador de Ação Vital Crucial (Primeiro Login) */}
        {isPrimeiroLogin && (
          <View style={estilos.containerPrimeiroLogin}>
            <Text style={estilos.tituloPrimeiroLogin}>Bem-vindo ao Ecossistema NutriCode!</Text>
            <Text style={estilos.textoPrimeiroLogin}>Inicie a arquitetura do seu balanço biológico:</Text>
            
            <TouchableOpacity style={estilos.botaoAcaoVital}>
              <Ionicons name="barbell-outline" size={24} color={Colors.backgroundPrimary} />
              <Text style={estilos.textoBotaoAcaoVital}>Criar Rotina Metabólica (Treinos)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[estilos.botaoAcaoVital, estilos.botaoAcaoVitalSecundario]}>
              <Ionicons name="restaurant-outline" size={24} color={Colors.brandGreen} />
              <Text style={[estilos.textoBotaoAcaoVital, estilos.textoBotaoAcaoSecundario]}>Estruturar Abordagem Nutricional Dietética</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cartão de Progresso Central */}
        <View style={estilos.cartaoPerfil}>
          <View style={estilos.linhaPerfil}>
            <NutriMascot state="alegre" size={60} />
            <View style={estilos.informacaoPerfil}>
              <Text style={estilos.nomePerfil}>{user?.nome || 'Atleta'}</Text>
              <Text style={estilos.objetivoPerfil}>{rotuloObjetivo}</Text>
            </View>
          </View>
          <XPBar currentXP={experienciaAtual} nextLevelXP={experienciaProximoNivel} level={nivel} />
        </View>

        {/* Micro-Interação Textual Recursiva */}
        <View style={estilos.painelMutanteMotivacional}>
          <MaquinaDeEscreverTexto 
            mensagens={mensagensCiclicas}
            velocidadeDigitacao={45}
            tempoPausa={4000}
            estilo={estilos.textoMotivacionalCiclico}
          />
        </View>

        {/* Painel Estatístico Consolidado */}
        <Text style={estilos.tituloSecao}>Matriz Diária Resumida</Text>
        <View style={estilos.gradeResumo}>
          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.waterMedium + '20' }]}>
              <Ionicons name="water" size={20} color={Colors.waterMedium} />
            </View>
            <Text style={estilos.valorResumo}>{percentualAgua}%</Text>
            <Text style={estilos.rotuloResumo}>Hidratação</Text>
            <View style={estilos.barraMiniatura}>
              <View style={[estilos.barraMiniaturaPreenchida, { width: `${percentualAgua}%`, backgroundColor: Colors.waterMedium }]} />
            </View>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.brandGreen + '20' }]}>
              <Ionicons name="barbell" size={20} color={Colors.brandGreen} />
            </View>
            <Text style={estilos.valorResumo}>{treinoHojeConcluido ? '✅' : '⏳'}</Text>
            <Text style={estilos.rotuloResumo}>Mecânica Fís.</Text>
            <View style={estilos.barraMiniatura}>
              <View style={[estilos.barraMiniaturaPreenchida, { width: treinoHojeConcluido ? '100%' : '0%', backgroundColor: Colors.brandGreen }]} />
            </View>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={[estilos.iconeResumo, { backgroundColor: Colors.brandAccent + '20' }]}>
              <Ionicons name="restaurant" size={20} color={Colors.brandAccent} />
            </View>
            <Text style={estilos.valorResumo}>{refeicoesHojeRegistradas}/4</Text>
            <Text style={estilos.rotuloResumo}>Digestão Global</Text>
            <View style={estilos.barraMiniatura}>
              <View style={[estilos.barraMiniaturaPreenchida, { width: `${(refeicoesHojeRegistradas / 4) * 100}%`, backgroundColor: Colors.brandAccent }]} />
            </View>
          </View>
        </View>

        {/* Métricas Biológicas Limítrofes */}
        <Text style={estilos.tituloSecao}>Variáveis Globais Bio</Text>
        <View style={estilos.linhaEstatisticas}>
          <StatCard icon="body" iconColor={Colors.brandGreen} label="Peso" value={pesoCorporalFisico > 0 ? `${pesoCorporalFisico}kg` : '—'} />
          <View style={{ width: 10 }} />
          <StatCard icon="pulse" iconColor={Colors.brandAccentWarm} label="IMC" value={String(indiceMassaCorporal)} />
          <View style={{ width: 10 }} />
          <StatCard icon="flame" iconColor={Colors.streakFire} label="Rendimento" value={`${sequenciaDias}d`} />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  // Controle Estrito de Geometria Raiz
  areaSeguraHospedeira: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  containerDeRolagem: { padding: 20, paddingBottom: 40 },
  cabecalhoEstrutural: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saudacaoPrincipal: { ...Typography.h2, color: Colors.textPrimary },
  saudacaoSubjacente: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  distintivoSequencia: {
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
  textoSequencia: { ...Typography.captionBold, color: Colors.streakFire },
  
  // Painéis de Ação Vital
  containerPrimeiroLogin: {
    backgroundColor: '#fffbeb', // Amarelo suave provisório limitador
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fce7f3'
  },
  tituloPrimeiroLogin: { ...Typography.h3, color: '#b45309', marginBottom: 4 },
  textoPrimeiroLogin: { ...Typography.body, color: '#d97706', marginBottom: 16 },
  botaoAcaoVital: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandGreen,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  botaoAcaoVitalSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.brandGreen,
  },
  textoBotaoAcaoVital: { ...Typography.bodyBold, color: Colors.backgroundPrimary },
  textoBotaoAcaoSecundario: { color: Colors.brandGreen },

  // Painéis de Dados Físicos
  cartaoPerfil: {
    backgroundColor: Colors.surfaceCards,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  linhaPerfil: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  informacaoPerfil: { flex: 1, marginLeft: 14 },
  nomePerfil: { ...Typography.h3, color: Colors.textPrimary },
  objetivoPerfil: { ...Typography.caption, color: Colors.brandAccent, marginTop: 2 },
  tituloSecao: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 14 },
  gradeResumo: { flexDirection: 'row', gap: 10, marginBottom: 24 },
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
  barraMiniatura: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceCardsLight,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  barraMiniaturaPreenchida: { height: '100%', borderRadius: 2 },
  linhaEstatisticas: { flexDirection: 'row', marginBottom: 24 },
  
  // Painel de Tipografia Mutante
  painelMutanteMotivacional: {
    backgroundColor: Colors.brandAccent + '15',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brandAccent,
  },
  textoMotivacionalCiclico: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 22,
  }
});
