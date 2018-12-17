const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const privatekey = fs.readFileSync(path.join(__dirname, './private.pem'), 'utf8');
const publickey = fs.readFileSync(path.join(__dirname, './public.pem'), 'utf8');

// console.log(privatekey);
// console.log(publickey);

let encrypt_text = {
    name: "sushant",
    password: "test@123"
}

encrypt_text = JSON.stringify(encrypt_text);

let buffer = Buffer.from(encrypt_text);

let encryptedContent = crypto.publicEncrypt(publickey.toString(), buffer);
encryptedContent = encryptedContent.toString("base64")
console.log(encryptedContent);

buffer = new Buffer(encryptedContent, "base64")
let decryptedContent =  crypto.privateDecrypt(privatekey.toString(), buffer);
decryptedContent = decryptedContent.toString("utf8");
console.log(decryptedContent);

// let encryptedContent = crypto.privateEncrypt(privatekey.toString(), buffer);
// encryptedContent = encryptedContent.toString("base64")
// console.log(encryptedContent);

// buffer = new Buffer(encryptedContent, "base64")
// let decryptedContent = crypto.publicDecrypt(publickey.toString(), buffer);
// decryptedContent = decryptedContent.toString("utf8");
// console.log(decryptedContent);