#!/usr/bin/env node
import { Command } from 'commander';
import baseAction from './commands/base';
const program = new Command();
program.action(baseAction);
program.parse(process.argv);
