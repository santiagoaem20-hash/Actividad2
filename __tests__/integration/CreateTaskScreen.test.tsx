import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';
import { server } from '../../src/mocks/server';

const API_URL = 'https://api.taskmanager.com';

// Mock de safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('Pantalla de Integración (MSW) - CreateTaskScreen', () => {
  afterEach(() => server.resetHandlers());

  it('Escenario 1 (Éxito): Completa el flujo de creación interactuando con la API a través de MSW', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return HttpResponse.json(
          { id: '101', title: 'Tarea creada con MSW', status: 'pending' },
          { status: 201 }
        );
      })
    );

    const { getByTestId, getByText, findByText } = await render(<CreateTaskScreen />);

    const input = getByTestId('input-titulo');
    // Seleccionamos explícitamente el botón por su texto
    const saveButton = getByText('Guardar');

    await act(async () => {
      fireEvent.changeText(input, 'Tarea creada con MSW');
    });

    await act(async () => {
      fireEvent.press(saveButton);
    });

    // findByText espera asíncronamente a que MSW responda y React re-renderice
    expect(await findByText('Tarea creada exitosamente')).toBeTruthy();
    expect(await findByText('Tarea creada con MSW')).toBeTruthy();
  });

  it('Escenario 2 (Error de API): Muestra el banner de error cuando la API responde con status 500', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { getByTestId, getByText, findByText } = await render(<CreateTaskScreen />);

    const input = getByTestId('input-titulo');
    const saveButton = getByText('Guardar');

    await act(async () => {
      fireEvent.changeText(input, 'Tarea que fallará');
    });

    await act(async () => {
      fireEvent.press(saveButton);
    });

    // Esperar mensaje de error condicional interceptado por MSW
    expect(await findByText('Error al crear la tarea')).toBeTruthy();
  });

  it('Escenario 3 (Datos Vacíos): Muestra el estado inicial "No hay tareas aún" cuando no existen tareas', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () => {
        return HttpResponse.json([]);
      })
    );

    const { getByText } = await render(<CreateTaskScreen />);

    expect(getByText('No hay tareas aún')).toBeTruthy();
  });
});