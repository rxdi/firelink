import { writeFile } from 'fs';
import { promisify } from 'util';

import { linkedPackagesName, PackageJson, WorkingFiles } from '../injection-tokens';

export async function modifyJson(packageJson: PackageJson, dependencies: { dep: string; folder: string }[]) {
  await Promise.all(
    dependencies.map(async ({ dep }) => {
      packageJson.dependencies[dep] = `file:./${linkedPackagesName}/${dep.split('/')[1]}`;
    }),
  );
  await promisify(writeFile)(WorkingFiles.PACKAGE_JSON, JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
}
