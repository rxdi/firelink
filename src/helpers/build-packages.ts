import { promisify } from 'util';
import { join } from 'path';
import { linkedPackagesName } from '../injection-tokens';
import { nextOrDefault } from './args-extractors';
import { readdir } from 'fs';
import { Worker } from './worker';

export async function buildPackages() {
  return await Promise.all(
    (await promisify(readdir)(join(process.cwd(), linkedPackagesName))).map(
      async dir => {
        await Worker(
          {
            command: 'npx',
            args: (nextOrDefault('--buildCommand', 'tsc') as string).split(' '),
            cwd: join(process.cwd(), linkedPackagesName, dir)
          },
          false
        );
      }
    )
  );
}
