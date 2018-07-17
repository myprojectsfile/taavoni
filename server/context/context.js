var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Moameleh Schema
var MoamelehSchema = new mongoose.Schema({
    tarikhMoameleh: { type: Date, default: Date.now },
    tedadSahmMoameleh: Number,
    arzeshSahmMoameleh: Number,
    forushandeh_username: String,
    forushandeh_fullName: String,
    forushandeh_darkhastId: String,
    kharidar_username: String,
    kharidar_fullName: String,
    kharidar_darkhastId: String,
    userIdSabtKonandeh: { type: String, required: false },
    usernameSabtKonandeh: { type: String, required: false },
    fullnameSabtKonandeh: { type: String, required: false }
});

// Darkhast Shcemas
var DarkhastSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: String,
    noeDarkhast: { type: String, enum: ['خرید', 'فروش'], required: true },
    tedadSahm: Number,
    arzeshSahm: Number,
    tedadMoamelehShodeh: { type: Number, required: false, default: 0 },
    tedadBaghiMandeh: { type: Number, required: false },
    tarikhDarkhast: { type: Date, default: Date.now },
    vazeiat: { type: String, enum: ['در انتظار', 'لغو شده', 'انجام شده', 'در حال انجام'], required: true, default: 'در انتظار' },
    tozihat: { type: String, required: false },
    moamelat: [MoamelehSchema]
});

// Portfo Schema
var PortfoSchema = new mongoose.Schema({
    username: String,
    userId: String,
    fullName: String,
    tedadSahm: Number,
    moamelat: { type: [MoamelehSchema], required: false }
});

var ClaimSchema = new mongoose.Schema({
    claim: String,
    tozihat: { type: String, required: false }
});

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    family: { type: String, required: true },
    mobile: { type: String, required: false },
    codeMelli: { type: String, required: false },
    enabled: { type: Boolean },
    claims: [String]
});

UserSchema.virtual('fullName').get(function () { return this.name + ' ' + this.family });


// Define Models
var Darkhast = mongoose.model('Darkhast', DarkhastSchema);
var User = mongoose.model('User', UserSchema);
var Moameleh = mongoose.model('Moameleh', MoamelehSchema)
var Portfo = mongoose.model('Portfo', PortfoSchema)


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
    Darkhast: Darkhast,
    User: User,
    Moameleh: Moameleh,
    Portfo: Portfo
}