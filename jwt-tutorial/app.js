const jwt = require('jsonwebtoken');

const secret = "testing123";
const fakesecret = "abcdef123";
const payload = {name:"sushant"};
const token = jwt.sign({data:payload}, secret, {expiresIn: 30});
console.log(token);

const verify = () => {
    try {
        const data = jwt.verify(token, secret);
        console.log(data);
    }catch(err) {
        console.log(`error : ${err}`);
    }
}


setTimeout(() => {
    console.log('check jwt after 35 seconds');
    verify(token);
}, 35000);

verify(token);