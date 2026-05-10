# Tela: Home (`src/app/(panel)/home/page.tsx`)

## 🧠 O Que Essa Tela Faz?
Esta é a tela de "Lobby" e Dashboard principal. Ela não executa tarefas biológicas sozinha, mas ela **lê e condensa** os dados de todo o aplicativo. Ela olha para o copo de água, olha para as refeições e para os treinos de hoje, e desenha gráficos (barras) em miniatura. Ela também carrega as dicas motivacionais na máquina de escrever virtual, o nível do usuário e o Avatar (Mascote).

---

## 🛠️ Dissecando o Código (Para Devs)

Como esta tela é essencialmente uma leitora global, o ponto mais complexo dela é onde ela engole os dados de todas as outras entidades do aplicativo de forma simultânea.

### 1. `carregarDadosDiariosSubjacentes()` - O Hub Central de Inteligência

Essa função roda toda vez que a Home abre. A missão dela é ir em todos os "bancos de dados" isolados e pegar a situação daquele exato momento.

**Analogia:** Imagine um CEO chegando na empresa de manhã. Ele não quer saber como construir a máquina de embalar. Ele só chama o Diretor de Água, o Diretor de Comida e o Diretor de Treino e pergunta: "Como estamos hoje?". Cada um responde com um número, o CEO anota na lousa (Interface), e pronto.

```typescript
async function carregarDadosDiariosSubjacentes() {
  
  // 1. Relatório do Diretor de Hidratação
  const agua = await getTodayWater();
  setAguaHoje(agua);
  
  // 2. Relatório do Diretor Físico (Treino)
  const treinos = await getWorkoutPlan();
  const treinoDeHoje = treinos[chaveDiaAtual];
  if (treinoDeHoje) {
    // Só me importa se foi concluído ou não (Booleano)
    setTreinoHojeConcluido(treinoDeHoje.completed);
  }
  
  // 3. Relatório do Diretor de Alimentação
  const refeicoes = await getMealPlan();
  const refeicaoDeHoje = refeicoes[chaveDiaAtual];
  if (refeicaoDeHoje) {
    let contagem = 0;
    // Ele checa manualmente gaveta por gaveta pra ver se existe pelo menos 1 alimento cadastrado.
    // Se tiver, aumenta a contagem. O máximo será 4.
    if (refeicaoDeHoje.cafe?.foods?.length > 0) contagem++;
    if (refeicaoDeHoje.almoco?.foods?.length > 0) contagem++;
    if (refeicaoDeHoje.lanche?.foods?.length > 0) contagem++;
    if (refeicaoDeHoje.janta?.foods?.length > 0) contagem++;
    
    // Atualiza o mostrador na Home pra "3/4" ou "4/4" refeições registradas.
    setRefeicoesHojeRegistradas(contagem);
  }
}
```

### 2. A Matemática Limítrofe Visível (`Math.min` e Interpolação Textual)

```typescript
// Impede que a barra de água passe de 100% caso o cara beba 5 litros e a meta seja 2.
// Ele faz a divisão (ex: 2000 / 2000 = 1). Multiplica por 100 = 100%. 
// O Math.min(resultado, 100) garante que nunca vai estourar a tela.
const percentualAgua = Math.min(Math.round((aguaHoje / metaAguaDiaria) * 100), 100);

// Uma Array de mensagens dinâmicas que variam dependendo da realidade ATUAL do banco de dados
const mensagensCiclicas = [
  `Até este limiar biológico você consumiu ${((aguaHoje) / 1000).toFixed(1)} Litros Essenciais de Água`,
  `Energia metabólica alcançada no nível ${nivel}! Continue o fluxo!`,
];
```

**Por que não fazer isso no Backend?**
Isso poupa banda larga. Ao invés do servidor calcular os 100% e as strings textuais e enviar pela internet para o celular, nós apenas salvamos a fonte de verdade bruta no celular (`aguaHoje = 2000`). Todas essas transformações (porcentagens, "2 Litros", "1.5 Litros", textos interativos) ocorrem em microssegundos direto no chip do celular, garantindo experiência *Zero-Lag*.
