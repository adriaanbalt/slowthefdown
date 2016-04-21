var mongoose = require('mongoose'),
    shortId = require('shortid');

var HighScoreSchema = new mongoose.Schema({
    
    _id: {
        type: String,
        unique: true
    },
    
    createdDate: {
        type: Date,
        default: new Date()
    },
    
    lastUpdatedDate: {
        type: Date,
        default: new Date()
    },
    
    title: String,
    description: String,
    type: String,
    highscore: Number,
    
    user: {
        type: String,
        ref: 'User'
    }

});

mongoose.model('HighScore', HighScoreSchema);
