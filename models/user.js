const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    join_date: { type: Date, default: Date.now  },
    pw_date: { type: Date, default: Date.now  },
    team : { type: String, default: '[]' },
    phone: { type: String, default: '[]' },
    own_event: { type: String, default: '[]' },
    event_sub: { type: String, default: '[]' },
    event_sub_dir: { type: String, default: '[]' },
    user_sub: { type: String, default: '[]' },
    user_sub_dir: { type: String, default: '[]' }
});

module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
    const bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}