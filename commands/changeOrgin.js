import fs from 'fs';
import { dirname } from '../util/index.js';
import symbols from 'log-symbols'
import chalk from 'chalk'
chalk.level = 1;

export default function(orginType, orginAddress) {
  const templateText = fs.readFileSync(dirname(import.meta.url, '../template.json'), 'utf-8');
  const templateJson = JSON.parse(templateText);
  templateJson[orginType] = orginAddress;
  fs.writeFileSync(dirname(import.meta.url, '../template.json'), JSON.stringify(templateJson, null, 2), 'utf-8')
  console.log(symbols.success, chalk.green(`更改${orginType}的模板地址成功`))
  console.log('-------------')
  console.log(chalk.green('目前的模板地址如下：'))
  console.table(templateJson);
}