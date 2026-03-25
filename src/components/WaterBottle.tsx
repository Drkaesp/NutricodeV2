import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

/**
 * Interface Paramétrica Lógica Hidrológica (A Complexidade Máxima)
 * Este componente orquestra a matemática trigonométrica do fluido e o carregamento 
 * das matrizes estocásticas biológicas (Fauna) de acordo com o marco volumétrico ingerido.
 */

interface ParametrosGarrafaAgua {
  volumeAtualMl: number;
  volumeMetaMl: number;
  escalaGeometrica?: number;
  formatoTampa?: 'padrao' | 'esportiva' | 'premium'; // Patentes progressivas
}

// Estruturas de Entidades Biológicas Locais
const FAUNA_NIVEL_1 = ['🐟', '🐠', '🦐']; // Peixinhos vetoriais, cavalos-marinhos
const FAUNA_NIVEL_2 = ['🐙', '🐡', '🦑']; // Polvos complexos, marlins
const FAUNA_NIVEL_3 = ['🦈', '🐋', '🐬']; // Tubarões maciços, baleias, golfinhos

export default function GarrafaAguaProcedimental({
  volumeAtualMl,
  volumeMetaMl,
  escalaGeometrica = 280,
  formatoTampa = 'padrao',
}: ParametrosGarrafaAgua) {
  // Cálculos Básicos de Densidade
  const percentualPreenchimento = Math.min((volumeAtualMl / volumeMetaMl) * 100, 100);
  const larguraCilindro = escalaGeometrica * 0.45;
  const alturaCilindro = escalaGeometrica;
  const alturaCorpo = alturaCilindro * 0.75;
  const alturaFluidoGeometrica = (alturaCorpo * percentualPreenchimento) / 100;

  // Motores Inerciais Trigonométricos
  const motorOndaUm = useRef(new Animated.Value(0)).current;
  const motorOndaDois = useRef(new Animated.Value(0)).current;
  const motorElevacaoFluido = useRef(new Animated.Value(0)).current;

  // Animação de Entrada e Loops Senoidais Contínuos
  useEffect(() => {
    // Escalonamento numérico estendido elástico gradual (Ascensão da Água)
    Animated.timing(motorElevacaoFluido, {
      toValue: alturaFluidoGeometrica,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Comportamento senoidal contínuo na superfície plana da estrutura (Math.sin simulado por rotação)
    Animated.loop(
      Animated.timing(motorOndaUm, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(motorOndaDois, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [alturaFluidoGeometrica]);

  // Gestão Estocástica da Fauna Submersa Dinâmica
  const [entidadesBiologicas, setEntidadesBiologicas] = useState<{ id: string; tipo: string; left: string; top: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Algoritmo de injeção biológica estocástica
    let poolFauna: string[] = [];

    // Camada Primeira Limítrofe (Até 1000ml = 1L)
    if (volumeAtualMl > 0) poolFauna = [...poolFauna, ...FAUNA_NIVEL_1];
    
    // Camada Intermediária Central (Acima de 1000ml)
    if (volumeAtualMl >= 1000) poolFauna = [...poolFauna, ...FAUNA_NIVEL_2];
    
    // Camada Submersa Abissal Complexa (Acima de 2000ml)
    if (volumeAtualMl >= 2000) poolFauna = [...poolFauna, ...FAUNA_NIVEL_3];

    // Gerar entidades fixadas visualmente na matriz hídrica atual
    const maxEntidades = Math.floor(volumeAtualMl / 250); // Uma entidade a cada 250ml
    const novasEntidades = [];
    
    for (let i = 0; i < maxEntidades; i++) {
        if (poolFauna.length === 0) break;
        const tipoAleatorio = poolFauna[Math.floor(Math.random() * poolFauna.length)];
        novasEntidades.push({
            id: `fauna_${i}`,
            tipo: tipoAleatorio,
            left: `${10 + Math.random() * 60}%`, // Dentro das margens internas
            // O Spawn top varia mas respeita o nível da água
            top: `${Math.random() * 80}%`,
            size: 14 + Math.random() * 12,
            delay: Math.random() * 2000,
        });
    }
    setEntidadesBiologicas(novasEntidades);
  }, [volumeAtualMl]);

  // Interpolação Trigonométrica Rotacional
  const rotacaoOndaAtiva = motorOndaUm.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const rotacaoOndaPassiva = motorOndaDois.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={[estilos.gradeIsoladaRaiz, { width: escalaGeometrica, height: escalaGeometrica + 40 }]}>
      
      {/* Abstração da Garrafa Subjacente */}
      <View style={[estilos.involucroMatriz, { width: larguraCilindro + 10, height: alturaCilindro }]}>
        
        {/* Parametrização Gráfica Customizada da Tampa */}
        <View style={[estilos.tampaGeometrica, { width: larguraCilindro * 0.4, height: alturaCilindro * 0.12 }]}>
          <View style={[
              estilos.tampaAcoplada, 
              { width: larguraCilindro * 0.4 + 8 },
              formatoTampa === 'esportiva' && { backgroundColor: Colors.brandAccent },
              formatoTampa === 'premium' && { backgroundColor: Colors.brandYellowBright, height: 12, top: -8 }
          ]} />
        </View>

        {/* Parede Cilíndrica Delimitadora */}
        <View style={[estilos.corpoCilindrico, { width: larguraCilindro, height: alturaCorpo }]}>
          
          {/* Matriz Fluida com Elevadores Inerciais */}
          <Animated.View style={[estilos.matrizSubmersaAnimada, { height: motorElevacaoFluido }]}>
            
            {/* Onda 1 (Senoide Ativa) */}
            <Animated.View style={[
                estilos.ondaSenoidalProcedimental, 
                { 
                    backgroundColor: 'rgba(56, 189, 248, 0.4)', // Cyan suave
                    transform: [{ rotate: rotacaoOndaAtiva }, { translateY: -larguraCilindro * 0.6 }] 
                }
            ]} />
             {/* Onda 2 (Senoide Passiva Contrafásica) */}
              <Animated.View style={[
                estilos.ondaSenoidalProcedimental, 
                { 
                    backgroundColor: Colors.waterMedium,
                    transform: [{ rotate: rotacaoOndaPassiva }, { translateY: -larguraCilindro * 0.55 }] 
                }
            ]} />

            {/* Ecossistema Interligado Autômato */}
            <View style={StyleSheet.absoluteFill}>
              {entidadesBiologicas.map((biota) => (
                  // Usando animacoes em CSS ou Animated locais para respiração vitalícia
                  <Animated.Text 
                      key={biota.id}
                      style={{
                          position: 'absolute' as const,
                          left: biota.left as any,
                          top: biota.top as any,
                          fontSize: biota.size,
                          opacity: 0.85,
                      }}
                  >
                      {biota.tipo}
                  </Animated.Text>
              ))}
            </View>

          </Animated.View>

          {/* Calibradores Analógicos do Cilindro */}
          {[25, 50, 75].map((marco) => (
             <View key={marco} style={[estilos.balizaMedicao, { bottom: `${marco}%` }]} />
          ))}
        </View>
      </View>

      {/* Exposição Textual de Marcos Limítrofes */}
      <View style={estilos.trilhaRotuloMagnitudo}>
         <Text style={estilos.fonteNumericaMaciça}>{volumeAtualMl}ml</Text>
         <Text style={estilos.fonteNumericaAlvo}>/ {volumeMetaMl}ml</Text>
      </View>

      {/* Cartão Finalizador Condicional de Estado */}
      <View style={[estilos.distintivoEscalonado, percentualPreenchimento >= 100 && estilos.distintivoExplosao]}>
         <Text style={[estilos.textoDistintivo, percentualPreenchimento >= 100 && estilos.textoExplosao]}>
            {Math.round(percentualPreenchimento)}%
         </Text>
      </View>

    </View>
  );
}

const estilos = StyleSheet.create({
  gradeIsoladaRaiz: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  involucroMatriz: {
    alignItems: 'center',
  },
  tampaGeometrica: {
    backgroundColor: Colors.waterBackground,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 2,
    borderColor: Colors.surfaceCardsLight,
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tampaAcoplada: {
    height: 8,
    backgroundColor: Colors.surfaceCardsLight,
    borderRadius: 4,
    position: 'absolute',
    top: -6,
  },
  corpoCilindrico: {
    backgroundColor: Colors.backgroundPrimary, // Limpo para o contraste fluindo
    borderRadius: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderColor: Colors.surfaceCardsLight,
    overflow: 'hidden', // Segredo para o corte da onda elástica
    position: 'relative',
    justifyContent: 'flex-end',
  },
  matrizSubmersaAnimada: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.waterDark, // Base funda
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  ondaSenoidalProcedimental: {
    position: 'absolute',
    // O motor senoide simulado na UI Reativa usa um quadrado massivo rodando
    width: 600,
    height: 600,
    left: '50%',
    marginLeft: -300,
    top: 0, // Ancorado ao topo do fluido
    borderRadius: 240, // O "Squircle" que emula a onda orgânica
  },
  balizaMedicao: {
    position: 'absolute',
    left: 4,
    width: 12,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    zIndex: 10,
  },
  trilhaRotuloMagnitudo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
  },
  fonteNumericaMaciça: {
    ...Typography.h2,
    color: Colors.waterMedium,
  },
  fonteNumericaAlvo: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  distintivoEscalonado: {
    backgroundColor: Colors.surfaceCards,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceCardsLight,
  },
  distintivoExplosao: {
    backgroundColor: Colors.waterMedium + '30',
    borderColor: Colors.waterMedium,
  },
  textoDistintivo: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  textoExplosao: {
    color: Colors.waterMedium,
  },
});
