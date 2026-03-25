# NutriCode v2 — Documentação Técnica

> Gerada em: 24/03/2026  
> Stack: Expo SDK 54 · React 19 · React Native 0.81 · TypeScript 5.9 · Expo Router 6

---

## 1. Arquitetura Geral

```
src/
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout (AuthProvider + Stack)
│   ├── index.tsx                  # Splash screen
│   ├── (auth)/                   # Grupo de autenticação
│   │   ├── signup/page.tsx       # Cadastro de conta
│   │   └── onboarding/page.tsx   # Onboarding em 3 etapas
│   └── (panel)/                  # Grupo principal (logado)
│       ├── _layout.tsx           # Bottom tabs (5 abas)
│       ├── home/page.tsx         # Dashboard principal
│       ├── agua/page.tsx         # Controle de água
│       ├── alimentacao/
│       │   ├── page.tsx          # Lista de refeições
│       │   └── edit.tsx          # Adicionar refeição
│       ├── treino/
│       │   ├── page.tsx          # Lista de treinos
│       │   └── edit.tsx          # Adicionar treino
│       └── perfil/page.tsx       # Perfil do usuário
├── components/                   # Componentes reutilizáveis
│   ├── DailyProgress.tsx
│   ├── MacroCard.tsx
│   ├── MealCard.tsx
│   ├── NutriMascot.tsx
│   ├── StatCard.tsx
│   └── WaterTracker.tsx
├── context/
│   └── AuthContext.tsx            # Estado global de autenticação
└── utils/
    └── storage.ts                 # Helpers de persistência (AsyncStorage)

constants/                         # Fora de src/
├── Colors.ts                      # Paleta de cores (dark theme)
├── Typography.ts                  # Estilos tipográficos
└── GameData.ts                    # Tabelas de dados (exercícios, refeições)
```

### Padrão de Navegação

```
Stack (root _layout.tsx)
├── index (Splash) ─── fade
├── (auth)/signup ──── slide_from_bottom
├── (auth)/onboarding ── slide_from_right
└── (panel) ─── fade, sem gesto de voltar
    └── BottomTabs (_layout.tsx)
        ├── home
        ├── agua
        ├── alimentacao (com sub-rotas edit)
        ├── treino (com sub-rotas edit)
        └── perfil
```

---

## 2. Fluxo de Autenticação

### AuthContext (`src/context/AuthContext.tsx`)

Gerencia todo o ciclo de vida do usuário via `AsyncStorage`.

#### Tipo `Usuario`

| Campo              | Tipo     | Descrição                         |
|--------------------|----------|-----------------------------------|
| `id`               | string   | `Date.now().toString()`           |
| `nome`             | string   | Nome completo                     |
| `email`            | string   | Email (normalizado lowercase)     |
| `senhaHash`        | string   | SHA-256 da senha                  |
| `peso`             | number   | Peso em kg                        |
| `altura`           | number   | Altura em cm                      |
| `idade`            | number   | Idade (não calculada, esperada)   |
| `sexo`             | string   | masculino/feminino/outro          |
| `objetivo`         | string   | perder_peso/ganhar_massa/manter   |
| `nivelAtividade`   | string   | sedentario/moderado/ativo         |
| `totalXP`          | number   | XP acumulado (gamificação)        |
| `streak`           | number   | Dias consecutivos                 |
| `onboardingCompleto` | boolean | Se completou o onboarding       |
| `dataCriacao`      | string   | ISO date                          |

#### Funções Expostas

| Função                | Assinatura                                      | O que faz                                      |
|-----------------------|-------------------------------------------------|------------------------------------------------|
| `login`               | `(email, senha) → Promise<boolean>`             | Busca usuário, compara hash SHA-256            |
| `register`            | `(email, senha, nome) → Promise<boolean>`       | Cria novo usuário, verifica duplicatas         |
| `logout`              | `() → Promise<void>`                            | Limpa sessão do AsyncStorage                   |
| `updateUser`          | `(dados: Partial<Usuario>) → Promise<void>`     | Atualiza campos do usuário                     |
| `completeOnboarding`  | `(dados: Partial<Usuario>) → Promise<void>`     | `updateUser` + seta `onboardingCompleto: true` |
| `addXP`               | `(quantidade: number) → Promise<void>`          | Incrementa XP total                            |

#### Chaves de Storage

- `@nutricode_usuarios` → Array de todos os `Usuario`
- `@nutricode_usuario_logado` → Email do usuário com sessão ativa

#### Fluxo de Restauração de Sessão

```
App abre → restaurarSessao()
  → Lê email de @nutricode_usuario_logado
  → Busca usuário correspondente em @nutricode_usuarios
  → Se encontrou → setUser(usuario)
  → Se não → user permanece null
```

---

## 3. Telas

### 3.1 Splash (`src/app/index.tsx`)

- Exibe `NutriMascot` (estado "alegre", 120px) + título + subtítulo
- Aguarda **ambas as condições**: carregamento do auth (`isLoading`) e tempo mínimo de 2s
- Redirecionamento:
  - Logado + onboarding completo → `/(panel)/home/page`
  - Logado + onboarding incompleto → `/(auth)/onboarding/page`
  - Não logado → `/(auth)/signup/page`

### 3.2 Signup (`src/app/(auth)/signup/page.tsx`)

- Formulário: Nome, Email, Senha, Confirmar Senha
- **Validações**: nome ≥ 3 chars, email regex, senha ≥ 8 chars + pelo menos 1 número, senhas iguais
- Senhas com toggle de visibilidade (ícone olho)
- Indicador de progresso: "Etapa 1 de 3"
- Sucesso → redireciona para onboarding após 1s
- Link "Já possui uma conta? Entrar" → `router.back()`

### 3.3 Onboarding (`src/app/(auth)/onboarding/page.tsx`)

3 etapas com step indicator animado e balão de fala do mascote:

| Etapa | Campos                          | Mascote diz                        |
|-------|----------------------------------|------------------------------------|
| 1     | Peso, Altura, Nascimento, Gênero | "Me conta um pouco sobre você! 🏋️" |
| 2     | Objetivo (3 opções em cards)     | "Qual é o seu objetivo? 🎯"        |
| 3     | Nível de Atividade (3 opções)    | "Qual seu nível de atividade? ⚡"   |

- Botão "Voltar" visível a partir da etapa 2
- Na etapa 3, botão diz "Começar! 🚀" e chama `handleConfirm()`

### 3.4 Home/Dashboard (`src/app/(panel)/home/page.tsx`)

Tela principal com scroll vertical contendo:

1. **Header**: saudação com nome + avatar com inicial
2. **DailyProgress**: barra de progresso do dia (4 métricas fixas)
3. **Seção "Resumo de Hoje"**: 3 `StatCard`s (Calorias, Água, Treino)
4. **Seção "Macros"**: 3 `MacroCard`s (Proteínas, Carboidratos, Gorduras)
5. **Seção "Refeições de Hoje"**: 3 `MealCard`s (Café, Almoço, Jantar)

> Todos os dados são hardcoded em estado local — não há persistência.

### 3.5 Água (`src/app/(panel)/agua/page.tsx`)

- Meta diária calculada: `peso × 35 mL` (arredondado)
- Exibe progresso circular (anel SVG) com porcentagem
- **Botões rápidos**: +100mL, +200mL, +350mL, +500mL
- Botão "Resetar" para zerar o consumo
- Card de progresso com barras por hora
- Componente `WaterTracker` reutilizado aqui
- Dados persistidos via `storage.ts` (por data: `@nutricode_agua_YYYY-MM-DD`)

### 3.6 Alimentação (`src/app/(panel)/alimentacao/page.tsx`)

- Lista as refeições do dia agrupadas por tipo (Café, Almoço, Jantar, Lanche)
- Cada refeição mostra: emoji + nome + calorias + macros
- Resumo com totais de calorias e macros no topo
- Botão flutuante (+) → navega para `edit`
- Dados persistidos via `storage.ts` (por data: `@nutricode_refeicoes_YYYY-MM-DD`)

### 3.7 Alimentação/Edit (`src/app/(panel)/alimentacao/edit.tsx`)

- Formulário para adicionar refeição
- **Tipo**: seleção entre Café da Manhã, Almoço, Jantar, Lanche (botões pill)
- **Alimento**: lista filtrada de `GameData.ALIMENTOS` com barra de busca
- **Quantidade**: input numérico (gramas), padrão 100g
- Macros calculados proporcionalmente à quantidade
- Salva via `storage.ts` e volta para a lista

### 3.8 Treino (`src/app/(panel)/treino/page.tsx`)

- Lista os treinos do dia com cards coloridos
- Cada treino mostra: emoji + nome + duração + calorias queimadas
- Resumo: total de minutos e calorias do dia
- Botão flutuante (+) → navega para `edit`
- Dados persistidos via `storage.ts` (por data: `@nutricode_treinos_YYYY-MM-DD`)

### 3.9 Treino/Edit (`src/app/(panel)/treino/edit.tsx`)

- Formulário para registrar treino
- **Exercício**: lista filtrada de `GameData.EXERCICIOS` com busca
- **Duração**: input numérico (minutos)
- Calorias calculadas: `caloriasPorMinuto × duração`
- Salva via `storage.ts` e volta para a lista

### 3.10 Perfil (`src/app/(panel)/perfil/page.tsx`)

- Avatar com inicial do nome + badge de nível
- **Sistema de nível**: XP → nível (thresholds: 0, 100, 300, 600, 1000, 1500, 2100)
- Barra de progresso de XP para próximo nível
- Cards informativos: peso, altura, idade, objetivo, nível de atividade
- **TMB** (Taxa Metabólica Basal): calculada pela fórmula de Harris-Benedict
- Botão de logout

---

## 4. Componentes Reutilizáveis

### `NutriMascot` (`src/components/NutriMascot.tsx`)

| Prop    | Tipo                                            | Default   |
|---------|------------------------------------------------|-----------|
| `state` | `'alegre' \| 'triste' \| 'motivado' \| 'dormindo'` | `'alegre'` |
| `size`  | `number`                                        | `80`      |

Renderiza um emoji dentro de um container circular com fundo gradiente.

- `alegre` → 😊, `triste` → 😢, `motivado` → 💪, `dormindo` → 😴

### `DailyProgress` (`src/components/DailyProgress.tsx`)

| Prop       | Tipo    | Descrição                  |
|------------|---------|----------------------------|
| `progress` | `number`| 0-1, progresso do dia      |
| `label`    | `string`| Texto abaixo da barra      |

Barra de progresso horizontal com cor baseada no avanço:
- `< 0.3` → vermelho, `< 0.7` → amarelo, `≥ 0.7` → verde

### `StatCard` (`src/components/StatCard.tsx`)

| Prop    | Tipo     |
|---------|----------|
| `icon`  | `string` |
| `label` | `string` |
| `value` | `string` |
| `color` | `string` |

Card com ícone Ionicons, label e valor. Fundo com opacidade da cor.

### `MacroCard` (`src/components/MacroCard.tsx`)

| Prop      | Tipo     |
|-----------|----------|
| `label`   | `string` |
| `current` | `number` |
| `goal`    | `number` |
| `color`   | `string` |
| `unit`    | `string` |

Card de macro com barra de progresso, mostrando `current/goal` + unidade.

### `MealCard` (`src/components/MealCard.tsx`)

| Prop       | Tipo     |
|------------|----------|
| `emoji`    | `string` |
| `name`     | `string` |
| `calories` | `number` |
| `time`     | `string` |

Card de refeição com emoji, nome, calorias, e horário.

### `WaterTracker` (`src/components/WaterTracker.tsx`)

| Prop      | Tipo     |
|-----------|----------|
| `current` | `number` |
| `goal`    | `number` |

Anel de progresso SVG estilizado mostrando consumo de água vs. meta.

---

## 5. Constantes

### `Colors.ts` — Paleta Dark Theme

| Token               | Hex       | Uso                              |
|----------------------|-----------|----------------------------------|
| `backgroundPrimary`  | `#0D0D0D` | Fundo principal                  |
| `backgroundSecondary`| `#1A1A1A` | Fundo de seções                  |
| `surfaceCards`       | `#1E1E1E` | Cards e inputs                   |
| `surfaceCardsLight`  | `#2A2A2A` | Bordas e separadores             |
| `brandAccent`        | `#4ADE80` | Verde accent (botões, destaques) |
| `brandAccentSoft`    | `#22C55E` | Verde secundário                 |
| `textPrimary`        | `#F5F5F5` | Texto principal                  |
| `textSecondary`      | `#A3A3A3` | Texto secundário                 |
| `textMuted`          | `#525252` | Placeholders                     |
| `textOnAccent`       | `#0D0D0D` | Texto sobre accent               |
| `statusSuccess`      | `#22C55E` | Sucesso                          |
| `statusError`        | `#EF4444` | Erro                             |
| `statusWarning`      | `#F59E0B` | Alerta                           |
| `statusInfo`         | `#3B82F6` | Informação                       |
| `categoryProtein`    | `#60A5FA` | Cor de proteínas                 |
| `categoryCarbs`      | `#FBBF24` | Cor de carboidratos              |
| `categoryFat`        | `#F87171` | Cor de gorduras                  |
| `categoryWater`      | `#38BDF8` | Cor de água                      |

### `Typography.ts` — Estilos de Texto

| Estilo        | Tamanho | Peso   | Uso                    |
|---------------|---------|--------|------------------------|
| `h1`          | 28px    | bold   | Títulos de tela        |
| `h2`          | 22px    | bold   | Subtítulos             |
| `h3`          | 18px    | 600    | Títulos de seção       |
| `body`        | 15px    | normal | Texto corrido          |
| `bodyBold`    | 15px    | 600    | Texto enfatizado       |
| `caption`     | 13px    | normal | Labels, descrições     |
| `captionBold` | 13px    | 600    | Labels em destaque     |
| `button`      | 16px    | bold   | Texto de botões        |
| `small`       | 11px    | normal | Texto auxiliar pequeno |

### `GameData.ts` — Dados de Exercícios e Alimentos

#### `EXERCICIOS` (20 itens)

Cada exercício tem: `id`, `nome`, `emoji`, `caloriasPorMinuto`, `categoria`.

| Categorias disponíveis |
|------------------------|
| Cardio, Musculação, Flexibilidade, Esportes |

#### `ALIMENTOS` (20 itens)

Cada alimento tem: `id`, `nome`, `emoji`, `caloriasPor100g`, `proteinasPor100g`, `carbsPor100g`, `gordurasPor100g`, `categoria`.

| Categorias disponíveis |
|------------------------|
| Proteínas, Grãos, Frutas, Laticínios, Vegetais |

---

## 6. Utilitários

### `storage.ts` (`src/utils/storage.ts`)

Wrapper sobre `AsyncStorage` com operações tipadas genéricas.

| Função          | Assinatura                                           | Descrição                          |
|-----------------|------------------------------------------------------|------------------------------------|
| `salvarDados`   | `<T>(chave: string, dados: T) → Promise<void>`      | Serializa e salva JSON             |
| `carregarDados` | `<T>(chave: string) → Promise<T \| null>`            | Carrega e desserializa             |
| `removerDados`  | `(chave: string) → Promise<void>`                    | Remove uma chave                   |
| `obterHoje`     | `() → string`                                        | Retorna data no formato `YYYY-MM-DD` |

#### Padrão de Chaves por Data

As telas usam chaves compostas com a data do dia:
- Água: `@nutricode_agua_2026-03-24`
- Refeições: `@nutricode_refeicoes_2026-03-24`
- Treinos: `@nutricode_treinos_2026-03-24`

---

## 7. Bugs Conhecidos

| #  | Bug                                        | Local                           | Severidade |
|----|--------------------------------------------|---------------------------------|------------|
| 1  | Onboarding nunca seta `onboardingCompleto` | `onboarding/page.tsx` L50-64   | **Alta**   |
| 2  | Sem tela de login (só signup)              | Não existe                      | **Alta**   |
| 3  | Campos `nascimento`/`genero` incompatíveis com tipo `Usuario` que espera `idade`/`sexo` | `onboarding/page.tsx` L53-59 | **Média** |
| 4  | Home usa dados hardcoded, não reflete dados reais de refeição/treino/água | `home/page.tsx` | **Média** |

---

## 8. Dependências Principais

| Pacote                          | Versão    | Uso                              |
|---------------------------------|-----------|----------------------------------|
| `expo`                          | 54.0.22   | Framework base                   |
| `expo-router`                   | 6.0.14    | Roteamento file-based            |
| `expo-crypto`                   | 15.0.8    | Hash SHA-256 de senhas           |
| `react-native-reanimated`       | 4.1.1     | Animações                        |
| `react-native-safe-area-context`| 5.6.0     | SafeAreaView                     |
| `react-native-screens`          | 4.16.0    | Otimização de navegação nativa   |
| `@react-native-async-storage`   | 2.2.0     | Persistência local               |
| `@expo/vector-icons`            | 15.0.3    | Ícones (Ionicons)                |
| `@react-navigation/native`     | 7.1.8     | Base de navegação                |
