import { isWin, Tasks } from '../injection-tokens';
import { Worker } from './worker';

export async function runCommand(
  runner: string,
  args: string[],
): Promise<boolean> {
  return await Worker({
    command: isWin ? 'cmd' : 'npx',
    args: [
      ...(isWin ? ['/c', 'npx'] : []),
      runner,
      ...args
        .slice(2)
        .filter(
          (a) =>
            a !== Tasks.LEAVE_CHANGES &&
            a !== Tasks.REVERT &&
            a !== Tasks.BUILD,
        ),
    ],
  });
}
