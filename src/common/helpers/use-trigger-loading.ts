import { useLoading } from '../context/useLoading';

export const useTriggerLoading = () => {
  const { showLoading, closeLoading } = useLoading();

  async function triggerLoading<T>(callback: () => T | Promise<T>): Promise<[Awaited<T> | undefined, boolean]> {
    try {
      showLoading();
      return [await callback(), false];
    } catch (e) {
      console.error(e);
      return [undefined, true];
    } finally {
      closeLoading();
    }
  }

  return triggerLoading;
};
