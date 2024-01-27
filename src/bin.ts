#!/usr/bin/env node
import { Command } from 'commander'
import { handleCommand } from './commands/commandHandler'
const program = new Command()
program.action(handleCommand)
program.parse(process.argv)
