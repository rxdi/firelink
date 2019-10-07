import { includes } from './args-extractors';
import { writeFileJson } from './write-file-json';
import { promisify } from 'util';
import { PackageJson } from '../injection-tokens';
import { exists } from 'fs';

export async function exitHandler(originalPackageJson: PackageJson) {
  if (!includes('--leave-changes')) {
    writeFileJson('package.json', originalPackageJson);
  } else if (!(await promisify(exists)('package.temp.json'))) {
    writeFileJson('package.temp.json', originalPackageJson);
  }
  process.exit();
}
