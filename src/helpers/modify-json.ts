import { writeFile } from 'fs';
import { promisify } from 'util';

import {
  DependenciesLink,
  PackageJson,
  WorkingFiles,
} from '../injection-tokens';

export async function modifyJson(
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
