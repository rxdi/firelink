import { Worker } from './worker';
import { includes } from './args-extractors';
import {
  PackageJson,
  FireLinkConfig,
} from '../injection-tokens';
import { readJson } from './read-json';
import { revertJson } from './revert-json';
import { modifyJson } from './modify-json';
import { exitHandler } from './exit-handler';
import { buildPackages } from './build-packages';
import { copyPackages } from './copy-packages';

export async function createVirtualSymlink() {
  const packageJson: PackageJson = await readJson('package.json');
  packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
  let runner = packageJson.fireConfig.runner || 'firebase';

  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  if (includes('--revert-changes')) {
    return await revertJson();
  }
  if (packageJson && packageJson.fireDependencies) {
    const linkedDepndencies = packageJson.fireDependencies;
    const dependencies = Object.keys(linkedDepndencies).map(dep => ({
      dep,
      folder: linkedDepndencies[dep]
    }));
    await copyPackages(dependencies);
    if (includes('--buildCommand')) {
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
      ...process.argv
        .slice(2)
        .filter(
          a =>
            a !== '--leave-changes' &&
            a !== '--revert-changes' &&
            a !== '--buildCommand'
        )
    ]
  });
  exitHandler(originalPackageJson);
}
