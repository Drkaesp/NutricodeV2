# 🌿 Nutricode V2

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

O **Nutricode V2** é um ecossistema digital de alta performance projetado para otimizar a biologia humana. Através de um controle rigoroso de nutrição, hidratação e treinamento, o app utiliza mecânicas de gamificação para transformar hábitos saudáveis em uma jornada de evolução constante.

---

## 🚀 A Ideia
O projeto nasceu da necessidade de uma ferramenta que não apenas registre dados, mas que motive o usuário através de feedback visual e progressão de personagem (XP, Níveis e Streaks). O Nutricode foca no tripé da saúde: **Hidratação, Alimentação e Movimento**.

## 🛠️ Tecnologias & Linguagens
O projeto é construído com o que há de mais moderno no ecossistema Mobile:

- **Linguagem Principal:** [TypeScript](https://www.typescriptlang.org/) (98%+)
- **Framework:** [React Native](https://reactnative.dev/) com [Expo SDK 54](https://expo.dev/)
- **Navegação:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Animações:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) para interações fluidas
- **Persistência:** [Async Storage](https://react-native-async-storage.github.io/async-storage/) para cache e dados locais
- **Estilização:** CSS-in-JS com foco em performance e Design System customizado

---

## 🧬 Funcionalidades Principais

| Módulo | Descrição |
| :--- | :--- |
| **💧 Hidratação** | Controle de ingestão de água com metas dinâmicas e visualização de progresso. |
| **🥗 Alimentação** | Matriz alimentar completa para planejamento e registro de refeições diárias. |
| **🏋️ Treinamento** | Biblioteca de exercícios e rotinas semanais para acompanhamento de performance. |
| **🎮 Gamificação** | Sistema de XP, Nível e Mascotes que evoluem conforme você atinge suas metas. |

---

## 📦 Passo a Passo de Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento local:

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (v18 ou superior)
- **npm** ou **yarn**
- **Expo Go** (no celular) ou um emulador de Android/iOS

### 2. Clonar o Repositório
```bash
git clone https://github.com/Drkaesp/NutricodeV2.git
cd NutricodeV2
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Configurar Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
```bash
cp .env.example .env
```

### 5. Iniciar o Projeto
```bash
npm start
```
Agora, basta escanear o QR Code com o app **Expo Go** ou pressionar:
- `a` para abrir no Android
- `i` para abrir no iOS
- `w` para abrir no navegador (Web)

---

## 📂 Estrutura de Pastas
```text
src/
 ├── app/         # Rotas e Páginas (Expo Router)
 ├── components/  # Componentes reutilizáveis
 ├── constants/   # Design System e Dados Estáticos
 ├── services/    # Integração com APIs
 └── utils/       # Helpers e Storage
```

---

## 👨‍💻 Contribuição
1. Faça um **Fork** do projeto
2. Crie uma **Branch** para sua feature (`git checkout -b feature/nova-feature`)
3. Faça o **Commit** (`git commit -m 'Adicionando nova feature'`)
4. Faça o **Push** (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

---

Desenvolvido com ❤️ por [Drkaesp](https://github.com/Drkaesp)
