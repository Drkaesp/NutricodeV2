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
    Animated.timing(motorElevacaoFluido, {
      toValue: alturaFluidoGeometrica,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Ondulação mais calma e estável
    Animated.loop(
      Animated.sequence([
        Animated.timing(motorOndaUm, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(motorOndaUm, { toValue: 0, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(motorOndaDois, { toValue: 1, duration: 10000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(motorOndaDois, { toValue: 0, duration: 10000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [alturaFluidoGeometrica]);

  // Gestão Estocástica da Fauna Submersa Dinâmica
  const [entidadesBiologicas, setEntidadesBiologicas] = useState<{ id: string; tipo: string; left: string; top: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    let poolFauna: string[] = [];
    if (volumeAtualMl > 0) poolFauna = [...poolFauna, ...FAUNA_NIVEL_1];
    if (volumeAtualMl >= 1000) poolFauna = [...poolFauna, ...FAUNA_NIVEL_2];
    if (volumeAtualMl >= 2000) poolFauna = [...poolFauna, ...FAUNA_NIVEL_3];

    const maxEntidades = Math.floor(volumeAtualMl / 250);
    const novasEntidades = [];
    
    for (let i = 0; i < maxEntidades; i++) {
        if (poolFauna.length === 0) break;
        const tipoAleatorio = poolFauna[Math.floor(Math.random() * poolFauna.length)];
        novasEntidades.push({
            id: `fauna_${i}`,
            tipo: tipoAleatorio,
            left: `${10 + Math.random() * 60}%`, 
            top: `${10 + Math.random() * 70}%`, // Ensure not too high
            size: 16 + Math.random() * 12,
            delay: Math.random() * 2000,
        });
    }
    setEntidadesBiologicas(novasEntidades);
  }, [volumeAtualMl]);

  // Interpolação Orgânica mais Estável
  const rotacaoOndaAtiva = motorOndaUm.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });
  
  const rotacaoOndaPassiva = motorOndaDois.interpolate({
    inputRange: [0, 1],
    outputRange: ['5deg', '-5deg'],
  });

  // Componente interno para natação assíncrona dos peixes
  const PeixeNadador = ({ biota }: { biota: any }) => {
    const motorX = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(motorX, { toValue: larguraCilindro * 0.5, duration: 4000 + biota.delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(motorX, { toValue: -larguraCilindro * 0.2, duration: 4000 + biota.delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
            ])
        ).start();
    }, []);

    // Calcula uma direção baseada na variação para ver se ele inverte
    const scaleX = motorOndaUm.interpolate({ inputRange: [0, 1], outputRange: [1, -1] });

    return (
        <Animated.Text 
            style={{
                position: 'absolute',
                top: biota.top,
                left: biota.left,
                fontSize: biota.size,
                opacity: 0.9,
                transform: [{ translateX: motorX }] // Apenas flutua suave lateralmente
            }}
        >
            {biota.tipo}
        </Animated.Text>
    );
  };

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
                    backgroundColor: 'rgba(56, 189, 248, 0.45)',
                    transform: [{ rotate: rotacaoOndaAtiva }] 
                }
            ]} />
             {/* Onda 2 (Senoide Passiva Contrafásica) */}
              <Animated.View style={[
                estilos.ondaSenoidalProcedimental, 
                { 
                    backgroundColor: Colors.waterMedium,
                    transform: [{ rotate: rotacaoOndaPassiva }] 
                }
            ]} />

            {/* Ecossistema Interligado Autômato */}
            <View style={StyleSheet.absoluteFill}>
              {entidadesBiologicas.map((biota) => (
                  <PeixeNadador key={biota.id} biota={biota} />
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
    backgroundColor: '#cbd5e1',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderColor: '#94a3b8',
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: Colors.brandAccent,
    elevation: 4,
  },
  tampaAcoplada: {
    height: 14,
    backgroundColor: '#94a3b8',
    borderRadius: 8,
    position: 'absolute',
    top: -10,
  },
  corpoCilindrico: {
    backgroundColor: 'rgba(255,255,255,0.05)', // Aspecto de vidro fosco
    borderRadius: 40, // Base mais orgânica e arredondada
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden', 
    position: 'relative',
    justifyContent: 'flex-end',
    shadowColor: Colors.waterMedium,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  matrizSubmersaAnimada: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', 
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  ondaSenoidalProcedimental: {
    position: 'absolute',
    width: 300,
    height: 100,
    left: '50%',
    marginLeft: -150,
    top: -10, 
    borderRadius: 50, 
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
