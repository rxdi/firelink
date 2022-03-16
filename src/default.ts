import { createVirtualSymlink } from './create-virtual-symlink';
import { readJson } from './helpers';
import {
  getOutFolder,
  getPackagesFolderName,
  Tasks,
  WorkingFiles,
} from './injection-tokens';

export default async (cmd: {
  runner: boolean;
  leaveChanges: boolean;
  revertChanges: boolean;
  build: boolean;
}) => {
  const packageJson = await readJson(WorkingFiles.PACKAGE_JSON);

  await createVirtualSymlink(
    packageJson,
    getOutFolder(packageJson),
    getPackagesFolderName(packageJson),
    {
      BUILD: cmd.build ? Tasks.BUILD : null,
      LEAVE_CHANGES: cmd.leaveChanges ? Tasks.LEAVE_CHANGES : null,
      NO_RUNNER: !cmd.runner ? Tasks.NO_RUNNER : null,
      REVERT: cmd.revertChanges ? Tasks.REVERT : null,
    },
  );
};
