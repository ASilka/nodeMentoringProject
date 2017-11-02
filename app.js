const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = express.json();
const fs = require("fs");
const router = express.Router();

//app.listen(3000);

app.use(cookieParser());

app.get('/user', function (req, res) {
    let parsedCookies = req.cookies;
    let parsedQuery = req.query;
    res.json(req.query);
    //res.send('query: ' + req.query);
    console.log('Cookies: ', parsedCookies)
    console.log('Query: ', parsedQuery)
})


router.use(express.static(__dirname + "/public"));

router.get("/api/products", function (req, res) {

    let contentBase = fs.readFileSync("./data/products.json");
    let products = JSON.parse(contentBase);
    res.send(products);
});

router.get("/api/users", function (req, res) {

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