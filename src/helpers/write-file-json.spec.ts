import 'jest';

import { unlink } from 'fs';
import { promisify } from 'util';

import { fileExists } from './file-exists';
import { writeFileJson } from './write-file-json';

describe('[WriteFileJson]: tests', () => {
  it('Should write json file', async () => {
    writeFileJson('package-test.json', {
      dependencies: {},
      fireDependencies: {},
      fireConfig: {},
    });
    let isExists = await fileExists('package-test.json');
    expect(isExists).toBeTruthy();
    await promisify(unlink)('package-test.json');
    isExists = await fileExists('package-test.json');
    expect(isExists).toBeFalsy();
  });
});
