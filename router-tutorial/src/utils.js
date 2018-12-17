const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const utils = {};


utils.hash = (text) => {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(text, salt);
}

utils.verifyHash = (password, hash) => {
    return bcrypt.compareSync(password, hash); // true
}


module.exports = utils;