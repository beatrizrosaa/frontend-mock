// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. Pega a função de login do "Cérebro" (AuthContext)
  const { login, isLoading } = useAuth();
  
  // 2. Cria "estados" para guardar o email e a senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // 3. Função que será chamada quando o formulário for enviado
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o "recarregamento" da página
    
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    // Chama a função de login do AuthContext
    await login(email, password); 
    // O AuthContext vai lidar com o sucesso (redirecionar) ou erro (toast)
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Acessar sua Conta</h2>
        
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            style={styles.input}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading} 
          style={isLoading ? styles.buttonDisabled : styles.button}
        >
          
          {isLoading ? <div style={styles.spinner}></div> : 'Entrar'}
        </button>

        <p style={styles.linkText}>
          Não tem uma conta? 
          <Link to="/register" style={styles.link}> Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};

// CSS Básico (in-line) para não precisarmos de um arquivo .css
// Sinta-se à vontade para estilizar como quiser depois!
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  form: {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    width: '350px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box', // Garante que o padding não quebre o layout
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  buttonDisabled: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#aaa',
    color: 'white',
    fontSize: '1rem',
  },
  linkText: {
    marginTop: '1rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
    // Para centrar o spinner no botão (opcional)
    margin: '-2px 0', 
  },
};

export default Login;