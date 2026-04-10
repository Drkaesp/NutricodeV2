const API_BASE_URL = 'https://nutricode-api.onrender.com';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper para pegar o JWT Token persistido.
 */
export const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('@nutricode_jwt');
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  return { 'Content-Type': 'application/json' };
};

export const api = {
  login: async (email: string, senhaHash: string) => {
    // A API Java tipicamente espera password em plain text ou gerencia o hash lá mesmo?
    // Na duvida usaremos o valor entregue pelo form (que passava pelo hash local antes)
    // Alteraremos o form para passar a senha bruta, ja que o bcrypt usualmente fica no backend.
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senhaHash }),
    });

    if (!response.ok) {
      let errMsg = 'Falha no login';
      try {
          const text = await response.text();
          try {
              const data = JSON.parse(text);
              if (data.message) errMsg = data.message;
              else errMsg = `Erro ${response.status}: ${text}`;
          } catch {
              errMsg = `Erro ${response.status}: Credenciais inválidas ou e-mail não confirmado.`;
          }
      } catch(e) {}
      throw new Error(errMsg);
    }

    return response.json(); // { username, token, refreshToken } ou similar
  },

  register: async (usernameRaw: string, email: string, password: string) => {
    // A API Java bloqueia nomes com espaços com erro 403. Sanitarizando:
    const username = usernameRaw.replace(/\s+/g, '');

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        let errMsg = 'Falha no registro';
        try {
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (data.message) errMsg = data.message;
                else if (typeof data === 'string') errMsg = data;
                else errMsg = `Erro ${response.status}: ${text}`;
            } catch {
                if (response.status === 403) {
                    errMsg = 'A senha fornecida é muito fraca ou o acesso foi negado pelo servidor.';
                } else if (response.status === 400) {
                    errMsg = 'E-mail já está em uso ou os dados são inválidos!';
                } else {
                    errMsg = `Erro ${response.status}: O servidor não respondeu com detalhes claros.`;
                }
            }
        } catch(e) {}
        throw new Error(errMsg);
    }

    try {
        const data = await response.json();
        return data;
    } catch(e) {
        return null;
    }
  },
  
  // Future protected requests can use this helper:
  // get: async (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`, { headers: await getAuthHeaders() })
};
