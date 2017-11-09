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

app.use(express.json());
app.use(cookieParser());

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

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
    let employee = _.find(data, {
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
        const token = jwt.sign(payload, 'password', {
            expiresIn: 1000000
        });

        const userInfo = _.find(data, { firstName: req.body.firstName });
        const userEmail = userInfo.eMail;
        const userName = userInfo.userName;

        res.send(
            {
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
    const token = req.headers['x-access-token'];
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
        done(null, false, { message: 'Invalid password/username.' });
    }
    else {
        done(null, true);
    }
}
));

app.post('/authenticate', passport.authenticate('local', { session: false }), function (req, res) {
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
        return done(null, {
            username: profile.displayName,
            profileUrl: profile.profileUrl
        });
    }
));

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'read_stream'
})
);

passport.use('twitter', new TwitterStrategy({
    consumerKey: "some_key",
    consumerSecret: "secret",
    callbackURL: "http://www.example.com/auth/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        return done(null, {
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
        return done(null, {
            googleId: profile.id
        });
    }
));

app.get('/auth/google', passport.authenticate('google'));

//app.listen(3000);

app.get('/user', function (req, res) {
    let parsedCookies = req.cookies;
    let parsedQuery = req.query;
    res.json(req.query);
    //res.send('query: ' + req.query);
    console.log('Cookies: ', parsedCookies)
    console.log('Query: ', parsedQuery)
})


router.use(express.static(__dirname + "/public"));

router.get("/api/products", tokenVerification, function (req, res) {

    let contentBase = fs.readFileSync("./data/products.json");
    let products = JSON.parse(contentBase);
    res.send(products);
});

router.get("/api/users", tokenVerification, function (req, res) {

    let contentBase = fs.readFileSync("./data/products.json");
    let products = JSON.parse(contentBase);
    res.send(products);
});

router.get("/api/products/:id", function (req, res) {

    let id = req.params.id;
    let contentBase = fs.readFileSync("./data/products.json");
    let products = JSON.parse(contentBase);
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            product = products[i];
            break;
        }
    }
    if (product) {
        res.send(product);
    }
    else {
        res.status(404).send();
    }
});

router.get("/api/products/:id/reviews", function (req, res) {

    let id = req.params.id;

    let contentBase = fs.readFileSync("./data/products.json");
    let products = JSON.parse(contentBase);
    let product = null;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            product = products[i];
            break;
        }
    }

    if (product) {
        res.send(product.Reviews);
    }
    else {
        res.status(404).send();
    }
});

router.post("/api/products", bodyParser, function (req, res, next) {
    if (!req.query.product) res.sendStatus(400);
    else next();
}, function (req, res, next) {
    let product = {};

    let data = fs.readFileSync("./data/products.json", "utf8");
    let products = JSON.parse(data);

    let id = Math.max.apply(Math, products.map(function (o) { return o.id; }))
    product.id = id + 1;
    product.Product = req.query.product;
    product.Year = req.body.year;
    product.Owner = req.body.owner;
    products.push(product);
    let updatedContentBase = JSON.stringify(products);
    fs.writeFileSync("./data/products.json", updatedContentBase);
    res.send(product);
});

app.use('/', router);

module.exports = app;