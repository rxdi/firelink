/* eslint-disable @typescript-eslint/no-explicit-any */
import { exitWithError } from './exit-with-error';

export function lazy(
  getActionFunc: () => Promise<(...args: any[]) => Promise<unknown>>,
): (...args: any[]) => Promise<void> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      exitWithError(error);
    }
  };
}
