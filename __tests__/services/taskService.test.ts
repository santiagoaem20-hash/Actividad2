import { fetchTasks, createTask } from '../../src/services/taskService';
import { Task } from '../../src/types';

describe('Servicio - taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTasks()', () => {
    it('debe realizar la petición HTTP GET correctamente y retornar la lista de tareas', async () => {
      const mockTasks: Task[] = [
        { id: '1', title: 'Comprar insumos', status: 'pending' },
        { id: '2', title: 'Revisar reportes', status: 'completed' },
      ];

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTasks),
      });

      const result = await fetchTasks();

      expect(global.fetch).toHaveBeenCalledWith('https://api.taskmanager.com/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('debe lanzar un error cuando la respuesta de la API no es exitosa (!res.ok)', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchTasks()).rejects.toThrow('Error al obtener las tareas');
    });
  });

  describe('createTask()', () => {
    it('debe retornar un objeto Task válido con estado pending e ID generado', async () => {
      const title = 'Tarea de prueba local';
      const mockCreatedTask: Task = {
        id: '123-abc',
        title: 'Tarea de prueba local',
        status: 'pending',
      };

      // Se agrega el mock de fetch para la petición POST de creación
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCreatedTask),
      });

      const result = await createTask(title);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.taskmanager.com/tasks',
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(result).toEqual({
        id: expect.any(String),
        title: 'Tarea de prueba local',
        status: 'pending',
      });
    });
  });
});