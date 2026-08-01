import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';
import { Task } from '../../src/types';

describe('Componente - TaskCard', () => {
  const mockOnDelete = jest.fn();

  const pendingTask: Task = {
    id: 'task-1',
    title: 'Estudiar para el examen',
    status: 'pending',
  };

  const completedTask: Task = {
    id: 'task-2',
    title: 'Entrenar en la tarde',
    status: 'completed',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente la información de una tarea pendiente', async () => {
    const { getByText } = await render(<TaskCard task={pendingTask} onDelete={mockOnDelete} />);

    expect(getByText('Estudiar para el examen')).toBeTruthy();
    expect(getByText('○ Pendiente')).toBeTruthy();
  });

  it('debe renderizar el estado completado correctamente', async () => {
    const { getByText } = await render(<TaskCard task={completedTask} onDelete={mockOnDelete} />);

    expect(getByText('Entrenar en la tarde')).toBeTruthy();
    expect(getByText('✓ Completada')).toBeTruthy();
  });

  it('debe llamar a onDelete pasando el ID de la tarea al presionar Eliminar', async () => {
    const { getByLabelText } = await render(<TaskCard task={pendingTask} onDelete={mockOnDelete} />);

    const deleteButton = getByLabelText('Eliminar tarea Estudiar para el examen');
    fireEvent.press(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('task-1');
  });
});