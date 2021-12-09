import { PackageJson, WorkingFiles } from '../injection-tokens';
import { exitHandler } from './exit-handler';

const mockIncludes = jest.fn();
const mockFileExists = jest.fn();
const mockWriteFileJson = jest.fn();

jest.mock('./args-extractors', () => ({
  includes: () => mockIncludes(),
}));
jest.mock('./file-exists', () => ({
  fileExists: () => mockFileExists(),
}));
jest.mock('./write-file-json', () => ({
  writeFileJson: (...args: unknown[]) => mockWriteFileJson(...args),
}));

jest
  .spyOn(process, 'exit')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mockImplementation((_code: number) => undefined as never);

const fakePackageJson = {
  dependencies: {
    foo: 'bar',
  },
  fireDependencies: {
    baz: 'qux',
  },
} as PackageJson;

describe('exitHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should exit with correct status on success', async () => {
    await exitHandler(fakePackageJson, true);
    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should exit with correct status on failure', async () => {
    await exitHandler(fakePackageJson, false);
    expect(process.exit).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should write original package.json contents back to package.json if not otherwise specified', async () => {
    mockIncludes.mockReturnValueOnce(false);

    await exitHandler(fakePackageJson, true);
    expect(mockWriteFileJson).toHaveBeenCalledTimes(1);
    expect(mockWriteFileJson).toHaveBeenCalledWith(
      WorkingFiles.PACKAGE_JSON,
      fakePackageJson,
    );
  });

  it('should leave changes to package.json and write original to temp file if --leave-changes specified', async () => {
    mockIncludes.mockReturnValueOnce(true);
    mockFileExists.mockReturnValueOnce(false);

    await exitHandler(fakePackageJson, true);
    expect(mockWriteFileJson).toHaveBeenCalledTimes(1);
    expect(mockWriteFileJson).toHaveBeenCalledWith(
      WorkingFiles.PACKAGE_TEMP_JSON,
      fakePackageJson,
    );
  });

  it('should not overwrite package.temp.json even if --leave-changes is specified', async () => {
    mockIncludes.mockReturnValueOnce(true);
    mockFileExists.mockReturnValueOnce(true);

    await exitHandler(fakePackageJson, true);
    expect(mockWriteFileJson).toHaveBeenCalledTimes(0);
  });
});
