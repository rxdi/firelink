import { includes, nextOrDefault } from './helpers/args-extractors';
import { buildPackages } from './helpers/build-packages';
import { exitHandler } from './helpers/exit-handler';
import { modifyJson } from './helpers/modify-json';
import { revertJson } from './helpers/revert-json';
import { runCommand } from './helpers/run-command';
import { Worker } from './helpers/worker';
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
) {
  packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
  let successStatus = false;
  const runner =
    nextOrDefault(Tasks.RUNNER) ||
    packageJson.fireConfig.runner ||
    DEFAULT_RUNNER;

  if (includes(Tasks.REVERT)) {
    return await revertJson(
      WorkingFiles.PACKAGE_JSON,
      WorkingFiles.PACKAGE_TEMP_JSON,
    );
  }

  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  if (packageJson.fireDependencies) {
    const linkedDepndencies = packageJson.fireDependencies;
    const dependencies = Object.keys(linkedDepndencies).map((dep) => ({
      dep,
      folder: linkedDepndencies[dep],
    }));

    if (includes(Tasks.BUILD)) {
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
    signals.map((event) =>
      process.on(event as never, () =>
        exitHandler(originalPackageJson, successStatus),
      ),
    );

    await modifyJson(packageJson, dependencies);
  }

  try {
    if (includes(Tasks.BOOTSTRAP)) {
      await Worker({ command: 'npm', args: ['install'] });
    }
    if (!includes(Tasks.NO_RUNNER)) {
      await runCommand(runner, process.argv);
    }
    successStatus = true;
  } catch (e) {
  } finally {
    await exitHandler(originalPackageJson, successStatus);
  }
  process.stdin.pause();
}
