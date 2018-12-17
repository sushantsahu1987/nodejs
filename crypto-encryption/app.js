const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const readfile = (name) => {
    return new Promise((resolve, reject) => {
        const abspath = path.join(__dirname, name);
        const options = {
            encoding: "utf8"
        };
        fs.readFile(abspath, options, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    })
};

//  You cannot return data from a async function
const app = async () => {


    const IV_LENGTH = 16; // For AES, this is always 16
    const initVect = crypto.randomBytes(IV_LENGTH);

    const encrypt = (text, CIPHER_KEY) => {
        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    const getCipherKey = (password) => {
        return crypto.createHash('sha256').update(password).digest();
    }

    const decrypt = (text, CIPHER_KEY) => {
        const decipher = crypto.createDecipheriv('aes256', CIPHER_KEY, initVect);
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    try {
        const password = await readfile('private.pem');
        const CIPHER_KEY = getCipherKey(password);
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor lacinia quam ut pretium. Sed enim nisl, pharetra eget";
        const content = encrypt(text, CIPHER_KEY)
        console.log(decrypt(content, CIPHER_KEY));
    } catch (err) {
        console.log(err);
    }

}


app();
// const content = awa