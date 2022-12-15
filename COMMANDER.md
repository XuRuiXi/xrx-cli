### node的命令行模块commander使用手册


- Command实例

一般我们使用默认的全局模块
```js
import { program } from 'commander'
program.option()
```
但是如果项目比较复杂，我们可以在各个文件创建自己的实例

```js
import { Command } from 'commander'
const program = new Command();
program.option()
program.parse();
```

- option
```js
// option(命令<参数>， 描述， 默认值)
program
  .option('-d, --debug', 'output extra debugging')
  .option('-p, --pizza-type <type>', 'flavour of pizza', '默认参数')
  .action((optionsParam, cmd) => {
    console.log(optionsParam, cmd)
  })
/* 
  必须执行该函数program.parse，才会分析命令行参数，用以执行option、command等
  program.parse默认arguments就是process.argv（所以这里可以不传）
  而且parse的使用必须在option和command定义完成之后
*/
program.parse(process.argv);
```
通过option，我们可以在命令行输入-d 或者-p执行选项，参数跟在命令后面也在第一个参数。<>尖括号为必填，[]方括号为可选。  
optionsParam是一个对象，包含选项的参数合集  
cmd是Command（program）实例对象
```js
{
  [name]: value
}
```
[name]是后面声明的名字，如果长字符以-连接，就转化为驼峰形式的命名。  
如果没有要求输入参数，默认是boolean。第三个参数为默认参数，例：
```
当在命令行输入 -d
----------
{ pizzaType: '默认参数', debug: true }
```


```
命令行输入 -p 100
----------
{ pizzaType: '100' }
```

当然我们也可以连续输入选项。

```
命令行输入 -d -p 100
----------
{ debug: true, pizzaType: '100' }
```

如果我们输入的命令行变成
```
命令行输入 -p -d
----------
{ pizzaType: '-d' }
```
因为参数总是贪婪的，会把后面的参数消费，因此-d就变成了-p的参数了。

```js
program
  .name('xrx-cli')  // 在usage最前面添加项目名称，与usage配套使用。控制台打印：Usage: xrx-cli <command> [options]
  .usage('<command> [options]')  // usage里的内容会打印在最前面
  .version('0.0.1')
```
设置version之后，会自动生成-V --version选项。
```js
program.version('0.0.1')
```

```
命令行输入 -h
----------
Usage: xrx-cli <command> [options]

Options:
  -V, --version            output the version number
  -d, --debug              output extra debugging
  -p, --pizza-type <type>  flavour of pizza (default: "默认参数")
  -h, --help               display help for command
```
**program.opts\<Function>**：可以获取option的所有参数

```js
const options = program.opts();
```

**program.args\<Array>**：所有未被消费的参数都会被push该数组

**process.argv\<Array>**：所有的参数

- command

```js
function myParseInt(value, dummyPrevious) {
  console.log(dummyPrevious) // 1
  // parseInt 参数为字符串和进制数
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue + dummyPrevious;
}

program
  .command('init <projectName> [anything]')
  .argument('<something>', 'something的描述', myParseInt, 1)
  .option('-t, --type <typeName>')
  .description('init a project')
  .action((projectName, anything, something, opts, cmd) => {
    console.log('init name', projectName, anything, something, opts);
  })
```
**command**：函数入参接收命令，后面也和option一样，跟上参数（可接收多个）。  

**argument**：可以通过该函数添加command的参数，第二个入参为描述，第三个参数为函数，该函数接收两个参数：用户新输入的参数值和当前已有的参数值（即上一次调用自定义处理函数后的返回值），返回新的命令参数值。第四个参数为第三个函数的已有的值（默认值）。 

**option**：command也可以添加option  

**description**：command的描述  

**action**：回调函数的参数依次是command入参、option的入参（仅限于该command的option）、Command实例。我们也可以在action的回调函数里面通过this，直接使用Command实例。

- program.on  

事件监听
```js
// option:debug
program.on('command:init', function() {
  console.log(this.opts());
});
```