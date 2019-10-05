import { Worker } from './worker';
import {
  readdir,
  readFile,
  writeFile,
  writeFileSync,
  unlink,
  exists
} from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { includes, nextOrDefault } from './args-extractors';

const linkedPackagesName = '.packages';

async function readJson(name: string) {
  return JSON.parse(
    await promisify(readFile)(join(process.cwd(), name), {
      encoding: 'utf-8'
    })
  );
}

function writeFileJson(name: string, json: Object) {
  writeFileSync(join(process.cwd(), name), JSON.stringify(json, null, 2), {
    encoding: 'utf-8'
  });
}

async function revertJson() {
  writeFileJson('package.json', await readJson('package.temp.json'));
  await promisify(unlink)('package.temp.json');
}

async function modifyJson(
  packageJson: PackageJson,
  dependencies: { dep: string; folder: string }[]
) {
  await Promise.all(
    dependencies.map(async ({ dep }) => {
      packageJson.dependencies[dep] = `file:./${linkedPackagesName}/${
        dep.split('/')[1]
      }`;
    })
  );
  await promisify(writeFile)(
    './package.json',
    JSON.stringify(packageJson, null, 2),
    { encoding: 'utf-8' }
  );
}

async function exitHandler(originalPackageJson: PackageJson) {
  if (!includes('--leave-changes')) {
    writeFileJson('package.json', originalPackageJson);
  } else if (!(await promisify(exists)('package.temp.json'))) {
    writeFileJson('package.temp.json', originalPackageJson);
  }
  process.exit();
}

interface FireLinkConfig {
  runner?: string;
}

interface PackageJson {
  dependencies: { [key: string]: string };
  fireConfig?: FireLinkConfig;
  fireDependencies: { [key: string]: string };
}

export async function createFirebasePackageSymlink() {
  const packageJson: PackageJson = await readJson('package.json');
  packageJson.fireConfig = packageJson.fireConfig || ({} as FireLinkConfig);
  let runner = packageJson.fireConfig.runner || 'firebase';

  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  if (includes('--revert-changes')) {
    return await revertJson();
  }

  try {
    if (packageJson && packageJson.fireDependencies) {
      const linkedDepndencies = packageJson.fireDependencies;
      const dependencies = Object.keys(linkedDepndencies).map(dep => ({
        dep,
        folder: linkedDepndencies[dep]
      }));
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

      try {
        if (includes('--buildCommand')) {
          await Promise.all(
            (await promisify(readdir)(
              join(process.cwd(), linkedPackagesName)
            )).map(async dir => {
              await Worker(
                {
                  command: 'npx',
                  args: (nextOrDefault(
                    '--buildCommand',
                    'tsc'
                  ) as string).split(' '),
                  cwd: join(process.cwd(), linkedPackagesName, dir)
                },
                false
              );
            })
          );
        }
      } catch (e) {}
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
          .filter(a => a !== '--leave-changes' && a !== '--revert-changes')
      ]
    });
  } catch (e) {
    console.log(e);
  }
  exitHandler(originalPackageJson);
}
