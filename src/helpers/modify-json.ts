import { promisify } from 'util';
import { linkedPackagesName, PackageJson } from '../injection-tokens';
import { writeFile } from 'fs';

export async function modifyJson(
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
