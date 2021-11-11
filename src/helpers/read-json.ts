import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { PackageJson } from '../injection-tokens';

export async function readJson(name: string, cwd: string = process.cwd()) {
  return JSON.parse(
    await promisify(readFile)(join(cwd, name), {
      encoding: 'utf-8',
    }),
  ) as PackageJson;
}
