#!/usr/bin/env node
import fs from 'fs'
import { dirname, testSshAddress } from '../util/index.js'
import { program  } from 'commander'
import changeOrgin from '../commands/changeOrgin.js';
import resetOrgin from '../commands/resetOrgin.js';
import init from '../commands/init.js';
import { ORGIN_TYPE } from '../util/constant.js';
import chalk from 'chalk'
chalk.level = 1;

const packageText = fs.readFileSync(dirname(import.meta.url, '../package.json'), 'utf-8');
const json = JSON.parse(packageText);

program
  .name(json.name)
  .usage('<command>')
  .version(json.version)
  .description('一款用于初始化react / vue项目的脚手架')

program
  .command('init')
  .argument('[projectName]', '项目名称')
  .option('-t, --type <typeName>', 'react / vue')
  .description('初始化项目的命令')
  .action((projectName, opts) => {
    if (opts.type && !ORGIN_TYPE.includes(opts.type)) {
      console.log(chalk.red(`type只能是${ORGIN_TYPE.join('/')}其中一个`));
      return;
    }
    init(projectName, opts.type)
  })

program
  .command('changeOrgin')
  .argument('<orginType>', '更改的源类型 react / vue')
  .argument('<orginAddress>', '更改的源地址')
  .description('更改react / vue的模板源')
  .action((orginType, orginAddress) => {
    if (!ORGIN_TYPE.includes(orginType)) {
      console.log(chalk.red(`orginType只能是${ORGIN_TYPE.join('/')}其中一个`));
      return;
    }
    if (!testSshAddress(orginAddress)) {
      console.log(chalk.red(`目前只支持项目的SSH地址`))
      return;
    }
    changeOrgin(orginType, orginAddress)
  })

program
  .command('resetOrgin')
  .description('重置回默认的模板源')
  .action(() => {
    resetOrgin();
  })


program.parse(process.argv)