import { Command } from 'commander';

import { lazy } from '../../helpers';

export function registerMainCommands(program: Command) {
  program
    .command('revert:changes')
    .description('Revert changes')
    .action(lazy(() => import('./revert').then(m => m.default)));
}
