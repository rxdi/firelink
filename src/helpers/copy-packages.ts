import { join } from 'path';

import { DependenciesLink } from '../injection-tokens';
import { FolderSync } from './copy-recursive';

export async function copyPackages(
  dependencies: DependenciesLink[],
  outFolder: string,
  outFolderName: string,
) {
  await Promise.all(
    dependencies.map(async ({ folder }) => {
      await FolderSync.copyFolderRecursive(
        folder,
        join(outFolder, outFolderName),
      );
    }),
  );
}
