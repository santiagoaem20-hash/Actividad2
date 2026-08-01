import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('Pruebas de Custom Hook - useCounter', () => {
  it('debe inicializar el contador con el valor por defecto (0) y con valor personalizado', async () => {
    const { result: defaultResult } = await renderHook(() => useCounter());
    expect(defaultResult.current.count).toBe(0);

    const { result: customResult } = await renderHook(() => useCounter(10));
    expect(customResult.current.count).toBe(10);
  });

  it('debe incrementar el contador correctamente usando act()', async () => {
    const { result } = await renderHook(() => useCounter(5));

    await act(async () => {
      result.current.increment();
    });

    expect(result.current.count).toBe(6);
  });

  it('debe decrementar el contador correctamente usando act()', async () => {
    const { result } = await renderHook(() => useCounter(5));

    await act(async () => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('debe reiniciar el contador al valor inicial con reset()', async () => {
    const { result } = await renderHook(() => useCounter(10));

    await act(async () => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});