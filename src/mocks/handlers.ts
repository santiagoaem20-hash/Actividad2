import { http, HttpResponse } from 'msw';

export const handlers = [
  // El comodín (RegExp o '*/tasks') intercepta cualquier URL que termine en /tasks
  http.get('*/tasks', () => {
    return HttpResponse.json([
      { id: '1', title: 'Aprender MSW e Integración', completed: false },
      { id: '2', title: 'Aprobar Actividad 3', completed: true },
    ]);
  }),
];