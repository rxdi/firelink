import { writeFileSync } from 'fs';
import { join } from 'path';

export function writeFileJson(name: string, json: Object) {
  writeFileSync(join(process.cwd(), name), JSON.stringify(json, null, 2), {
    encoding: 'utf-8'
  });
}
