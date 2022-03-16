#! /usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';

import pack from '../package.json';
import { lazy } from './helpers';

program.name('firelink').version(pack.version);

program
  .option('--leave-changes', 'modify package.json and create package-temp.json')
  .option('--revert-changes', 'revert package.json from package-temp.json')
  .option('--no-runner', 'do not run the script after finish')
  .option('--build', 'build every package with tsc command')
  .description('https://github.com/rxdi/firelink')
  .action(lazy(() => import('./default').then(m => m.default)));

program.on('command:*', () => {
  console.log();
  console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log();
  program.outputHelp();
  process.exit(1);
});
process.argv.push('-h');
program.parse(process.argv);
