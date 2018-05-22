var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Define Shcemas
var DarkhastSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: String,
    tedadSahm: Number,
    arzeshSahm: Number,
    tarikhDarkhast: { type: Date, default: Date.now }
});

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    family: { type: String, required: true },
    mobile: { type: String, required: false }
});

// Define Models
var SafeKharid = mongoose.model('SafeKharid', DarkhastSchema);
var SafeForush = mongoose.model('SafeForush', DarkhastSchema);
var User = mongoose.model('User', UserSchema);

// hash password before saving user
UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    var saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(user.password, salt)
            .then(hash => {
                user.password = hash;
                next();
            })
            .catch(err => {
                return next(err);
            });
    });
})

module.exports = {
    SafeForush: SafeForush,
    SafeKharid: SafeKharid,
    User: User
}