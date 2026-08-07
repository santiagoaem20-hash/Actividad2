import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

describe('Pruebas de Accesibilidad (a11y) - CreateTaskScreen', () => {

  test('1. El campo de texto de la tarea debe tener etiqueta de accesibilidad configurada', async () => {
    // Renderizado síncrono al inicio de la prueba
    const { getByTestId } = await renderScreen();

    const input = getByTestId('input-titulo');
    
    // Validar presencia y atributo de accesibilidad
    expect(input).toBeTruthy();
    expect(input.props.accessibilityLabel).toBe('Título de la tarea');
  });

  test('2. El botón de guardar debe estar disponible en el árbol accesible', async () => {
    const { getByText } = await renderScreen();

    const button = getByText('Guardar');
    
    expect(button).toBeTruthy();
  });

  test('3. Los elementos interactivos no deben estar ocultos para lectores de pantalla', async () => {
    const { getByText } = await renderScreen();

    const button = getByText('Guardar');
    
    // Verifica que no tenga asignado accessibilityElementsHidden en true
    expect(button.props.accessibilityElementsHidden).not.toBe(true);
  });

});