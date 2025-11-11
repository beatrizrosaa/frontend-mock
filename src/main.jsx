// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Importar o Provedor de Rotas
import { BrowserRouter } from 'react-router-dom';

// 2. Importar o Provedor de Autenticação (nosso "Cérebro")
import { AuthProvider } from './context/AuthContext.jsx';

// 3. Importar o Container de Notificações e o CSS dele
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O BrowserRouter DEVE vir por fora do AuthProvider */}
    <BrowserRouter>
      {/* O AuthProvider "envolve" o App */}
      <AuthProvider>
        <App /> {/* O App agora tem acesso às rotas e ao contexto */}
      </AuthProvider>
    </BrowserRouter>

    {/* O ToastContainer fica no topo, pronto para ser chamado */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
);