const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
    serviceName : process.env.SERVICE_NAME,
    secretKey : process.env.SECRETKEY,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    rootPath: path.resolve(__dirname, '..'),
}