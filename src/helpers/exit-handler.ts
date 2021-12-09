import { PackageJson, Tasks, WorkingFiles } from '../injection-tokens';
import { includes } from './args-extractors';
import { fileExists } from './file-exists';
import { writeFileJson } from './write-file-json';

export async function exitHandler(
  originalPackageJson: PackageJson,
  success: boolean,
) {
  if (!includes(Tasks.LEAVE_CHANGES)) {
    writeFileJson(WorkingFiles.PACKAGE_JSON, originalPackageJson);
  } else if (!(await fileExists(WorkingFiles.PACKAGE_TEMP_JSON))) {
    writeFileJson(WorkingFiles.PACKAGE_TEMP_JSON, originalPackageJson);
  }
  process.exit(success ? 0 : 1);
}
