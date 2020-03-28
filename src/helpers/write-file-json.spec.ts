import 'jest';

import { exists, unlink } from 'fs';
import { promisify } from 'util';

import { writeFileJson } from './write-file-json';

describe('[WriteFileJson]: tests', () => {
  it('Should write json file', async () => {
    writeFileJson('package-test.json', { dependencies: {}, fireDependencies: {}, fireConfig: {} });
    let isExists = await promisify(exists)('package-test.json');
    expect(isExists).toBeTruthy();
    await promisify(unlink)('package-test.json');
    isExists = await promisify(exists)('package-test.json');
    expect(isExists).toBeFalsy();
  });
});
