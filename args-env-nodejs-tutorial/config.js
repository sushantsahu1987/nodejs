const fs = require('fs');
let config = {};

config.init = () => {
    
    let data = '';
    if(process.env.DEV === 'DEBUG') {
        data = fs.readFileSync(__dirname+'/dev.json','utf8');
    } else {
        data = fs.readFileSync(__dirname+'/prod.json','utf8');
    }

    const result = JSON.parse(data);
    config.db = result.db;
    config.password = result.password;
}

module.exports = config;