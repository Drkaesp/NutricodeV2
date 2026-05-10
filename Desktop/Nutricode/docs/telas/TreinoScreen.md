# Tela: Treino (`src/app/(panel)/treino/page.tsx`)

## 🧠 O Que Essa Tela Faz?
A Tela de Treino funciona como a prancheta da academia do usuário. Ela exibe no topo os dias da semana. Ao clicar em um dia (ex: Quinta), ela revela a lista de exercícios daquele dia, agrupados inteligentemente por grupos musculares (ex: Peito 3 blocos, Costas 2 blocos). Se o usuário clicar num exercício, ele expande pra mostrar um vídeo em GIF simulando como fazer. No final, o usuário aperta o botão verde gigante pra confirmar que treinou, o que envia os dados para a API e o recompensa com XP (Experiência).

---

## 🛠️ Dissecando o Código (Para Devs)

Esta tela foca intensamente em Otimização de Memória (Heap) de Dispositivos Móveis e em Gestão de Componentes Visuais Pesados (Gifs / Imagens).

### 1. `ExerciseAnimation` - Montagem Manual de GIFs

Geralmente, GIFs consumem muita memória RAM do celular. Muitos de uma vez fazem o app fechar sozinho (`OOM - Out of Memory`). O Nutricode é esperto: ele não usa o formato `.gif`. A nossa API manda um Array de imagens estáticas (JPG) e o celular vira um folheador de páginas.

**Analogia:** Imagine tentar rodar 20 fitas VHS ao mesmo tempo numa locadora, a luz da rua vai cair. Em vez disso, nós imprimimos as fotos do filme numa revistinha e mandamos você passar as páginas com o dedo rápido (`setInterval`).

```typescript
const ExerciseAnimation = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0); // Em qual página estamos?
  
  React.useEffect(() => {
    // A cada 1000 milissegundos (1 segundo), muda a página.
    // O "% images.length" faz o loop infinito. Se tem 3 imagens, o index fará: 0, 1, 2, 0, 1, 2...
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1000);
    
    // Quando fechar o exercício, mata o relógio pra não afogar a CPU.
    return () => clearInterval(interval); 
  }, [images]);

  // Renderiza apenas UMA imagem leve de cada vez
  return <Image source={{ uri: images[index] }} ... />;
};
```

### 2. A Renderização Preguiçosa (Lazy Load Condicional)

Se você tem 20 exercícios no dia, baixar 20 animações ao mesmo tempo destruiria a internet 4G do usuário. Para evitar isso, usamos o `rastreadorExpansaoAnimada`.

```typescript
// Se o cara nunca clicou pra abrir a gaveta (recipienteAtivo = false), 
// o React NEM TENTA criar o bloco da imagem, poupando a requisição HTTP.
{recipienteAtivo && (
  <View style={estilos.camadaAbstrataVideoMimica}>
    {exeAtual.images && exeAtual.images.length > 0 ? (
      <ExerciseAnimation images={exeAtual.images} /> // Roda a "revistinha" se tiver imagens
    ) : (
      <View style={estilos.substitutoGeometricoGif}>
        <Text>Simulação Trigonométrica</Text> 
        {/* Placeholder desenhado no CSS se a API ainda não tiver o GIF cadastrado */}
      </View>
    )}
  </View>
)}
```

### 3. `despacharConclusaoDoTreino()` - Dupla Recompensa (API + Fallback Local)

Quando o usuário avisa que treinou, nós comunicamos nosso servidor (`api.logWorkout`). Se o servidor estiver online, ele calcula o XP baseado no Streak e manda de volta pra gente atualizar a tela. Mas se o cara estiver sem internet?

**Analogia:** É como tentar bater o ponto num relógio na porta da empresa. Se a máquina de bater ponto eletrônica (API) queimar porque acabou a luz, o gerente pega um caderno de papel (`AsyncStorage Local`) e anota a mão pra garantir que o trabalhador receba no fim do mês.

```typescript
if (user?.id) {
  try {
    // Bate na porta da Nuvem. O Servidor faz a matemática da gamificação.
    const res = await api.logWorkout(...);
  } catch (e) {
    console.error('Erro na API treino', e);
  }
} else {
  // Caiu no Fallback!
  // O cara fez login de Visitante ou a Nuvem estava inacessível na hora.
  // Nós fazemos a matemática de gamificação na mão direto no chip do celular dele.
  const ganhoExperiencia = (user?.totalXP || 0) + XP_REWARDS.COMPLETE_WORKOUT;
  const sequenciaDiasForca = (user?.streak || 0) + 1;
  
  // Salva no armazenamento persistente de bolso do celular.
  await updateUser({ totalXP: ganhoExperiencia, streak: sequenciaDiasForca });
}
```
