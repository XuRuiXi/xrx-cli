import fs from 'fs'
import { dirname, deleteFolder } from '../util/index.js'
import { resolve } from 'path'
import inquirer from 'inquirer'
import ora from 'ora'
import download from 'download-git-repo'
import symbols from 'log-symbols'
import chalk from 'chalk'


export default function(name, type){
  const json = fs.readFileSync(dirname(import.meta.url, '../template.json'), 'utf-8')
  const templateList = JSON.parse(json);
  chalk.level = 1;
  const question = [
    {
      name: 'projectName',
      type: 'input',
      message: '请输入项目名称',
      validate(val) {
        if (!val) {
          return '请输入项目名称'
        } else {
          return true
        }
      }
    },
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目类型:',
      default: 'react',
      choices: [
        { value: 'react', name: 'react' },
        { value: 'bigScreen', name: 'bigScreen' },
        { value: 'oldProject', name: 'oldProject' }
      ]
    },
    {
      type: 'list',
      name: 'jest',
      default: 'no',
      message: '是否集成Jest测试？',
      choices: [
        { value: 'no', name: 'no' },
        { value: 'yes', name: 'yes' }
      ]
    }
  ].filter(i => ![name && 'projectName', type && 'projectType'].includes(i.name))

  inquirer.prompt(question).then((answers) => {
    let { projectName = name, jest, projectType = type } = answers;
    let url = templateList[projectType]
  
    console.log(chalk.green('\n Start generating... \n'))
    // 出现加载图标
    const spinner = ora('Downloading...')
    spinner.start()
    console.log(`\n${url}\n`);
    download(`direct:${url}`, `./${projectName}`, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
        return
      }
      const json = fs.readFileSync(resolve(`./${projectName}/package.json`), 'utf-8');
      const newJson = JSON.parse(json);
      newJson.name = projectName;
      if (jest === 'no') {
        Reflect.deleteProperty(newJson.devDependencies, 'jest');
        Reflect.deleteProperty(newJson.devDependencies, '@types/jest');
        deleteFolder(resolve(`./${projectName}/test`));
      }
      fs.writeFileSync(resolve(`./${projectName}/package.json`), JSON.stringify(newJson, null, 2), 'utf-8', (err) => {
        if (err) throw err;
      });
  
      // 结束加载图标
      spinner.succeed()
      console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
      console.log('\n To get started')
      console.log(`\n    cd ${projectName} \n`)
    })
  })
}