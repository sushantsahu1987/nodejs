const express = require('express');
const app = express();

app.get('/', (req, resp)=> {
    resp.send({msg: 'greetings from test.sushantsahu.com'});
})

app.listen(3000, ()=> {
    console.log('this is demo nodejs app running on port 3000');
})