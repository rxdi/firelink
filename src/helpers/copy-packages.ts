import { join } from 'path';

import { DependenciesLink, isWin } from '../injection-tokens';
import { FolderSync } from './copy-recursive';
import { Worker } from './worker';

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

export function copyPackages(dependencies: DependenciesLink[]) {
  return (outFolder: string) => (outFolderName: string) => (
    excludes: string[],
  ) => (nativeCopyEnabled?: boolean) =>
    Promise.all(
      dependencies.map(({ folder }) =>
        nativeCopyEnabled || isWin
          ? FolderSync.copyFolderRecursive(
              folder,
              join(outFolder, outFolderName),
            )
          : copyOther(folder, outFolder, outFolderName, excludes),
      ),
    );
}

/* Cannot make it work to behave the same as rsync in windows for now */

// function copyWindows(
//   folder: string,
//   outFolder: string,
//   outFolderName: string,
//   excludes: string[],
// ) {
//   console.log(folder);
//   console.log([outFolder, outFolderName].join('\\'));
//   return Worker({
//     command: 'cmd',
//     args: [
//       '/c',
//       'robocopy',
//       folder,
//       [outFolder, outFolderName].join('\\'),
//       '/s',
//       '/e',
//       '*.*',
//       ...(excludes
//         ? excludes.reduce(
//             (prev, curr) => [...prev, '/xd', curr],
//             [] as string[],
//           )
//         : []),
//     ],
//   });
// }
