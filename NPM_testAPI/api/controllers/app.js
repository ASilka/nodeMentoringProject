const fs = require("fs");
const _ = require('lodash');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = express.json();
const router = express.Router();
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const data = require('./data/employees.json');
const tokens = require('./data/tokens.json');
//const Sequelize = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

app.use(express.json());
app.use(cookieParser());
app.use('/', router);
//app.listen(3000);

/*
const sequalize = new Sequelize('postgres: //test:test@localhost:5432/nodejs')
const dbUsers = sequalize.define('Users');
const dbProducts = sequalize.define("Products");

sequalize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully');
    })
    .catch(err => {
        console.error('unable to connect: ', err);
    });
*/

app.use(passport.initialize());
app.use(passport.session());

// simple basic authentification
function basicAuth(req, res, next) {
    const credentials = auth(req);
    if (!credentials || credentials.name !== 'testName' || credentials.pass !== 'testPass') {
        res.json({
            status: '401',
            message: 'Access denied'
        })
    }
    else {
        next();
    };
};

router.post('/auth', basicAuth, bodyParser, function (req, res) {
    let employee = _.find(data,
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

    if (employee === undefined) {
        res.send({
            status: '404',
            message: 'No user found'
        });
    }

    else {
        const payload = {
            admin: "test"
        };
        const token = jwt.sign(payload, 'password',
            {
                expiresIn: 1000000
            });

        const userInfo = _.find(data,
            {
                firstName: req.body.firstName
            });
        const userEmail = userInfo.eMail;
        const userName = userInfo.userName;

        res.send({
            status: '200',
            message: 'Ok',
            data: {
                user: {
                    email: userEmail,
                    username: userName
                }
            },
            token: token
        }
        );
    }
}
);
//middleware to verify JWTtoken

function tokenVerification(req, res, next) {
    const token = req.headers['x-access-token'
    ];
    if (token) {
        jwt.verify(token, 'password', function (err, decoded) {
            if (err) {
                res.send({
                    status: '403',
                    message: 'Failed to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            status: '403',
            message: 'No token provided'
        });
    }
};

//local authentication strategy with passport

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
}, function (username, password, done) {

    if (username !== 'testName' || password !== 'testPass') {
        done(null,
            false,
            {
                message: 'Invalid password/username.'
            });
    }
    else {
        done(null, true);
    }
}
));

app.post('/authenticate', passport.authenticate('local',
    {
        session: false
    }), function (req, res) {
        res.json('successfully log in');
    }
);
//other authentication strategies with passport

passport.use('facebook', new FacebookStrategy({
    clientID: "some_id",
    clientSecret: "secret",
    callbackURL: "http://www.example.com/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        return done(null,
            {
                username: profile.displayName,
                profileUrl: profile.profileUrl
            });
    }
));

app.get('/auth/facebook', passport.authenticate('facebook',
    {
        scope: 'read_stream'
    })
);

passport.use('twitter', new TwitterStrategy({
    consumerKey: "some_key",
    consumerSecret: "secret",
    callbackURL: "http://www.example.com/auth/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        return done(null,
            {
                profileUrl: profile.id
            });
    }
));

app.get('/auth/twitter', passport.authenticate('twitter'));

passport.use('google', new GoogleStrategy({
    consumerKey: "some_key",
    consumerSecret: "secret",
    callbackURL: "http://www.example.com/auth/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        return done(null,
            {
                googleId: profile.id
            });
    }
));

app.get('/auth/google', passport.authenticate('google'));

// establishing connection to mongo and test of connection 

const mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

const url = 'mongodb://localhost:27017/test';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

mongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    //app.listen(3000);
    //db.close();
}
);

const dbMongoose = mongoose.connection;
dbMongoose.on('error', console.error.bind(console, 'connection error: '));
dbMongoose.once('once', function () {
});

// creating schemas for cities, users and products

let citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    capital: { type: Boolean, required: true },
    location: {
        lat: Number,
        long: Number
    }
});

let userSchema = new mongoose.Schema({
    isActive: Boolean,
    title: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    userName: { type: String, required: true, unique: true, minlength: [2, "tooShort"] },
    eMail: String,
    createdAt: Date,
    updatedAt: Date

});

let productSchema = new mongoose.Schema({
    id: Number,
    product: { type: String, required: true },
    year: Number,
    owner: String,
    reviews: String
});

// creating models for city, user, product with validations

const City = mongoose.model('City', citySchema);
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

let productData = require('./data/products.json');
let usersData = require('./data/employees.json');
let cities = require('./data/cities.json');

//create cities collection

router.post('/AddCities', function (req, res) {
    mongoClient.connect(url, function (err, db) {
        db.collection('cities').insertMany(cities, function (err, data) {
            console.log(data.ops);
            assert.equal(null, err);
            //assert.equal(5, data.insertedCount);
            res.send(data);
            db.close();
        }
        )
    })
});

/*
router.post('/AddUsers', function (req, res) {
    mongoClient.connect(url, function (err, db) {
        db.collection('users').insertMany(usersData, function (err, data) {
            console.log(data.ops);
            assert.equal(null, err);
            //assert.equal(20, data.insertedCount);
            res.send(data);
            db.close();
        }
        )
    })
});
*/

//add users and products collections into db via mongoose 

let object = {};

router.post('/AddUsersMongoose', function (req, res) {
    usersData.forEach(function (object) {
        new User(object)
            .save(function (error) {
                console.log("user has been saved.");
                if (error) {
                    console.error(error);
                }
            });
        res.send();
    });
});

router.post('/AddProductsMongoose', function (req, res) {
    productData.forEach(function (object) {
        new Product(object)
            .save(function (error) {
                console.log("product has been saved.");
                if (error) {
                    console.error(error);
                }
            });
        res.send();
    });
});

//  return a random city on every request with mongoClient

router.get('/randomCity', function (req, res) {
    mongoClient.connect(url, function (err, db) {
        db.collection('cities').count(function (err, count) {
            db.collection('cities').distinct("_id", function (err, result) {
                if (err)
                    res.send(err)
                var randomId = result[Math.floor(Math.random() * (count - 1))]
                db.collection('cities').findOne({ _id: randomId }, function (err, result) {
                    res.json(result);
                    db.close();
                })
            })
        })
    })
});

//  return a random city on every request with mongoose

router.get('/randomCityMongoose', function (req, res) {
    City.count().exec(function (err, count) {
        var random = Math.floor(Math.random() * count);
        City.findOne().skip(random).exec(
            function (err, result) {
                res.json(result);
            });
    });

});

/*
app.get('/user', function (req, res) {
    let parsedCookies = req.cookies;
    let parsedQuery = req.query;
    res.json(req.query);
    //res.send('query: ' + req.query);
    console.log('Cookies: ', parsedCookies)
    console.log('Query: ', parsedQuery)
})

router.use(express.static(__dirname + "/public"));
*/

//Modify application to respond all routes from Homework 4 and return data from the database

router.get("/api/products", tokenVerification, function (req, res) {
    Product.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

router.get("/api/cities", tokenVerification, function (req, res) {
    City.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

router.get("/api/users", tokenVerification, function (req, res) {
    User.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

router.get("/api/products/:id", function (req, res) {
    let id = req.params.id;
    Product.find({ id: id }, function (err, product) {
        if (err) throw err;
        res.json(product);
    });
});

router.get("/api/products/:id/reviews", function (req, res) {
    let id = req.params.id;
    Product.find({ id: id }, 'reviews', function (err, product) {
        if (err) throw err;
        res.json(product);
    });
});

router.post("/api/products", bodyParser, function (req, res) {
    if (!req.query.product) { res.sendStatus(400) }
    else (
        Product.create({ product: req.query.product, year: req.body.year, owner: req.body.owner, lastModifiedDate: new Date() }, function (err, product) {
            mongoose.disconnect();
            if (err) return console.log(err);
            res.json(product);
        }));
});

router.post("/api/cities", bodyParser, function (req, res) {
    if (!req.query.city) { res.sendStatus(400) }
    else (
        City.create({ name: req.query.city, country: req.body.country, capital: req.body.capital, lastModifiedDate: new Date() }, function (err, city) {
            if (err) return console.log(err);
            res.json(city);
        }));
});

router.put("/api/cities/:id", bodyParser, function (req, res) {
    let id = req.params.id;
    if (!req.query.id) { res.sendStatus(400) }
    else (
        City.update({ _id: req.query.id }, { _id: req.body.id, name: req.body.name, capital: req.body.capital, lastModifiedDate: new Date() }, function (err, res) {
            if (err) return console.log(err);
            res.json(res);
        }));
});

router.delete("/api/users/:id", bodyParser, function (req, res) {
    let id = req.params.id;
    User.findOneAndRemove({ _id: id }, function (err, doc) {
        if (err) throw err;
        res.json("user with id" + id + " has been deleted");
    });
});

router.delete("/api/products/:id", bodyParser, function (req, res) {
    let id = req.params.id;
    Product.findOneAndRemove({ id: id }, function (err, doc) {
        if (err) throw err;
        res.json("product with id" + id + " has been deleted");
    });
});

router.delete("/api/cities/:id", bodyParser, function (req, res) {
    let id = req.params.id;
    City.findOneAndRemove({ id: id }, function (err, doc) {
        if (err) throw err;
        res.json("city with id" + id + " has been deleted");
    });
});

module.exports = app;