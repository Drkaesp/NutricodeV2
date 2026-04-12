# 🌿 Nutricode AppV2

O **Nutricode** é um ecossistema digital inteligente voltado para a otimização da performance biológica através do controle nutricional, hidratação e treinamento físico, utilizando elementos de gamificação (XP, Níveis, Streaks) para impulsionar o engajamento do usuário.

## 🚀 Como Começar

### Pré-requisitos
- **Node.js**: v18 ou superior.
- **npm** ou **yarn**.
- **Expo Go**: Instalado no seu dispositivo móvel (ou um emulador configurado).

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Drkaesp/NutricodeV2.git
cd NutricodeV2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Clone o arquivo `.env.example` para `.env` e ajuste conforme necessário.
```bash
cp .env.example .env
```

### Execução

Para iniciar o servidor de desenvolvimento do Expo:

```bash
npm start
```

- Pressione **`a`** para Android.
- Pressione **`i`** para iOS.
- Pressione **`w`** para Web.

---

## 📂 Estrutura do Projeto

- `src/app/`: Roteamento baseado em arquivos (Expo Router).
  - `(auth)`: Fluxo de autenticação (Login/Cadastro).
  - `(panel)`: Dashboard principal e módulos (Água, Alimentação, Treino).
- `src/components/`: Componentes visuais e lógicos reutilizáveis.
- `src/services/`: Camada de comunicação com a API externa.
- `src/utils/`: Utilitários, storage local e helpers.
- `constants/`: Design System (Cores, Tipografia) e dados estáticos do jogo.
- `assets/`: Imagens, fontes e mascotes.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** & **Expo** (Core Framework).
- **Expo Router** (Navegação).
- **AsyncStorage** (Persistência Local).
- **React Native Reanimated** (Animações Fluídas).
- **TypeScript** (Segurança de Tipagem).

---

## 🧬 Funcionalidades Principais

- **Fluxo Hidrológico**: Rastreio de ingestão de água com representação visual procedimental.
- **Matriz Alimentar**: Planejamento e conclusão de refeições diárias.
- **Biblioteca de Treino**: Catálogo de exercícios e rotinas semanais.
- **Gamificação**: Sistema de evolução baseado em XP para cada ação saudável realizada.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
