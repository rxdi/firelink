import { DependenciesLink, isWin } from '../injection-tokens';
import { Worker } from './worker';

function copyWindows(
  folder: string,
  outFolder: string,
  outFolderName: string,
  excludes: string[],
) {
  return Worker({
    command: 'cmd',
    args: [
      '/c',
      'robocopy',
      folder,
      `${outFolder}/${outFolderName}`,
      'x*',
      '/E',
      ...(excludes
        ? excludes.reduce(
            (prev, curr) => [...prev, '/xd', curr],
            [] as string[],
          )
        : []),
    ],
  });
}

function copyOther(
  folder: string,
  outFolder: string,
  outFolderName: string,
  excludes: string[],
) {
  return Worker({
    command: 'rsync',
    args: [
      '-r',
      ...(excludes
        ? excludes.reduce(
            (prev, curr) => [...prev, '--exclude', curr],
            [] as string[],
          )
        : []),
      folder,
      `${outFolder}/${outFolderName}`,
    ],
  });
}

export function copyPackages(
  dependencies: DependenciesLink[],
  outFolder: string,
  outFolderName: string,
  excludes: string[],
) {
  return Promise.all(
    dependencies.map(({ folder }) =>
      isWin
        ? copyWindows(folder, outFolder, outFolderName, excludes)
        : copyOther(folder, outFolder, outFolderName, excludes),
    ),
  );
}

/* Deprecated due to performance issues
 * Left here just for example purposes
 * In some moments we may fix and revert this
 * For now native `rsync` and `robocopy` will be executed
 */
// import { join } from 'path';

// import { DependenciesLink } from '../injection-tokens';
// import { FolderSync } from './copy-recursive';

// export async function copyPackages(
//   dependencies: DependenciesLink[],
//   outFolder: string,
//   outFolderName: string,
// ) {
//   await Promise.all(
//     dependencies.map(async ({ folder }) => {
//       await FolderSync.copyFolderRecursive(
//         folder,
//         join(outFolder, outFolderName),
//       );
//     }),
//   );
// }
