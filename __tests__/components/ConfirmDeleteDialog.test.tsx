import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

describe('Componente - ConfirmDeleteDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el mensaje personalizado con el título de la tarea cuando visible es true', async () => {
    const { getByText } = await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Comprar leche"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(getByText('Eliminar tarea')).toBeTruthy();
    expect(
      getByText('¿Seguro que quieres eliminar "Comprar leche"? Esta acción no se puede deshacer.')
    ).toBeTruthy();
  });

  it('debe renderizar el mensaje por defecto cuando no se proporciona taskTitle', async () => {
    const { getByText } = await render(
      <ConfirmDeleteDialog
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(
      getByText('¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.')
    ).toBeTruthy();
  });

  it('debe llamar a la función onCancel al presionar el botón Cancelar', async () => {
    const { getByLabelText } = await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Comprar leche"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = getByLabelText('Cancelar');
    fireEvent.press(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('debe llamar a la función onConfirm al presionar el botón Eliminar', async () => {
    const { getByLabelText } = await render(
      <ConfirmDeleteDialog
        visible={true}
        taskTitle="Comprar leche"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = getByLabelText('Confirmar eliminación');
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});