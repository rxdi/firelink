import { readdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { linkedPackagesName, Tasks } from '../injection-tokens';
import { nextOrDefault } from './args-extractors';
import { Worker } from './worker';

export async function buildPackages() {
  return await Promise.all(
    (await promisify(readdir)(join(process.cwd(), linkedPackagesName))).map(async dir => {
      await Worker(
        {
          command: 'npx',
          args: (nextOrDefault(Tasks.BUILD, 'tsc') as string).split(' '),
          cwd: join(process.cwd(), linkedPackagesName, dir),
        },
        false,
      );
    }),
  );
}
