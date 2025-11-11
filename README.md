# 🚀 Gerenciador de Contatos (Frontend)

Este é o frontend do projeto "Gerenciador de Contatos", uma aplicação full-stack construída em React. A aplicação permite que usuários se cadastrem, façam login, e gerenciem uma lista de contatos pessoais de forma segura.

Esta aplicação consome uma **API REST** (construída separadamente em Node.js, Express e Postgres) para todas as operações de dados.

**🔗 Link da Aplicação:** [https://frontend-mini-projeto-dv1k.vercel.app/](https://frontend-mini-projeto-dv1k.vercel.app/)

---

## ✨ Funcionalidades Principais

* **Autenticação de Usuário:** Sistema completo de Cadastro (`/register`) e Login (`/login`) com validação.
* **Gerenciamento de Estado Global:** O estado de autenticação (token, dados do usuário) é gerenciado globalmente usando a **Context API** do React (`AuthContext`).
* **Rotas Protegidas:** O acesso ao Dashboard (`/dashboard`) é protegido. Usuários não autenticados são redirecionados para o login.
* **Operações CRUD:** O dashboard permite ao usuário logado:
    * **C**riar novos contatos.
    * **L**er (visualizar) todos os seus contatos.
    * **A**tualizar (editar) contatos existentes.
    * **E**xcluir (deletar) contatos.
* **Feedback ao Usuário:** Notificações (toasts) para feedback de sucesso ou erro em todas as operações.
* **Loading States:** Indicadores de carregamento (`isLoading`) em formulários para evitar cliques duplos e melhorar a experiência do usuário.

---

## 🛠️ Tecnologias Utilizadas

* **React:** Biblioteca principal para a construção da interface.
* **Vite:** Ferramenta de build e servidor de desenvolvimento local.
* **React Router DOM:** Para gerenciamento de rotas (navegação).
* **Context API:** Para gerenciamento de estado global (autenticação).
* **Fetch API:** Para fazer as chamadas HTTP para o backend.
* **React Toastify:** Para as notificações (toasts).
* **CSS Padrão** (ou **Styled Components** / **Tailwind** - *ajuste conforme o seu caso*): Para estilização.

---

## 📦 Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o frontend na sua máquina.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* `npm` ou `yarn`
* O **Backend** (API) [deste projeto](https://github.com/beatrizrosaa/mini-projeto-postgresql) precisa estar rodando localmente ou na nuvem.

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/beatrizrosaa/frontend-mini-projeto.git
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd frontend-mini-projeto
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto. Você pode copiar o `.env.example` (se ele existir) ou criar um do zero com a seguinte variável:

    ```env
    # .env
    # Aponta para a sua API local (se estiver rodando o backend na sua máquina)
    VITE_API_BASE_URL=http://localhost:3001/api
    
    # Ou, aponta para a API na Vercel
    # VITE_API_BASE_URL=https://postgresql.beatrizrosa.me/api
    ```
    *(Lembre-se: O Vite exige o prefixo `VITE_`)*

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O seu servidor local estará disponível em `http://localhost:5173`.

---


## 🕵️ Mocking de API com MSW (Mock Service Worker)

Este projeto usa o **MSW** para simular a API do backend em ambiente de desenvolvimento.

### Como Funciona?

* **Ativação:** O MSW é **ativado automaticamente** sempre que o projeto é executado localmente com `npm run dev` (graças à verificação `import.meta.env.DEV` no `src/main.tsx`).
* **Operação:** Ele intercepta as chamadas de `fetch` no navegador e retorna respostas "mockadas" (falsas) definidas em `src/mocks/handlers.ts`.
* **Bypass:** Se uma chamada de API não tiver um *handler* correspondente, ela será enviada para o backend real (ex: `https://postgresql.beatrizrosa.me/api`).

### Como Desativar (Temporariamente)

Se você estiver a rodar o `npm run dev` e quiser testar contra o **backend real** (em vez dos mocks), simplesmente comente a chamada `enableMocking()` no `src/main.tsx`:

```tsx
// src/main.tsx

// Comente a linha abaixo para desativar o MSW
// enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
// }); // E esta linha

## 🔗 Projetos Relacionados

* **Repositório do Backend (API):** [https://github.com/beatrizrosaa/mini-projeto-postgresql](https://github.com/beatrizrosaa/mini-projeto-postgresql)