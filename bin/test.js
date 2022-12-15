#!/usr/bin/env node
import { program  } from 'commander'

program
  .version('0.0.1')
  .name('xrx-cli')  //// 在usage最前面添加项目名称，与usage配套使用。控制台打印：Usage: xrx-cli <command> [options]
  .usage('<command> [options]')  // usage里的内容会打印在最前面
  .option('-d, --debug', 'output extra debugging')
  .option('-p, --pizza-type <type>', 'flavour of pizza', '默认参数')
  .action((optionsParam, cmd) => {
    console.log('optionsParam', optionsParam)
  })

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


program.on('command:init', function() {
  console.log(this.opts());
});

/* 
  必须执行该函数program.parse，才会分析命令行参数，用以执行option、command等
  program.parse默认arguments就是process.argv（所以这里可以不传）
  而且parse的使用必须在option和command定义完成之后
*/
program.parse(process.argv);
