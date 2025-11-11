// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


// 1. Importar o Provedor de Rotas
import { BrowserRouter } from 'react-router-dom';

// 2. Importar o Provedor de Autenticação
import { AuthProvider } from './context/AuthContext.jsx';

// 3. Importar o Container de Notificações
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- LÓGICA DO MSW ---

// 4. Função assíncrona para iniciar o MSW
async function enableMocking() {
  // Verifica se estamos em "desenvolvimento"
  if (import.meta.env.DEV) {
    // Importa o worker (agora .js)
    const { worker } = await import('./mocks/browser.js');
    
    // Inicia o worker
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

// 5. Chama a função de mocking
// O '.then()' garante que o React SÓ renderize DEPOIS
// que o worker do MSW estiver pronto.
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      
      {/* O BrowserRouter DEVE vir por fora do AuthProvider */}
      <BrowserRouter>
        {/* O AuthProvider "envolve" o App */}
        <AuthProvider>
          <App /> {/* O App agora tem acesso às rotas e ao contexto */}
        </AuthProvider>
      </BrowserRouter>

      {/* O ToastContainer fica no topo */}
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
});