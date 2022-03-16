import { createVirtualSymlink } from './create-virtual-symlink';
import { PackageJson, Tasks } from './injection-tokens';

const mockBuildPackages = jest.fn();
const mockCopyPackages = jest.fn();
const mockExitHandler = jest.fn();
const mockModifyJson = jest.fn();
const mockRevertJson = jest.fn();
const mockRunCommand = jest.fn();

jest.mock('./helpers/build-packages', () => ({
  buildPackages: async (...args: unknown[]) => mockBuildPackages(...args),
}));
jest.mock('./helpers/copy-packages', () => ({
  copyPackages: (...args: unknown[]) => mockCopyPackages(...args),
}));
jest.mock('./helpers/exit-handler', () => ({
  exitHandler: (...args: unknown[]) => mockExitHandler(...args),
}));
jest.mock('./helpers/modify-json', () => ({
  modifyJson: async (...args: unknown[]) => mockModifyJson(...args),
}));
jest.mock('./helpers/revert-json', () => ({
  revertJson: async () => mockRevertJson(),
}));
jest.mock('./helpers/run-command', () => ({
  runCommand: async () => mockRunCommand(),
}));

const fakePackageJson = {
  dependencies: {
    foo: 'bar',
  },
  fireDependencies: {
    baz: 'qux',
  },
} as PackageJson;
const outFolder = '.';
const outFolderName = '.packages';

describe('createVirtualSymlink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should exit successfully if final command succeeds', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.resolve(true));
    await createVirtualSymlink(fakePackageJson, outFolder, outFolderName, {
      BUILD: null,
      LEAVE_CHANGES: null,
      NO_RUNNER: null,
      REVERT: null,
    });
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(fakePackageJson, true);
  });

  it('should exit with error if final command fails', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.reject(false));
    await createVirtualSymlink(fakePackageJson, outFolder, outFolderName, {
      BUILD: null,
      LEAVE_CHANGES: null,
      NO_RUNNER: null,
      REVERT: null,
    });
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(fakePackageJson, false);
  });

  it('should only revert json and exit if --revert-changes flag is present', async () => {
    process.argv.push('--revert-changes');
    await createVirtualSymlink(fakePackageJson, outFolder, outFolderName, {
      BUILD: null,
      LEAVE_CHANGES: null,
      NO_RUNNER: null,
      REVERT: Tasks.REVERT,
    });
    expect(mockRevertJson).toHaveBeenCalledTimes(1);
    expect(mockRunCommand).toHaveBeenCalledTimes(0);
    expect(mockExitHandler).toHaveBeenCalledTimes(0);
    process.argv.pop();
  });

  it('should update dependencies if fireDependencies are present in original package.json', async () => {
    mockRunCommand.mockImplementationOnce(() => Promise.resolve(true));
    await createVirtualSymlink(fakePackageJson, outFolder, outFolderName, {
      BUILD: null,
      LEAVE_CHANGES: null,
      NO_RUNNER: null,
      REVERT: null,
    });
    expect(mockCopyPackages).toHaveBeenCalledTimes(1);
    expect(mockModifyJson).toHaveBeenCalledTimes(1);
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(fakePackageJson, true);
  });

  it('should build fireDependencies if --buildCommand flag is present', async () => {
    process.argv.push('--buildCommand');
    mockRunCommand.mockImplementationOnce(() => Promise.resolve(true));
    await createVirtualSymlink(fakePackageJson, outFolder, outFolderName, {
      BUILD: Tasks.BUILD,
      LEAVE_CHANGES: null,
      NO_RUNNER: null,
      REVERT: null,
    });
    expect(mockCopyPackages).toHaveBeenCalledTimes(1);
    expect(mockBuildPackages).toHaveBeenCalledTimes(1);
    expect(mockModifyJson).toHaveBeenCalledTimes(1);
    expect(mockRunCommand).toHaveBeenCalledTimes(1);
    expect(mockExitHandler).toHaveBeenCalledWith(fakePackageJson, true);
  });
});
