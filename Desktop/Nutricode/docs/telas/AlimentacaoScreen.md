# Tela: Alimentação (`src/app/(panel)/alimentacao/page.tsx`)

## 🧠 O Que Essa Tela Faz?
A Tela de Alimentação é o verdadeiro "caderno de dieta" do usuário. Ela exibe uma linha do tempo (seg, ter, qua...) e quatro grandes gavetas (Café, Almoço, Lanche, Janta). O usuário pode expandir essas gavetas para ver as comidas daquela refeição. Se a pessoa apertar "Completar Digestão", o aplicativo entende que ela comeu aquilo. No rodapé, uma barra invisível (fixa) calcula os "Macros" totais (Proteínas, Carboidratos e Gorduras) em tempo real conforme as comidas são injetadas.

---

## 🛠️ Dissecando o Código (Para Devs)

Esta tela é um quebra-cabeça de Interface de Usuário (UI) mutante. Vamos focar nas engrenagens de Animação e no Motor de Cálculo Nutricional.

### 1. O Motor de Animação Nativa (`LayoutAnimation`)

Quando você clica em "Café da Manhã", a aba abre deslizando suavemente em vez de "pular" direto pra tela. Fazer animação no React Native pode ser pesado e lento, por isso nós usamos um "truque" que acorda o motor nativo do celular (C++ / Java / Swift) para fazer a animação fora do Javascript.

**Analogia:** Imagine que o React Native é um gerente terceirizado e o celular é o trabalhador braçal. Em vez do gerente tentar animar frame por frame (o que engasga o app), o gerente só grita: "Layout mudou, arruma suavemente!". O trabalhador braçal resolve rápido.

```typescript
// No TOPO do arquivo, habilitamos o motor experimental do Android pra animações fluidas
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// O estado que lembra quais "gavetas" estão abertas no momento
// Ex: { 'cafe': true, 'almoco': false }
const [blocosExpandidos, setBlocosExpandidos] = useState<Record<string, boolean>>({});

// O Gatilho da Mágica
const alternarExpansaoBloco = (chaveRefeicao: string) => {
  // Essa linha abaixo grita pro celular: "A próxima mudança de tela que acontecer, 
  // anime ela usando Easing (Acelera e desacelera suavemente)!"
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
  // Aqui mudamos o estado do React. A mágica da animação acontece sozinha por causa da linha de cima.
  setBlocosExpandidos(prev => ({ ...prev, [chaveRefeicao]: !prev[chaveRefeicao] }));
};
```

### 2. O Processador Matemático (`calcularMatrizTotal`)

Como sabemos o total de Proteína do dia todo se as comidas estão espalhadas em Arrays dentro de Arrays? Nós usamos o método `.reduce()`, que é como uma máquina de moer carne.

**Analogia:** Imagine que você tem 4 caixas (Café, Almoço, etc) cheias de frutas. Você vira todas elas dentro de um funil (`.flatMap()`). Elas descem pra uma esteira. No final da esteira tem um contador com 4 bacias (Calorias, Proteína, etc). O contador pega cada fruta que cai da esteira, vê o valor dela, soma nas bacias e joga a fruta fora. No final, sobram só os totais nas bacias (`.reduce()`).

```typescript
function calcularMatrizTotal(alimentos: MealFood[]) {
  // O Reduce pega uma lista e transforma em um ÚNICO objeto
  return alimentos.reduce(
    (acumulador, alimento) => ({
      // Pra cada alimento que passar aqui, nós somamos com o que já estava acumulado antes
      calorias: acumulador.calorias + alimento.kcal,
      proteina: acumulador.proteina + alimento.protein,
      carboidratos: acumulador.carboidratos + alimento.carbs,
      gordura: acumulador.gordura + alimento.fat,
    }),
    // Aqui é o Ponto Zero. As 4 bacias vazias antes da esteira ligar.
    { calorias: 0, proteina: 0, carboidratos: 0, gordura: 0 } 
  );
}

// Juntando as 4 gavetas em uma lista só (O Funil)
const matrizAgregada = ['cafe', 'almoco', 'lanche', 'janta'].flatMap((chave) => extratorDeAlimentos(chave));

// Jogando na máquina e recebendo o total (O Contador)
const totaisDiarios = calcularMatrizTotal(matrizAgregada);
```
**O pulo do gato no TypeScript:** Reparou na tipagem `MealFood[]`? Isso garante que dentro da função nós nunca vamos tentar acessar `alimento.vitaminas`, porque o TypeScript vai gritar que isso não existe no contrato de `MealFood`. Previne bugs fatais de `undefined` em tempo de compilação!
