import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const dirname = (url) => path.dirname(fileURLToPath(url));

const deleteAll = (path) => {
  var files = [];
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteAll(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const showTable = (templateList) => {
  const table = Object.keys(templateList).map(i => ({
    "name": i,
    "url": templateList[i]
  }))
  console.table(table);
}

export {
  dirname,
  deleteAll,
  showTable,
}