# Tela: Cadastro (`src/app/(auth)/signup/page.tsx`)

## 🧠 O Que Essa Tela Faz?
A tela de Cadastro coleta os dados vitais de um novo usuário. Mas ela não apenas "cadastra" e libera a porta: por questões de segurança e integridade de dados da aplicação, ela usa regras pesadas (expressões regulares) para garantir que a senha é forte e que o email é válido. O ponto alto da tela é quando ela se comunica com o Backend para registrar o perfil e depois aciona silenciosamente o serviço **EmailJS** para enviar, direto pro inbox do usuário, um token de ativação (link mágico).

---

## 🛠️ Dissecando o Código (Para Devs)

Vamos quebrar o motor central desta tela: a função `handleSignup()`. 

### `handleSignup()` - A Forja do Usuário e o Pombo Correio (EmailJS)

Esta função assíncrona é um monstro de validação. Ela primeiro atua como um porteiro extremamente chato, checando cada caractere da senha e o formato do email. Passando pelas regras, ela vai pra API e invoca um serviço externo.

**Analogia:** Você quer entrar em um clube secreto. O segurança da porta verifica se seu nome não é falso, se seu convite (email) parece um convite real, e se sua senha é um cofre forte (tem números, letras maiúsculas). Se tudo bater, ele avisa a central. A central cria sua credencial, mas bloqueia. Então, o segurança chama um pombo correio (EmailJS), pendura a chave de desbloqueio na perna do pombo e manda voar pro seu endereço residencial. Você precisa ir pra casa pegar a chave.

```typescript
async function handleSignup() {
  setMensagem({ texto: '', tipo: '' });

  // 1. A Muralha de Validações "Early Return"
  // Nós fazemos "return" em cada erro. Isso evita criar "if/else" aninhados que deixam o código confuso.
  if (!nome || !email || !senha || !confirmarSenha) { ... return; }
  
  // Usamos Regex (Expressões Regulares) para validação matemática de strings
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMensagem({ texto: 'Digite um email válido.', tipo: 'erro' });
    return;
  }
  
  if (senha.length < 8) { ... return; }
  if (!/\d/.test(senha)) { ... return; } // Checa se tem número \d
  if (!/[A-Z]/.test(senha)) { ... return; } // Checa se tem maiúscula

  setLoading(true);
  try {
    // 2. Registro na API Remota
    // O servidor cria a conta como "Pendente" e nos retorna um confirmationToken
    const data = await api.register(nome, email, senha);

    if (data && data.confirmationToken) {
      // Monta a URL mágica que ativa a conta
      const confirmLink = `https://nutricode-api.onrender.com/auth/confirm?token=${data.confirmationToken}`;

      // 3. Orquestração do Pombo Correio (EmailJS)
      // Montamos a "carta" usando variáveis de ambiente de segurança (process.env)
      const payload = {
        service_id: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
        user_id: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          codigo_confirmacao: confirmLink, 
        }
      };

      try {
        // Disparamos o "Fetch" pro EmailJS por trás dos panos. 
        // Não usamos await na thread principal para não congelar o app por muito tempo.
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Erro ao enviar confirmação pelo EmailJS', e);
      }

      setMensagem({ texto: 'Conta criada! Acesse seu email para confirmar antes de Logar.', tipo: 'sucesso' });
      // Joga o cara de volta pra tela de Login (que está no '/' em index.tsx)
      setTimeout(() => router.replace('/' as never), 2500);
    }
  } catch (err: any) {
    setMensagem({ texto: err.message || 'Erro ao criar conta.', tipo: 'erro' });
  }
  setLoading(false);
}
```

**Insights TypeScript:**
Notou como usamos o Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`? Essa é a forma mais barata em processamento de verificar se uma string contém "qualquer coisa, uma @, mais qualquer coisa, um ponto, e mais qualquer coisa". Também as validações `/\d/` e `/[A-Z]/` garantem que o banco de dados do Backend nunca receberá senhas fracas que podem gerar problemas de segurança ou quebras no servidor. É o Front-end blindando o Back-end!
