#!/usr/bin/env node
import { Command } from 'commander';
import baseAction from './commands/base';

import { VERSION } from './shared/constant';
const program = new Command();

program
  .option('--init', 'Initialize the cli configuration file in the current working directory.')
  .option(
    '-c --config <config>',
    `Specify a configuration file. By default, find the file at the beginning of in the current working directory.`
  )
  .usage('[command] [options]')
  .version(VERSION, '-v --version')
  .description('Cli of devui.')
  .action(baseAction);

program.parse(process.argv);
