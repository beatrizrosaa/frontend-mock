// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Se estiver checando o token no localStorage, mostre um "Carregando"
  if (isLoading) {
    return <div>Carregando sua sessão...</div>;
  }

  // 2. Se NÃO estiver autenticado, redirecione para o login
  if (!isAuthenticated) {
    // O 'replace' impede o usuário de "voltar" para a página protegida
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado, mostre a página que ele tentou acessar
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;