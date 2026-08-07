import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../src/mocks/server';
import { CreateTaskScreen } from '../src/screens/CreateTaskScreen';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = async () =>
  await render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

beforeAll(() => {
  try {
    server.listen({ onUnhandledRequest: 'bypass' });
  } catch (e) {}
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  try {
    server.close();
  } catch (e) {}
});

describe('Pruebas de Integración con MSW - Task Manager', () => {

  test('1. Debe cargar y renderizar la lista de tareas exitosamente desde la API', async () => {
    server.use(
      http.get('*', () => {
        return HttpResponse.json([
          { id: '1', title: 'Aprender MSW e Integración', completed: false },
          { id: '2', title: 'Aprobar Actividad 3', completed: true },
        ]);
      })
    );

    const { getByText } = await renderScreen();

    await waitFor(() => {
      expect(getByText('Aprender MSW e Integración')).toBeTruthy();
    });
  });

  test('2. Debe manejar el fallo de la API correctamente (500)', async () => {
    server.use(
      http.get('*', () => new HttpResponse(null, { status: 500 }))
    );

    const { queryByText } = await renderScreen();

    await waitFor(() => {
      expect(queryByText('Aprender MSW e Integración')).toBeNull();
    });
  });

  test('3. Debe mostrar el estado correspondiente cuando la API retorna una lista vacía', async () => {
    server.use(
      http.get('*', () => HttpResponse.json([]))
    );

    const { getByText } = await renderScreen();

    await waitFor(() => {
      expect(getByText('No hay tareas aún')).toBeTruthy();
    });
  });

});