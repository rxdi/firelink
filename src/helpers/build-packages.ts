import { readdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { Tasks } from '../injection-tokens';
import { nextOrDefault } from './args-extractors';
import { Worker } from './worker';

export async function buildPackages(outFolder: string, outFolderName: string) {
  return await Promise.all(
    (
      await promisify(readdir)(join(outFolder, outFolderName))
    ).map(async (dir) => {
      await Worker({
        command: 'npx',
        args: (nextOrDefault(Tasks.BUILD, 'tsc') as string).split(' '),
        cwd: join(outFolder, outFolderName, dir),
      });
    }),
  );
}
