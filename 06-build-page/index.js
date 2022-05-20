const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fsPromises = require('fs/promises');
const { writer } = require('repl');

const writableHtml = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
const writableCss = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));

const htmlBuilder = async function () {
   const mkdir = await fsPromises.mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });
   const files = await fsPromises.readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true });
   const htmlFiles = await fsPromises.readdir(path.resolve(__dirname, 'components'), { withFileTypes: true });
   let arr = [];
   for (const file of files) {
      if (file.isFile() && path.extname(file.name) == '.css') {
         const stream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name), 'utf-8')
         stream.on('data', (chunk) => {
            writableCss.write(chunk.toString() + '\n');
         })
      }
   }

   const templatePath = path.join(__dirname, 'template.html');
   fileToArray(templatePath).then((arr) => {
      let i = 1;
      for (const file of htmlFiles) {
         const filename = (file.name).substring(0, (file.name).length - 5);
         const indexfile = arr.findIndex((element) => (element.trim() == '{{' + filename + '}}'));
         const filePath = path.join(__dirname, 'components', file.name);
         fileToArray(filePath).then((filearr) => {
            if (indexfile > 0) {
               arr.splice(indexfile, 1, filearr.join('\n'));
               return arr;
            }
         }).then((arr) => {
            if (i == htmlFiles.length) {
               arr.forEach((element) => {
                  writableHtml.write(element + '\n');
               })
            } else i++;
         })
      }
   })

   // file to Array
   async function fileToArray(filepath) {
      const input = fs.createReadStream(filepath);
      const res = await new Promise((resolve, reject) => {
         const strings = [];
         const rl = readline.createInterface({
            input,
            crlfDelay: Infinity
         });
         rl.on('line', (line) => strings.push(line));
         rl.once('close', () => resolve(strings));
         rl.once('error', (err) => reject(err));
      });
      return res;
   }
}
htmlBuilder();

const copyDir = async function () {
   const files = await fsPromises.readdir(path.resolve(__dirname, 'assets'), { withFileTypes: true });
   const rmdir = await fsPromises.rm(path.resolve(__dirname, 'project-dist', 'assets'), { recursive: true, force: true });
   const mkdir = await fsPromises.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), { recursive: true });
   for (const file of files) {
      if (file.isFile()) {
         const copy = await fsPromises.copyFile(path.resolve(__dirname, 'assets', file.name), path.resolve(__dirname, 'project-dist', 'assets', file.name));
      }
      else if (file.isDirectory()) {
         const mkdirNew = await fsPromises.mkdir(path.resolve(__dirname, 'project-dist', 'assets', file.name), { recursive: true });
         const filesNewDir = await fsPromises.readdir(path.resolve(__dirname, 'assets', file.name), { withFileTypes: true });
         for (const newfile of filesNewDir) {
            if (newfile.isFile()) {
               const copy = await fsPromises.copyFile(path.resolve(__dirname, 'assets', file.name, newfile.name), path.resolve(__dirname, 'project-dist', 'assets', file.name, newfile.name));
            }
         }
      }
   }
}
copyDir()

/*/const templatePath = path.join(__dirname, 'template.html');
   fileToArray(templatePath).then((arr) => chaingeTemplate(arr)).then((arr) => console.log('arrOUT', arr));


   function chaingeTemplate(arr) {
      for (const file of htmlFiles) {
         //   console.log('arr: ', arr)
         const filename = (file.name).substring(0, (file.name).length - 5);
         const indexfile = arr.findIndex((element) => (element.trim() == '{{' + filename + '}}'));
         const filePath = path.join(__dirname, 'components', file.name);
         //console.log(filePath);
         fileToArray(filePath).then((filearr) => {
            arr.splice(indexfile, 1, filearr.join("\n"));
            console.log('arrIN', arr);
         })
         //console.log('indexfile:', indexfile, 'filearr:', filearr);
      }
      return arr;
   }*/