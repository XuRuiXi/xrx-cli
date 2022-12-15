import { ORGINS } from "../util/constant.js";
import { dirname } from "../util/index.js";
import chalk from "chalk";
import symbol from 'log-symbols';
import fs from 'fs';
chalk.level = 1;

export default function() {
  fs.writeFileSync(dirname(import.meta.url, '../template.json'), JSON.stringify(ORGINS, null, 2), 'utf-8');
  const template = fs.readFileSync(dirname(import.meta.url, '../template.json'), 'utf-8');
  const templateJSON = JSON.parse(template);
  console.log(symbol.success, chalk.green('模板源重置成功'))
  console.log('--------------')
  console.log(chalk.green('目前的模板地址如下：'))
  console.table(templateJSON)
}