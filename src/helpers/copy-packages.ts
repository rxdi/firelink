import { DependenciesLink } from '../injection-tokens';
import { Worker } from './worker';

export async function copyPackages(
  dependencies: DependenciesLink[],
  outFolder: string,
  outFolderName: string,
) {
  await Promise.all(
    dependencies.map(async ({ folder }) => {
      await Worker({
        command: 'rsync',
        args: [
          '-r',
          '--exclude',
          'node_modules',
          '--exclude',
          'dist',
          '--exclude',
          '.cache',
          folder,
          `${outFolder}/${outFolderName}`,
        ],
      });
    }),
  );
}
