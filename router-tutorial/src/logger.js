const moment = require('moment');

const logger = (req, resp, next) => {

    const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    const ip = req.ip;
    const method = req.method;
    const url = req.originalUrl;
    const msg = `${method} url: ${url}`;

    console.log("================================")
    console.log('logger');
    console.log(date);
    console.log(ip);
    console.log(msg);
    console.log("================================")
    next();
};

module.exports = logger;