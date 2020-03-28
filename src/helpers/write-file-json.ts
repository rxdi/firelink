import { writeFileSync } from 'fs';
import { join } from 'path';

import { PackageJson } from '../injection-tokens';

export function writeFileJson(name: string, json: PackageJson) {
  writeFileSync(join(process.cwd(), name), JSON.stringify(json, null, 2), {
    encoding: 'utf-8',
  });
}
