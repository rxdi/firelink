import { linkedPackagesName } from '../injection-tokens';
import { Worker } from './worker';

export async function copyPackages(
  dependencies: { folder: string; dep: string }[]
) {
  await Promise.all(
    dependencies.map(async ({ folder }) => {
      const args = [
        '-r',
        '--exclude',
        'node_modules',
        '--exclude',
        'dist',
        '--exclude',
        '.cache',
        folder,
        `./${linkedPackagesName}`
      ];
      await Worker({
        command: 'rsync',
        args
      });
    })
  );
}
