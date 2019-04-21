var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
// var moment = require('moment-timezone');
var moment = require('jalali-moment');

// Moameleh Schema
var MoamelehSchema = new mongoose.Schema({
  shenasehMoameleh: {
    type: String,
    required: false
  },
  tarikhMoameleh: {
    type: String
    // ,default: moment.tz('Asia/Tehran').format()
  },
  tedadSahmMoameleh: Number,
  gheymatMoameleh: Number,
  arzeshSahmMoameleh: Number,
  forushandeh_username: String,
  forushandeh_fullName: String,
  forushandeh_darkhastId: String,
  kharidar_username: String,
  kharidar_fullName: String,
  kharidar_darkhastId: String,
  userIdSabtKonandeh: {
    type: String,
    required: false
  },
  usernameSabtKonandeh: {
    type: String,
    required: false
  },
  fullnameSabtKonandeh: {
    type: String,
    required: false
  }
});

MoamelehSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikhMoameleh == null) {
    self.tarikhMoameleh = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});

// Darkhast Shcemas
var DarkhastSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fullName: String,
  noeDarkhast: {
    type: String,
    enum: ['خرید', 'فروش'],
    required: true
  },
  tedadSahm: Number,
  gheymatSahm: Number,
  arzeshSahm: Number,
  tedadMoamelehShodeh: {
    type: Number,
    required: false,
    default: 0
  },
  tedadBaghiMandeh: {
    type: Number,
    required: false
  },
  tarikhDarkhast: {
    type: String
  },
  tarikhUpdate: {
    type: String,
    required: false
  },
  vazeiat: {
    type: String,
    enum: ['در انتظار', 'لغو شده', 'انجام شده', 'در حال انجام'],
    required: true,
    default: 'در انتظار'
  },
  tozihat: {
    type: String,
    required: false
  },
  moamelat: [MoamelehSchema]
});


DarkhastSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikhDarkhast == null) {
    self.tarikhDarkhast = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});

// Portfo Schema
var PortfoSchema = new mongoose.Schema({
  username: String,
  userId: String,
  fullName: String,
  tedadSahm: Number,
  moamelat: {
    type: [MoamelehSchema],
    required: false
  }
});

var ClaimSchema = new mongoose.Schema({
  claim: String,
  tozihat: {
    type: String,
    required: false
  }
});

// Noe File
var NoeFileSchema = new mongoose.Schema({
  noeFile: {
    type: String
  }
});

// FileInfo
var UserFileSchema = new mongoose.Schema({
  filename: {
    type: String
  },
  encoding: {
    type: String
  },
  md5: {
    type: String
  },
  mimetype: {
    type: String
  },
  originalname: {
    type: String
  },
  size: {
    type: Number
  },
  uploadDate: {
    type: String
  },
  noeFile: {
    type: String
  }
});

// User Schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  family: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false
  },
  codeMelli: {
    type: String,
    required: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  confirmed: {
    type: Boolean, default: false
  },
  claims: [ClaimSchema],
  userFiles: [UserFileSchema]
});

UserSchema.virtual('fullName').get(function () {
  return this.name + ' ' + this.family
});

// hash password before saving user
UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password'))
    return next();

  // var salt = bcrypt.genSaltSync(10);
  // var hash = bcrypt.hashSync(user.password, salt);
  // user.password = hash;
  // next();
  const saltRounds = 10;
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


// Gheymat Rooz
var GheymatRoozSahmSchema = new mongoose.Schema({
  tarikh: {
    type: String
  },
  gheymatRooz: Number
});

GheymatRoozSahmSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikh == null) {
    self.tarikh = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});

// Define Models
var Darkhast = mongoose.model('Darkhast', DarkhastSchema);
var Claim = mongoose.model('Claim', ClaimSchema);
var NoeFile = mongoose.model('NoeFile', NoeFileSchema);
var User = mongoose.model('User', UserSchema);
var Moameleh = mongoose.model('Moameleh', MoamelehSchema)
var Portfo = mongoose.model('Portfo', PortfoSchema)
var GheymatRoozSahm = mongoose.model('GheymatRoozSahm', GheymatRoozSahmSchema);





module.exports = {
  Darkhast: Darkhast,
  Claim: Claim,
  NoeFile: NoeFile,
  User: User,
  Moameleh: Moameleh,
  Portfo: Portfo,
  GheymatRoozSahm: GheymatRoozSahm
}
