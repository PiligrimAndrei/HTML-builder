const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fsPromises = require('fs/promises');


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
   /* const template = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8')
   template.on('data', (chunk) => {
      arr += chunk;
      console.log(arr);
   })
 */
   const templatePath = path.join(__dirname, 'template.html');
   fileToArray(templatePath).then((arr) => chaingeTemplate(arr)).catch(console.error);


   function chaingeTemplate(arr) {
      //console.log(arr);
      arr.forEach(element => {
         element.includes('{{')
         console.log(element);
      });
      let htmlTag = 'footer';
      console.log(htmlTag);
      components(htmlTag);
   }


   function components(tag) {
      for (const file of htmlFiles) {
         if (file.isFile() && (file.name) == tag + '.html') {
            console.log('Удачно')
         }
      }
   }


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
