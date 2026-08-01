import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask } from '../../src/services/taskService';

// JUSTIFICACIÓN DE MOCKING:
// Se aísla el servicio externo 'taskService' mediante jest.mock() para evitar 
// peticiones reales a una API o base de datos durante las pruebas unitarias, 
// garantizando respuestas deterministas e instantáneas.
jest.mock('../../src/services/taskService');

const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('Pruebas de Custom Hook - useCreateTask (Con Mocking)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe manejar la creación exitosa de una tarea transitando por los estados: idle -> loading -> success', async () => {
    const mockNewTask = { id: '100', title: 'Tarea remota', status: 'pending' as const };
    
    mockedCreateTask.mockResolvedValueOnce(mockNewTask);

    const { result } = await renderHook(() => useCreateTask());

    expect(result.current.status).toBe('idle');

    await act(async () => {
      await result.current.submit('Tarea remota');
    });

    expect(result.current.status).toBe('success');
    expect(result.current.tasks).toContainEqual(mockNewTask);
    expect(mockedCreateTask).toHaveBeenCalledWith('Tarea remota');
  });

  it('debe cambiar el estado a "error" cuando el servicio asíncrono falla', async () => {
    mockedCreateTask.mockRejectedValueOnce(new Error('Network error'));

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea fallida');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.tasks.length).toBe(0);
  });

  it('debe eliminar una tarea agregada previamente con removeTask()', async () => {
    const mockNewTask = { id: 'abc', title: 'Tarea a eliminar', status: 'pending' as const };
    mockedCreateTask.mockResolvedValueOnce(mockNewTask);

    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea a eliminar');
    });

    expect(result.current.tasks.length).toBe(1);

    await act(async () => {
      result.current.removeTask('abc');
    });

    expect(result.current.tasks.length).toBe(0);
  });
});