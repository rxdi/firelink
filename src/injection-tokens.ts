export interface FireLinkConfig {
  runner?: string;
  outFolderLocation?: string;
  outFolderName?: string;
  excludes?: string[];
  excludesFileName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PackageJson extends Record<string, any> {
  dependencies: { [key: string]: string };
  fireConfig?: FireLinkConfig;
  fireDependencies: { [key: string]: string };
}

export const getPackagesFolderName = (packageJson: PackageJson) =>
  packageJson?.fireConfig?.outFolderName || '.packages';

export const getOutFolder = (packageJson: PackageJson) =>
  packageJson?.fireConfig?.outFolderLocation || '.';

export const DEFAULT_RUNNER = 'firebase';

export enum WorkingFiles {
  PACKAGE_JSON = 'package.json',
  PACKAGE_TEMP_JSON = 'package.temp.json',
}

export interface WorkerOptions {
  command: string;
  args?: string[];
  cwd?: string;
}

export enum Tasks {
  REVERT = '--revert-changes',
  BUILD = '--buildCommand',
  LEAVE_CHANGES = '--leave-changes',
}

export interface DependenciesLink {
  dep: string;
  folder: string;
}

export const isWin = process.platform === 'win32';
