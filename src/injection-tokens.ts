export interface FireLinkConfig {
  runner?: string;
}

export interface PackageJson {
  dependencies: { [key: string]: string };
  fireConfig?: FireLinkConfig;
  fireDependencies: { [key: string]: string };
}

export const linkedPackagesName = '.packages';

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
