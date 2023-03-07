#! /usr/bin/env node
import { program } from 'commander';

import packageJson from '../package.json';
import { commands } from './tasks';

program.name(packageJson.name).version(packageJson.version);

commands.map((command) => command(program));

program.parse(process.argv);
