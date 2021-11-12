// import { lstat, mkdir, readdir, readFile, writeFile } from 'fs';
// import { basename, join } from 'path';
// import { promisify } from 'util';

// import { createVirtualSymlink } from './create-virtual-symlink';
// import { fileExists } from './helpers/file-exists';

// async function copyFile(source: string, target: string) {
//   let targetFile = target;

//   if (await fileExists(target)) {
//     if ((await promisify(lstat)(target)).isDirectory()) {
//       targetFile = join(target, basename(source));
//     }
//   }

//   await promisify(writeFile)(targetFile, await promisify(readFile)(source));
// }

// async function copyFolderRecursive(source: string, target: string) {
//   let files = [];

//   const targetFolder = join(target, basename(source));
//   if (!(await fileExists(targetFolder))) {
//     await promisify(mkdir)(targetFolder);
//   }

//   if ((await promisify(lstat)(source)).isDirectory()) {
//     files = await promisify(readdir)(source);
//     await Promise.all(
//       files.map(async file => {
//         const curSource = join(source, file);
//         if ((await promisify(lstat)(curSource)).isDirectory()) {
//           await copyFolderRecursive(curSource, targetFolder);
//         } else {
//           await copyFile(curSource, targetFolder);
//         }
//       }),
//     );
//   }
//   return new Promise<boolean>(resolve => {
//     setTimeout(() => {
//       resolve(true);
//     }, 1000);
//   });
// }

describe('', () => {
  it('Should verify that ', async () => {
    // await copyFolderRecursive('../example', '.');
    // await createVirtualSymlink(
    //   {
    //     name: '@test/main',
    //     dependencies: {
    //       '@test/dependency': '1.0.0',
    //     },
    //     fireDependencies: {
    //       '@test/dependency': './packages/dependency',
    //     },
    //     fireConfig: {
    //       runner: 'npm',
    //       outFolderName: '.packages',
    //       outFolderLocation: '.',
    //     },
    //   },
    //   '',
    //   '',
    // );
  });
});
