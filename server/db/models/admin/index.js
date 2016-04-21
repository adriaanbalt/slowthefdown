var mongoose = require('mongoose');
    Promise = require('bluebird');

var Admin = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    privilegesFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

//Create super-Admins
mongoose.adminEmails = [
    'adriaan@balt.us'
];

Admin.static('isAdmin', function(user) {
    if(mongoose.adminEmails.indexOf(user.email) !== -1) return Promise.resolve(true);
    else return Promise.promisify(this.findById)(user._id)
        .then((result) => Promise.resolve(!!result));
});

mongoose.model('Admin', Admin);
