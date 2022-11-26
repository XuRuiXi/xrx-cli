import fs from 'fs'
import { dirname, deleteAll } from '../util/index.js'
// 命令所在目录
import { resolve } from 'path'
import inquirer from 'inquirer'
import ora from 'ora'
import download from 'download-git-repo'
import symbols from 'log-symbols'
import chalk from 'chalk'

const json = fs.readFileSync(dirname(import.meta.url) + '\\..\\template.json', 'utf-8')
const templateList = JSON.parse(json);

chalk.level = 1;

const question = [
  {
    name: 'name',
    type: 'input',
    message: '请输入项目名称',
    validate(val) {
      if (!val) {
        return 'Name is required!'
      } else {
        return true
      }
    }
  },
  {
    name: 'jest',
    type: 'input',
    message: '是否集成Jest测试？（yes/no）'
  }
]

inquirer.prompt(question).then((answers) => {
  let { name, jest } = answers;
  let url = templateList.xrx

  console.log(chalk.green('\n Start generating... \n'))
  // 出现加载图标
  const spinner = ora('Downloading...')
  spinner.start()

  download(`direct:${url}`, `./${name}`, { clone: true }, (err) => {
    if (err) {
      spinner.fail()
      console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
      return
    }
    const json = fs.readFileSync(`${resolve('./')}\\${name}\\package.json`, 'utf-8');
    const newJson = JSON.parse(json);
    newJson.name = name;
    if (['n', 'no', 'No'].indexOf(jest) !== -1) {
      Reflect.deleteProperty(newJson.devDependencies, 'jest');
      Reflect.deleteProperty(newJson.devDependencies, '@types/jest');
      deleteAll(`${resolve('./')}\\${name}\\test`);
    }
    fs.writeFileSync(`${resolve('./')}\\${name}\\package.json`, JSON.stringify(newJson, null, 2), 'utf-8', (err) => {
      if (err) throw err;
    });

    // 结束加载图标
    spinner.succeed()
    console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
    console.log('\n To get started')
    console.log(`\n    cd ${name} \n`)
  })
})
