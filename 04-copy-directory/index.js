const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const copyDir = async function () {
   const files = await fsPromises.readdir(path.resolve(__dirname, 'files'), { withFileTypes: true });
   const rmdir = await fsPromises.rm(path.resolve(__dirname, 'files-copy'), { recursive: true, force: true });
   const mkdir = await fsPromises.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true });
   for (const file of files) {
      //console.log(file);
      const copy = await fsPromises.copyFile(path.resolve(__dirname, 'files', file.name), path.resolve(__dirname, 'files-copy', file.name));
   }
}

copyDir()