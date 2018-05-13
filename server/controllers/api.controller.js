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
};

get_safeKharid = function (req, res) {
    context.SafeKharid.find({}, function (err, result) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(result);
    });
};

get_safeForush = function (req, res) {
    context.SafeForush.find({}, function (err, result) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(result);
    });
};


post_darkhastKharid = function (req, res) {
    var darkhastKharid = new context.SafeKharid(req.body);
    var user = context.User.findOne({ '_id': req.userId }, function (err, user) {
        if (err) res.status(400).send(err);

        if (!user) res.status(404).send();

        darkhastKharid.username = user.username;
        darkhastKharid.save(function (err, darkhast) {
            if (err) {
                console.log(`this is error: ${err}`);
                res.statusCode = 400;
                res.send(err);
            }

            res.json(darkhast);
        });
    });
};

post_darkhastForush = function (req, res) {
    var darkhastForush = new context.SafeForush(req.body);
    var user = context.User.findOne({ '_id': req.userId }, function (err, user) {
        if (err) res.status(400).send(err);

        if (!user) res.status(404).send();

        darkhastForush.username = user.username;
        darkhastForush.save(function (err, darkhast) {
            if (err) {
                console.log(`this is error: ${err}`);
                res.statusCode = 400;
                res.send(err);
            }

            res.json(darkhast);
        });
    });
};


get_safeKharid_byid = function (req, res) {
    context.SafeKharid.findById(req.params.id, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(darkhast);
    });
};

get_safeForush_byid = function (req, res) {
    context.SafeForush.findById(req.params.id, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(darkhast);
    });
};


update_darkhastKharid = function (req, res) {
    context.SafeKharid.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(darkhast);
    });
};

update_darkhastForush = function (req, res) {
    context.SafeForush.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json(darkhast);
    });
};


del_safeKharid_byid = function (req, res) {
    context.SafeKharid.remove({
        _id: req.params.id
    }, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json({ message: 'درخواست مورد نظر با موفقیت حذف شد' });
    });
};

del_safeForush_byid = function (req, res) {
    context.SafeForush.remove({
        _id: req.params.id
    }, function (err, darkhast) {
        if (err) {
            res.statusCode = 400;
            res.send(err);
        }
        res.json({ message: 'درخواست مورد نظر با موفقیت حذف شد' });
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

                    var payload = {
                        iss: 'taavoni.bpmo.ir',
                        sub: user._id,
                        exp: expirationDate,
                        claims: getUserClaims(user._id)
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

        var expirationDate = getExpirationDate();
        var payload = {
            iss: 'taavoni.bpmo.ir',
            sub: user._id,
            exp: expirationDate,
            claims: getUserClaims(user._id)
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
    return ['shareholder'];
}

function getTokenSecret() {
    return 'asdfghjkl';
}

function getExpirationDate() {
    var now = new Date();
    var validationHours = 4;
    var expirationDate = now.setMinutes(now.getMinutes() + (validationHours * 60));
}