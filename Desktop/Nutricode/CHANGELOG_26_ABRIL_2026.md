# Relatório de Modificações - Nutricode V2 (26 de Abril de 2026)

Este documento centraliza todas as alterações, integrações e correções de bugs aplicadas no projeto **Nutricode** durante as sessões de hoje, visando tornar o software 100% integrado, funcional e pronto para uso em produção.

---

## 1. Integração Definitiva com a API V2 (Spring Security)
- **Remoção de Mocks:** Transição do armazenamento local assíncrono para consumo de backend real.
- **Segurança de Endpoints:** Refatoração do arquivo `src/services/api.ts`. Todos os endpoints de log e info (Água, Dieta, Treino, Status Físico) foram ajustados de `/users/{userId}/...` para `/users/me/...`. Esta modificação resolveu os bloqueios `403 Forbidden` impostos pela proteção de *Roles* para usuários não-admins.
- **Tratamento de Erros:** Implementação de logs e captura de falhas de requisição para debugar inconsistências no payload de forma direta no console.

## 2. Autenticação e Sessão Global (`AuthContext`)
- **Validação de Onboarding:** Modificação na lógica da tela inicial (`src/app/index.tsx`). Ao logar, o sistema agora verifica se as métricas essenciais (peso, altura, idade) existem. Caso não existam, o usuário é compulsoriamente redirecionado ao fluxo de preenchimento inicial (Onboarding).
- **Enriquecimento de Contexto:** A função de login foi alterada para puxar imediatamente o perfil `/users/me/info` e a progressão do usuário, injetando na sessão logo na entrada.
- **Auto-Logout de Segurança:** Implementada desconexão automática do sistema caso o servidor retorne token expirado durante o uso.

## 3. Sistema de Gamificação (XP, Patente e Streaks)
- **Atualização em Tempo Real:** O retorno de métricas das chamadas de API (como ganho de XP e streaks ao bater as metas de alimentação, hidratação e treinos) foi devidamente mapeado no Frontend para atualizar instantaneamente a barra de nível do usuário.

## 4. Correções de Lógica e Experiência do Usuário (UX)
- **Navegação Cíclica da Dieta:** Corrigido o bug relatado onde o retorno da página de inserção de alimentos (`src/app/(panel)/alimentacao/edit.tsx`) estava descarregando a "stack" de navegação e voltando para o Início (`index.tsx`). O botão "Voltar" agora usa um redirecionamento âncora `router.replace('/(panel)/alimentacao/page')` assegurando permanência na área de dietas.
- **Funcionalidade de Imagem de Perfil:**
  - Instalação da biblioteca nativa `expo-image-picker`.
  - Inserção de campo `avatar: string` na interface global de `User`.
  - Refatoração total da tela `src/app/(panel)/perfil/page.tsx` para solicitar permissão nativa, abrir a galeria, converter a foto selecionada em formato `Base64` e injetar a foto substituindo o Mascote na interface.

## 5. Proteção de Credenciais
- **Isolamento de Segredos:** Refatoração de segurança removendo as credenciais de serviços (como `EmailJS`) espalhadas no código em hardcode para alocação centralizada no arquivo de ambiente `.env`.

---
**Status Final:** O sistema encontra-se validado na camada de testes de frontend (Q.A) e devidamente conectado à malha da API Backend, livre de vazamentos de rotas, loops de tela não-intencionais e falhas de CORS/Acesso aos logs diários.
