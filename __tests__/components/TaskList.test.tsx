import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskList } from '../../src/components/TaskList';
import { Task } from '../../src/types';

describe('Componente - TaskList', () => {
  const mockOnDelete = jest.fn();

  const mockTasks: Task[] = [
    { id: '1', title: 'Primera tarea', status: 'pending' },
    { id: '2', title: 'Segunda tarea', status: 'completed' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el mensaje vacío cuando no hay tareas', async () => {
    const { getByText } = await render(<TaskList tasks={[]} onDelete={mockOnDelete} />);

    expect(getByText('No hay tareas aún')).toBeTruthy();
  });

  it('debe mostrar el contador en singular ("1 tarea") cuando hay exactamente una tarea', async () => {
    const { getByText } = await render(<TaskList tasks={[mockTasks[0]]} onDelete={mockOnDelete} />);

    expect(getByText('1 tarea')).toBeTruthy();
    expect(getByText('Primera tarea')).toBeTruthy();
  });

  it('debe mostrar el contador en plural ("2 tareas") y renderizar todas las tarjetas', async () => {
    const { getByText } = await render(<TaskList tasks={mockTasks} onDelete={mockOnDelete} />);

    expect(getByText('2 tareas')).toBeTruthy();
    expect(getByText('Primera tarea')).toBeTruthy();
    expect(getByText('Segunda tarea')).toBeTruthy();
  });

  it('debe delegar la acción de eliminación al componente hijo TaskCard', async () => {
    const { getByLabelText } = await render(<TaskList tasks={mockTasks} onDelete={mockOnDelete} />);

    const deleteFirstTaskButton = getByLabelText('Eliminar tarea Primera tarea');
    fireEvent.press(deleteFirstTaskButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});