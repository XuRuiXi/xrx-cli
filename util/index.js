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