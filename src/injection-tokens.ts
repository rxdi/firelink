export interface FireLinkConfig {
  runner?: string;
}

export interface PackageJson {
  dependencies: { [key: string]: string };
  fireConfig?: FireLinkConfig;
  fireDependencies: { [key: string]: string };
}

export const linkedPackagesName = '.packages';

export interface WorkerOptions {
  command: string;
  args?: string[];
  cwd?: string;
}
