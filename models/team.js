const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Team Schema
const teamSchema = new Schema({
    team_name: { type: String, required: true },
    password: { type: String, required: true },
    found_date: { type: Date, default: Date.now  },
    pw_date: { type: Date, default: Date.now  },
    founder: { type: String, required: true },
    team_users : { type: String, default: '[]' },
    phone: { type: String, default: '[]' },
    own_event: { type: String, default: '[]' }
});

module.exports = mongoose.model('Team', teamSchema);

module.exports.createTeam = function(newTeam, callback){
    const bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newTeam.password, salt, function(err, hash) {
            newTeam.password = hash;
            newTeam.save(callback);
        });
    });
}