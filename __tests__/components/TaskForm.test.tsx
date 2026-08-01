import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('Componente - TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el campo de texto y el botón de guardar', async () => {
    const { getByTestId, getByText } = await render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(getByTestId('input-titulo')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('debe permitir escribir en el input y enviar el texto ingresado al pulsar Guardar', async () => {
    const { getByTestId, getByRole } = await render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = getByTestId('input-titulo');
    const button = getByRole('button');

    await act(async () => {
      fireEvent.changeText(input, 'Aprender React Native Testing');
    });

    await act(async () => {
      fireEvent.press(button);
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith('Aprender React Native Testing');
  });

  it('no debe llamar a onSubmit si el campo de texto está vacío o solo contiene espacios', async () => {
    const { getByTestId, getByRole } = await render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = getByTestId('input-titulo');
    const button = getByRole('button');

    await act(async () => {
      fireEvent.changeText(input, '   ');
    });

    await act(async () => {
      fireEvent.press(button);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});