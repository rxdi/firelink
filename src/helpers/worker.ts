import { spawn } from 'child_process';

import { WorkerOptions } from '../injection-tokens';

export const Worker = (
  { command, args, cwd }: WorkerOptions = {
    command: 'npx',

    args: [],
  },
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: cwd || process.cwd() });
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
    child.on('close', (code: number) => {
      if (code !== 0) {
        return reject(!code);
      }
      return resolve(!code);
    });
  });
};
