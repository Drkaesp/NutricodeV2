import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import NutriMascot from '@/src/components/NutriMascot';
import XPBar from '@/src/components/XPBar';
import { useAuth } from '@/src/context/AuthContext';
import { getLevelFromXP, calculateDailyWaterGoal, RECOMMENDED_WORKOUTS, RecommendedWorkout } from '@/constants/GameData';
import { getWorkoutPlan, saveWorkoutPlan, getTodayWater, WorkoutExercise } from '@/src/utils/storage';
import { fetchExercisesFromApi } from '@/src/utils/api';

/**
 * O Módulo Operacional Base do Perfil Integrado Biológico
 * Propriedades mutantes gráficas atreladas diretamente à edição biométrica (Altura, Peso, Nome).
 * O disparo interno de atualizações gera uma purga lógica em balanços hídricos em toda a matriz.
 */
export default function CentralBiometricaBase() {
  const { user, updateUser, logout } = useAuth();
  const roteadorNativo = useRouter();
  const [capturaAguaHoje, setCapturaAguaHoje] = useState(0);

  // Estados Locais Mutáveis para Edição In-Place
  const [modoEdicaoMutante, setModoEdicaoMutante] = useState(false);
  const [nomeEditavel, setNomeEditavel] = useState(user?.nome || '');
  const [pesoEditavel, setPesoEditavel] = useState(String(user?.peso || 0));
  const [alturaEditavel, setAlturaEditavel] = useState(String(user?.altura || 0));

  const totalProcessamentoXP = user?.totalXP || 0;
  const { level: patenteAtual, currentXP: expAtual, nextLevelXP: expRequerida } = getLevelFromXP(totalProcessamentoXP);
  const sequenciaEstabilidade = user?.streak || 0;
  
  const necessidadeHidricaBasal = calculateDailyWaterGoal(user?.peso || 70);
  const massaCorporalFisica = parseFloat(pesoEditavel) || 0;
  const eixoVerticalCorporal = parseFloat(alturaEditavel) || 0;
  
  const calculoMassaRelativaIMC = eixoVerticalCorporal > 0 ? parseFloat((massaCorporalFisica / ((eixoVerticalCorporal / 100) ** 2)).toFixed(1)) : 0;

  const rotuloAlvoBiologico = user?.objetivo === 'perder_peso' ? 'Queima Metabólica'
    : user?.objetivo === 'ganhar_massa' ? 'Hipertrofia Celular'
    : user?.objetivo === 'manter_forma' ? 'Manutenção Estrita'
    : 'Não Estipulado';

  const nivelExaustaoAtividade = user?.nivelAtividade === 'sedentario' ? 'Conservação Energia'
    : user?.nivelAtividade === 'moderado' ? 'Cinética Média'
    : user?.nivelAtividade === 'ativo' ? 'Fadiga Ativa'
    : 'Desconhecido';

  useFocusEffect(
    useCallback(() => {
      sincronizarDadosExternos();
    }, [])
  );

  async function sincronizarDadosExternos() {
    const afericaoHidrica = await getTodayWater();
    setCapturaAguaHoje(afericaoHidrica);
  }

  /**
   * Disparo Sequencial de Redes de Processamento
   * Salva as métricas editadas e alerta o usuário sobre recálculos reativos absolutos estruturais.
   */
  async function purgaLogicaDeBalanco() {
    if(!modoEdicaoMutante) {
      setModoEdicaoMutante(true);
      return;
    }

    await updateUser({
      nome: nomeEditavel,
      peso: massaCorporalFisica,
      altura: eixoVerticalCorporal
    });
    
    setModoEdicaoMutante(false);

    Alert.alert(
      'Métrica Biológica Reescrita',
      `Os nós conectores foram informados.\nSua necessidade hídrica diária foi recalculada para ${calculateDailyWaterGoal(massaCorporalFisica)}ml e suas matrizes calóricas foram adaptadas perfeitamente no backend local.`,
      [{ text: 'Compreendido' }]
    );
  }

  async function invocarModificadorAvatar() {
    // Solicita permissões
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão Recusada', 'O acesso à galeria é necessário para acoplar uma nova biometria visual.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const asset = pickerResult.assets[0];
      const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
      await updateUser({ avatar: base64Uri });
      Alert.alert('Sincronização', 'Sua matriz visual foi atualizada na rede.');
    }
  }

  async function engatarRotinaImplantada(rotina: RecommendedWorkout) {
    const apiExercicios = await fetchExercisesFromApi();
    
    const vetorExercicios: WorkoutExercise[] = rotina.exercises
      .map((idUnico) => {
        const dadosExercicio = apiExercicios.find((e) => e.id === idUnico);
        if (!dadosExercicio) return null;
        return {
          exerciseId: dadosExercicio.id,
          name: dadosExercicio.name,
          muscleGroup: dadosExercicio.muscleGroup,
          sets: dadosExercicio.defaultSets,
          reps: dadosExercicio.defaultReps,
        };
      })
      .filter(Boolean) as WorkoutExercise[];

    Alert.alert(
      'Abordagem Biológica',
      `Acoplar as métricas mecânicas de "${rotina.name}" na sua matriz de esforço?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Injetar Vetor',
          onPress: async () => {
            const estruturaSemanal = await getWorkoutPlan();
            const malhaDeDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
            const alvoVazio = malhaDeDias.find((d) => (estruturaSemanal[d]?.exercises?.length || 0) === 0);
            
            if (alvoVazio) {
              estruturaSemanal[alvoVazio] = { exercises: vetorExercicios, time: '', completed: false };
              await saveWorkoutPlan(estruturaSemanal);
              Alert.alert('✅ Simbiose Completada!', `Tensão fisiológica inserida no ciclo [${alvoVazio.toUpperCase()}].`);
            } else {
              Alert.alert('Estrutura Lotada', 'Arquitetura física no seu limite estourado de 7 ciclos por semana.');
            }
          },
        },
      ]
    );
  }

  async function acionarDesconexao() {
    Alert.alert('Eviscerar Conexão', 'O encerramento expurgará os dados voláteis da sessão atual. Deseja fechar os canais?', [
      { text: 'Manter Link', style: 'cancel' },
      { text: 'Desatar Nó', style: 'destructive', onPress: async () => { await logout(); roteadorNativo.replace('/'); } },
    ]);
  }

  const categoriaDensidadeCorporal = calculoMassaRelativaIMC < 18.5 ? 'Ausência de Matriz' 
                                   : calculoMassaRelativaIMC < 25 ? 'Estrutura Primária OK' 
                                   : calculoMassaRelativaIMC < 30 ? 'Ponto de Sobrecarga' 
                                   : 'Colapso Crítico (Obesidade)';
                                   
  const espectroDaMassa = calculoMassaRelativaIMC < 18.5 ? Colors.statusInfo 
                        : calculoMassaRelativaIMC < 25 ? Colors.brandGreen 
                        : calculoMassaRelativaIMC < 30 ? Colors.statusWarning 
                        : Colors.statusError;

  return (
    <SafeAreaView style={estilos.blindagemMatrizBase}>
      <ScrollView contentContainerStyle={estilos.rolagemFisicaContinua} showsVerticalScrollIndicator={false}>
        
        {/* Acoplamento do Escopo Biográfico Textual */}
        <View style={estilos.cabecalhoIdentidadePrincipal}>
          <TouchableOpacity style={estilos.campoFisicoAvatar} onPress={invocarModificadorAvatar} activeOpacity={0.8}>
            {user?.avatar ? (
               <Image source={{ uri: user.avatar }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
               <NutriMascot state="alegre" size={80} />
            )}
            <View style={estilos.engateMudarAvatar}>
               <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
            <View style={estilos.distintivoElevacaoAurea}>
              <Text style={estilos.textoDistintivoNivel}>PATENTE {patenteAtual}</Text>
            </View>
          </TouchableOpacity>
          
          {modoEdicaoMutante ? (
            <TextInput
              style={estilos.pontoInjecaoTextoNome}
              value={nomeEditavel}
              onChangeText={setNomeEditavel}
              placeholder="Designação Ativa..."
              placeholderTextColor={Colors.textMuted}
            />
          ) : (
             <Text style={estilos.nomenclaturaAtivaUsuario}>{user?.nome || 'Assinante Biomédico'}</Text>
          )}

          <Text style={estilos.nomenclaturaSistemaEndereco}>{user?.email || ''}</Text>
          
          <View style={estilos.separadorDeEngrenagem} />
          <XPBar currentXP={expAtual} nextLevelXP={expRequerida} level={patenteAtual} />
        </View>

        {/* Console de Manipulação de Matriz Paramétrica de Massa (Peso/Altura) */}
        <View style={estilos.seccaoCabecalhoDivisor}>
           <Text style={estilos.tituloDeSegmentacao}>Engrenagens Base (Métricas)</Text>
           <TouchableOpacity onPress={purgaLogicaDeBalanco} style={estilos.botaoEngrenagemAltera}>
               <Ionicons name={modoEdicaoMutante ? "save" : "pencil"} size={16} color={Colors.brandAccent} />
               <Text style={estilos.botaoEngrenagemTexto}>{modoEdicaoMutante ? 'Acoplar Dados' : 'Modificar'}</Text>
           </TouchableOpacity>
        </View>

        <View style={estilos.gradeTopologicaSatelite}>
          <View style={estilos.quadroMatrizSatelite}>
            <Ionicons name="scale" size={18} color={Colors.brandAccent} />
            {modoEdicaoMutante ? (
                <TextInput
                    style={estilos.campoInjecaoMicroNumero}
                    value={pesoEditavel}
                    keyboardType="numeric"
                    onChangeText={setPesoEditavel}
                />
            ) : (
                <Text style={estilos.hologramaNumeralBase}>{massaCorporalFisica > 0 ? `${massaCorporalFisica}kg` : '—'}</Text>
            )}
            <Text style={estilos.legendaSateliteFisica}>Massa (Kg)</Text>
          </View>
          
          <View style={estilos.quadroMatrizSatelite}>
            <Ionicons name="resize" size={18} color={Colors.brandGreen} />
            {modoEdicaoMutante ? (
                <TextInput
                    style={estilos.campoInjecaoMicroNumero}
                    value={alturaEditavel}
                    keyboardType="numeric"
                    onChangeText={setAlturaEditavel}
                />
            ) : (
                <Text style={estilos.hologramaNumeralBase}>{eixoVerticalCorporal > 0 ? `${eixoVerticalCorporal}cm` : '—'}</Text>
            )}
            <Text style={estilos.legendaSateliteFisica}>Eixo (Cm)</Text>
          </View>

          <View style={estilos.quadroMatrizSatelite}>
            <Ionicons name="pulse" size={18} color={espectroDaMassa} />
            <Text style={estilos.hologramaNumeralBase}>{calculoMassaRelativaIMC || '—'}</Text>
            <Text style={estilos.legendaSateliteFisica}>Dens. IMC</Text>
          </View>
          
          <View style={estilos.quadroMatrizSatelite}>
            <Ionicons name="flame" size={18} color={Colors.streakFire} />
            <Text style={estilos.hologramaNumeralBase}>{sequenciaEstabilidade}d</Text>
            <Text style={estilos.legendaSateliteFisica}>Inércia Diária</Text>
          </View>
        </View>

        {calculoMassaRelativaIMC > 0 && (
          <View style={[estilos.cardRetornoEspectral, { borderColor: espectroDaMassa + '40' }]}>
            <View style={[estilos.focalizadorEspectral, { backgroundColor: espectroDaMassa }]} />
            <View style={estilos.blocoInformacaoEspectral}>
              <Text style={estilos.rotuloRetornoEspectral}>{categoriaDensidadeCorporal}</Text>
              <Text style={estilos.descritivoRetornoEspectral}>Matriz Base {calculoMassaRelativaIMC} — Furtividade: {rotuloAlvoBiologico}</Text>
            </View>
          </View>
        )}

        {/* Vetores de Atuação */}
        <Text style={estilos.tituloDeSegmentacao}>Diretrizes do Hospedeiro</Text>
        <View style={estilos.malhaAlinhamentoAcoes}>
          <View style={[estilos.cartaoMecanicoAlvo, { borderColor: Colors.brandAccent + '30' }]}>
            <Ionicons name="flag" size={20} color={Colors.brandAccent} />
            <Text style={estilos.textoCardMecanico}>{rotuloAlvoBiologico}</Text>
          </View>
          <View style={{ width: 10 }} />
          <View style={[estilos.cartaoMecanicoAlvo, { borderColor: Colors.brandGreen + '30' }]}>
            <Ionicons name="flash" size={20} color={Colors.brandGreen} />
            <Text style={estilos.textoCardMecanico}>{nivelExaustaoAtividade}</Text>
          </View>
        </View>

        {/* Motor Fixo de Hidratação Reativa */}
        <View style={estilos.cardMonitoramentoReativoAberto}>
          <Ionicons name="water" size={20} color={Colors.waterMedium} />
          <View style={estilos.bateriaInternaReativa}>
            <Text style={estilos.logBateriaReativa}>Saturação Hidrológica Ativa</Text>
            <View style={estilos.suporteElevacaoLiquida}>
              <View style={[estilos.enchimentoViscosoReativo, { width: `${Math.min((capturaAguaHoje / necessidadeHidricaBasal) * 100, 100)}%` }]} />
            </View>
          </View>
          <Text style={estilos.metricasExatasReativas}>{capturaAguaHoje}/{necessidadeHidricaBasal}ml</Text>
        </View>

        {/* Puxada Externa do Repositório Fisiológico Relevante (Recomendações) */}
        <Text style={estilos.tituloDeSegmentacao}>Rotinas Biomecânicas Injetáveis</Text>
        <Text style={estilos.subTextoLado}>Puxadas remotas adaptáveis ao frame logado</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.trilhaLongoPrasoRolagem}>
          {RECOMMENDED_WORKOUTS.map((cargaRotineira) => (
            <View key={cargaRotineira.id} style={[estilos.cardProcedurizadoInjecao, { borderColor: cargaRotineira.color + '40' }]}>
              <View style={[estilos.invólucroBaseIcone, { backgroundColor: cargaRotineira.color + '20' }]}>
                <Ionicons name={cargaRotineira.icon as any} size={28} color={cargaRotineira.color} />
              </View>
              <Text style={estilos.cargaNomeEstricta}>{cargaRotineira.name}</Text>
              <Text style={estilos.focagemMuscular}>{cargaRotineira.focus}</Text>
              <View style={estilos.balancoAtributosGerais}>
                <View style={estilos.celulaIconeAtributo}>
                  <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                  <Text style={estilos.textoAtributoLeve}>{cargaRotineira.duration}</Text>
                </View>
                <View style={[estilos.emblemaEstresseCalculado, {
                  backgroundColor: cargaRotineira.difficulty === 'Iniciante' ? Colors.brandGreen + '20'
                    : cargaRotineira.difficulty === 'Intermediário' ? Colors.brandAccent + '20'
                    : Colors.statusError + '20'
                }]}>
                  <Text style={[estilos.textoEstresseEmblema, {
                    color: cargaRotineira.difficulty === 'Iniciante' ? Colors.brandGreen
                      : cargaRotineira.difficulty === 'Intermediário' ? Colors.brandAccent
                      : Colors.statusError
                  }]}>{cargaRotineira.difficulty}</Text>
                </View>
              </View>
              <Text style={estilos.textoExplicatorioCarga}>{cargaRotineira.description}</Text>
              
              <TouchableOpacity
                style={[estilos.engateMecanicoInferior, { backgroundColor: cargaRotineira.color }]}
                onPress={() => engatarRotinaImplantada(cargaRotineira)}
                activeOpacity={0.8}>
                <Ionicons name="add" size={18} color={Colors.backgroundPrimary} />
                <Text style={estilos.textoEngateMecanico}>Acoplar Rotina</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={estilos.botaoPurgaDesconectar} onPress={acionarDesconexao}>
          <Ionicons name="power-outline" size={20} color={Colors.statusError} />
          <Text style={estilos.textoDesconectarRede}>Desatar Nó Sistêmico (Sair)</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  blindagemMatrizBase: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  rolagemFisicaContinua: { padding: 20, paddingBottom: 40 },
  cabecalhoIdentidadePrincipal: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  campoFisicoAvatar: { 
    position: 'relative', 
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.surfaceCardsLight,
    borderRadius: 45,
    padding: 4
  },
  engateMudarAvatar: {
    position: 'absolute',
    bottom: 4,
    right: -4,
    backgroundColor: Colors.brandAccent,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  distintivoElevacaoAurea: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.levelBadge,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  textoDistintivoNivel: { ...Typography.captionBold, color: Colors.textOnAccent, fontSize: 10 },
  nomenclaturaAtivaUsuario: { ...Typography.h2, color: Colors.textPrimary, marginBottom: 2 },
  pontoInjecaoTextoNome: {
      ...Typography.h2, 
      color: Colors.brandAccent, 
      marginBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: Colors.brandAccent,
      minWidth: 150,
      textAlign: 'center'
  },
  nomenclaturaSistemaEndereco: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 16 },
  separadorDeEngrenagem: { width: '80%', height: 1, backgroundColor: Colors.surfaceCardsLight, marginBottom: 16 },
  
  seccaoCabecalhoDivisor: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
  },
  tituloDeSegmentacao: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  botaoEngrenagemAltera: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: Colors.brandAccent + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12
  },
  botaoEngrenagemTexto: { ...Typography.captionBold, color: Colors.brandAccent },

  gradeTopologicaSatelite: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quadroMatrizSatelite: {
    flex: 1,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  hologramaNumeralBase: { ...Typography.metricSmall, color: Colors.textPrimary, fontSize: 16, marginTop: 6 },
  campoInjecaoMicroNumero: {
      ...Typography.metricSmall,
      color: Colors.brandAccent,
      fontSize: 16,
      marginTop: 6,
      borderBottomWidth: 1,
      borderBottomColor: Colors.brandAccent,
      minWidth: 40,
      textAlign: 'center',
      height: 24,
      padding: 0
  },
  legendaSateliteFisica: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  
  cardRetornoEspectral: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  focalizadorEspectral: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  blocoInformacaoEspectral: { flex: 1 },
  rotuloRetornoEspectral: { ...Typography.bodyBold, color: Colors.textPrimary },
  descritivoRetornoEspectral: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  malhaAlinhamentoAcoes: { flexDirection: 'row', marginBottom: 20, marginTop: 10 },
  cartaoMecanicoAlvo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  textoCardMecanico: { ...Typography.bodyBold, color: Colors.textPrimary, flex: 1 },
  cardMonitoramentoReativoAberto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCards,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
    gap: 12,
  },
  bateriaInternaReativa: { flex: 1 },
  logBateriaReativa: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: 6 },
  suporteElevacaoLiquida: { height: 6, backgroundColor: Colors.surfaceCardsLight, borderRadius: 3, overflow: 'hidden' },
  enchimentoViscosoReativo: { height: '100%', backgroundColor: Colors.waterMedium, borderRadius: 3 },
  metricasExatasReativas: { ...Typography.captionBold, color: Colors.waterMedium },
  
  subTextoLado: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 14, marginTop: -6 },
  trilhaLongoPrasoRolagem: { paddingBottom: 8, gap: 12, marginTop: 5 },
  cardProcedurizadoInjecao: {
    width: 200,
    backgroundColor: Colors.surfaceCards,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginRight: 12,
  },
  invólucroBaseIcone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cargaNomeEstricta: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: 4 },
  focagemMuscular: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 8 },
  balancoAtributosGerais: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  celulaIconeAtributo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textoAtributoLeve: { ...Typography.caption, color: Colors.textSecondary },
  emblemaEstresseCalculado: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  textoEstresseEmblema: { ...Typography.captionBold, fontSize: 10 },
  textoExplicatorioCarga: { ...Typography.caption, color: Colors.textMuted, marginBottom: 12, lineHeight: 16 },
  engateMecanicoInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textoEngateMecanico: { ...Typography.buttonSmall, color: Colors.backgroundPrimary },
  botaoPurgaDesconectar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.statusError + '10',
    borderWidth: 1,
    borderColor: Colors.statusError + '30',
    marginTop: 20
  },
  textoDesconectarRede: { ...Typography.button, color: Colors.statusError },
});
