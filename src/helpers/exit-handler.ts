import { exists } from 'fs';
import { promisify } from 'util';

import { PackageJson, Tasks, WorkingFiles } from '../injection-tokens';
import { includes } from './args-extractors';
import { writeFileJson } from './write-file-json';

export async function exitHandler(originalPackageJson: PackageJson) {
  if (!includes(Tasks.LEAVE_CHANGES)) {
    writeFileJson(WorkingFiles.PACKAGE_JSON, originalPackageJson);
  } else if (!(await promisify(exists)(WorkingFiles.PACKAGE_TEMP_JSON))) {
    writeFileJson(WorkingFiles.PACKAGE_TEMP_JSON, originalPackageJson);
  }
  process.exit();
}
