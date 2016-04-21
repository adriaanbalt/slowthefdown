var mongoose = require('mongoose'),
    crypto = require('crypto'),
    shortId = require('shortId');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    salt: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    lastLoginDate: {
        type: Date,
        default: new Date()
    },
    google: {
      _id: String,
      photo: String,
      link: String
    },
    facebook: {
      _id: String,
      photo: String,
      link: String
    }
    // type: { // User
    //     type: String, 
    //     enum: ['admin','client', 'contractor'],
    //     required: true
    // }

    // avatar: String,

    // google: {
    //   _id: String,
    //   photo: String,
    //   link: String
    // },
    // facebook: {
    //   _id: String,
    //   photo: String,
    //   link: String
    // },

    // email: String,
    // phone: String,
    // fax: String,

    // businessName: String,
    // firstName: String,
    // lastName: String,

    // address: String,
    // suite: String,
    // city: String,
    // state: String,
    // zipcode: String,

    // rating: Number,

    // security: Number,
    // permissions: Number,

    // password: String,

    // salt: String,

    // contractors: [
    //     {
    //         type: String, 
    //         ref: 'User'
    //     }
    // ],

    // projects: [
    //     { 
    //         type: String,
    //         ref: 'Project'
    //     }
    // ],

    // checklist: [
    //     { 
    //         type: String,
    //         ref: 'Task' 
    //     }
    // ],

    // milestones: [
    //     { 
    //         type: String,
    //         ref: 'Milestone' 
    //     }
    // ],

    // reviews: [
    //     {
    //         type: String, 
    //         ref: 'Review'
    //     }
    // ],

    // skills: [
    //     {
    //         type: String, 
    //         ref: 'Skill'
    //     }
    // ]
});

// add password handling functions as methods on User schema
UserSchema.statics.hashPassword = hashPassword;

// add method on instances to check if password is correct
UserSchema.methods.correctPassword = function(password) {
  return !!this.salt && hashPassword(password, this.salt) === this.password;
};

// hashes password for secure storage
function hashPassword(plainText, salt) {
  console.log ( 'hashPassword' );
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
}

// combines above functions for password save and update handling
function handlePasswordChange(next) {
  console.log ( 'handlePasswordChange' );
    if (this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64'); // generates a random string to be added to the user's password prior to hashing, an extra security measure
        this.password = this.constructor.hashPassword(this.password, this.salt);
    }
    next();
}

UserSchema.pre('save', handlePasswordChange);  // runs 'handlePasswordChange' prior to 'save' action
UserSchema.pre('update', handlePasswordChange);  // runs 'handlePasswordChange' prior to 'update' action

// set user schema on mongoose
mongoose.model('User', UserSchema);



