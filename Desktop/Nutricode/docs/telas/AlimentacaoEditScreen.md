# Tela: Edição de Alimentação (`src/app/(panel)/alimentacao/edit.tsx`)

## 🧠 O Que Essa Tela Faz?
Essa tela atua como o **laboratório de formulação** da refeição do usuário. Ela permite pesquisar alimentos em um banco de dados externo via API e adicioná-los diretamente em uma refeição específica (ex: Almoço de Terça-feira). Mais importante ainda, ela permite ao usuário **editar as gramas** do alimento adicionado, recalculando matematicamente todas as proteínas, carboidratos e gorduras de forma proporcional em tempo real.

---

## 🛠️ Dissecando o Código (Para Devs)

A magia desta tela acontece no processamento da edição de quantidade (gramas). Não é só mudar o número visualmente; é atualizar a matriz nutricional inteira de uma vez.

### 1. `updateGrams(index: number, delta: number)` - A Escala de Equivalência

Quando o usuário clica nos botões `+` ou `-` ao lado de um alimento adicionado, ele está alterando o peso. A tabela nutricional dos alimentos da API normalmente vem baseada em 100g. Precisamos usar a regra de 3 para reescalar os valores.

**Analogia:** Imagine uma receita de bolo feita para 1 pessoa (100g de bolo) que pede 2 ovos. Se a pessoa quer fazer o bolo para 2 pessoas (200g de bolo), nós não precisamos adivinhar os ingredientes. Descobrimos o **Multiplicador**: O peso novo (200) dividido pelo peso antigo (100) = Multiplicador 2. Então nós pegamos todos os ingredientes (proteínas, calorias) e multiplicamos por 2.

```typescript
async function updateGrams(index: number, delta: number) {
  // Fazemos uma cópia da lista atual de comidas pra não ferir a imutabilidade do React
  const updatedFoods = [...currentFoods];
  
  // Descobre qual será o peso novo. O Math.max garante que o usuário nunca coloque um peso menor que 10 gramas (para não dar erro no app ou calorias zeradas).
  const novaGrama = Math.max(10, updatedFoods[index].grams + delta); 
  
  // A Regra de 3: (Peso Novo / Peso Antigo)
  // Ex: Se tinha 100g e virou 110g -> 110 / 100 = 1.1 (Aumentar em 10% tudo)
  const multiplicador = novaGrama / updatedFoods[index].grams;
  
  // Atualiza o alimento naquela posição da Array recriando o objeto (Spread Operator)
  updatedFoods[index] = {
    ...updatedFoods[index],
    grams: novaGrama,
    // Aplica o multiplicador atômico em todos os macro nutrientes
    kcal: updatedFoods[index].kcal * multiplicador,
    protein: updatedFoods[index].protein * multiplicador,
    carbs: updatedFoods[index].carbs * multiplicador,
    fat: updatedFoods[index].fat * multiplicador,
  };
  
  // Salva no Estado Local da UI para a tela reagir instantaneamente
  setCurrentFoods(updatedFoods);
  
  // Salva no Banco de Dados Falso / AsyncStorage
  const plan = await getMealPlan();
  if (day && slot) {
    (plan[day] as any)[slot] = { foods: updatedFoods };
    await saveMealPlan(plan);
  }
}
```

### 2. A Busca Filtrada Dinâmica (`filteredFoods`)

```typescript
const filteredFoods = search.trim() === ''
  ? apiFoods
  : apiFoods.filter((f) => f.name.toLowerCase().includes(search.trim().toLowerCase()));
```

**Por que fazemos o filtro assim?**
Em vez de disparar uma busca na API cada vez que o usuário digita uma letra no Input de Busca (o que fritaria o servidor da Nutricode com milhões de requisições por segundo), nós fazemos o `loadCurrentFoods()` trazer todos os alimentos permitidos pro celular e os guardamos no estado `apiFoods`.
A constante `filteredFoods` pega o que o usuário digitou, abaixa a caixa (`toLowerCase()`) e compara com os itens também em caixa baixa. O React desenha instantaneamente! Isso tira a carga do Backend e joga a carga de Processamento na CPU do celular, o que é grátis.
