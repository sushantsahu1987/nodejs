const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const logger = require('./src/logger');
const routes = require('./src/routes');

const token = require('./src/token');
token.init();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(logger);
routes(app);
app.listen(3000, () => {
    console.log('server is running on server 3000');
});