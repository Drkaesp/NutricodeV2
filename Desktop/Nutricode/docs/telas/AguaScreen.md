# Tela: Água (`src/app/(panel)/agua/page.tsx`)

## 🧠 O Que Essa Tela Faz?
Imagine essa tela como o **centro de controle de hidratação** do usuário. O objetivo principal dela não é apenas marcar o quanto de água foi bebido, mas criar um "loop de hábito". Ela exibe uma garrafa de água interativa (procedimental) que vai enchendo em tempo real, mostra o histórico da semana usando um design em barras holográficas, e recompensa o usuário com XP quando ele atinge a meta baseada no próprio peso corporal.

---

## 🛠️ Dissecando o Código (Para Devs)

Abaixo, vamos analisar as partes mais complexas dessa tela. Vou te explicar como se estivéssemos sentados juntos resolvendo esse problema.

### 1. `inicializarRastreioOrganico()` - A Máquina do Tempo Semanal

Essa função assíncrona é chamada assim que a tela abre (no `useFocusEffect`). A missão dela é dupla: buscar a água que o usuário já bebeu hoje e montar o gráfico dos últimos 7 dias.

**Analogia:** Pense nela como um bibliotecário que primeiro checa o "jornal de hoje" (água de hoje) e depois vai no arquivo buscar os "jornais da última semana" para montar um mural.

```typescript
async function inicializarRastreioOrganico() {
  // 1. Busca no AsyncStorage (local) o quanto o usuário já bebeu hoje
  const hojeColetado = await getTodayWater();
  setIngestaoAtual(hojeColetado);
  
  // Checa se o que ele já bebeu é maior ou igual à meta diária calculada
  setPatamarAtingido(hojeColetado >= metaCilindricaVolume);

  // 2. Busca o arquivo completo de todos os dias já registrados
  const logsRelacionais = await getWaterLog();
  
  // 3. O Loop de Reconstrução Retroativa
  const ultimosSeteEspacos = [];
  for (let i = 6; i >= 0; i--) {
    const ponteiroData = new Date();
    ponteiroData.setDate(ponteiroData.getDate() - i); // Volta 'i' dias no passado
    const chaveDataISO = ponteiroData.toISOString().split('T')[0]; // Pega só a data: "YYYY-MM-DD"
    
    // Procura no array de logs se existe registro para esse dia específico
    const blocoLocal = logsRelacionais.find((l) => l.date === chaveDataISO);
    
    // Empurra pro array o resultado. Se não achar, assume que ele bebeu 0 ml naquele dia.
    ultimosSeteEspacos.push({ date: chaveDataISO, intakeMl: blocoLocal?.intakeMl || 0 });
  }
  setHistoricoCicloSemanal(ultimosSeteEspacos);
}
```
**Por que fazemos assim?** 
Em vez de depender de uma API que traga todos os dias vazios preenchidos com zero, nós garantimos que a interface sempre desenhará **exatamente 7 barras** na tela. Fazemos um loop de 6 até 0, voltando os dias no objeto `Date` nativo do JavaScript e casando as datas (`YYYY-MM-DD`) com o que temos salvo no celular.

---

### 2. `invocarInjecaoVolume(mlTransicionado: number)` - A Máquina de Recompensas

Esta é a função mais crítica do arquivo. É ela que é acionada toda vez que o usuário clica em botões como "+ 300ml" ou "+ 1L". 

**Analogia:** Imagine um fliperama onde você joga uma ficha (os ml de água). A máquina engole a ficha, soma no seu saldo atual, percebe se você bateu o recorde e, se sim, te dá um ticket (XP) comunicando o servidor central (API).

```typescript
async function invocarInjecaoVolume(mlTransicionado: number) {
  // 1. Persistência Local: Salva no celular e recebe de volta o total do dia
  const topoAgregado = await addWater(mlTransicionado);
  setIngestaoAtual(topoAgregado);

  // 2. A Trava de Recompensa
  // Ele só "completa agora" se o novo total ultrapassou a meta E se ele já não tinha atingido antes
  const completouAgora = topoAgregado >= metaCilindricaVolume && !patamarAtingido;
  const hojeData = new Date().toISOString().split('T')[0];

  if (user?.id) {
    try {
      // 3. Sincronização com o Servidor (API)
      const res = await api.logWater(user.id, mlTransicionado, hojeData, completouAgora);
      
      // Se a API retornou que ele ganhou XP por bater a meta
      if (completouAgora && res.xpEarned > 0) {
        setPatamarAtingido(true); // Tranca a meta (não ganha XP de novo hoje)
        Alert.alert(
          '💧 Saciedade Hídrica Biológica!',
          `Estrutura purgada e otimizada!\n+${res.xpEarned} XP`,
          [{ text: 'Estabilizar' }]
        );
      }
      await refreshUserData(); // Recarrega os dados do usuário para ver o novo nível
    } catch (e) {
      console.error('Erro ao logar água na API', e);
    }
  } else {
    // 4. Modo Fallback (Offline/Sem ID)
    if (completouAgora) {
      setPatamarAtingido(true);
      const acumuloExp = (user?.totalXP || 0) + XP_REWARDS.COMPLETE_WATER_GOAL;
      await updateUser({ totalXP: acumuloExp });
      // Dispara alerta local
    }
  }
}
```
**O pulo do gato no TypeScript:**
Repare na variável `completouAgora`. Em vez de dar XP toda vez que ele bebe água depois da meta, criamos uma booleana que só é `true` no **exato momento da travessia** (quando passa da meta pela primeira vez naquele dia). O React atualiza o `patamarAtingido` para `true`, então nos próximos cliques do dia `!patamarAtingido` será falso, bloqueando spam de XP. Isso protege o loop de gamificação!
