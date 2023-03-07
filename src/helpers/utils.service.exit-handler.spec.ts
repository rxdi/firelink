import { PackageJson, WorkingFiles } from '../types';
import { UtilsService } from './utils.service';

describe('exitHandler', () => {
  const fakePackageJson = {
    dependencies: {
      foo: 'bar',
    },
    fireDependencies: {
      baz: 'qux',
    },
  } as PackageJson;

  const mockIncludes = jest.fn();
  const mockFileExists = jest.fn();
  const mockWriteFileJson = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .spyOn(UtilsService, 'writeFileJson')
      .mockImplementation(mockWriteFileJson);
    jest.spyOn(UtilsService, 'fileExists').mockImplementation(mockFileExists);

    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  it('should exit with correct status on success', async () => {
    await UtilsService.exitHandler(
      [fakePackageJson, fakePackageJson],
      true,
    )({});
    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should exit with correct status on failure', async () => {
    await UtilsService.exitHandler(
      [fakePackageJson, fakePackageJson],
      false,
    )({});
    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should write original package.json contents back to package.json if not otherwise specified', async () => {
    await UtilsService.exitHandler(
      [fakePackageJson, fakePackageJson],
      true,
    )({ leaveChanges: false });
    expect(mockWriteFileJson).toHaveBeenCalledTimes(2);
    expect(mockWriteFileJson).toHaveBeenCalledWith(
      WorkingFiles.PACKAGE_JSON,
      fakePackageJson,
    );
  });

  it('should leave changes to package.json and write original to temp file if --leave-changes specified', async () => {
    mockIncludes.mockReturnValueOnce(true);
    mockFileExists.mockReturnValueOnce(false);

    await UtilsService.exitHandler(
      [fakePackageJson, fakePackageJson],
      true,
    )({ leaveChanges: true });
    expect(mockWriteFileJson).toHaveBeenCalledTimes(1);
    expect(mockWriteFileJson).toHaveBeenCalledWith(
      WorkingFiles.PACKAGE_TEMP_JSON,
      fakePackageJson,
    );
  });

  it('should not overwrite package.temp.json even if --leave-changes is specified', async () => {
    mockIncludes.mockReturnValueOnce(true);
    mockFileExists.mockReturnValueOnce(true);

    await UtilsService.exitHandler(
      [fakePackageJson, fakePackageJson],
      true,
    )({ leaveChanges: true });
    expect(mockWriteFileJson).toHaveBeenCalledTimes(0);
  });
});
