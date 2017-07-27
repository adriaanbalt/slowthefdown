var mongoose    = require('mongoose'),
    Promise    = require('bluebird');

require('./models/admin');
require('./models/highscore');
require('./models/user');

module.exports = (URI) => {

    console.log ( "   DB URI >", URI );

    // DB connection, use prod db if running prod
    var db = mongoose.connect(URI).connection;

    return new Promise((resolve, reject) => {
      db.on('connected', () => console.log('MongoDB connected!'));
      db.on('open', resolve); //happens after models are loaded
      db.on('error', reject);
    });
};
