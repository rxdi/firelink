import { includes } from './helpers/args-extractors';
import { buildPackages } from './helpers/build-packages';
import { copyPackages } from './helpers/copy-packages';
import { exitHandler } from './helpers/exit-handler';
import { modifyJson } from './helpers/modify-json';
import { readJson } from './helpers/read-json';
import { revertJson } from './helpers/revert-json';
import { Worker } from './helpers/worker';
import { DEFAULT_RUNNER, FireLinkConfig, PackageJson, Tasks, WorkingFiles } from './injection-tokens';

export async function createVirtualSymlink() {
  const packageJson: PackageJson = await readJson(WorkingFiles.PACKAGE_JSON);
  packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
  const runner = packageJson.fireConfig.runner || DEFAULT_RUNNER;

  if (includes(Tasks.REVERT)) {
    return await revertJson();
  }

  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  if (packageJson && packageJson.fireDependencies) {
    const linkedDepndencies = packageJson.fireDependencies;
    const dependencies = Object.keys(linkedDepndencies).map(dep => ({
      dep,
      folder: linkedDepndencies[dep],
    }));
    await copyPackages(dependencies);
    if (includes(Tasks.BUILD)) {
      try {
        await buildPackages();
      } catch (e) {}
    }
    process.stdin.resume();
    process.on('exit', () => exitHandler(originalPackageJson));
    process.on('SIGINT', () => exitHandler(originalPackageJson));
    process.on('SIGUSR1', () => exitHandler(originalPackageJson));
    process.on('SIGUSR2', () => exitHandler(originalPackageJson));
    process.on('uncaughtException', () => exitHandler(originalPackageJson));
    await modifyJson(packageJson, dependencies);
  }
  await Worker({
    command: 'npx',
    args: [
      runner,
      ...process.argv.slice(2).filter(a => a !== Tasks.LEAVE_CHANGES && a !== Tasks.REVERT && a !== Tasks.BUILD),
    ],
  });
  exitHandler(originalPackageJson);
}
