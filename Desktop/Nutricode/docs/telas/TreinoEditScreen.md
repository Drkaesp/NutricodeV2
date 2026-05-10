# Tela: Edição de Treino (`src/app/(panel)/treino/edit.tsx`)

## 🧠 O Que Essa Tela Faz?
Essa é a Biblioteca Mestra do Corpo. Quando o usuário clica em "Adicionar Exercício" na tela de Treino, ele é jogado aqui. A tela traz **todos os exercícios do banco de dados (API)**. O usuário pode filtrar por grupo muscular no topo (Peito, Ombro, Pernas) ou digitar o nome na barra de busca. Se o exercício já estiver adicionado naquele dia da semana, o botão de "+" se transforma em um "✔️" para ele não injetar o mesmo treino duas vezes na mesma prancheta.

---

## 🛠️ Dissecando o Código (Para Devs)

Para uma tela de catálogo funcionar sem lag na rolagem, o segredo é Busca Instantânea no Lado do Cliente e Otimizações Matemáticas nos botões.

### 1. Filtro Cruzado Múltiplo (Texto + Grupo Muscular)

Nós temos dois campos de força agindo em cima da Array que vem da API (`apiExercises`): A Busca de Texto e as Pílulas de Filtro Muscular.

**Analogia:** Imagine um segurança de boate. Ele tem duas regras na prancheta pra deixar alguém entrar. 
Regra 1: O nome bate com o que o dono pediu (`matchSearch`). 
Regra 2: A pessoa tá usando a camiseta do camarote correto (`matchFilter`). 
O cara só entra se passar nas duas regras E(`&&`).

```typescript
const filtered = apiExercises.filter((ex) => {
  // REGRA 1: Se o input de busca tá em branco, todo mundo passa. 
  // Se não, o texto do exercício tem que conter o texto da busca (tudo minúsculo).
  const matchSearch = search.trim() === '' || ex.name.toLowerCase().includes(search.trim().toLowerCase());
  
  // REGRA 2: Se a Pílula do Menu tá no 'all' (Todos), todo mundo passa.
  // Se não, o músculo do cara tem que ser EXATAMENTE igual a Pílula (ex: 'peito' == 'peito').
  const matchFilter = filter === 'all' || ex.muscleGroup === filter;
  
  // A Porta: Só passa quem for true nos dois!
  return matchSearch && matchFilter;
});
```

### 2. O Agrupador Morfológico Inteligente (`groupedExercises`)

Se o usuário estiver no filtro "Todos", a lista ficaria uma bagunça de Bíceps, Pernas e Costas misturados. Nós varremos a lista organizada criando "Cestos" invisíveis na hora da renderização.

```typescript
const groupedExercises: Record<string, Exercise[]> = {};

if (filter === 'all') {
  filtered.forEach(ex => {
    // Se o Cesto do músculo (ex: 'ombro') ainda não existe no objeto vazio, nós criamos a gaveta!
    if (!groupedExercises[ex.muscleGroup]) groupedExercises[ex.muscleGroup] = [];
    
    // Joga o exercício dentro do Cesto certo
    groupedExercises[ex.muscleGroup].push(ex);
  });
}
```
Isso faz com que, no JSX, nós possamos criar uma "Header" (ex: **Ombros**) e renderizar só os daquele cesto, e depois desenhar a próxima Header (ex: **Pernas**).

### 3. A Estrutura de Set (`alreadyAdded`) - O(1) de Performance

Para sabermos se o exercício já está no dia da pessoa e desenharmos um sinal de "✔️", nós poderíamos mandar o React ler a lista inteira do dia toda vez que for desenhar um quadrado de exercício. Se tem 200 exercícios na API, o React faria `200 * Tamanho_do_Treino` verificações (Isso frita a bateria). 
Para resolver, usamos um `Set`.

**Analogia:** Em vez do segurança perguntar pra fila de 200 pessoas "Ei, você tá na lista VIP?", nós damos a ele um crachá de Ouro (`Set`) no começo da noite com os IDs Vips anotados (ex: [3, 8, 12]). Agora, para verificar, ele apenas olha pro peito da pessoa. É instantâneo.

```typescript
// Transforma a lista de exercícios que a pessoa JÁ TEM numa coleção purificada de IDs.
// Exemplo: Set { 'ex_01', 'ex_04' }
const alreadyAdded = new Set(currentExercises.map((e) => e.exerciseId));

const renderExercise = (ex) => {
  // Em vez de rodar um .find() demorado, a busca num Set é O(1). 
  // O Processador não pensa, ele vai no endereço de memória exato e retorna true ou false na velocidade da luz.
  const added = alreadyAdded.has(ex.id);
  
  return (
    //...
    {added ? (
      <Ionicons name="checkmark-circle" color={Colors.brandGreen} />
    ) : (
      <TouchableOpacity onPress={() => addExercise(ex)}>
        <Ionicons name="add-circle" />
      </TouchableOpacity>
    )}
  )
}
```
