const dotENV = require('dotenv');

dotENV.config();

module.exports = {
    PORT : process.env.PORT
}