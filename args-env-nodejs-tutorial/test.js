const config = require('./config');

const test = () => {
    console.log('==================================================');
    console.log('from test module');
    console.log(config.db);
    console.log(config.password);
    console.log('==================================================');
}

module.exports = test;