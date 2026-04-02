import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

/**
 * Componente: MaquinaDeEscreverTexto
 * Objetivo: Renderizar fragmentos de texto rotativos mutantes em velocidade de digitação
 * nativa na memória, informando ao logado o panorama métrico ativo com mensagens de reforço.
 *
 * Restrição Matemática: O hook de efeito temporal controla rigidamente os ciclos (loops)
 * por ponteiros não bloqueantes (setTimeout/setInterval) garantindo que a thread principal
 * de UI (UI Thread) não sofra asfixia (frame drop) durante as transições de estado.
 */

interface Props {
  mensagens: string[];
  velocidadeDigitacao?: number;
  tempoPausa?: number;
  estilo?: TextStyle;
}

export default function MaquinaDeEscreverTexto({
  mensagens,
  velocidadeDigitacao = 50,
  tempoPausa = 3000,
  estilo,
}: Props) {
  const [textoAtual, setTextoAtual] = useState('');
  const [indiceMensagem, setIndiceMensagem] = useState(0);
  const [estaApagando, setEstaApagando] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Lógica do ponteiro de caracteres atual
    const textoAlvo = mensagens[indiceMensagem];
    
    if (estaApagando) {
      // Estado de retrocesso (Apagando texto)
      if (textoAtual.length > 0) {
        timer = setTimeout(() => {
          setTextoAtual(textoAlvo.substring(0, textoAtual.length - 1));
        }, velocidadeDigitacao / 2); // Apaga mais rápido
      } else {
        // Exauriu a string, avançar para a próxima mensagem na matriz cíclica
        setEstaApagando(false);
        setIndiceMensagem((prev) => (prev + 1) % mensagens.length);
      }
    } else {
      // Estado de avanço (Digitando texto)
      if (textoAtual.length < textoAlvo.length) {
        timer = setTimeout(() => {
          setTextoAtual(textoAlvo.substring(0, textoAtual.length + 1));
        }, velocidadeDigitacao);
      } else {
        // Terminada a digitação, engatilhar a pausa estática
        timer = setTimeout(() => {
          setEstaApagando(true);
        }, tempoPausa);
      }
    }

    return () => clearTimeout(timer);
  }, [textoAtual, estaApagando, indiceMensagem, mensagens, velocidadeDigitacao, tempoPausa]);

  return <Text style={[styles.texto, estilo]}>{textoAtual}</Text>;
}

const styles = StyleSheet.create({
  texto: {
    // A base tipográfica será injetada pelos parâmetros externos do hospedeiro
  },
});
