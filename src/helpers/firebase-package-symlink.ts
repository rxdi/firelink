import { Worker } from './worker';
import { readdir, readFile, writeFile, writeFileSync } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { includes, nextOrDefault } from './args-extractors';

const linkedPackagesName = '.packages';

export async function createFirebasePackageSymlink() {
  const packageJson: {
    dependencies: { [key: string]: string };
    fireDependencies: { [key: string]: string };
  } = JSON.parse(
    await promisify(readFile)(join(process.cwd(), 'package.json'), {
      encoding: 'utf-8'
    })
  );
  const originalPackageJson = JSON.parse(JSON.stringify(packageJson));

  function revertJson() {
    writeFileSync(
      join(process.cwd(), 'package.json'),
      JSON.stringify(originalPackageJson, null, 2),
      { encoding: 'utf-8' }
    );
  }
  function exitHandler() {
    revertJson();
    process.exit();
  }
  try {
    if (packageJson && packageJson.fireDependencies) {
      const linkedDepndencies = packageJson.fireDependencies;
      const dependencies = Object.keys(linkedDepndencies).map(dep => ({
        dep,
        folder: linkedDepndencies[dep]
      }));
      async function modifyJson() {
        await Promise.all(
          dependencies.map(async ({ dep }) => {
            packageJson.dependencies[dep] = `file:./${linkedPackagesName}/${
              dep.split('/')[1]
            }`;
          })
        );
        if(!nextOrDefault('--leave-changes', null)) {
          await promisify(writeFile)(
            './package.json',
            JSON.stringify(packageJson, null, 2),
            { encoding: 'utf-8' }
          );
        }
      }

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
                  args: (nextOrDefault('--buildCommand', 'tsc') as string).split(' '),
                  cwd: join(process.cwd(), linkedPackagesName, dir)
                },
                false
              );
            })
          );
        }
      } catch (e) {}
      process.stdin.resume();
      process.on('exit', exitHandler);
      process.on('SIGINT', exitHandler);
      process.on('SIGUSR1', exitHandler);
      process.on('SIGUSR2', exitHandler);
      process.on('uncaughtException', exitHandler);
      await modifyJson();
    }
    await Worker({
      command: 'npx',
      args: ['firebase', ...process.argv.slice(2)]
    });
  } catch (e) {
    console.log(e);
  }
  exitHandler();
}
