const fs = require('fs');
const path = require('path');

const writableStream = fs.createWriteStream(path.resolve(__dirname, 'text2.txt'))

const readline = require('readline').createInterface({
   input: process.stdin,
   output: process.stdout
})

writableStream.on('error', () => {
   console.log('Good bie');
})
readline.question('What\'s your name?', (name) => {
   console.log('Hi ', name);
   writableStream.write(name);
   readline.close();
})

