// var QueueModel = require('../context/context').SafeKharid;
var context = require('../context/context');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');

module.exports = function (app) {

    app.route('/api/safeKharid')
        .get(get_safeKharid)
        .post(post_darkhastKharid);

    app.route('/api/safeKharid/:id')
        .get(get_safeKharid_byid)
        .put(update_darkhastKharid)
        .delete(del_safeKharid_byid);

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

post_darkhastKharid = function (req, res) {
    var darkhastKharid = new context.SafeKharid(req.body);
    darkhastKharid.save(function (err, darkhast) {
        console.log('saving ...');
        if (err) {
            console.log(`this is error: ${err}`);
            res.statusCode = 400;
            res.send(err);
        }
        res.json(darkhast);
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


update_darkhastKharid = function (req, res) {
    context.SafeKharid.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
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
                    var payload = { subject: user._id };
                    var token = jwt.encode(payload, 'asdfghjkl');

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

        var payload = { subject: user._id };
        var token = jwt.encode(payload, 'asdfghjkl');

        res.status(200).send({ token });
    });

};
