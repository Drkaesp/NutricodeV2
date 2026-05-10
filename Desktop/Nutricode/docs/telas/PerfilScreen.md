# Tela: Perfil (`src/app/(panel)/perfil/page.tsx`)

## 🧠 O Que Essa Tela Faz?
O Perfil é o **Centro de Comando Biológico** do usuário. Diferente das outras telas que rastreiam o que o usuário *faz* (comer, beber, malhar), esta tela gerencia quem o usuário *é*. Aqui ele pode trocar seu Avatar, mudar Nome, Peso e Altura. Além disso, ela age como uma loja de "Rotinas Prontas", permitindo que o usuário injete treinos pré-montados diretamente em dias vazios de sua semana de treinos.

---

## 🛠️ Dissecando o Código (Para Devs)

Esta tela é pesada porque lida com **Variáveis de Efeito Cascata**. Se o usuário muda o peso aqui, a meta de água dele lá na tela de Água tem que mudar automaticamente.

### 1. `purgaLogicaDeBalanco()` - O Gatilho do Efeito Cascata

Quando o usuário clica em "Modificar" nas métricas de corpo, ele abre caixas de texto. Quando ele clica de novo (que agora chama "Acoplar Dados"), nós salvamos isso no banco. 

**Analogia:** O Perfil é como a prefeitura de uma cidade. Quando o usuário muda a sua altura ou peso, a prefeitura não guarda isso em segredo. Ela liga num alto-falante (`updateUser` do AuthContext) e grita pra todas as outras telas: "O peso mudou pra 80kg!". A tela de Água ouve isso e automaticamente recalcula a meta para `80 * 35ml`.

```typescript
async function purgaLogicaDeBalanco() {
  // Se não estava editando, apenas transforma os textos em Inputs editáveis e para por aqui.
  if(!modoEdicaoMutante) {
    setModoEdicaoMutante(true);
    return;
  }

  // Se já estava editando, é hora de salvar.
  // O updateUser é a nossa Prefeitura com Alto Falante. Ele reescreve as globais.
  await updateUser({
    nome: nomeEditavel,
    peso: massaCorporalFisica,
    altura: eixoVerticalCorporal
  });
  
  // Trava as caixas de texto de novo
  setModoEdicaoMutante(false);

  // Exibe o Alerta Biológico avisando que a "matriz" inteira foi atualizada
  Alert.alert('Métrica Biológica Reescrita', ...);
}
```

### 2. `invocarModificadorAvatar()` - Convertendo Fotos em Texto (Base64)

Salvar imagens num banco de dados é chato e consome banda larga. Em vez de fazer upload do arquivo `.jpg` do Avatar para um servidor de arquivos pesado, nós usamos um truque chamado **Base64**.

**Analogia:** É como pegar um quadro da Mona Lisa e transformá-lo num livro gigantesco de 1 milhão de letras (AaBzXxYy...). O banco de dados só entende texto, então nós guardamos esse "livro". Quando o React Native vai desenhar o avatar, ele lê o livro super rápido e "pinta" a imagem de novo.

```typescript
async function invocarModificadorAvatar() {
  // Pede a chave pra entrar na Galeria do Android/iOS
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.granted === false) return;

  // Abre a galeria pedindo pra recortar em quadrado (1:1) com qualidade baixa (0.5) pra não travar a memória
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true, // ESSE É O SEGREDO! Pede a foto traduzida em texto!
  });

  if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
    // Monta o cabeçalho técnico antes do código gigante da foto pra tela de UI entender o que é aquilo
    const base64Uri = `data:image/jpeg;base64,${pickerResult.assets[0].base64}`;
    
    // Grita no alto falante da Prefeitura que a foto global mudou
    await updateUser({ avatar: base64Uri });
  }
}
```

### 3. `engatarRotinaImplantada()` - Encaixe Inteligente de Treinos

Na base do perfil, temos os treinos recomendados (ex: Treino de Força). Se o usuário clicar em "Acoplar Rotina", o app tem que jogar isso na semana do usuário. Mas *onde*?

```typescript
const malhaDeDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

// O método .find() é um cão farejador. Ele passa dia por dia (segunda, terça...) 
// checando se o tamanho da lista de exercícios daquele dia é 0. 
// No momento em que ele acha O PRIMEIRO dia vazio, ele para de procurar e retorna aquele dia.
const alvoVazio = malhaDeDias.find((d) => (estruturaSemanal[d]?.exercises?.length || 0) === 0);

if (alvoVazio) {
  // Acopla a rotina gigantesca apenas naquele dia específico
  estruturaSemanal[alvoVazio] = { exercises: vetorExercicios, time: '', completed: false };
  await saveWorkoutPlan(estruturaSemanal);
}
```
Se o cara já lotou os 7 dias da semana, o `.find()` vai retornar `undefined`, e o app vai disparar um alerta avisando que a arquitetura dele está estourada!
