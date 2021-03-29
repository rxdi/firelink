import { writeFile } from 'fs';
import { promisify } from 'util';

import {
  DependenciesLink,
  linkedPackagesName,
  PackageJson,
  WorkingFiles,
} from '../injection-tokens';

export async function modifyJson(
  packageJson: PackageJson,
  dependencies: DependenciesLink[],
) {
  for (const { dep } of dependencies) {
    packageJson.dependencies[dep] = `file:./${linkedPackagesName}/${
      dep.includes('/') ? dep.split('/')[1] : dep
    }`;
  }
  await promisify(writeFile)(
    WorkingFiles.PACKAGE_JSON,
    JSON.stringify(packageJson, null, 2),
    { encoding: 'utf-8' },
  );
}
