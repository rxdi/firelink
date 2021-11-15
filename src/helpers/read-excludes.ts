import { readFile } from 'fs';
import { promisify } from 'util';

import { parseIgnoredFiles } from './parse-ignore';

export async function readExcludes(file: string) {
  try {
    const ignore = await promisify(readFile)(file, {
      encoding: 'utf-8',
    });
    return parseIgnoredFiles(ignore);
  } catch (e) {
    return [];
  }
}
