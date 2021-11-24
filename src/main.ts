import { createVirtualSymlink } from './create-virtual-symlink';
import { readJson } from './helpers/read-json';
import {
  getOutFolder,
  getPackagesFolderName,
  WorkingFiles,
} from './injection-tokens';

(async () => {
  const packageJson = await readJson(WorkingFiles.PACKAGE_JSON);

  await createVirtualSymlink(
    packageJson,
    getOutFolder(packageJson),
    getPackagesFolderName(packageJson),
  );
})();
