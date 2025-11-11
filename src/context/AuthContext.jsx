// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // CORREÇÃO 1: Renomeamos o isLoading para ser mais específico
  const [isCheckingToken, setIsCheckingToken] = useState(true); // Antigo 'isLoading'

  // CORREÇÃO 2: Criamos um loading SÓ para o formulário
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate();

  // EFEITO 1: CHECAGEM INICIAL
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    // CORREÇÃO 3: Usamos o setter correto
    setIsCheckingToken(false);
  }, []);

  // FUNÇÃO DE LOGIN
  const login = async (email, password) => {
    // CORREÇÃO 4: Usamos o setter de "submissão"
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Credenciais inválidas.');
      
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success('Login bem-sucedido!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Não foi possível fazer o login.');
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      // CORREÇÃO 5: Usamos o setter de "submissão"
      setIsSubmitting(false);
    }
  };

  // FUNÇÃO DE CADASTRO
  const register = async (name, email, password) => {
    // CORREÇÃO 6: Usamos o setter de "submissão"
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao se cadastrar.');
      
      toast.success('Cadastro realizado! Agora, faça o login.');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Não foi possível se cadastrar.');
    } finally {
      // CORREÇÃO 7: Usamos o setter de "submissão"
      setIsSubmitting(false);
    }
  };

  // FUNÇÃO DE LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    toast.info('Você foi desconectado. Até logo!');
    navigate('/login');
  };

  // 4. Define o "valor"
  const contextValue = {
    token,
    user,
    setUser,
    // CORREÇÃO 8: Expondo o loading correto para os formulários
    isLoading: isSubmitting, 
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  // 5. Retorna o Provedor
  // CORREÇÃO 9: A renderização agora SÓ depende da checagem inicial.
  return (
    <AuthContext.Provider value={contextValue}>
      {!isCheckingToken && children}
    </AuthContext.Provider>
  );
};

// ... (o resto do arquivo, useAuth e PropTypes, continua igual)

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};