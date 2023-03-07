import { Command } from 'commander';

import { UtilsService } from '../helpers';
import { Tasks, WorkingFiles } from '../types';

function mainTasks(program: Command) {
  program
    .allowUnknownOption()
    .option(
      Tasks.LEAVE_CHANGES,
      'modify package.json and create package-temp.json',
    )
    .option(Tasks.REVERT, 'revert package.json from package-temp.json')
    .option(Tasks.SKIP_RUNNER, 'do not run the script after finish')
    .option(
      `-r, ${Tasks.RUNNER} <runner>`,
      'do not run the script after finish',
    )
    .option(
      Tasks.BOOTSTRAP,
      'Change reference inside package.json dependencies to local and execute npm install after finish reverts all of the changes made to package.json',
    )
    .description('https://github.com/rxdi/firelink')
    .action(
      UtilsService.lazy(() =>
        import('./default').then((module) =>
          module.default({
            packageJsonName: WorkingFiles.PACKAGE_JSON,
            packageLockJsonName: WorkingFiles.PACKAGE_LOCK_JSON,
          }),
        ),
      ),
    );
}

export const commands = [mainTasks];
