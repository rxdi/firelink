import { writeFileJson } from './write-file-json';
import { readJson } from './read-json';
import { promisify } from 'util';
import { unlink } from 'fs';

export async function revertJson() {
  writeFileJson('package.json', await readJson('package.temp.json'));
  await promisify(unlink)('package.temp.json');
}
