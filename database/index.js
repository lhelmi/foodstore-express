const mongoose = require('mongoose');
const { dbHost, dbName, dbPort, dbUser, dbPass } =
require('../app/config');

mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);
const db = mongoose.connection;

module.exports = db;