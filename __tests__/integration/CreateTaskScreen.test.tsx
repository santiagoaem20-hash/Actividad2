import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';
import { createTask } from '../../src/services/taskService';

// Mock de safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock del servicio de tareas
jest.mock('../../src/services/taskService');

const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('Pantalla de Integración - CreateTaskScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el título de la pantalla y el estado inicial vacío', async () => {
    const { getByText, getByTestId } = await render(<CreateTaskScreen />);

    expect(getByText('Nueva tarea')).toBeTruthy();
    expect(getByTestId('input-titulo')).toBeTruthy();
    expect(getByText('No hay tareas aún')).toBeTruthy();
  });

  it('debe completar el flujo de creación exitosa de una tarea', async () => {
    const mockTask = { id: '101', title: 'Diseñar suite de pruebas', status: 'pending' as const };
    mockedCreateTask.mockResolvedValueOnce(mockTask);

    const { getByTestId, getByRole, getByText } = await render(<CreateTaskScreen />);

    const input = getByTestId('input-titulo');
    const saveButton = getByRole('button');

    await act(async () => {
      fireEvent.changeText(input, 'Diseñar suite de pruebas');
    });

    await act(async () => {
      fireEvent.press(saveButton);
    });

    // Mensaje de éxito
    expect(getByText('Tarea creada exitosamente')).toBeTruthy();
    // La tarea aparece en la lista
    expect(getByText('Diseñar suite de pruebas')).toBeTruthy();
    expect(getByText('1 tarea')).toBeTruthy();
  });

  it('debe mostrar el banner de error cuando falla la creación de la tarea', async () => {
    mockedCreateTask.mockRejectedValueOnce(new Error('Servidor no disponible'));

    const { getByTestId, getByRole, getByText } = await render(<CreateTaskScreen />);

    const input = getByTestId('input-titulo');
    const saveButton = getByRole('button');

    await act(async () => {
      fireEvent.changeText(input, 'Tarea con error');
    });

    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(getByText('Error al crear la tarea')).toBeTruthy();
  });

  it('debe abrir el diálogo de confirmación y eliminar la tarea al presionar Eliminar', async () => {
    const mockTask = { id: '202', title: 'Tarea a borrar', status: 'pending' as const };
    mockedCreateTask.mockResolvedValueOnce(mockTask);

    const { getByTestId, getByRole, getByText, getByLabelText, queryByText } = await render(
      <CreateTaskScreen />
    );

    // 1. Crear la tarea
    await act(async () => {
      fireEvent.changeText(getByTestId('input-titulo'), 'Tarea a borrar');
    });
    await act(async () => {
      fireEvent.press(getByRole('button'));
    });

    expect(getByText('Tarea a borrar')).toBeTruthy();

    // 2. Presionar "Eliminar" en la tarjeta
    const deleteCardButton = getByLabelText('Eliminar tarea Tarea a borrar');
    await act(async () => {
      fireEvent.press(deleteCardButton);
    });

    // 3. Confirmar en el modal
    const confirmDialogButton = getByLabelText('Confirmar eliminación');
    await act(async () => {
      fireEvent.press(confirmDialogButton);
    });

    // 4. Verificar que la tarea fue removida
    expect(queryByText('Tarea a borrar')).toBeNull();
    expect(getByText('No hay tareas aún')).toBeTruthy();
  });

  it('debe cancelar la eliminación de la tarea al presionar Cancelar en el diálogo', async () => {
    const mockTask = { id: '303', title: 'Tarea a conservar', status: 'pending' as const };
    mockedCreateTask.mockResolvedValueOnce(mockTask);

    const { getByTestId, getByRole, getByText, getByLabelText } = await render(
      <CreateTaskScreen />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('input-titulo'), 'Tarea a conservar');
    });
    await act(async () => {
      fireEvent.press(getByRole('button'));
    });

    // Abrir modal
    await act(async () => {
      fireEvent.press(getByLabelText('Eliminar tarea Tarea a conservar'));
    });

    // Cancelar
    await act(async () => {
      fireEvent.press(getByLabelText('Cancelar'));
    });

    // La tarea debe seguir existiendo
    expect(getByText('Tarea a conservar')).toBeTruthy();
  });
});