import { PackageJson } from '../types';
import { UtilsService } from './utils.service';

describe('createVirtualSymlink', () => {
  const fakePackageJson = {
    dependencies: {
      foo: 'bar',
    },
    fireDependencies: {
      baz: 'qux',
    },
  } as PackageJson;

  const mockExitHandler = jest.fn().mockImplementation(() => () => null);
  const mockModifyJson = jest.fn();
  const mockRevertJson = jest.fn();
  const mockRunCommand = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(UtilsService, 'runCommand').mockImplementation(mockRunCommand);
    jest.spyOn(UtilsService, 'revertJson').mockImplementation(mockRevertJson);
    jest.spyOn(UtilsService, 'modifyJson').mockImplementation(mockModifyJson);
    jest.spyOn(UtilsService, 'exitHandler').mockImplementation(mockExitHandler);
  });

  it('should exit successfully if final command succeeds', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.resolve(true));
    await UtilsService.createVirtualSymlink([fakePackageJson, fakePackageJson])(
      {},
    );
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(
      [fakePackageJson, fakePackageJson],
      true,
    );
  });

  it('should exit with error if final command fails', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.reject(false));
    await UtilsService.createVirtualSymlink([fakePackageJson, fakePackageJson])(
      {},
    );
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(
      [fakePackageJson, fakePackageJson],
      false,
    );
  });

  it('should only revert json and exit if --revert-changes flag is present', async () => {
    await UtilsService.createVirtualSymlink([fakePackageJson, fakePackageJson])(
      {
        revertChanges: true,
      },
    );
    expect(mockRevertJson).toHaveBeenCalledTimes(1);
    expect(mockRunCommand).toHaveBeenCalledTimes(0);
    expect(mockExitHandler).toHaveBeenCalledTimes(0);
    process.argv.pop();
  });

  it('should update dependencies if fireDependencies are present in original package.json', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.resolve(true));
    await UtilsService.createVirtualSymlink([fakePackageJson, fakePackageJson])(
      {},
    );
    expect(mockModifyJson).toHaveBeenCalledTimes(1);
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(
      [fakePackageJson, fakePackageJson],
      true,
    );
  });
});
