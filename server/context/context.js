// var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
// var moment = require('moment-timezone');
var moment = require('jalali-moment');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate')

// Moameleh Schema
var MoamelehSchema = new mongoose.Schema({
  tarikhMoameleh: {
    type: String
    // ,default: moment.tz('Asia/Tehran').format()
  },
  tedadSahmMoameleh: Number,
  gheymatMoameleh: Number,
  arzeshSahmMoameleh: Number,
  kharidar: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  forushandeh: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  sabtKonandeh: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  darkhastKharid: {
    type: Schema.Types.ObjectId,
    ref: 'Darkhast'
  },
  darkhastForush: {
    type: Schema.Types.ObjectId,
    ref: 'Darkhast'
  }
});

MoamelehSchema.plugin(autopopulate);

MoamelehSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikhMoameleh == null) {
    self.tarikhMoameleh = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});

// Darkhast Shcemas
var DarkhastSchema = new mongoose.Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  }
});

DarkhastSchema.plugin(autopopulate);


DarkhastSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikhDarkhast == null) {
    self.tarikhDarkhast = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  } else {
    self.tarikhUpdate = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});

// Portfo Schema
var PortfoSchema = new mongoose.Schema({
  tedadSahm: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  moameleha: [{
    type: Schema.Types.ObjectId,
    ref: 'Moameleh',
    autopopulate: true
  }]
});

PortfoSchema.plugin(autopopulate);

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
    type: Schema.Types.ObjectId,
    ref: 'NoeFile',
    autopopulate: true
  }
});

UserFileSchema.plugin(autopopulate);

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
  tedadSahm: {
    type: Number,
    default: 0
  },
  darkhastha: [{
    type: Schema.Types.ObjectId,
    ref: 'Darkhast'
  }],
  moameleha: [{
    type: Schema.Types.ObjectId,
    ref: 'Moameleh'
  }],
  claimha: [{
    type: Schema.Types.ObjectId,
    ref: 'Claim',
    autopopulate: true
  }],
  fileha: [{
    type: Schema.Types.ObjectId,
    ref: 'UserFile',
    autopopulate: true
  }],
  semat: {
    type: Schema.Types.ObjectId,
    ref: 'Semat'
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Messages'
  }]
});

UserSchema.plugin(autopopulate);

UserSchema.virtual('fullName').get(function () {
  return this.name + ' ' + this.family
});

UserSchema.set('toObject', {
  virtuals: true
});

UserSchema.set('toJSON', {
  virtuals: true
});

var SematSchema = new Schema({
  semat: String,
  toozihat: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  }
});

SematSchema.plugin(autopopulate);

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


var MessageSchema = new Schema({
  name: String,
  phone: String,
  email: String,
  ferestandeh: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  girandeh: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  message: String,
  tarikh: String,
  pasokh: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
});

MessageSchema.pre('save', function (next) {
  const self = this;
  if (self.tarikh == null) {
    self.tarikh = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  }
  next();
});



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
var Messages = mongoose.model('Messages', MessageSchema);
var Semat = mongoose.model('Semat', SematSchema);





module.exports = {
  Darkhast: Darkhast,
  Claim: Claim,
  NoeFile: NoeFile,
  UserFile: UserFile,
  User: User,
  Moameleh: Moameleh,
  Portfo: Portfo,
  GheymatRoozSahm: GheymatRoozSahm,
  Messages: Messages,
  Semat: Semat
}
