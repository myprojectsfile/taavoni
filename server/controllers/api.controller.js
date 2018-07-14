// var QueueModel = require('../context/context').SafeKharid;
var context = require('../context/context');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');

module.exports = function (app) {

    // SafeKharid routes
    app.route('/api/safeKharid')
        .get(get_safeKharid)
        .post(checkIsAuthenticated, post_darkhastKharid);

    app.route('/api/safeKharid/:id')
        .get(get_safeKharid_byid)
        .put(update_darkhastKharid)
        .delete(del_safeKharid_byid);

    // SafeForush routes
    app.route('/api/safeForush')
        .get(get_safeForush)
        .post(checkIsAuthenticated, post_darkhastForush);

    app.route('/api/safeForush/:id')
        .get(get_safeForush_byid)
        .put(update_darkhastForush)
        .delete(del_safeForush_byid);

    // define auth routes
    app.route('/api/login')
        .post(post_login);
    app.route('/api/register')
        .post(post_register);

    // listdarkhast routes
    app.route('/api/darkhast/:username')
        .get(getListDarkhastByUsername);

    app.route('/api/darkhast/:id')
        .put(update_darkhast_byid);

    // Moameleh routes
    app.route('/api/moameleh')
        .get(get_moameleh)
        .post(checkIsAuthenticated, post_moameleh);

    app.route('/api/moameleh/:id')
        .get(get_moameleh_byid)
        .put(update_moameleh)
        .delete(del_moameleh_byid);
};

get_safeKharid = function (req, res) {
    context.Darkhast.find({ 'noeDarkhast': 'خرید' }, function (err, result) {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        }
        res.json(result);
    }).where('vazeiat').in(['در انتظار', 'در حال انجام'])
        .sort('tarikhDarkhast');
};

get_safeForush = function (req, res) {
    context.Darkhast.find({ 'noeDarkhast': 'فروش' }, function (err, result) {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        }
        res.json(result);
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
    context.Darkhast.find({ 'username': req.params.username }, function (err, darkhastha) {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        }

        res.json(darkhastha);
    });
};


post_darkhastKharid = function (req, res) {
    // find user by id
    context.User.findOne({ '_id': req.userId }, function (err, user) {

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
                console.log(`this is error: ${err}`);
                res.statusCode = 500;
                res.send(err);
            }

            res.json(darkhast);
        });
    });
};

post_darkhastForush = function (req, res) {
    // find user by id
    context.User.findOne({ '_id': req.userId }, function (err, user) {

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
                console.log(`this is error: ${err}`);
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
    context.User.findOne({ '_id': req.userId }, function (err, user) {

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
                console.log(`this is error: ${err}`);
                res.statusCode = 500;
                res.send(err);
            }

            res.json(newMoameleh);
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
    context.Darkhast.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err) res.status(500).send(err);

        if (!darkhast) res.status(404).send();

        res.json(darkhast);
    });
};

update_darkhastForush = function (req, res) {
    context.Darkhast.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err) res.status(500).send(err);

        if (!darkhast) res.status(404).send();

        res.json(darkhast);
    });
};

update_moameleh = function (req, res) {
    context.Moameleh.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, moameleh) {
        if (err) res.status(500).send(err);

        if (!moameleh) res.status(404).send();

        res.json(moameleh);
    });
};

update_darkhast_byid = function (req, res) {
    context.Darkhast.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err) res.status(500).send(err);

        if (!darkhast) res.status(404).send();

        res.json(darkhast);
    });
};


del_safeKharid_byid = function (req, res) {
    context.Darkhast.remove({ _id: req.params.id }, function (err, darkhast) {
        if (err) res.status(404).send(err);

        if (!darkhast) res.status(404).send();

        res.json({ message: 'درخواست مورد نظر با موفقیت حذف شد' });
    });
};

del_safeForush_byid = function (req, res) {
    context.Darkhast.remove({ _id: req.params.id }, function (err, darkhast) {
        if (err) res.status(404).send(err);

        if (!darkhast) res.status(404).send();

        res.json({ message: 'درخواست مورد نظر با موفقیت حذف شد' });
    });
};

del_moameleh_byid = function (req, res) {
    context.Moameleh.remove({ _id: req.params.id }, function (err, moameleh) {
        if (err) res.status(404).send(err);

        if (!moameleh) res.status(404).send();

        res.json({ message: 'معامله مورد نظر با موفقیت حذف شد' });
    });
};

post_login = function (req, res) {
    var userData = req.body;
    context.User.findOne({ 'username': userData.username }, function (err, user) {
        if (!user) {
            res.statusCode = 401;
            res.json({ message: 'نام کاربری اشتباه است یا وجود ندارد' });
        } else {
            bcrypt.compare(userData.password, user.password, function (err, isMatch) {
                if (err) {
                    res.status(401).send(err);
                }

                if (isMatch) {

                    var expirationDate = getExpirationDate();
                    var userClaims = getUserClaims(user._id);
                    console.log(`claims is :${JSON.stringify(userClaims)}`);
                    var payload = {
                        iss: 'taavoni.bpmo.ir',
                        sub: user._id,
                        exp: expirationDate,
                        claims: userClaims,
                        username: user.username
                    };
                    var token = jwt.encode(payload, getTokenSecret());

                    res.status(200).send({ token });
                } else return res.status(401).send({ message: 'کلمه عبور اشتباه است' });

            });
        }
    });
}


post_register = function (req, res) {
    var newUser = new context.User(req.body);

    newUser.save(function (err, user) {
        if (err) {
            res.status(400).send(err);
        }
        var userClaims = getUserClaims(user._id);
        console.log(`claims is :${userClaims}`);
        var expirationDate = getExpirationDate();
        var payload = {
            iss: 'taavoni.bpmo.ir',
            sub: user._id,
            exp: expirationDate,
            claims: userClaims
        };

        var token = jwt.encode(payload, getTokenSecret());

        res.status(200).send({ token });
    });

};

function checkIsAuthenticated(req, res, next) {
    if (!req.header('Authorization'))
        return res.status(401).send({ message: 'Authorization required' });

    var token = req.header('Authorization').split(' ')[1];

    var payload = jwt.decode(token, getTokenSecret());
    if (!payload) return res.status(401).send({ message: 'Authorizaion Header is Invalid' });

    req.userId = payload.sub;

    next();
}

function getUserClaims(userId) {
    // context.User.findById(userId, function (err, user) {
    //     if (err) return err;
    //     var userClaims = [];

    //     if (user.username == 'admin') { userClaims = ['shareAdmin']; }
    //     else { userClaim = ['shareholder']; }
    //     console.log(userClaims);
    //     return userClaims;
    return ['shareholder'];
    // });
}

function getTokenSecret() {
    return 'asdfghjkl';
}

function getExpirationDate() {
    var now = new Date();
    var validationHours = 4;
    var expirationDate = now.setMinutes(now.getMinutes() + (validationHours * 60));
}