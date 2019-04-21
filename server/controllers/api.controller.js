// var QueueModel = require('../context/context').SafeKharid;
var context = require('../context/context');
var jwt = require('jwt-simple');
// var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
var moment = require('jalali-moment');


module.exports = function (app) {

  // SafeKharid routes
  app.route('/api/safeKharid')
    .get(checkIsAuthenticated, get_safeKharid)
    .post(checkIsAuthenticated, post_darkhastKharid);

  app.route('/api/safeKharid/:id')
    .get(checkIsAuthenticated, get_safeKharid_byid)
    .put(checkIsAuthenticated, update_darkhastKharid)
    .delete(checkIsAuthenticated, del_safeKharid_byid);

  // SafeForush routes
  app.route('/api/safeForush')
    .get(checkIsAuthenticated, get_safeForush)
    .post(checkIsAuthenticated, post_darkhastForush);

  app.route('/api/safeForush/tedadKolSahamForushUser/:username')
    .get(checkIsAuthenticated, get_tedadKolSahamForushUser);

  app.route('/api/safeForush/:id')
    .get(checkIsAuthenticated, get_safeForush_byid)
    .put(checkIsAuthenticated, update_darkhastForush)
    .delete(checkIsAuthenticated, del_safeForush_byid);

  // define auth routes
  app.route('/api/login')
    .get((req, res) => {
      res.json('login api work fine')
    })
    .post(post_login);

  app.route('/api/register')
    .post(post_register);

  // listdarkhast routes
  app.route('/api/darkhast/byUsername/:username')
    .get(checkIsAuthenticated, getListDarkhastByUsername);

  app.route('/api/darkhast/hasNoActiveRequest/noeDarkhast/:noeDarkhast/byUsername/:username')
    .get(checkIsAuthenticated, checkUserHasNoActiveCrossRequest);

  app.route('/api/darkhast/:id')
    .put(checkIsAuthenticated, update_darkhast_byid);

  // Moameleh routes
  app.route('/api/moameleh')
    .get(checkIsAuthenticated, get_moameleh)
    .post(checkIsAuthenticated, post_moameleh);

  app.route('/api/moameleh/:id')
    .get(checkIsAuthenticated, get_moameleh_byid)
    .put(checkIsAuthenticated, update_moameleh)
    .delete(checkIsAuthenticated, del_moameleh_byid);

  // portfo routes
  app.route('/api/portfo')
    .post(checkIsAuthenticated, post_portfo);

  app.route('/api/portfo/byUsername/:username')
    .get(checkIsAuthenticated, getPortfoByUsername);

  app.route('/api/portfo/darayi/byUsername/:username')
    .get(checkIsAuthenticated, getPortfoDarayiByUsername);

  app.route('/api/portfo/:id')
    .put(checkIsAuthenticated, update_portfo_byid)
    .delete(checkIsAuthenticated, del_portfo_byid);

  // user routes
  app.route('/api/user/byUsername/:username')
    .get(checkIsAuthenticated, getUserByUsername);

  app.route('/api/user/byCodeMelli/:codeMelli')
    .get(checkIsAuthenticated, getUserByCodeMelli);

  app.route('/api/user/byUsername/:username/byCodeMelli/:codeMelli')
    .get(CheckUserExistByUsernameOrCodemelli);

  app.route('/api/user/:id')
    .get(checkIsAuthenticated, get_user_byid)
    .put(checkIsAuthenticated, update_user_byid)
    .delete(checkIsAuthenticated, del_user_byid);

  app.route('/api/user/updatePass/:id/:oldPassword')
    .put(checkIsAuthenticated, update_user_pass_byid);

  app.route('/api/user/updateUserFiles/:username')
    .put(checkIsAuthenticated, update_user_files_by_username);

  app.route('/api/user/getUserFiles/:username')
    .get(checkIsAuthenticated, get_user_files_by_username);

  // claim routes
  app.route('/api/claim')
    .get(checkIsAuthenticated, get_claim_list)
    .post(post_claim);

  app.route('/api/claim/:id')
    .get(checkIsAuthenticated, get_claim_byid)
    .put(checkIsAuthenticated, update_claim_byid)
    .delete(checkIsAuthenticated, del_claim_byid);

  // GheymatRoozSahm routes
  app.route('/api/gheymatRoozSahm/akharinGheymat')
    .get(checkIsAuthenticated, get_akharinGhehmatSahm)

  app.route('/api/gheymatRoozSahm')
    .post(checkIsAuthenticated, post_gheymatSahm);

  // app.route('/api/gheymatRoozSahm/:id')
  //     .get(checkIsAuthenticated, get_gheymatRoozSahm_byid)
  //     .put(checkIsAuthenticated, update_gheymatRoozSahm_byid)
  //     .delete(checkIsAuthenticated, del_gheymatRoozSahm_byid);
  // NoeFile routes
  app.route('/api/noeFile')
    .get(get_noeFile)
    .post(post_noeFile);

  app.route('/api/noeFile/:id')
    .put(update_noeFile)
    .delete(delete_noeFile);
};


get_akharinGhehmatSahm = function (req, res) {
  context.GheymatRoozSahm.findOne({}, function (err, gheymat) {
    if (err) res.status(500).send(err);
    else {
      if (!gheymat) res.status(404).send();
      else res.send(gheymat);
    }
  }).sort('-tarikh');
}

get_noeFile = function (req, res) {
  context.NoeFile.find({}, function (err, noeFile) {
    if (err) res.status(500).send(err);
    else {
      if (!noeFile) res.status(404).send();
      else res.send(noeFile);
    }
  });
}

get_claim_list = function (req, res) {
  context.Claim.find({}, function (err, claims) {
    if (err) res.status(500).send(err);
    else {
      if (!claims) res.status(404).send();
      else res.send(claims);
    }
  });
}

get_user_files_by_username = function (req, res) {
  context.User.findOne({
    'username': req.params.username
  }, function (err, user) {

    if (err) res.status(500).send(err);
    else {
      if (!user) res.status(404).send();
      else {
        res.json(user.userFiles);
      }
    }
  });
}

get_claim_byid = function (req, res) {
  context.Claim.findById(req.params.id, function (err, claim) {
    if (err) res.status(500).send(err);
    else {
      if (!claim) res.status(404).send();
      else res.send(claim);
    }
  });
}

post_claim = function (req, res) {
  // create new claim
  var newClaim = new context.Claim(req.body);
  newClaim.save(function (err, claim) {

    if (err) res.status(500).send(err);
    else res.json(claim);
  });
};

post_noeFile = function (req, res) {
  // create new noeFile
  var noeFile = new context.NoeFile(req.body);
  noeFile.save(function (err, noeFile) {

    if (err) res.status(500).send(err);
    else res.json(noeFile);
  });
};

delete_noeFile = function (req, res) {
  context.NoeFile.findByIdAndDelete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
};

update_noeFile = function (req, res) {
  context.NoeFile.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, noeFile) {
    if (err) res.status(500).send(err);

    if (!noeFile) res.status(404).send();
    // return new row
    res.json(noeFile);
  });
};

post_gheymatSahm = function (req, res) {
  // create new ghyematRooz
  var gheymatRooz = new context.GheymatRoozSahm(req.body);
  gheymatRooz.save(function (err, gheymatRow) {

    if (err) res.status(500).send(err);
    else res.json(gheymatRow);
  });
};


checkUserHasNoActiveCrossRequest = function (req, res) {
  // بر اساس نوع درخواست  بصورت برعکس چک میکنیم
  const noeDarkhast = req.params.noeDarkhast == 0 ? 'فروش' : 'خرید';
  const username = req.params.username;

  context.Darkhast.find({
      'username': username,
      'noeDarkhast': noeDarkhast
    }, function (err, darkhastha) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      if (darkhastha.length > 0) res.send(false);
      else res.send(true);

    }).where('vazeiat').in(['در انتظار', 'در حال انجام'])
    .sort('tarikhDarkhast');
}

get_safeKharid = function (req, res) {
  context.Darkhast.find({
    'noeDarkhast': 'خرید'
  }, null, {
    sort: {
      'gheymatSahm': 'desc',
      'tarikhDarkhast': 'asc'
    }
  }, function (err, result) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    res.json(result);
  }).where('vazeiat').in(['در انتظار', 'در حال انجام']);
};

get_safeForush = function (req, res) {
  context.Darkhast.find({
      'noeDarkhast': 'فروش'
    }, null, {
      sort: {
        'gheymatSahm': 'asc',
        'tarikhDarkhast': 'asc'
      }
    }, function (err, result) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }
      res.json(result);
    }).where('vazeiat').in(['در انتظار', 'در حال انجام'])
    .sort('tarikhDarkhast');
};

get_tedadKolSahamForushUser = function (req, res) {
  context.Darkhast.find({
      'noeDarkhast': 'فروش',
      'username': req.params.username
    }, 'tedadBaghiMandeh', function (err, result) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      // محاسبه مجموع کل سهام کاربر
      let i = 0;
      let sum = 0;

      for (i = 0; i < result.length; i++) {
        sum = sum + result[i].tedadBaghiMandeh;
      };

      res.json({
        'tedadKolSahamForush': sum
      });

    }).where('vazeiat').in(['در انتظار', 'در حال انجام'])
    .sort('tarikhDarkhast');
};


get_moameleh = function (req, res) {
  context.Moameleh.find({}, function (err, result) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    res.json(result);
  });
};

getListDarkhastByUsername = function (req, res) {
  context.Darkhast.find({
    'username': req.params.username
  }, function (err, darkhastha) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }

    res.json(darkhastha);
  });
};

getPortfoByUsername = function (req, res) {
  context.Portfo.find({
    'username': req.params.username
  }, function (err, portfo) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    if (!portfo) res.status(404).send();
    res.json(portfo);
  });
};

getPortfoDarayiByUsername = function (req, res) {
  context.Portfo.find({
    'username': req.params.username
  }, 'tedadSahm', function (err, portfo) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    if (!portfo) res.status(404).send();
    res.json(portfo);
  });
};

getUserByUsername = function (req, res) {
  context.User.find({
    'username': req.params.username
  }, '-password', function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    if (!user) res.status(404).send();
    res.json(user);
  });
};

getUserByCodeMelli = function (req, res) {
  context.User.find({
    'codeMelli': req.params.codeMelli
  }, '-password', function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    if (!user) res.status(404).send();
    res.json(user);
  });
};

CheckUserExistByUsernameOrCodemelli = function (req, res) {
  var userExist = false;

  context.User.findOne({
    'username': req.params.username
  }, function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }

    if (user) userExist = true;
    context.User.findOne({
      'codeMelli': req.params.codeMelli
    }, function (err, user) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      if (user) userExist = true;

      res.send(userExist);
    });
  });
};

get_user_byid = function (req, res) {
  context.User.findById(req.params.id, '-password', function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    }
    if (!user) res.status(404).send();
    res.json(user);
  });
};


post_darkhastKharid = function (req, res) {
  // find user by id
  context.User.findOne({
    '_id': req.userId
  }, function (err, user) {

    if (err) res.status(500).send(err);

    if (!user) res.status(404).send();
    // create new darkhast
    var darkhastKharid = new context.Darkhast(req.body);
    // set username & noedarkhast
    darkhastKharid.username = user.username;
    darkhastKharid.noeDarkhast = 'خرید';
    darkhastKharid.fullName = user.fullName;
    darkhastKharid.tedadBaghiMandeh = req.body.tedadSahm;
    darkhastKharid.save(function (err, darkhast) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      res.json(darkhast);
    });
  });
};

post_darkhastForush = function (req, res) {
  // find user by id
  context.User.findOne({
    '_id': req.userId
  }, function (err, user) {

    if (err) res.status(500).send(err);

    if (!user) res.status(404).send();
    // create new darkhast
    var darkhastForush = new context.Darkhast(req.body);
    // set username & noedarkhast
    darkhastForush.username = user.username;
    darkhastForush.noeDarkhast = 'فروش';
    darkhastForush.fullName = user.fullName;
    darkhastForush.tedadBaghiMandeh = req.body.tedadSahm;
    darkhastForush.save(function (err, darkhast) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      res.json(darkhast);
    });
  });
};

post_moameleh = function (req, res) {
  // find user by id
  // userid is added to req by checkIsAuthenticated middleware
  context.User.findOne({
    '_id': req.userId
  }, function (err, user) {

    if (err) res.status(500).send(err);

    if (!user) res.status(404).send();
    // create new moameleh
    var moameleh = new context.Moameleh(req.body);
    // set username
    moameleh.userIdSabtKonandeh = user._id;
    moameleh.usernameSabtKonandeh = user.username;
    moameleh.fullnameSabtKonandeh = user.fullName;
    // save new moameleh
    moameleh.save(function (err, newMoameleh) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      res.json(newMoameleh);
    });
  });
};

post_portfo = function (req, res) {
  // find user by id
  // userid is added to req by checkIsAuthenticated middleware
  context.User.findOne({
    '_id': req.userId
  }, function (err, user) {

    if (err) res.status(500).send(err);

    if (!user) res.status(404).send('کاربری با این شناسه وجود ندارد');
    // create new portfo
    var portfo = new context.Portfo(req.body);
    // set username
    portfo.username = user.username;
    portfo.userId = user._id;
    portfo.fullName = user.fullName;
    // save new moameleh
    portfo.save(function (err, newPortfo) {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }

      res.json(newPortfo);
    });
  });
};

get_safeKharid_byid = function (req, res) {
  context.Darkhast.findById(req.params.id, function (err, darkhast) {
    if (err) res.status(500).send(err);

    if (!darkhast) res.status(404).send();

    res.json(darkhast);
  });
};

get_safeForush_byid = function (req, res) {
  context.Darkhast.findById(req.params.id, function (err, darkhast) {
    if (err) res.status(500).send(err);

    if (!darkhast) res.status(404).send();

    res.json(darkhast);
  });
};

get_moameleh_byid = function (req, res) {
  context.Moameleh.findById(req.params.id, function (err, moameleh) {
    if (err) res.status(500).send(err);

    if (!moameleh) res.status(404).send();

    res.json(moameleh);
  });
};


update_darkhastKharid = function (req, res) {
  ``
  // save changes
  context.Darkhast.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, darkhast) {
    if (err) res.status(500).send(err);

    if (!darkhast) res.status(404).send();
    // return new row
    res.json(darkhast);
  });
};

update_darkhastForush = function (req, res) {
  context.Darkhast.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, darkhast) {
    if (err) res.status(500).send(err);

    if (!darkhast) res.status(404).send();

    res.json(darkhast);
  });
};

update_moameleh = function (req, res) {
  context.Moameleh.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, moameleh) {
    if (err) res.status(500).send(err);

    if (!moameleh) res.status(404).send();

    res.json(moameleh);
  });
};

update_darkhast_byid = function (req, res) {
  // set update date
  req.body['tarikhUpdate'] = moment().locale('fa').format('YYYY/M/D HH:mm:ss');
  context.Darkhast.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, darkhast) {
    if (err) res.status(500).send(err);

    if (!darkhast) res.status(404).send();

    res.json(darkhast);
  });
};

update_portfo_byid = function (req, res) {
  context.Portfo.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, portfo) {
    if (err) res.status(500).send(err);

    if (!portfo) res.status(404).send();

    res.json(portfo);
  });
};

// update_user_byid = function (req, res) {
//   context.User.findOneAndUpdate({
//     _id: req.params.id
//   }, req.body, {
//     new: true
//   }, function (err, user) {
//     if (err) res.status(500).send(err);

//     if (!user) res.status(404).send();

//     res.json(user);
//   });
// };

update_user_byid = function (req, res) {
  context.User.findOne({
    _id: req.params.id
  }, (err, user) => {
    if (err) res.status(500).end(err);

    if (!user) res.status(404).end();

    Object.assign(user, req.body);
    user.save((err) => {
      if (err) res.status(500).end(err);

      res.json(user);
    })
  });
};


update_claim_byid = function (req, res) {
  context.Claim.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, claim) {
    if (err) res.status(500).send(err);
    else {
      if (!claim) res.status(404).send();
      else res.json(claim);
    }
  });
};

update_user_pass_byid = function (req, res) {
  // find user
  context.User.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) res.status(500).send(err);
    if (!user) res.status(404).send();
    else {
      // check old password matched
      const oldPassword = req.params.oldPassword;
      bcrypt.compare(oldPassword, user.password, function (err, isMatch) {
        if (err) res.status(500).send(err);
        else {
          if (isMatch) {
            user.password = req.body.password;
            // save user changes
            user.save((err) => {
              if (err) res.json(err);
              else res.json(user);
            })
          } else res.status(400).send('کلمه عبور قبلی اشتباه است');
        }
      });
    }
  });
};

update_user_files_by_username = function (req, res) {
  context.User.findOne({
    username: req.params.username
  }, (err, user) => {
    if (err) res.status(500).send(err);

    if (!user) res.status(404).send();
    user.userFiles.push(req.body);
    user.save((err) => {
      if (err) res.json(err);

      res.json(user);
    })
  });
};


del_safeKharid_byid = function (req, res) {
  context.Darkhast.remove({
    _id: req.params.id
  }, function (err, darkhast) {
    if (err) res.status(404).send(err);

    if (!darkhast) res.status(404).send();

    res.json({
      message: 'درخواست مورد نظر با موفقیت حذف شد'
    });
  });
};

del_safeForush_byid = function (req, res) {
  context.Darkhast.remove({
    _id: req.params.id
  }, function (err, darkhast) {
    if (err) res.status(404).send(err);

    if (!darkhast) res.status(404).send();

    res.json({
      message: 'درخواست مورد نظر با موفقیت حذف شد'
    });
  });
};

del_moameleh_byid = function (req, res) {
  context.Moameleh.remove({
    _id: req.params.id
  }, function (err, moameleh) {
    if (err) res.status(404).send(err);

    if (!moameleh) res.status(404).send();

    res.json({
      message: 'معامله مورد نظر با موفقیت حذف شد'
    });
  });
};

del_portfo_byid = function (req, res) {
  context.Portfo.remove({
    _id: req.params.id
  }, function (err, portfo) {
    if (err) res.status(404).send(err);

    if (!portfo) res.status(404).send();

    res.json({
      message: 'ردیف پورتفوی مورد نظر با موفقیت حذف شد'
    });
  });
};

del_user_byid = function (req, res) {
  context.User.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) res.status(404).send(err);

    if (!user) res.status(404).send();

    res.json({
      message: 'کاربر مورد نظر با موفقیت حذف شد'
    });
  });
};

del_claim_byid = function (req, res) {
  context.Claim.remove({
    _id: req.params.id
  }, function (err, claim) {
    if (err) res.status(404).send(err);
    else {
      if (!claim) res.status(404).send();
      else res.json({
        message: 'کاربر مورد نظر با موفقیت حذف شد'
      });
    }
  });
};

post_login = function (req, res) {
  var userData = req.body;
  context.User.findOne({
    'username': userData.username
  }, function (err, user) {
    if (!user) {
      res.statusCode = 401;
      res.json({
        message: 'نام کاربری اشتباه است یا وجود ندارد'
      });
    } else {
      // chekck if user is enabled/disabled
      if (!user.enabled) res.status(401).send({
        message: 'این نام کاربری غیر فعال است.لطفا با مدیر سیستم تماس بگیرید.'
      })
      else {
        bcrypt.compare(userData.password, user.password, function (err, isMatch) {
          if (err) {
            res.status(401).send(err);
          }
          if (isMatch) {

            var expirationDate = getExpirationDate();
            var payload = {
              iss: 'taavoni.bpmo.ir',
              exp: expirationDate,
              user: user,
              fullName: user.fullName
            };

            var token = jwt.encode(payload, getTokenSecret());

            res.status(200).send({
              token
            });

          } else return res.status(401).send({
            message: 'کلمه عبور اشتباه است'
          });

        });
      }
    }
  });
}


post_register = function (req, res) {
  // find shareholder claim
  context.Claim.findOne({
    'claim': 'shareholder'
  }, (err, shareholderClaim) => {
    if (err) res.status(500).send(err);
    else {
      var newUser = new context.User(req.body);
      newUser.enabled = true;
      // add shareholder claim to user claims
      if (shareholderClaim)
        newUser.claims.push(shareholderClaim);

      newUser.save(function (err, user) {
        if (err) res.status(500).send(err);
        else {
          // get user and add it to token payload
          context.User.findById(user._id, '-password', function (err, userData) {
            if (err) res.status(500).send(err);

            var expirationDate = getExpirationDate();
            var payload = {
              iss: 'taavoni.bpmo.ir',
              exp: expirationDate,
              user: userData,
              fullName: user.fullName
            };

            // create token to send back to user register method
            var token = jwt.encode(payload, getTokenSecret());

            // create user portfo record
            var newPortfo = new context.Portfo({
              username: user.username,
              userId: user.userId,
              fullName: user.fullName,
              tedadSahm: 0,
              moamelat: []
            });

            // save newPortfo record
            newPortfo.save(function (err, portfo) {
              if (err) res.status(500).send(err + ': خطا در ایجاد رکورد خالی پورتفوی کاربر بهنگام ثبت نام');
              else res.status(200).send({
                token
              });
            });

          });
        }
      });
    }
  });


};


function checkIsAuthenticated(req, res, next) {
  if (!req.header('Authorization'))
    return res.status(401).send({
      message: 'Authorization required'
    });

  var token = req.header('Authorization').split(' ')[1];

  var payload = jwt.decode(token, getTokenSecret());
  if (!payload) return res.status(401).send({
    message: 'Authorizaion Header is Invalid'
  });

  req.userId = payload.user._id;

  next();
}

function getTokenSecret() {
  return 'asdfghjkl';
}

function getExpirationDate() {
  var now = new Date();
  var validationHours = 4;
  var expirationDate = now.setMinutes(now.getMinutes() + (validationHours * 60));
  return expirationDate;
}
