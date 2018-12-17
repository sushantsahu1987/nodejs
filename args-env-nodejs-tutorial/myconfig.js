const fs = require('fs');
let data = '';

if (process.env.DEV === 'DEBUG') {
    data = fs.readFileSync(__dirname + '/dev.env', 'utf8');
} else {
    data = fs.readFileSync(__dirname + '/prod.env', 'utf8');
}

const lines = data.split('\n');
lines.forEach(l => {
    const v = l.split('=');
    process.env[v[0].trim()] = v[1].trim();
});