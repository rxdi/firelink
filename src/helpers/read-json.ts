import { promisify } from 'util';
import { readFile } from 'fs';
import { join } from 'path';

export async function readJson(name: string) {
  return JSON.parse(
    await promisify(readFile)(join(process.cwd(), name), {
      encoding: 'utf-8'
    })
  );
}
