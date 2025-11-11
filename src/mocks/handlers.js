// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

// Pega a sua VITE_API_BASE_URL (ex: /api)
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
  
  // --- Handler 1: Mock de Login ---
  http.post(`${API_URL}/login`, ({ request }) => {
    console.log('[MSW] Mock de Login: Sucesso!');
    
    return HttpResponse.json({
      token: 'mock-jwt-token-123456789',
      user: { id: 'user-mock-id', email: 'mock@user.com', name: 'Usuário Mockado' },
    }, { status: 200 });
  }),

  // --- Handler 2: Mock de Cadastro ---
  http.post(`${API_URL}/register`, ({ request }) => {
    console.log('[MSW] Mock de Cadastro: Sucesso!');

    return HttpResponse.json({
      message: 'Usuário cadastrado com sucesso pelo MSW!',
      user: { id: `user-mock-${Date.now()}`, name: 'Novo Mock', email: 'novo@mock.com' },
    }, { status: 201 });
  }),

  // --- Handler 3: Mock de Criar Contato (NOVO) ---
  http.post(`${API_URL}/contacts`, async ({ request }) => {
    const newContact = await request.json(); 
    console.log('[MSW] Mock de Criar Contato:', newContact);

    return HttpResponse.json({
      id: `mock-contact-${Date.now()}`,
      ...newContact, 
      userId: 'user-mock-id',
    }, { status: 201 });
  }),

  // (Você pode adicionar os mocks de GET, PUT e DELETE de contatos aqui também)
];