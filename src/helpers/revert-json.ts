import { unlink } from 'fs';
import { promisify } from 'util';

import { readJson } from './read-json';
import { writeFileJson } from './write-file-json';

export async function revertJson(originalJson: string, tempJson: string) {
  writeFileJson(originalJson, await readJson(tempJson));
  await promisify(unlink)(tempJson);
}
