import { buildPackages } from './helpers/build-packages';
import { copyPackages } from './helpers/copy-packages';
import { exitHandler } from './helpers/exit-handler';
import { modifyJson } from './helpers/modify-json';
import { readExcludes } from './helpers/read-excludes';
import { revertJson } from './helpers/revert-json';
import { runCommand } from './helpers/run-command';
import {
  DEFAULT_RUNNER,
  FireLinkConfig,
  PackageJson,
  Signals,
  Tasks,
  WorkingFiles,
} from './injection-tokens';

export async function createVirtualSymlink(
  packageJson: PackageJson = {} as PackageJson,
  outFolder: string,
  outFolderName: string,
  tasks: Record<keyof typeof Tasks, Tasks>,
) {
  packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
  let successStatus = false;
  const runner = packageJson.fireConfig.runner || DEFAULT_RUNNER;
  const excludes = [
    ...(packageJson.fireConfig.excludes || []),
    ...(await readExcludes(
      packageJson.fireConfig.excludesFileName || '.fireignore',
    )),
  ];

  if (tasks.REVERT) {
    return await revertJson(
      WorkingFiles.PACKAGE_JSON,
      WorkingFiles.PACKAGE_TEMP_JSON,
    );
  }

  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  if (packageJson.fireDependencies) {
    const linkedDepndencies = packageJson.fireDependencies;
    const dependencies = Object.keys(linkedDepndencies).map(dep => ({
      dep,
      folder: linkedDepndencies[dep],
    }));
    await copyPackages(dependencies, outFolder, outFolderName, excludes);
    if (tasks.BUILD) {
      try {
        await buildPackages(outFolder, outFolderName);
      } catch (e) {}
    }
    process.stdin.resume();
    const signals: Signals[] = [
      'exit',
      'SIGINT',
      'SIGUSR1',
      'SIGUSR2',
      'uncaughtException',
    ];
    signals.map(event =>
      process.on(event as never, () =>
        exitHandler(originalPackageJson, successStatus),
      ),
    );

    await modifyJson(packageJson, dependencies, outFolder, outFolderName);
  }

  try {
    if (!tasks.NO_RUNNER) {
      await runCommand(runner, process.argv);
    }
    successStatus = true;
  } catch (e) {
  } finally {
    await exitHandler(originalPackageJson, successStatus);
  }
  process.stdin.pause();
}
