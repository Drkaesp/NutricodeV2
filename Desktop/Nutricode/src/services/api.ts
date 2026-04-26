const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://nutricode-api.onrender.com';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper para pegar o JWT Token persistido.
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
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
  
  // User Info & Progression
  getUserMe: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/me`, { headers });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Sessão expirada');
      }
      throw new Error('Falha ao obter dados do usuário');
    }
    return response.json();
  },

  getUserInfo: async (userId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/info`, { headers });
    if (!response.ok) {
        if(response.status === 404) return null; // Not found info
        throw new Error('Falha ao obter info física');
    }
    return response.json();
  },

  updateUserInfo: async (userId: string, data: any) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/info`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Falha ao atualizar info física: ${response.status} - ${errText}`);
    }
    return response.json();
  },

  getUserProgression: async (userId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/progression`, { headers });
    if (!response.ok) {
      if(response.status === 404) return null;
      throw new Error('Falha ao obter progressão');
    }
    return response.json();
  },

  // Logs
  logWeight: async (userId: string, weight: number, date: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/weight-logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ weight, date }),
    });
    if (!response.ok) throw new Error('Falha ao registrar peso');
    return response.json();
  },

  logWater: async (userId: string, milliliters: number, date: string, isCompleted: boolean) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/water-logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ milliliters, date, isCompleted }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Falha ao registrar água: ${response.status} - ${text}`);
    }
    return response.json();
  },

  logWorkout: async (userId: string, durationMinutes: number, date: string, isCompleted: boolean) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/workout-performed`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ date, isFinished: isCompleted }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Falha ao registrar treino: ${response.status} - ${text}`);
    }
    return response.json();
  },

  logDiet: async (userId: string, calories: number, date: string, isCompleted: boolean) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/${userId}/diet-performed`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ date, isFinished: isCompleted }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Falha ao registrar dieta: ${response.status} - ${text}`);
    }
    return response.json();
  }
};
