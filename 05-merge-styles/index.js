const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const writableStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));

const mergeStyles = async function () {
   const files = await fsPromises.readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true });
   let arr = [];
   for (const file of files) {
      if (file.isFile() && path.extname(file.name) == '.css') {
         const stream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name), 'utf-8')
         stream.on('data', (chunk) => {
            // arr += chunk + '\n';
            writableStream.write(chunk.toString());
         })
      }
   }
}
mergeStyles();
