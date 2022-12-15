### 发布一个脚手架

首先npm初始化项目 npm init  
```
npm init
```

在node环境，为了支持esm，在package.json加上  
```
"name": "xrx-cli", // 项目名称
"type": "module",
```

在根目录创建bin文件夹，用来存放bin命令的脚本文件。新建index.js  

**在index.js加上**
```js
#!/usr/bin/env node
console.log(111)
```
#!/usr/bin/env node 这是为了告诉系统，运行这个文件要使用哪个解析器，并且在哪里找到该解析器。

**bin**  

在package.json加上
```
"bin": {
  "xrx-cli": "bin/index.js",
},
```
加上此属性之后，当别人安装自己的包，就会生成xrx-cli命令，能够在在终端上使用xrx-cli命令。

**npm link**  

为了模拟安装后的效果，我们在脚手架项目的根目录执行
```
npm link
```
该命令会在npm的全局安装目录下，模拟“安装”这个包，其实是生成一个软连接，连接到该项目。所以我们实时改动的代码，在执行xrx-cli命令的时候，也会实时生效。

如果我们想在某个本地项目局部安装，就在项目执行
```
npm link xrx-cli
```
此时就会在该项目安装xrx-cli（在node_modules生成软连接）  

局部解绑
```
npm link xrx-cli
```
全局解绑
```
npm link -g xrx-cli
```

**commander**  
为了分析命令行参数，并且执行相应的命令，我们需要用到commander，它提供给用户命令行输入和参数解析

- command（命令）

**init**  
util/constant.js
```js
export const ORGIN_TYPE = ['react', 'vue'];
export const ORGINS = {
  react: "git@github.com:XuRuiXi/xrx-react-env-template.git",
  vue: ""
}
```
util/index.js

```js
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


// 根据 当前文件绝对路径 和  相对路径 返回绝对路径
const dirname = (filePath, relativePath) => {
  /* 
    fileURLToPath
    将文件URL转换为路径
    file:///C:/Users/xuruixi/Desktop/npm%E5%8C%85%E5%8F%91%E5%B8%83/xrx-cli/bin/cm.js
    --->    C:\Users\xuruixi\Desktop\npm包发布\xrx-cli\bin\cm.js
   */
  /* 
    path.dirname
    用来获取文件/目录所在的文件路径
    G:\tutorials\nodejs-path-dirname\index.js
    --->    G:\tutorials\nodejs-path-dirname
    G:\tutorials\nodejs-path-dirname
    --->    G:\tutorials
  */
  return `${path.dirname(fileURLToPath(filePath))}\\${relativePath.replace(/\//g, '\\')}`;
};

const deleteFolder = (path) => {
  var files = [];
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const testSshAddress = url => {
  const reg = /^.+\.git$/g;
  return reg.test(url);
}

export {
  dirname,
  deleteFolder,
  testSshAddress
}
```

bin/index.js
```js
import fs from 'fs'
import { dirname, testSshAddress } from '../util/index.js'
import { program  } from 'commander'
import changeOrgin from '../commands/changeOrgin.js';
import resetOrgin from '../commands/resetOrgin.js';
import init from '../commands/init.js';
import { ORGIN_TYPE } from '../util/constant.js';
import chalk from 'chalk'

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
```

我们声明了一个命令：init  
它有一个可选的参数（projectName），当执行选项的时候（-t, --type），则必须输入参数（typeName），而且typeName只能是react / vue 其中一个。当输入完成之后执行action。init为项目初始化函数。  

---

除了初始化项目，我们再声明一个可以改变react / vue 模板源的命令

**changeOrgin**  

/template.json
```json
{
  "react": "git@github.com:XuRuiXi/xrx-react-env-template.git",
  "vue": ""
}
```

commands/changeOrgin.js
```js
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
```

log-symbols：一个控制台显示图表的库，目前支持4种图表（info、success、warning、error）
chalk：可以让我们更加简单的结合console.log输出各种颜色的字
chalk.level：0|1|2|3 官方解释是数字越大支持的颜色种类越多

bin/index.js
```js
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
```

---

我们再声明一个可以重置模板源的命令

**resetOrgin**  

commands/resetOrgin.js
```js
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
```
bin/index.js
```js
program
  .command('resetOrgin')
  .description('重置回默认的模板源')
  .action(() => {
    resetOrgin();
  })
```

**program.parse()**
这个函数放在index.js的最后执行，因为只有执行了该方法，Command才能解析命令行参数。但是如果放在命令/选项之前执行，就会因为在这之前初始化导致没有这些命令/选项...

**init**  
最后，我们回到最开始的init函数，它接收两个参数projectName（项目名称）, typeName（项目类型）

commands/init.js
```js
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
        { value: 'vue', name: 'vue' }
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
```

ora：在终端显示loading状态

inquirer：让我们在命令行进行问答输入，支持手动输入、单选、多选...

download：可以让我们根据http / ssh 下载仓库代码
