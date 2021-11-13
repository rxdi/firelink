import { lstat, mkdir, readdir, readFile, writeFile } from 'fs';
import { basename, join } from 'path';
import { promisify } from 'util';

import { fileExists } from './file-exists';

export class FolderSync {
  public static async copyFile(source: string, target: string) {
    let targetFile = target;

    if (await fileExists(target)) {
      if ((await promisify(lstat)(target)).isDirectory()) {
        targetFile = join(target, basename(source));
      }
    }

    await promisify(writeFile)(targetFile, await promisify(readFile)(source));
  }

  public static async copyFolderRecursive(source: string, target: string) {
    const targetFolder = join(target, basename(source));
    if (!(await fileExists(targetFolder))) {
      await promisify(mkdir)(targetFolder, { recursive: true });
    }

    const sourceExists = await promisify(lstat)(source);

    if (sourceExists.isDirectory()) {
      const files = await promisify(readdir)(source);
      await Promise.all(
        files.map(async file => {
          const currrentSource = join(source, file);
          const isCurrentExists = await this.isExists(currrentSource);

          if (isCurrentExists.isDirectory()) {
            await this.copyFolderRecursive(currrentSource, targetFolder);
          } else {
            await this.copyFile(currrentSource, targetFolder);
          }
        }),
      );
    }
    return new Promise<boolean>(resolve => {
      /**
       * There is a time between notifiyng the OS for saving files and saving them actually.
       * Lets wait 1 second for everything to finish and to be actually saved in the storage
       */
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  private static isExists(source: string) {
    return promisify(lstat)(source);
  }
}
