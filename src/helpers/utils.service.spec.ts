import 'jest';

import { readFile, unlink } from 'fs';
import { promisify } from 'util';

import { PackageJson } from '../types';
import { UtilsService } from './utils.service';

describe('[Util]: tests', () => {
  it('Should write json file', async () => {
    UtilsService.writeFileJson('package-test.json', {
      dependencies: {},
      fireDependencies: {},
      fireConfig: {},
    });
    let isExists = await UtilsService.fileExists('package-test.json');
    expect(isExists).toBeTruthy();
    await promisify(unlink)('package-test.json');
    isExists = await UtilsService.fileExists('package-test.json');
    expect(isExists).toBeFalsy();
  });

  it('Should revert package-temp.json', async () => {
    const testJsonFileName = 'package-temp2.json';
    const testJsonToSave = 'package-temp3.json';
    UtilsService.writeFileJson(testJsonToSave, {
      dependencies: { '@pesho/test': '0.0.1' },
      fireDependencies: {},
      fireConfig: {},
    });
    UtilsService.writeFileJson(testJsonFileName, {
      dependencies: { '@pesho/test': '0.0.1' },
      fireDependencies: {},
      fireConfig: {},
    });
    const file: PackageJson = JSON.parse(
      await promisify(readFile)(testJsonFileName, { encoding: 'utf-8' }),
    );
    expect(file.dependencies['@pesho/test']).toBe('0.0.1');
    UtilsService.revertJson(testJsonToSave, testJsonFileName);
    const modifiedJson: PackageJson = JSON.parse(
      await promisify(readFile)(testJsonToSave, { encoding: 'utf-8' }),
    );
    expect(modifiedJson.dependencies['@pesho/test']).toBe('0.0.1');
    await promisify(unlink)(testJsonToSave);
    expect(await UtilsService.fileExists(testJsonToSave)).toBeFalsy();
  });
});
