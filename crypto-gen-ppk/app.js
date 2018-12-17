const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

console.log('generate public private certificate');
console.log(path.join(__dirname, '/certificate'));

const primelength = 1024;
const diffhell = crypto.createDiffieHellman(primelength);
diffhell.generateKeys('base64');

console.log(`public key : ${diffhell.getPublicKey('base64')}`);
console.log(`private key : ${diffhell.getPrivateKey('base64')}`);

const privatekey = path.join(__dirname, 'test_private.pk');
const publickey = path.join(__dirname, 'test_public.pubk');

// console.log(`public key : ${diffhell.getPublicKey('hex')}`);
// console.log(`private key : ${diffhell.getPrivateKey('hex')}`);

const privatefile = fs.createWriteStream(privatekey);
privatefile.write(diffhell.getPrivateKey('base64'));
privatefile.end();

const publicfile = fs.createWriteStream(publickey);
publicfile.write(diffhell.getPublicKey('base64'));
publicfile.end();