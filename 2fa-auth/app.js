const express = require('express');
const speakeasy = require('speakeasy');
const lowdb = require('lowdb');
const QRCode = require('qrcode');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const adapter = new FileSync("db.json");
const db = lowdb(adapter);
const app = express();

db.defaults({
    users: []
}).write();

app.get('/register', (req, res) => {

    console.log('creating a user');
    const secret = speakeasy.generateSecret();
    console.log(secret);

    const user = {
        "name": req.query.name,
        "password": req.query.password,
        "secret": secret.base32
    };

    db.get('users').push(user).write();
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        console.log('qr code: ');
        console.log(data_url.length);
        const result = `<html>
            <head>
                <title>qr code</title>
            </head>
            <body>
                <img src="${data_url}" />
            </body>
        </html>`
        res.send(result);
    });

});

app.get('/login', (req, res) => {

    console.log('creating a user');
    const user = db.get('users').find({
        name: req.query.name
    }).value();
    let verified = false;
    console.log(user);
    if (user) {
        verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: req.query.token
        })
    }

    console.log(`user verified ${verified}`);
    const data = (verified) ? "logged in successfully" : "login failed"
    res.send(data);

});

// app.get('/', (req, res) => {
//     res.set('Content-Type', 'image/png')
//         .status(200).sendFile(__dirname + '/qr.png');
// });

app.listen(3000, () => console.log('server is running at port 3000'));