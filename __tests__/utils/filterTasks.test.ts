import { filterTasksByStatus, FilterStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

describe('Pruebas Unitarias - filterTasksByStatus', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Diseñar suite de pruebas', status: 'pending' },
    { id: '2', title: 'Ejecutar Jest', status: 'completed' },
    { id: '3', title: 'Documentar entrega', status: 'archived' },
  ];

  it('debe retornar todas las tareas cuando el estado del filtro es "all" (toEqual)', () => {
    const result = filterTasksByStatus(mockTasks, 'all');
    expect(result).toEqual(mockTasks);
    expect(result.length).toBe(3);
  });

  it('debe filtrar correctamente las tareas por un estado específico como "completed" (toEqual)', () => {
    const result = filterTasksByStatus(mockTasks, 'completed');
    expect(result).toEqual([
      { id: '2', title: 'Ejecutar Jest', status: 'completed' },
    ]);
  });

  it('caso límite 1: debe lanzar una excepción (toThrow) si el estado del filtro no es válido', () => {
    // @ts-ignore - Probamos un estado inválido fuera del tipo TypeScript
    const invalidStatus: FilterStatus = 'invalido';

    expect(() => filterTasksByStatus(mockTasks, invalidStatus)).toThrow(
      'Estado inválido: invalido'
    );
  });

  it('caso límite 2: debe retornar un arreglo vacío si la lista inicial de tareas está vacía (toEqual)', () => {
    const result = filterTasksByStatus([], 'pending');
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});