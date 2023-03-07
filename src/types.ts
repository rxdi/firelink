export interface FireLinkConfig {
  runner?: string;
}

export interface PackageJson {
  dependencies: Record<string, string>;
  fireConfig?: FireLinkConfig;
  fireDependencies: Record<string, string>;
}

export const DEFAULT_RUNNER = 'firebase';

export enum WorkingFiles {
  PACKAGE_JSON = 'package.json',
  PACKAGE_LOCK_JSON = 'package-lock.json',
  PACKAGE_TEMP_JSON = 'package.temp.json',
}

export interface WorkerOptions {
  command: string;
  args?: string[];
  cwd?: string;
}

export enum Tasks {
  REVERT = '--revert-changes',
  LEAVE_CHANGES = '--leave-changes',
  SKIP_RUNNER = '--skip-runner',
  RUNNER = '--runner',
  BOOTSTRAP = '--bootstrap',
}

export interface DependenciesLink {
  dep: string;
  folder: string;
}

export const isWin = process.platform === 'win32';

export type Signals = NodeJS.Signals | 'exit' | 'uncaughtException';

export interface Arguments {
  runner?: string;
  bootstrap?: boolean;
  revertChanges?: boolean;
  leaveChanges?: boolean;
  skipRunner?: boolean;
}

export interface Options {
  packageJsonName: string;
  packageLockJsonName: string;
}
