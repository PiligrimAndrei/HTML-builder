const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const secretFolder = async function () {
   const files = await fsPromises.readdir(path.resolve(__dirname, 'secret-folder'), { withFileTypes: true });
   for (const file of files) {
      if (!file.isDirectory()) {
         const stat = fs.stat(path.resolve(__dirname, 'secret-folder', file.name), (err, stats) => {
            if (err) throw err;
            else console.log((file.name).split('.').slice(0, -1).join('.'), ' - ', path.extname(file.name).slice(1), ' - ', stats.size + ' bytes');
         });
      }
   };
}
secretFolder();
