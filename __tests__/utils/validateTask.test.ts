import { validateTaskTitle } from '../../src/utils/validateTask';

describe('Pruebas Unitarias - validateTaskTitle', () => {
  it('debe retornar null cuando el título es válido y tiene una longitud correcta (toBe)', () => {
    const result = validateTaskTitle('Comprar insumos');
    expect(result).toBe(null);
  });

  it('caso límite 1: debe retornar mensaje de error si el título está vacío o solo contiene espacios (toBe / toContain)', () => {
    const result = validateTaskTitle('   ');
    expect(result).toBe('El título es obligatorio');
    expect(result).toContain('obligatorio');
  });

  it('caso límite 2: debe retornar mensaje de error si el título tiene menos de 3 caracteres (toBe)', () => {
    const result = validateTaskTitle('Ab');
    expect(result).toBe('El título debe tener al menos 3 caracteres');
  });

  it('caso límite 3: debe retornar mensaje de error si el título excede los 100 caracteres (toBe)', () => {
    const longTitle = 'a'.repeat(101);
    const result = validateTaskTitle(longTitle);
    expect(result).toBe('El título no puede exceder los 100 caracteres');
  });

  it('caso límite 4: debe manejar entradas nulas o indefinidas (toBe)', () => {
    // @ts-ignore - Simula entrada inesperada fuera de TypeScript
    const resultNull = validateTaskTitle(null);
    // @ts-ignore
    const resultUndefined = validateTaskTitle(undefined);

    expect(resultNull).toBe('El título es obligatorio');
    expect(resultUndefined).toBe('El título es obligatorio');
  });
});