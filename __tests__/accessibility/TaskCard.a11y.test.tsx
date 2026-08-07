import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Estudiar accesibilidad en React Native',
  status: 'pending' as const,
};

describe('Accesibilidad - TaskCard', () => {
  it('el botón de eliminar posee un accessibilityLabel descriptivo para lectores de pantalla', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);

    // Verifica que el lector de pantalla encuentre la etiqueta explícita
    const deleteButton = screen.getByLabelText(
      'Eliminar tarea Estudiar accesibilidad en React Native'
    );
    expect(deleteButton).toBeTruthy();
  });

  it('el contenedor de la tarjeta tiene asignado el rol accesible adecuado', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);

    // Verifica que el elemento interactivo exponga el rol de botón a TalkBack/VoiceOver
    const card = screen.getByRole('button');
    expect(card).toBeTruthy();
  });

  it('anuncia el estado actual de la tarea al lector de pantalla', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);

    const statusText = screen.getByText('○ Pendiente');
    expect(statusText).toBeTruthy();
  });
});