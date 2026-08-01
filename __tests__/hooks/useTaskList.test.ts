import { renderHook, act } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';
import { Task } from '../../src/types';

describe('Pruebas de Custom Hook - useTaskList', () => {
  const initialMockTasks: Task[] = [
    { id: '1', title: 'Tarea inicial', status: 'pending' },
  ];

  it('debe cargar la lista de tareas inicial y la cantidad correcta (taskCount)', async () => {
    const { result } = await renderHook(() => useTaskList(initialMockTasks));

    expect(result.current.tasks).toEqual(initialMockTasks);
    expect(result.current.taskCount).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('debe agregar una nueva tarea exitosamente con addTask() y limpiar errores previos', async () => {
    const { result } = await renderHook(() => useTaskList([]));

    await act(async () => {
      result.current.addTask('Nueva tarea de prueba');
    });

    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Nueva tarea de prueba');
    expect(result.current.tasks[0].status).toBe('pending');
    expect(result.current.taskCount).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('caso límite / validación: debe registrar error y no agregar tarea si el título está vacío', async () => {
    const { result } = await renderHook(() => useTaskList([]));

    await act(async () => {
      result.current.addTask('   ');
    });

    expect(result.current.tasks.length).toBe(0);
    expect(result.current.error).toBe('El título no puede estar vacío');
  });

  it('debe eliminar una tarea por su id con removeTask()', async () => {
    const { result } = await renderHook(() => useTaskList(initialMockTasks));

    expect(result.current.taskCount).toBe(1);

    await act(async () => {
      result.current.removeTask('1');
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.taskCount).toBe(0);
  });
});