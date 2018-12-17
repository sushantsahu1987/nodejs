const config = require('./config');
const test = require('./test');

console.log('Arguments to read from command line');
console.log(process.argv);

console.log('==================================================');
console.log('Enviorment variables to read from process');
console.log(`PORT = ${process.env.PORT}`);
console.log(`DEV = ${process.env.DEV}`);

console.log('==================================================');
console.log('Enviorment variables defined in dev.env & prod.env');
console.log(`DB = ${process.env.DB}`);
console.log(`PWD = ${process.env.PWD}`);

config.init();
test();