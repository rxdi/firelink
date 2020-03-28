import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

export async function readJson(name: string) {
  return JSON.parse(
    await promisify(readFile)(join(process.cwd(), name), {
      encoding: 'utf-8',
    }),
  );
}
