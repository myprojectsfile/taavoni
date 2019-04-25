// var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
// var moment = require('moment-timezone');
var moment = require('jalali-moment');
const Schema = mongoose.Schema;

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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  darkhast: {
    type: Schema.Types.ObjectId,
    ref: 'Darkhast'
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
  moamelat: [MoamelehSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moameleha: [{
    type: Schema.Types.ObjectId,
    ref: 'Moameleh'
  }]
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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moameleha: [{
    type: Schema.Types.ObjectId,
    ref: 'Moameleh'
  }]
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
  },
  fileType: {
    type: Schema.Types.ObjectId,
    ref: 'NoeFile'
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
    type: Boolean,
    default: false
  },
  tedadSahm: Number,
  claims: [ClaimSchema],
  userFiles: [UserFileSchema],
  darkhastha: [{
    type: Schema.Types.ObjectId,
    ref: 'Darkhast'
  }],
  moameleha: [{
    type: Schema.Types.ObjectId,
    ref: 'Moameleh'
  }],
  portfo: {
    type: Schema.Types.ObjectId,
    ref: 'Portfo'
  },
  claimha: [{
    type: Schema.Types.ObjectId,
    ref: 'Claim'
  }],
  fileha: [{
    type: Schema.Types.ObjectId,
    ref: 'UserFile'
  }]
});

UserSchema.virtual('fullName').get(function () {
  return this.name + ' ' + this.family
});

function hashNewPassword(user, next) {
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
}

// hash password before saving user
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
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
  } else {
    next();
  }
})

// UserSchema.post('save', async function (doc, next) {

//   await Portfo.update({
//     username: this.username
//   }, {
//     fullName: this.fullName
//   });

//   await Darkhast.update({
//     username: this.username
//   }, {
//     fullName: this.fullName
//   }, {
//     'multi': true
//   });

//   let darkhast = await Darkhast.find({
//     moamelat: {
//       $elemMatch: {
//         kharidar_username: this.username
//       }
//     }
//   });

//   await darkhast.forEach(async d => {
//     await Darkhast.update({
//       moamelat: {
//         $elemMatch: {
//           kharidar_username: this.username
//         }
//       }
//     }, {
//       $set: {
//         'moamelat.$.kharidar_username': this.fullName
//       }
//     }, {
//       'multi': true
//     });
//   });



//   darkhast = await Darkhast.find({
//     moamelat: {
//       $elemMatch: {
//         forushandeh_username: this.username
//       }
//     }
//   });

//   await darkhast.forEach(async d => {
//     await Darkhast.update({
//       moamelat: {
//         $elemMatch: {
//           forushandeh_username: this.username
//         }
//       }
//     }, {
//       $set: {
//         'moamelat.$.forushandeh_fullName': this.fullName
//       }
//     }, {
//       'multi': true
//     });
//   });


//   await Moameleh.update({
//     forushandeh_username: this.username
//   }, {
//     forushandeh_fullName: this.fullName
//   }, {
//     'multi': true
//   });
//   await Moameleh.update({
//     kharidar_username: this.username
//   }, {
//     kharidar_fullName: this.fullName
//   }, {
//     'multi': true
//   });
// });


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
var UserFile = mongoose.model('UserFile', UserFileSchema);
var User = mongoose.model('User', UserSchema);
var Moameleh = mongoose.model('Moameleh', MoamelehSchema)
var Portfo = mongoose.model('Portfo', PortfoSchema)
var GheymatRoozSahm = mongoose.model('GheymatRoozSahm', GheymatRoozSahmSchema);





module.exports = {
  Darkhast: Darkhast,
  Claim: Claim,
  NoeFile: NoeFile,
  UserFile: UserFile,
  User: User,
  Moameleh: Moameleh,
  Portfo: Portfo,
  GheymatRoozSahm: GheymatRoozSahm
}
