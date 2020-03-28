import 'jest';

import { exists, readFile, unlink } from 'fs';
import { promisify } from 'util';

import { PackageJson } from '../injection-tokens';
import { revertJson } from './revert-json';
import { writeFileJson } from './write-file-json';

describe('[RevertJson]: tests', () => {
  it('Should revert package-temp.json', async () => {
    const testJsonFileName = 'package-temp2.json';
    const testJsonToSave = 'package-temp3.json';
    writeFileJson(testJsonToSave, { dependencies: { '@pesho/test': '0.0.1' }, fireDependencies: {}, fireConfig: {} });
    writeFileJson(testJsonFileName, { dependencies: { '@pesho/test': '0.0.1' }, fireDependencies: {}, fireConfig: {} });
    const file: PackageJson = JSON.parse(await promisify(readFile)(testJsonFileName, { encoding: 'utf-8' }));
    expect(file.dependencies['@pesho/test']).toBe('0.0.1');
    revertJson(testJsonToSave, testJsonFileName);
    const modifiedJson: PackageJson = JSON.parse(await promisify(readFile)(testJsonToSave, { encoding: 'utf-8' }));
    expect(modifiedJson.dependencies['@pesho/test']).toBe('0.0.1');
    await promisify(unlink)(testJsonToSave);
    expect(await promisify(exists)(testJsonToSave)).toBeFalsy();
  });
});
