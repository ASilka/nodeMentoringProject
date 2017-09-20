'use strict';

const user = require('./user');
const product = require('./product');

//create instances of User and Product
let userName = new user.User('Alena');
let productBrand = new product.Product('Test project');

exports.userName = userName;
exports.productBrand = productBrand;