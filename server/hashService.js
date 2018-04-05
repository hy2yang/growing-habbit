const crypto = require('crypto');

function getHashed(input){
    const hash = crypto.createHash('sha512');
    hash.update(input);
    return (hash.digest('hex'));
}

module.exports = {
    getHashed: getHashed
};
