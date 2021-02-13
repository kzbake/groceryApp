const mongoose = require('mongoose')

const db = mongoose.createConnection('mongodb://localhost/wallet?authSource=admin', { useFindAndModify: true, useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true } );

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('[Server]', 'Connection with MongoDB installed')
});

module.exports = db;

require('../models/UsersModel');
