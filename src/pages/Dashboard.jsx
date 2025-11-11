// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiFetch from '../services/apiService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  // 1. Pega 'logout' e 'token' do nosso "Cérebro"
  const { logout, token } = useAuth();

  // 2. Estados para o CRUD
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Estados para o formulário (criar/editar)
  const [currentContact, setCurrentContact] = useState(null); // Se != null, estamos editando
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // -----------------------------------------------------------------
  // FUNÇÃO DE BUSCAR CONTATOS (READ)
  // -----------------------------------------------------------------
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usa nosso 'apiFetch' (que já inclui o token)
      // O 'logout' é passado como callback para o caso de token expirado
      const data = await apiFetch('/contacts', { method: 'GET' }, logout);
      setContacts(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      if (error.message !== 'Sessão expirada.') {
        toast.error(error.message || 'Erro ao buscar contatos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Efeito que busca os contatos QUANDO o componente carrega (e o token existe)
  useEffect(() => {
    if (token) {
      fetchContacts();
    }
    // A dependência [token] garante que isso rode assim que o token estiver disponível
  }, [token]); 


  // -----------------------------------------------------------------
  // FUNÇÕES DO FORMULÁRIO
  // -----------------------------------------------------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setCurrentContact(null);
  };

  // -----------------------------------------------------------------
  // FUNÇÃO DE SUBMIT (CREATE / UPDATE)
  // -----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Define o método (POST ou PUT) e o endpoint
    const isEditing = !!currentContact;
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/contacts/${currentContact.id || currentContact._id}` : '/contacts';

    try {
      const result = await apiFetch(endpoint, {
        method: method,
        body: formData,
      }, logout);

      if (isEditing) {
        // Atualiza o contato na lista local
        setContacts(prev => prev.map(c => (c.id === currentContact.id ? result : c)));
        toast.success('Contato atualizado com sucesso!');
      } else {
        // Adiciona o novo contato na lista local
        setContacts(prev => [...prev, result]);
        toast.success('Contato criado com sucesso!');
      }
      resetForm(); // Limpa o formulário

    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      if (error.message !== 'Sessão expirada.') {
        toast.error(error.message || 'Erro ao salvar contato.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // -----------------------------------------------------------------
  // FUNÇÃO DE DELETAR (DELETE)
  // -----------------------------------------------------------------
  const handleDelete = async (contactId) => {
    if (!window.confirm('Tem certeza que deseja deletar este contato?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await apiFetch(`/contacts/${contactId}`, { method: 'DELETE' }, logout);
      
      // Remove o contato da lista local
      setContacts(prev => prev.filter(c => c.id !== contactId));
      toast.info('Contato deletado.');
      
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      if (error.message !== 'Sessão expirada.') {
        toast.error(error.message || 'Erro ao deletar contato.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // FUNÇÃO PARA PREPARAR EDIÇÃO
  // -----------------------------------------------------------------
  const handleEdit = (contact) => {
    setCurrentContact(contact);
    // Preenche o formulário com os dados do contato
    // (no MongoDB é _id, no Postgres é id)
    setFormData({ 
      name: contact.name, 
      email: contact.email || '', 
      phone: contact.phone,
      id: contact.id || contact._id // Guarda o ID
    });
  };


  // -----------------------------------------------------------------
  // RENDERIZAÇÃO DO COMPONENTE (JSX)
  // -----------------------------------------------------------------
  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h2>Meus Contatos</h2>
        <button onClick={logout} style={styles.logoutButton}>
          Sair (Logout)
        </button>
      </header>

      <div style={styles.content}>
        {/* Lado Esquerdo: Formulário */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <h3>{currentContact ? 'Editar Contato' : 'Novo Contato'}</h3>
            <div style={styles.inputGroup}>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nome"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Email (opcional)"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Telefone"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={isLoading} style={styles.button}>
              {isLoading ? 'Salvando...' : (currentContact ? 'Atualizar' : 'Criar')}
            </button>
            {currentContact && (
              <button type="button" onClick={resetForm} style={styles.buttonSecondary}>
                Cancelar Edição
              </button>
            )}
          </form>
        </div>

        {/* Lado Direito: Lista de Contatos */}
        <div style={styles.listContainer}>
          <h3>Lista</h3>
          {isLoading && contacts.length === 0 && <p>Carregando contatos...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          {!isLoading && contacts.length === 0 && <p>Nenhum contato cadastrado.</p>}

          <ul style={styles.contactList}>
            {contacts.map(contact => (
              <li key={contact.id || contact._id} style={styles.contactItem}>
                <div>
                  <strong>{contact.name}</strong>
                  <small>{contact.phone}</small>
                  <small>{contact.email}</small>
                </div>
                <div>
                  <button onClick={() => handleEdit(contact)} style={styles.editButton}>Editar</button>
                  <button onClick={() => handleDelete(contact.id || contact._id)} style={styles.deleteButton}>X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Estilos (Sinta-se à vontade para mover para um CSS) ---
const styles = {
  dashboard: { width: '100%', maxWidth: '1200px', margin: '0 auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #ccc',
  },
  logoutButton: { padding: '0.5rem 1rem', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' },
  content: { display: 'flex', padding: '2rem', gap: '2rem' },
  formContainer: { flex: 1, padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  listContainer: { flex: 2 },
  inputGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', marginBottom: '0.5rem' },
  buttonSecondary: { width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' },
  contactList: { listStyle: 'none', padding: 0 },
  contactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  editButton: { background: '#ffc107', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  deleteButton: { background: '#dc3545', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' },
};

export default Dashboard;