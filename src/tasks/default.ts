import { ExitCodeError, UtilsService } from '../helpers';
import { Arguments, Options } from '../types';

export default (options: Options) => async (args: Arguments) =>
  Promise.all([
    UtilsService.readJson(options.packageJsonName),
    UtilsService.readJson(options.packageLockJsonName),
  ]).then((tuple) => {
    const [packageJson] = tuple;
    if (!packageJson) {
      throw new ExitCodeError(1, `Missing package.json`);
    }
    return UtilsService.createVirtualSymlink(tuple)(args);
  });
