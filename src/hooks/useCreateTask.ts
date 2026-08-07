import { useEffect, useState } from 'react';
import { createTask, fetchTasks } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        if (!active) return;
        setTasks(data);
      } catch {
        if (!active) return;
        setTasks([]);
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (title: string) => {
    setStatus('loading');
    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { status, tasks, submit, removeTask };
}
