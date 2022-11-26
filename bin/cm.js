#!/usr/bin/env node
import fs from 'fs'
import { dirname } from '../util/index.js'
import { program } from 'commander'


const json = fs.readFileSync(dirname(import.meta.url) + '\\..\\package.json', 'utf-8')
program.usage('<command>');
program.version(JSON.parse(json).version)

program
  .command('init')
  .description('init a project')
  .action(() => {
    import('../commands/init.js');
  })

program.parse(process.argv)