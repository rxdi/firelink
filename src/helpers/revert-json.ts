import { unlink } from 'fs';
import { promisify } from 'util';

import { WorkingFiles } from '../injection-tokens';
import { readJson } from './read-json';
import { writeFileJson } from './write-file-json';

export async function revertJson() {
  writeFileJson(WorkingFiles.PACKAGE_JSON, await readJson(WorkingFiles.PACKAGE_TEMP_JSON));
  await promisify(unlink)(WorkingFiles.PACKAGE_TEMP_JSON);
}
