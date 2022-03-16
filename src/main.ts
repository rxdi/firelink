#! /usr/bin/env node
// import { createVirtualSymlink } from './create-virtual-symlink';
// import { readJson } from './helpers/read-json';
// import {
//   getOutFolder,
//   getPackagesFolderName,
//   WorkingFiles,
// } from './injection-tokens';

// (async () => {
//   const packageJson = await readJson(WorkingFiles.PACKAGE_JSON);

//   await createVirtualSymlink(
//     packageJson,
//     getOutFolder(packageJson),
//     getPackagesFolderName(packageJson),
//   );
// })();

import chalk from 'chalk';
import { program } from 'commander';

import pack from '../package.json';
import { commands } from './commands';
export const main = (argv: string[]) => {
  program.name('firelink').version(pack.version);

  commands.map(command => command(program));

  program.on('command:*', () => {
    console.log();
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log();
    program.outputHelp();
    process.exit(1);
  });

  program.parse(argv);
};
// process.argv.push('revert:changes');

main(process.argv);
