import { spawn } from 'child_process';
import { readFile, stat, unlink, writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import {
  Arguments,
  DEFAULT_RUNNER,
  DependenciesLink,
  FireLinkConfig,
  isWin,
  PackageJson,
  Signals,
  Tasks,
  WorkingFiles,
} from '../types';
import { WorkerOptions } from '../types';
import { ExitCodeError } from './custom-error';

export class UtilsService {
  static writeFileJson(name: string, json: PackageJson) {
    writeFileSync(join(process.cwd(), name), JSON.stringify(json, null, 2), {
      encoding: 'utf-8',
    });
  }

  static Worker = (
    { command, args, cwd }: WorkerOptions = {
      command: 'npx',

      args: [],
    },
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: cwd || process.cwd() });
      child.stderr.pipe(process.stderr);
      child.stdout.pipe(process.stdout);
      child.on('close', (code: number) => {
        if (code !== 0) {
          return reject(!code);
        }
        return resolve(!code);
      });
    });
  };

  static runCommand(runner: string, args: string[]): Promise<boolean> {
    return UtilsService.Worker({
      command: isWin ? 'cmd' : 'npx',
      args: [
        ...(isWin ? ['/c', 'npx'] : []),
        runner,
        ...args
          .slice(2)
          .filter((arg) => !Object.values(Tasks).includes(arg as Tasks))
          .filter((v) => v !== runner),
      ],
    });
  }

  static async revertJson(originalJson: string, tempJson: string) {
    const json = await UtilsService.readJson(tempJson);
    UtilsService.writeFileJson(originalJson, json);
    await promisify(unlink)(tempJson);
  }

  static async readJson<T = PackageJson>(
    name: string,
    cwd: string = process.cwd(),
  ) {
    return JSON.parse(await this.readJsonString(name, cwd)) as T;
  }

  private static async readJsonString(
    name: string,
    cwd: string = process.cwd(),
  ) {
    try {
      return await promisify(readFile)(join(cwd, name), {
        encoding: 'utf-8',
      });
    } catch (e) {}
    return null;
  }

  static async modifyJson(
    packageJson: PackageJson,
    dependencies: DependenciesLink[],
  ) {
    for (const { dep, folder } of dependencies) {
      packageJson.dependencies[dep] = `file:${folder}`;
    }
    await promisify(writeFile)(
      WorkingFiles.PACKAGE_JSON,
      JSON.stringify(packageJson, null, 2),
      { encoding: 'utf-8' },
    );
  }

  static async fileExists(filename: string) {
    try {
      await promisify(stat)(filename);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }
  }

  static exitHandler(
    [originalPackageJson, originalPackageLockJson]: [PackageJson, PackageJson],
    success: boolean,
  ) {
    return async (args: Arguments) => {
      if (!args.leaveChanges) {
        UtilsService.writeFileJson(
          WorkingFiles.PACKAGE_JSON,
          originalPackageJson,
        );
        if (originalPackageLockJson) {
          UtilsService.writeFileJson(
            WorkingFiles.PACKAGE_LOCK_JSON,
            originalPackageLockJson,
          );
        }
      } else if (
        !(await UtilsService.fileExists(WorkingFiles.PACKAGE_TEMP_JSON))
      ) {
        UtilsService.writeFileJson(
          WorkingFiles.PACKAGE_TEMP_JSON,
          originalPackageJson,
        );
      }
      process.exit(success ? 0 : 1);
    };
  }

  static createVirtualSymlink([packageJson, packageLockJson]: [
    PackageJson,
    PackageJson,
  ]) {
    return async (args: Arguments) => {
      packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
      let successStatus = false;
      const runner =
        args.runner || packageJson.fireConfig.runner || DEFAULT_RUNNER;

      if (args.revertChanges) {
        return await UtilsService.revertJson(
          WorkingFiles.PACKAGE_JSON,
          WorkingFiles.PACKAGE_TEMP_JSON,
        );
      }

      const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

      if (packageJson.fireDependencies) {
        const linkedDepndencies = packageJson.fireDependencies;
        const dependencies: DependenciesLink[] = Object.keys(
          linkedDepndencies,
        ).map((dep) => ({
          dep,
          folder: linkedDepndencies[dep],
        }));

        process.stdin.resume();
        const signals: Signals[] = [
          'exit',
          'SIGINT',
          'SIGUSR1',
          'SIGUSR2',
          'uncaughtException',
        ];
        signals.map((event) =>
          process.on(event as never, () =>
            UtilsService.exitHandler(
              [originalPackageJson, packageLockJson],
              successStatus,
            )(args),
          ),
        );

        await UtilsService.modifyJson(packageJson, dependencies);
      }

      try {
        if (args.bootstrap) {
          await UtilsService.Worker({ command: 'npm', args: ['install'] });
        }
        if (!args.skipRunner) {
          await UtilsService.runCommand(runner, process.argv);
        }
        successStatus = true;
      } catch (e) {
      } finally {
        await UtilsService.exitHandler(
          [originalPackageJson, packageLockJson],
          successStatus,
        )(args);
      }
      process.stdin.pause();
    };
  }

  static lazy(
    getActionFunc: () => Promise<(...args: never[]) => Promise<unknown>>,
  ): (...args: never[]) => Promise<void> {
    return async (...args: never[]) => {
      try {
        const actionFunc = await getActionFunc();
        await actionFunc(...args);

        process.exit(0);
      } catch (error) {
        UtilsService.exitWithError(error);
      }
    };
  }

  static exitWithError(error: Error): never {
    if (error instanceof ExitCodeError) {
      process.stderr.write(`\n${error.message}\n\n`);
      process.exit(error.code);
    } else {
      process.stderr.write(`\n${error}\n\n`);
      process.exit(1);
    }
  }
}
