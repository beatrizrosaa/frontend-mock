// src/services/apiService.js

// 1. Pega a URL da API do arquivo .env
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Função principal para "empacotar" o fetch
 * @param {string} endpoint - O endpoint da API (ex: '/contacts')
 * @param {RequestInit} options - As opções do fetch (method, headers, body)
 * @param {Function} logoutCallback - A função de logout do AuthContext (para deslogar em caso de 401)
 * @returns {Promise<any>} - A resposta da API em JSON
 */
const apiFetch = async (endpoint, options = {}, logoutCallback) => {
  // 1. Pega o token do localStorage
  const token = localStorage.getItem('token');

  // 2. Monta os headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever headers se necessário
  };

  // 3. Se o token existir, anexa no header de Autorização
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Garante que o body seja JSON (se for um objeto)
  const config = {
    ...options,
    headers,
  };
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    // 5. Faz a chamada de API
    console.log(`Fazendo requisição para ${API_URL}${endpoint}`, config );
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // 6. CHECAGEM DE TOKEN EXPIRADO (O PONTO CRÍTICO)
    if (response.status === 401 && logoutCallback) {
      toast.error('Sua sessão expirou. Por favor, faça o login novamente.');
      // Chama a função de logout (que vai limpar o localStorage e redirecionar)
      logoutCallback(); 
      throw new Error('Sessão expirada.');
    }

    // Se o endpoint for DELETE e o status for 204 (No Content), não há JSON
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição à API.');
    }

    return data; // Retorna o JSON de sucesso

  } catch (error) {
    console.error(`Erro na chamada API para ${endpoint}:`, error);
    // Re-lança o erro para o componente que chamou (ex: Dashboard) poder tratar
    throw error;
  }
};

export default apiFetch;