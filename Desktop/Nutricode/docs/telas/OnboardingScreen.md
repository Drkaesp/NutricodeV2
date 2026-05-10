# Tela: Onboarding (`src/app/(auth)/onboarding/page.tsx`)

## 🧠 O Que Essa Tela Faz?
O Onboarding é a entrevista inicial do aplicativo. É uma tela de passo a passo (wizard de formulário em múltiplos "steps"). O app não permite o uso do Nutricode sem que o usuário passe seu peso, altura, gênero, objetivo de treino e nível de atividade, pois os algoritmos de meta de água, cálculo de calorias e macros dependem estritamente desses dados fisiológicos. O desafio dessa tela é fazer uma interface de etapas de forma fluida sem renderizar múltiplas rotas (telas reais).

---

## 🛠️ Dissecando o Código (Para Devs)

Aqui o mais importante a entender é como navegamos entre as etapas e como, no final, nós traduzimos os dados visuais do celular para o formato exigido pelo banco de dados no servidor na função `handleConfirm()`.

### `handleConfirm()` - O Tradutor Universal e o Salto Final

Quando o usuário chega no passo 3 e clica em "Começar! 🚀", essa função é ativada. O trabalho dela não é só enviar dados, é *traduzir* e formatar os valores que o usuário digitou no celular (ex: 20/05/1990 e "masculino") para o formato engessado que o banco de dados SQL do backend exige (ex: "1990-05-20" e "MALE").

**Analogia:** Imagine que o celular fala "Português Brasileiro" e o Servidor fala "Robótico Americano". A função `handleConfirm` é o intérprete no meio da mesa de negociações. Ela pega a data bagunçada e a palavra "masculino", converte para o padrão aceitável do robô, envia para ele, avisa a memória local (AuthContext) que os dados mudaram, e então abre a porta para o salão principal (A Home).

```typescript
const handleConfirm = async () => {
  // 1. Prevenção Rápida
  if (!nivelAtividade || !user) return; 

  try {
    // 2. O TRADUTOR DE DATAS (O String Manipulation)
    let birthDate = undefined;
    // Checa se a string no Input de "Nascimento" tem exatos 10 caracteres (ex: 01/01/2000)
    if (nascimento && nascimento.length === 10) {
      // Pica a string usando a barra como faca. parts[0] = dia, parts[1] = mes, parts[2] = ano
      const parts = nascimento.split('/'); 
      // Remonta no formato ISO que bancos de dados SQL exigem: AAAA-MM-DD
      birthDate = `${parts[2]}-${parts[1]}-${parts[0]}`; 
    }

    // 3. O TRADUTOR DE ENUMS
    // O backend tem um ENUM rigoroso no banco que aceita apenas 'MALE' ou 'FEMALE'.
    const sex = genero === 'masculino' ? 'MALE' : genero === 'feminino' ? 'FEMALE' : 'MALE'; 

    // 4. Salva de Vez na API
    // Usamos await para segurar a tela de carregamento até o servidor dizer "Ok, salvo."
    await api.updateUserInfo(user.id, {
      height: parseInt(altura), // Transforma o texto '180' num numero matemático inteiro 180
      birthDate,
      sex
    });

    // 5. Injeta o Peso no Histórico de Saúde
    const today = new Date().toISOString().split('T')[0];
    await api.logWeight(user.id, parseFloat(peso), today);

    // 6. Sincroniza o Cérebro Local (Context API do React)
    await updateUser({
      peso: parseFloat(peso),
      altura: parseInt(altura),
      nascimento,
      genero: genero as any,
      objetivo: objetivo as any,
      nivelAtividade: nivelAtividade as any,
    });

    // 7. Teleporte (Destruindo a navegação do onboarding)
    router.replace('/(panel)/home/page' as any);
  } catch (e) {
    console.error('Erro no onboarding:', e);
  }
};
```

**Por que a Máscara da Data de Nascimento?**
No próprio JSX do `TextInput` da data, existe um bloco `onChangeText={(t) => {...}}` que usa Regex (`t.replace(/\D/g, '')`) para destruir instantaneamente qualquer caractere que não seja número (ex: letras) enquanto a pessoa digita, e automaticamente injeta uma `/` depois do dia e do mês. Essa é uma máscara local. Mas pro servidor, como vimos no código acima, usamos o `.split('/')` pra reverter isso e enviar limpo! É a essência do desenvolvimento Front-End!
