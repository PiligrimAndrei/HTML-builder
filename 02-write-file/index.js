const fs = require('fs');
const path = require('path');

const writableStream = fs.createWriteStream(path.resolve(__dirname, 'text2.txt'))

const readline = require('readline').createInterface({
   input: process.stdin,
   output: process.stdout
})

writableStream.on('error', () => {
   console.log('error');
})
readline.on('SIGINT', () => {
   console.log('Good bie');
   readline.close();
})

console.log('Please enter data')
readline.on('line', (data) => {
   if (data == 'exit') {
      console.log("Good luck!")
      readline.close();
   }
   else {
      writableStream.write(data + '\n');
      readline.pause;
   }
})