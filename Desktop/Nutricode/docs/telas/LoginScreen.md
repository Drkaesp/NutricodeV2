# Tela: Login (`src/app/index.tsx`)

## 🧠 O Que Essa Tela Faz?
Esta é a porta de entrada (Ponto Zero) do aplicativo. Além de validar o email e senha do usuário usando a API real, ela serve como uma espécie de "alfândega de dados". Quando o login é feito com sucesso, ela purga dados residuais antigos (limpa a memória local) e decide para qual tela o usuário deve ir: se o perfil dele estiver incompleto (sem peso/altura), ele é jogado no `Onboarding`; se estiver tudo certo, ele vai pro Painel Principal (`Home`).

---

## 🛠️ Dissecando o Código (Para Devs)

Aqui nós temos a função que coordena a orquestração inteira do login. Vamos mergulhar nela como se fosse um fluxo de aeroporto.

### `handleLogin()` - O Despachante Aduaneiro

Esta função lida com o clique do botão "Entrar". Ela bloqueia a interface (loading), fala com o servidor, guarda o crachá de acesso (JWT Token), faz uma limpeza na mala do usuário (Cache) e decide o portão de embarque.

**Analogia:** O usuário entrega o passaporte (email/senha). O despachante confere se os campos estão preenchidos. Se sim, ele liga pra central (API). Se a central validar, o despachante pega um carimbo oficial (Token JWT), joga fora os papéis velhos que o usuário carregava no bolso (Purga do AsyncStorage) e manda ele pra fila certa (Onboarding ou Home).

```typescript
async function handleLogin() {
  // 1. Limpeza de erros anteriores
  setMensagem({ texto: '', tipo: '' });

  // 2. Validação "Early Return"
  if (!email || !senha) {
    setMensagem({ texto: 'Preencha todos os campos.', tipo: 'erro' });
    return; // Para a execução do código aqui mesmo
  }

  setLoading(true); // Gira o spinner do botão
  
  try {
    // 3. Chamada da API Real
    const data = await api.login(email, senha);

    // Se o backend nos devolver um token válido...
    if (data && data.token) {
      
      // 4. Salva o JWT e Popula o Contexto Global
      // A função 'login' vem do AuthContext e salva o token de forma segura
      const loggedUser = await login(data.token);
      
      // 5. PURGA DOS DADOS ANTIGOS (Tratamento de Lixo)
      try {
        // Remove caches de dietas e treinos de versões anteriores para não conflitar com a nova sessão
        await AsyncStorage.multiRemove(['MEAL_PLAN_V1', 'WORKOUT_PLAN_V1']);
      } catch (e) {
        console.warn('Erro ao limpar cache antigo:', e); // Apenas avisa, não trava o app
      }
      
      setMensagem({ texto: 'Login realizado com sucesso!', tipo: 'sucesso' });
      
      // 6. Roteamento Inteligente (Atraso de 800ms para o usuário ler o "sucesso")
      setTimeout(() => {
        // Se faltar algum dado vital de biometria, manda pro Onboarding!
        if (!loggedUser?.altura || !loggedUser?.peso || !loggedUser?.idade) {
          router.replace('/(auth)/onboarding/page' as any);
        } else {
          // Senão, joga direto pro aplicativo
          router.replace('/(panel)/home/page' as any);
        }
      }, 800);
      
    } else {
      setMensagem({ texto: 'Resposta inválida do servidor.', tipo: 'erro' });
    }
    
  } catch (err: any) {
    // Captura erros da API (ex: 401 Unauthorized ou erro de rede)
    setMensagem({ texto: err.message || 'Erro ao tentar logar. Tente novamente.', tipo: 'erro' });
  }
  
  setLoading(false); // Desliga o spinner
}
```

**Por que fazemos o roteamento inteligente (`router.replace`)?**
Usamos `router.replace` ao invés de `router.push`. Em TypeScript/Expo Router, dar um `replace` **destrói** o histórico de navegação anterior. Assim, se o usuário logar e depois apertar a "setinha de voltar" do celular, ele **não consegue** voltar para a tela de Login sem querer. Ele fechou a porta de entrada atrás de si.
